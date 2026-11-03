/**
 * Sends transactional mail through Brevo's API. The sender address
 * (EMAIL_FROM) must be a verified sender in the Brevo account.
 */
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/** Who an email is sent as, and the key to send it with. */
export interface MailCredentials {
  apiKey?: string;
  /** "Name <address>" or a bare address; must be a verified sender in Brevo. */
  from?: string;
}

/** The credentials the order (pricing) emails use. */
function orderCredentials(): MailCredentials {
  return {
    apiKey: process.env.BREVO_API_KEY,
    from: process.env.EMAIL_FROM,
  };
}

export function isEmailConfigured(): boolean {
  const { apiKey, from } = orderCredentials();
  return !!(apiKey && from);
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
  headers,
  credentials = orderCredentials(),
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Extra mail headers, e.g. List-Unsubscribe. */
  headers?: Record<string, string>;
  /** Defaults to the order emails' credentials; other mailers pass their own. */
  credentials?: MailCredentials;
}): Promise<boolean> {
  const { apiKey, from } = credentials;
  if (!apiKey || !from) {
    console.error("Email is not configured: the API key or sender is missing.");
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
        ...(headers ? { headers } : {}),
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
