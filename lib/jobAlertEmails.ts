import {
  escapeHtml,
  layout,
  type EmailOptions,
} from "@/lib/orderEmails";
import type { AlertFrequency, JobAlert } from "@/lib/jobAlerts";

export interface DigestJob {
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  url: string;
}

/** Made-up jobs so the pop-up can preview a digest before the back end exists. */
export const SAMPLE_JOBS: DigestJob[] = [
  {
    title: "Frontend Developer",
    company: "Acme Technologies",
    location: "Accra, Ghana",
    type: "Full-time",
    posted: "Today",
    url: "#",
  },
  {
    title: "Financial Analyst",
    company: "Sankofa Bank",
    location: "Lagos, Nigeria",
    type: "Full-time",
    posted: "Today",
    url: "#",
  },
  {
    title: "Registered Nurse",
    company: "Unity Hospital",
    location: "Kumasi, Ghana",
    type: "Contract",
    posted: "Yesterday",
    url: "#",
  },
];

const COPY: Record<
  AlertFrequency,
  { heading: string; subject: string; intro: string }
> = {
  instant: {
    heading: "New job alert",
    subject: "New job on WorkPhelo",
    intro: "A new job matching your alerts was just posted.",
  },
  daily: {
    heading: "Your daily digest",
    subject: "Your daily WorkPhelo job digest",
    intro: "This is your daily digest of new jobs.",
  },
  weekly: {
    heading: "Your weekly digest",
    subject: "Your weekly WorkPhelo job digest",
    intro: "This is your weekly digest of new jobs.",
  },
};

function jobCard(job: DigestJob) {
  return `
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; margin:0 0 12px;">
          <tr>
            <td style="padding:16px;">
              <div style="font-size:16px; font-weight:bold; color:#1a3557;">${escapeHtml(job.title)}</div>
              <div style="color:#555; margin:2px 0 8px;">${escapeHtml(job.company)}</div>
              <div style="color:#777; font-size:13px;">${escapeHtml(job.location)} &middot; ${escapeHtml(job.type)} &middot; Posted ${escapeHtml(job.posted)}</div>
              <a href="${escapeHtml(job.url)}" style="display:inline-block; margin-top:12px; padding:8px 16px; background:#ff6a00; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px;">View job</a>
            </td>
          </tr>
        </table>`;
}

export interface DigestLinks {
  /** The job board. */
  browse: string;
  /** One click to stop the emails. */
  unsubscribe: string;
}

/** The email sent to subscribers: a short line saying what it is, then the jobs. */
export function jobAlertDigestEmail(
  alert: JobAlert,
  jobs: DigestJob[],
  options: EmailOptions & {
    links?: DigestLinks;
    /** Matching jobs left out of the email to keep it short. */
    more?: number;
  } = {},
) {
  const links = options.links ?? { browse: "#", unsubscribe: "#" };
  const copy = COPY[alert.frequency];
  const scope =
    alert.industries.length === 0
      ? ""
      : ` Industries: ${alert.industries.map(escapeHtml).join(", ")}.`;

  const html = layout(
    copy.heading,
    `
        <p style="margin-top:0;">${copy.intro}${scope}</p>
${jobs.map(jobCard).join("")}${
      options.more
        ? `
        <p style="color:#555;">&hellip;and ${options.more} more new job${options.more === 1 ? "" : "s"}.</p>`
        : ""
    }
        <p style="margin-top:24px;">
          <a href="${escapeHtml(links.browse)}" style="display:inline-block; padding:10px 20px; background:#1a3557; color:#ffffff; text-decoration:none; border-radius:6px;">Browse all jobs</a>
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

        <p style="color:#888; font-size:12px;">
          You get this because you subscribed to WorkPhelo job alerts.
          <a href="${escapeHtml(links.unsubscribe)}" style="color:#888;">Unsubscribe</a>
          at any time, or change your choices from the footer of workphelo.com.
        </p>`,
    options,
  );
  return { subject: copy.subject, html };
}
