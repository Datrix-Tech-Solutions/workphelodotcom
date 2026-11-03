"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { industries } from "@/lib/company";
import type { AlertFrequency, JobAlert } from "@/lib/jobAlerts";
import {
  findByEmail,
  isStoreConfigured,
  removeByToken,
  upsertSubscription,
  type Subscription,
} from "@/lib/jobAlertStore";

/** An alert plus the token this browser keeps to manage it later. */
export interface StoredAlert {
  alert: JobAlert;
  token: string;
}

export type AlertResult =
  | { ok: true; stored: StoredAlert }
  | { ok: false; error: string };

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  industries: z.array(z.enum(industries as [string, ...string[]])).max(30),
  frequency: z.enum(["instant", "daily", "weekly"]),
});

const toStored = (s: Subscription): StoredAlert => ({
  alert: {
    email: s.email,
    industries: s.industries,
    frequency: s.frequency,
  },
  token: s.token,
});

/** The signed-in candidate, if any. Job alerts are for candidates. */
async function candidateSession() {
  const session = await getSession();
  return session?.role === "candidate" ? session : null;
}

/**
 * Subscribes, or changes the signed-in candidate's subscription. Alerts go to
 * the account email, so they are always sent to an address the owner has signed
 * in with.
 */
export async function saveJobAlertAction(raw: {
  industries: string[];
  frequency: AlertFrequency;
}): Promise<AlertResult> {
  if (!isStoreConfigured()) {
    return { ok: false, error: "Job alerts aren't available right now." };
  }
  const session = await candidateSession();
  if (!session) {
    return { ok: false, error: "Please sign in to subscribe." };
  }
  const parsed = inputSchema.safeParse({
    ...raw,
    email: session.user.email,
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check your choices." };
  }

  const saved = await upsertSubscription({
    ...parsed.data,
    userId: session.user.id,
  });
  if (!saved) {
    return { ok: false, error: "We couldn't save that. Please try again." };
  }
  return { ok: true, stored: toStored(saved) };
}

/** The signed-in candidate's subscription, or null. */
export async function myJobAlertAction(): Promise<StoredAlert | null> {
  if (!isStoreConfigured()) return null;
  const session = await candidateSession();
  if (!session) return null;
  const found = await findByEmail(session.user.email.trim().toLowerCase());
  return found ? toStored(found) : null;
}

export async function removeJobAlertAction(): Promise<boolean> {
  if (!isStoreConfigured()) return false;
  const mine = await myJobAlertAction();
  return mine ? removeByToken(mine.token) : true;
}

/** Unsubscribe link in the emails; the token in the link is the proof. */
export async function unsubscribeByTokenAction(
  formData: FormData,
): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (z.uuid().safeParse(token).success && isStoreConfigured()) {
    await removeByToken(token);
  }
  redirect("/job-alerts/unsubscribe?done=1");
}
