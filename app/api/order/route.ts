import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { orderProcessedEmail, orderRequestEmail } from "@/lib/orderEmails";

const RATE_LIMIT_WINDOW_MS = 30_000;
const recentRequests = new Map<string, number>();

const money = z.number().finite().min(0).max(100_000_000);

const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").trim().max(320),
  company: z.string().trim().min(1, "Please enter your company").max(160),
  planName: z.string().trim().min(1).max(80),
  billing: z.enum(["month", "year"]),
  users: z.number().int().min(1).max(100_000),
  features: z.array(z.string().trim().max(120)).max(100),
  oneTime: money,
  discount: money,
  discountRate: z.number().min(0).max(1),
  insuranceCover: money,
  total: money,
});

function isRateLimited(ip: string) {
  const now = Date.now();
  for (const [key, at] of recentRequests) {
    if (now - at > RATE_LIMIT_WINDOW_MS) recentRequests.delete(key);
  }
  if (now - (recentRequests.get(ip) ?? 0) < RATE_LIMIT_WINDOW_MS) return true;
  recentRequests.set(ip, now);
  return false;
}

/** The WorkPhelo admin address(es) that get each new order request. */
function adminRecipients(): string[] {
  return (process.env.ORDER_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  const admins = adminRecipients();
  if (!isEmailConfigured() || admins.length === 0) {
    console.error("Order emails are not configured.");
    return NextResponse.json(
      { error: "We can't take orders right now. Please try again later." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait a moment before sending another order." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }
  const order = parsed.data;

  const imageUrl = `${request.nextUrl.origin}/icon.png`;
  const toTeam = orderRequestEmail(order, { imageUrl });
  const toRequester = orderProcessedEmail(order, { imageUrl });

  const [teamSent, requesterSent] = await Promise.all([
    sendEmail({
      to: admins,
      subject: toTeam.subject,
      html: toTeam.html,
      replyTo: order.email,
    }),
    sendEmail({
      to: order.email,
      subject: toRequester.subject,
      html: toRequester.html,
    }),
  ]);

  // The order only counts once the team has it; a missed confirmation to the
  // requester is logged but doesn't fail the request.
  if (!teamSent) {
    return NextResponse.json(
      { error: "We couldn't send your order. Please try again." },
      { status: 502 },
    );
  }
  if (!requesterSent) {
    console.error(`Order confirmation email to ${order.email} was not sent.`);
  }
  return NextResponse.json({ ok: true });
}
