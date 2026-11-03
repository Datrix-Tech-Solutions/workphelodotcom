import "server-only";

import { fetchJobs } from "@/lib/api";
import { matchesIndustries } from "@/lib/jobIndustry";
import type { Job } from "@/lib/jobs";
import type { AlertFrequency } from "@/lib/jobAlerts";
import type { DigestJob } from "@/lib/jobAlertEmails";
import {
  isJobAlertMailConfigured,
  sendJobAlertDigest,
  siteUrl,
} from "@/lib/jobAlertMailer";
import {
  isStoreConfigured,
  listByFrequency,
  markSent,
} from "@/lib/jobAlertStore";

export interface RunSummary {
  frequency: AlertFrequency;
  subscribers: number;
  sent: number;
  failed: number;
}

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/** The newest jobs, going back at least to `since`, across the API and adverts. */
async function jobsSince(since: number): Promise<Job[] | null> {
  const found: Job[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await fetchJobs({ page, limit: PAGE_SIZE });
    if (result.unavailable) return null;
    found.push(...result.jobs);
    const oldest = Math.min(...result.jobs.map((j) => Date.parse(j.createdAt)));
    if (result.jobs.length < PAGE_SIZE || oldest < since) break;
  }
  return found;
}

function toDigestJob(job: Job): DigestJob {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    posted: job.posted,
    url: `${siteUrl()}/jobs?job=${encodeURIComponent(job.id)}`,
  };
}

/**
 * Emails every subscriber of this frequency the jobs posted since they were last
 * sent anything. A subscriber with nothing new gets no email and nothing changes,
 * so their next run covers the longer stretch.
 */
export async function runJobAlerts(
  frequency: AlertFrequency,
): Promise<RunSummary | { error: string }> {
  if (!isStoreConfigured()) return { error: "Supabase admin isn't configured." };
  if (!isJobAlertMailConfigured()) return { error: "Job alert mail isn't configured." };

  // Taken before fetching, so a job posted mid-run is picked up next time, not missed.
  const startedAt = new Date();
  const subscribers = await listByFrequency(frequency);
  const summary: RunSummary = {
    frequency,
    subscribers: subscribers.length,
    sent: 0,
    failed: 0,
  };
  if (subscribers.length === 0) return summary;

  const earliest = Math.min(...subscribers.map((s) => Date.parse(s.lastSentAt)));
  const jobs = await jobsSince(earliest);
  if (!jobs) return { error: "The job service is unavailable." };

  for (const sub of subscribers) {
    const since = Date.parse(sub.lastSentAt);
    const matching = jobs
      .filter((job) => Date.parse(job.createdAt) > since)
      .filter(
        (job) =>
          sub.industries.length === 0 || matchesIndustries(job, sub.industries),
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    if (matching.length === 0) continue;

    const sent = await sendJobAlertDigest(
      { email: sub.email, industries: sub.industries, frequency },
      sub.token,
      matching.map(toDigestJob),
    );
    if (sent) {
      await markSent(sub.id, startedAt);
      summary.sent++;
    } else {
      summary.failed++;
    }
  }
  return summary;
}
