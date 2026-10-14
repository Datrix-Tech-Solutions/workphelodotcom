import { NextRequest, NextResponse } from "next/server";
import { sendWaitlistNotification } from "@/landing/lib/email";
import { z } from "zod/v4";

const WAITLIST_SUCCESS_MESSAGE =
  "Thank you. Your details have been sent successfully.";
const HONEYPOT_SUCCESS_MESSAGE = "Thank you. Your details have been received.";
const RATE_LIMIT_WINDOW_MS = 30_000;
const recentRequests = new Map<string, number>();

const waitlistSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120),
  email: z.email("Please enter a valid email address").trim().max(320),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  module: z.string().trim().max(80).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();

  for (const [key, timestamp] of recentRequests.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
      recentRequests.delete(key);
    }
  }

  const lastRequestAt = recentRequests.get(ip);

  if (lastRequestAt && now - lastRequestAt < RATE_LIMIT_WINDOW_MS) {
    return true;
  }

  recentRequests.set(ip, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { fullName, email, phone, company, module, website } = result.data;

    if (website) {
      return NextResponse.json(
        { message: HONEYPOT_SUCCESS_MESSAGE },
        { status: 200 },
      );
    }

    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Please wait a few seconds before trying again." },
        { status: 429 },
      );
    }

    const emailSent = await sendWaitlistNotification({
      fullName,
      email,
      phone,
      company: company || undefined,
      module: module || undefined,
    });

    if (!emailSent) {
      return NextResponse.json(
        {
          error:
            "We could not submit your request right now. Please try again shortly.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: WAITLIST_SUCCESS_MESSAGE },
      { status: 200 },
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 },
    );
  }
}
