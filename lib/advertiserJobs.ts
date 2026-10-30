import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { toJob, type ApiVacancy, type Job } from "@/lib/jobs";
import type { NewJob } from "@/lib/recruiterApi";

/** Adverts share the `{tenantId}_{vacancyId}` id shape; this is their tenant. */
export const ADVERT_TENANT = "advert";

export type AdvertStatus = "OPEN" | "CLOSED";

/** A row of `advertiser_jobs`. */
interface AdvertRow {
  id: string;
  advertiser_name: string;
  title: string;
  location: string;
  city: string | null;
  job_type: ApiVacancy["jobType"];
  work_mode: ApiVacancy["workMode"];
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  perks_and_benefits: string | null;
  salary_type: ApiVacancy["salaryType"];
  salary_amount: number | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  status: AdvertStatus;
  created_at: string;
}

/** An advert as its owner sees it on the dashboard. */
export interface MyAdvert {
  id: string;
  title: string;
  location: string;
  status: AdvertStatus;
  createdAt: string;
}

const COLUMNS =
  "id, advertiser_name, title, location, city, job_type, work_mode, description, responsibilities, requirements, perks_and_benefits, salary_type, salary_amount, salary_min, salary_max, salary_currency, status, created_at";

/** Maps a row onto the shape the job board already renders. */
function toAdvertJob(row: AdvertRow): Job {
  const job = toJob({
    id: row.id,
    tenantId: ADVERT_TENANT,
    companyName: row.advertiser_name || null,
    title: row.title,
    location: row.location,
    city: row.city,
    jobType: row.job_type,
    workMode: row.work_mode,
    description: row.description,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    perksAndBenefits: row.perks_and_benefits,
    salaryType: row.salary_type,
    salaryAmount: row.salary_amount,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    salaryCurrency: row.salary_currency,
    createdAt: row.created_at,
    questions: [],
  });
  return { ...job, advertised: true };
}

/** Open adverts, newest first. Returns [] when Supabase is unavailable. */
export async function fetchAdvertJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advertiser_jobs")
      .select(COLUMNS)
      .eq("status", "OPEN")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return (data as AdvertRow[]).map(toAdvertJob);
  } catch {
    return [];
  }
}

/** One open advert by its uuid, or null. */
export async function fetchAdvertJob(id: string): Promise<Job | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advertiser_jobs")
      .select(COLUMNS)
      .eq("id", id)
      .eq("status", "OPEN")
      .maybeSingle();
    if (error || !data) return null;
    return toAdvertJob(data as AdvertRow);
  } catch {
    return null;
  }
}

/**
 * Who an advert belongs to. Advertisers use their own Supabase login, so row-level
 * security keeps them to their own rows. Recruiters have no Supabase login: the server
 * writes for them with the service key, so every query is scoped to their HR user id.
 */
export type AdvertOwner =
  { kind: "advertiser" } | { kind: "recruiter"; id: string };

const UNAVAILABLE = "Not available right now.";

function isAvailable(owner: AdvertOwner) {
  return owner.kind === "recruiter"
    ? isAdminConfigured()
    : isSupabaseConfigured();
}

async function clientFor(owner: AdvertOwner) {
  return owner.kind === "recruiter"
    ? createAdminClient()
    : await createClient();
}

/** The signed-in owner's own adverts. */
export async function listMyAdverts(
  owner: AdvertOwner = { kind: "advertiser" },
): Promise<{ ok: true; data: MyAdvert[] } | { ok: false; error: string }> {
  if (!isAvailable(owner)) return { ok: false, error: UNAVAILABLE };
  const supabase = await clientFor(owner);
  let query = supabase
    .from("advertiser_jobs")
    .select("id, title, location, status, created_at")
    .order("created_at", { ascending: false });
  if (owner.kind === "recruiter") {
    query = query.eq("recruiter_id", owner.id);
  } else {
    // Open adverts are public, so row-level security alone would also return
    // everyone else's; an advertiser's list is held to their own user id here.
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { ok: false, error: "Please sign in again." };
    query = query.eq("user_id", auth.user.id);
  }
  const { data, error } = await query;
  if (error) return { ok: false, error: "Couldn't load your jobs." };
  return {
    ok: true,
    data: (data ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      location: r.location,
      status: r.status as AdvertStatus,
      createdAt: r.created_at,
    })),
  };
}

export async function createAdvert(
  job: NewJob,
  advertiserName: string,
  owner: AdvertOwner = { kind: "advertiser" },
): Promise<{ error?: string }> {
  if (!isAvailable(owner)) return { error: UNAVAILABLE };
  const supabase = await clientFor(owner);
  const { error } = await supabase.from("advertiser_jobs").insert({
    // A recruiter's advert has no Supabase user, so the default user id is cleared.
    ...(owner.kind === "recruiter"
      ? { user_id: null, recruiter_id: owner.id }
      : {}),
    advertiser_name: advertiserName,
    title: job.title.trim(),
    location: job.location.trim(),
    city: job.city ?? null,
    job_type: job.jobType,
    work_mode: job.workMode ?? null,
    vacancies: job.vacancies ?? null,
    closing_date: job.closingDate ?? null,
    description: job.description.trim(),
    responsibilities: job.responsibilities ?? null,
    requirements: job.requirements ?? null,
    perks_and_benefits: job.perksAndBenefits ?? null,
    salary_type: job.salaryType,
    salary_amount: job.salaryAmount ?? null,
    salary_min: job.salaryMin ?? null,
    salary_max: job.salaryMax ?? null,
    salary_currency: job.salaryCurrency ?? null,
  });
  return error ? { error: "Couldn't post your job. Please try again." } : {};
}

export async function setAdvertStatus(
  id: string,
  status: AdvertStatus,
  owner: AdvertOwner = { kind: "advertiser" },
): Promise<{ error?: string }> {
  if (!isAvailable(owner)) return { error: UNAVAILABLE };
  const supabase = await clientFor(owner);
  let query = supabase.from("advertiser_jobs").update({ status }).eq("id", id);
  // The service key skips row-level security, so a recruiter is held to their own rows here.
  if (owner.kind === "recruiter") query = query.eq("recruiter_id", owner.id);
  const { error } = await query;
  return error ? { error: "Couldn't update the job." } : {};
}
