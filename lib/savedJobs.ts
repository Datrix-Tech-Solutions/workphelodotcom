import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface SavedJob {
  id: string;
  title: string;
  company: string;
}

/** The signed-in candidate's Supabase client and id, or null. */
async function candidate() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, userId: data.user.id } : null;
}

/** Newest first. Empty when signed out or the table isn't set up yet. */
export async function listSavedJobs(): Promise<SavedJob[]> {
  const ctx = await candidate();
  if (!ctx) return [];
  const { data, error } = await ctx.supabase
    .from("saved_jobs")
    .select("job_id, title, company")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.job_id,
    title: r.title,
    company: r.company,
  }));
}

export async function saveJob(
  job: SavedJob,
): Promise<"ok" | "signin" | "error"> {
  const ctx = await candidate();
  if (!ctx) return "signin";
  const { error } = await ctx.supabase.from("saved_jobs").upsert({
    user_id: ctx.userId,
    job_id: job.id.slice(0, 200),
    title: job.title.slice(0, 300),
    company: job.company.slice(0, 300),
  });
  return error ? "error" : "ok";
}

export async function unsaveJob(
  jobId: string,
): Promise<"ok" | "signin" | "error"> {
  const ctx = await candidate();
  if (!ctx) return "signin";
  const { error } = await ctx.supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", jobId);
  return error ? "error" : "ok";
}
