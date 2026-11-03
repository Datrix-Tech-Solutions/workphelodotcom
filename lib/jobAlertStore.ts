import "server-only";

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import type { AlertFrequency } from "@/lib/jobAlerts";

export interface Subscription {
  id: string;
  email: string;
  userId: string | null;
  industries: string[];
  frequency: AlertFrequency;
  token: string;
  lastSentAt: string;
  createdAt: string;
}

interface Row {
  id: string;
  email: string;
  user_id: string | null;
  industries: string[];
  frequency: AlertFrequency;
  token: string;
  last_sent_at: string;
  created_at: string;
}

const COLUMNS =
  "id, email, user_id, industries, frequency, token, last_sent_at, created_at";

const toSubscription = (r: Row): Subscription => ({
  id: r.id,
  email: r.email,
  userId: r.user_id,
  industries: r.industries,
  frequency: r.frequency,
  token: r.token,
  lastSentAt: r.last_sent_at,
  createdAt: r.created_at,
});

export const isStoreConfigured = isAdminConfigured;

export async function findByEmail(email: string): Promise<Subscription | null> {
  const { data } = await createAdminClient()
    .from("job_alert_subscriptions")
    .select(COLUMNS)
    .eq("email", email)
    .maybeSingle<Row>();
  return data ? toSubscription(data) : null;
}

export async function findByToken(token: string): Promise<Subscription | null> {
  const { data } = await createAdminClient()
    .from("job_alert_subscriptions")
    .select(COLUMNS)
    .eq("token", token)
    .maybeSingle<Row>();
  return data ? toSubscription(data) : null;
}

/** Creates a subscription, or changes the choices of an existing one. */
export async function upsertSubscription(input: {
  email: string;
  userId: string | null;
  industries: string[];
  frequency: AlertFrequency;
}): Promise<Subscription | null> {
  const db = createAdminClient().from("job_alert_subscriptions");
  const existing = await findByEmail(input.email);
  const fields = {
    industries: input.industries,
    frequency: input.frequency,
    updated_at: new Date().toISOString(),
    ...(input.userId ? { user_id: input.userId } : {}),
  };
  const { data, error } = existing
    ? await db.update(fields).eq("id", existing.id).select(COLUMNS).single<Row>()
    : await db
        .insert({ email: input.email, user_id: input.userId, ...fields })
        .select(COLUMNS)
        .single<Row>();
  return error || !data ? null : toSubscription(data);
}

export async function removeByToken(token: string): Promise<boolean> {
  const { error } = await createAdminClient()
    .from("job_alert_subscriptions")
    .delete()
    .eq("token", token);
  return !error;
}

export async function listByFrequency(
  frequency: AlertFrequency,
): Promise<Subscription[]> {
  const { data } = await createAdminClient()
    .from("job_alert_subscriptions")
    .select(COLUMNS)
    .eq("frequency", frequency)
    .returns<Row[]>();
  return (data ?? []).map(toSubscription);
}

export async function markSent(id: string, at: Date): Promise<void> {
  await createAdminClient()
    .from("job_alert_subscriptions")
    .update({ last_sent_at: at.toISOString() })
    .eq("id", id);
}
