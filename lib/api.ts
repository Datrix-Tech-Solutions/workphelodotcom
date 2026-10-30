import {
  ADVERT_TENANT,
  fetchAdvertJob,
  fetchAdvertJobs,
} from "@/lib/advertiserJobs";
import {
  JOBS_PER_PAGE,
  TYPE_FILTERS,
  parseJobId,
  postedRange,
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

/**
 * The board: the HR API's jobs plus open adverts from Supabase. Adverts are
 * few, so they are filtered here and all join page 1, merged by date; later
 * pages are the API's alone.
 */
export async function fetchJobs(
  params: Parameters<typeof fetchApiJobs>[0],
): Promise<JobPage> {
  const [api, adverts] = await Promise.all([
    fetchApiJobs(params),
    fetchAdvertJobs(),
  ]);
  const page = params.page ?? 1;
  const matching = adverts.filter((job) => matchesFilters(job, params));
  if (page !== 1 || matching.length === 0) {
    return { ...api, total: api.total + matching.length };
  }
  const jobs = [...api.jobs, ...matching].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  return { ...api, jobs, total: api.total + matching.length };
}

/** Applies the board's filters to an advert, which the API never sees. */
function matchesFilters(
  job: Job,
  {
    query,
    location,
    type,
    posted,
  }: { query?: string; location?: string; type?: string; posted?: string },
): boolean {
  const has = (haystack: string, needle?: string) =>
    !needle || haystack.toLowerCase().includes(needle.toLowerCase());
  if (!has(`${job.title} ${job.company} ${job.description}`, query)) {
    return false;
  }
  if (!has(job.location, location)) return false;
  const filter = type ? TYPE_FILTERS[type] : undefined;
  if (filter) {
    const actual = filter.field === "jobType" ? job.type : job.workMode;
    if (actual !== filter.label) return false;
  }
  const range = postedRange(posted);
  if (range) {
    const at = Date.parse(job.createdAt);
    if (at < range.from || at > range.to) return false;
  }
  return true;
}

async function fetchApiJobs({
  query,
  location,
  type,
  posted,
  page = 1,
  limit = JOBS_PER_PAGE,
}: {
  query?: string;
  location?: string;
  type?: string;
  /** See `postedRange`. The API has no date filter, so it is applied here. */
  posted?: string;
  page?: number;
  limit?: number;
}): Promise<JobPage> {
  // With a keyword and a location the API can only search one of them, so it
  // searches the keyword and the location is matched here.
  const range = postedRange(posted);
  const filterLocally = !!(query && location) || !!range;
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
    const needle = query && location ? location.toLowerCase() : "";
    const matches = jobs.filter((j) => {
      if (needle && !j.location.toLowerCase().includes(needle)) return false;
      if (!range) return true;
      const at = Date.parse(j.createdAt);
      return at >= range.from && at <= range.to;
    });
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
  if (ids.tenantId === ADVERT_TENANT) return fetchAdvertJob(ids.vacancyId);

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
