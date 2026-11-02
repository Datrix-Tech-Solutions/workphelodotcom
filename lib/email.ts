/**
 * Sends transactional mail through Brevo's API. The sender address
 * (EMAIL_FROM) must be a verified sender in the Brevo account.
 */
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export function isEmailConfigured(): boolean {
  return !!(process.env.BREVO_API_KEY && process.env.EMAIL_FROM);
}

/** Accepts "Name <a@b.com>" or a bare "a@b.com". */
function parseAddress(value: string): { name?: string; email: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].replace(/^"|"$/g, "");
    return name ? { name, email: match[2] } : { email: match[2] };
  }
  return { email: value.trim() };
}

/** True when Brevo accepted the message. Never throws, so one failed email can't hide another. */
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
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error("Email is not configured: set BREVO_API_KEY and EMAIL_FROM.");
    return false;
  }

  try {
    const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({
      email,
    }));
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: parseAddress(from),
        to: recipients,
        subject,
        htmlContent: html,
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `Brevo refused an email (${res.status}):`,
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
