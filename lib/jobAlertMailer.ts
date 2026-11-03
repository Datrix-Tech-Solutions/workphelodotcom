import "server-only";

import { sendEmail, type MailCredentials } from "@/lib/email";
import type { JobAlert } from "@/lib/jobAlerts";
import { jobAlertDigestEmail, type DigestJob } from "@/lib/jobAlertEmails";

/**
 * The job-alert mailer. It has its own variables on purpose, so it can move to
 * a different provider or sender later without touching the order emails:
 *
 *   JOB_ALERT_BREVO_API_KEY  the key used to send job alerts
 *   JOB_ALERT_EMAIL_FROM     the sender, e.g. WorkPhelo Alerts <alerts@…>
 *
 * To change provider, replace `deliver` below; nothing else calls Brevo.
 */
function credentials(): MailCredentials {
  return {
    apiKey: process.env.JOB_ALERT_BREVO_API_KEY,
    from: process.env.JOB_ALERT_EMAIL_FROM,
  };
}

export function isJobAlertMailConfigured(): boolean {
  const { apiKey, from } = credentials();
  return !!(apiKey && from);
}

/** The site's public address, used for the links in the emails. */
export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://workphelo.com").replace(/\/$/, "");
}

/** The one place job-alert mail leaves the app. */
function deliver(message: {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}): Promise<boolean> {
  return sendEmail({ ...message, credentials: credentials() });
}

/** Most jobs shown in one email; the rest are counted. */
const MAX_JOBS_PER_EMAIL = 20;

/** Sends one subscriber their alert or digest. True when the mail provider accepted it. */
export async function sendJobAlertDigest(
  alert: JobAlert,
  token: string,
  jobs: DigestJob[],
): Promise<boolean> {
  if (jobs.length === 0) return false;
  const base = siteUrl();
  const unsubscribe = `${base}/job-alerts/unsubscribe?token=${token}`;
  const { subject, html } = jobAlertDigestEmail(
    alert,
    jobs.slice(0, MAX_JOBS_PER_EMAIL),
    {
      imageUrl: `${base}/icon.png`,
      links: { browse: `${base}/jobs`, unsubscribe },
      more: Math.max(0, jobs.length - MAX_JOBS_PER_EMAIL),
    },
  );
  return deliver({
    to: alert.email,
    subject,
    html,
    headers: { "List-Unsubscribe": `<${unsubscribe}>` },
  });
}
