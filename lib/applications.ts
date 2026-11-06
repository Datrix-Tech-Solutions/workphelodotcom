import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AppliedJob {
  id: string;
  title: string;
  company: string;
  appliedAt: string;
}

/**
 * Records an application. A signed-in candidate's goes on their account; a guest's is
 * kept by the email they applied with, and moves to their account once they sign up or
 * in with that (confirmed) email. Never throws, so a bookkeeping failure can't turn a
 * successful application into an error.
 */
export async function recordApplication(job: {
  id: string;
  title: string;
  company: string;
  /** The email on the application form. */
  email?: string;
}): Promise<void> {
  try {
    if (!isSupabaseConfigured()) return;
    const row = {
      job_id: job.id.slice(0, 200),
      title: (job.title || "Job").slice(0, 300),
      company: (job.company || "").slice(0, 300),
    };

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase
        .from("job_applications")
        .upsert({ user_id: data.user.id, ...row });
      return;
    }

    const email = job.email?.trim().toLowerCase();
    if (!email || !isAdminConfigured()) return;
    await createAdminClient()
      .from("guest_applications")
      .upsert({ email, ...row });
  } catch {
    // Intentionally ignored; see above.
  }
}

/**
 * Moves applications made as a guest with this account's email onto the account. Only
 * a confirmed email counts, so nobody can claim an address they don't own.
 */
async function claimGuestApplications(user: {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
}): Promise<void> {
  try {
    const email = user.email?.trim().toLowerCase();
    if (!email || !user.email_confirmed_at || !isAdminConfigured()) return;

    const admin = createAdminClient();
    const { data } = await admin
      .from("guest_applications")
      .select("job_id, title, company, applied_at")
      .eq("email", email);
    if (!data || data.length === 0) return;

    const { error } = await admin
      .from("job_applications")
      .upsert(
        data.map((r) => ({ user_id: user.id, ...r })),
        { onConflict: "user_id,job_id", ignoreDuplicates: true },
      );
    // Only forget the guest rows once they're safely on the account.
    if (!error) await admin.from("guest_applications").delete().eq("email", email);
  } catch {
    // The next visit tries again.
  }
}

/** Newest first. Empty when signed out or the table isn't set up yet. */
export async function listApplications(limit = 5): Promise<AppliedJob[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  await claimGuestApplications(auth.user);

  const { data, error } = await supabase
    .from("job_applications")
    .select("job_id, title, company, applied_at")
    .order("applied_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.job_id,
    title: r.title,
    company: r.company,
    appliedAt: r.applied_at,
  }));
}
