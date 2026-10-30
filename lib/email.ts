/**
 * Sends mail through Resend, the same service the WorkPhelo platform uses
 * (its notification service posts to the same endpoint), so the order emails
 * come from the same verified sender.
 */
const RESEND_URL = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

/** True when Resend accepted the message. Never throws, so one failed email can't hide another. */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error(
      "Email is not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL.",
    );
    return false;
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `Resend refused an email (${res.status}):`,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
