import {
  JOBS_PER_PAGE,
  TYPE_FILTERS,
  parseJobId,
  toJob,
  type ApiVacancy,
  type Job,
} from "@/lib/jobs";

const DEV_API_URL = "https://dev-api.workphelo.com/api/v1";
const PRODUCTION_API_URL = "https://api.workphelo.com/api/v1";

// HR_API_URL wins so a deployment can point at either server explicitly. Without it,
// `next dev` uses the dev server and a production build uses production.
export const API_URL =
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

/** The board endpoint has no location filter, only free-text `search`. */
const LOCATION_SCAN_LIMIT = 100;

export async function fetchJobs({
  query,
  location,
  type,
  page = 1,
  limit = JOBS_PER_PAGE,
}: {
  query?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<JobPage> {
  // With a keyword and a location the API can only search one of them, so it
  // searches the keyword and the location is matched here.
  const filterLocally = !!(query && location);
  const params = new URLSearchParams(
    filterLocally
      ? { page: "1", limit: String(LOCATION_SCAN_LIMIT) }
      : { page: String(page), limit: String(limit) },
  );
  const search = query || location;
  if (search) params.set("search", search);
  const typeFilter = type ? TYPE_FILTERS[type] : undefined;
  if (typeFilter) params.set(typeFilter.field, typeFilter.value);

  try {
    const res = await fetch(`${PUBLIC_API}/board?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { jobs: [], total: 0, unavailable: true };
    const body = (await res.json()) as Page<ApiVacancy>;
    const jobs = body.items.map(toJob);
    if (!filterLocally) {
      return { jobs, total: body.meta.total, unavailable: false };
    }
    const needle = location!.toLowerCase();
    const matches = jobs.filter((j) =>
      j.location.toLowerCase().includes(needle),
    );
    return {
      jobs: matches.slice((page - 1) * limit, page * limit),
      total: matches.length,
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
