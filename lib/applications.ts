import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AppliedJob {
  id: string;
  title: string;
  company: string;
  appliedAt: string;
}

/**
 * Records that the signed-in candidate applied to a job. Guests (and anyone
 * without a candidate account) are skipped. Never throws, so a bookkeeping
 * failure can't turn a successful application into an error.
 */
export async function recordApplication(job: {
  id: string;
  title: string;
  company: string;
}): Promise<void> {
  try {
    if (!isSupabaseConfigured()) return;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    await supabase.from("job_applications").upsert({
      user_id: data.user.id,
      job_id: job.id.slice(0, 200),
      title: (job.title || "Job").slice(0, 300),
      company: (job.company || "").slice(0, 300),
    });
  } catch {
    // Intentionally ignored; see above.
  }
}

/** Newest first. Empty when signed out or the table isn't set up yet. */
export async function listApplications(limit = 5): Promise<AppliedJob[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

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
