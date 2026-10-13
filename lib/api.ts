import {
  JOBS_PER_PAGE,
  parseJobId,
  toJob,
  type ApiVacancy,
  type Job,
} from "@/lib/jobs";

const DEV_API_URL = "https://dev-api.workphelo.com/api/v1";
const PRODUCTION_API_URL = "https://api.workphelo.com/api/v1";

// HR_API_URL wins so a deployment can point at either server explicitly. Without it,
// `next dev` uses the dev server and a production build uses production.
const API_URL =
  process.env.HR_API_URL ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : DEV_API_URL);

export const PUBLIC_API = `${API_URL}/hr/recruitment/public`;

interface Page<T> {
  items: T[];
  meta: { page: number; limit: number; total: number };
}

export interface JobPage {
  jobs: Job[];
  total: number;
  /** True when the job service could not be reached. */
  unavailable: boolean;
}

export async function fetchJobs({
  query,
  page = 1,
  limit = JOBS_PER_PAGE,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<JobPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (query) params.set("search", query);

  try {
    const res = await fetch(`${PUBLIC_API}/board?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { jobs: [], total: 0, unavailable: true };
    const body = (await res.json()) as Page<ApiVacancy>;
    return {
      jobs: body.items.map(toJob),
      total: body.meta.total,
      unavailable: false,
    };
  } catch {
    return { jobs: [], total: 0, unavailable: true };
  }
}

/** Returns null when the job is closed, missing, or the id is malformed. */
export async function fetchJob(jobId: string): Promise<Job | null> {
  const ids = parseJobId(jobId);
  if (!ids) return null;

  try {
    const res = await fetch(
      `${PUBLIC_API}/vacancies/${encodeURIComponent(ids.vacancyId)}?tenantId=${encodeURIComponent(ids.tenantId)}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return toJob((await res.json()) as ApiVacancy);
  } catch {
    return null;
  }
}
