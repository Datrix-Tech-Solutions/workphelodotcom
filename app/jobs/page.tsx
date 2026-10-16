import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import JobListings from "@/components/organisms/JobListings";
import Navbar from "@/components/organisms/Navbar";
import { fetchJob, fetchJobs } from "@/lib/api";
import { JOBS_PER_PAGE, postedRange, TYPE_FILTERS } from "@/lib/jobs";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string | string[];
    location?: string | string[];
    type?: string | string[];
    posted?: string | string[];
    page?: string | string[];
    job?: string | string[];
  }>;
}

const first = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const query = (first(params.q) ?? "").trim();
  const location = (first(params.location) ?? "").trim();
  const typeParam = first(params.type) ?? "";
  const type = typeParam in TYPE_FILTERS ? typeParam : "";
  const posted = postedRange(first(params.posted))
    ? (first(params.posted) as string)
    : "";
  const requested = Number.parseInt(first(params.page) ?? "1", 10);
  const page = Number.isNaN(requested) ? 1 : Math.max(requested, 1);

  const selectedId = first(params.job);
  const [{ jobs, total, unavailable }, selectedJob] = await Promise.all([
    fetchJobs({ query, location, type, posted, page }),
    selectedId ? fetchJob(selectedId) : Promise.resolve(null),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));

  const closeParams = new URLSearchParams();
  if (query) closeParams.set("q", query);
  if (location) closeParams.set("location", location);
  if (type) closeParams.set("type", type);
  if (posted) closeParams.set("posted", posted);
  if (page > 1) closeParams.set("page", String(page));
  const closeQuery = closeParams.toString();
  const closeHref = closeQuery ? `/jobs?${closeQuery}` : "/jobs";

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          query={query}
          location={location}
          type={type}
          posted={posted}
          showDateFilter
          title="Find your dream job"
          subtext="Looking for jobs? Browse our latest openings"
        />
        <JobListings
          jobs={jobs}
          total={total}
          query={query}
          location={location}
          type={type}
          posted={posted}
          page={page}
          totalPages={totalPages}
          selectedJob={selectedJob ?? undefined}
          closeHref={closeHref}
          unavailable={unavailable}
        />
      </main>
      <Footer />
    </>
  );
}
