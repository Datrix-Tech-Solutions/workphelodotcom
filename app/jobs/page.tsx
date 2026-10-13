import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import JobListings from "@/components/organisms/JobListings";
import Navbar from "@/components/organisms/Navbar";
import { fetchJob, fetchJobs } from "@/lib/api";
import { JOBS_PER_PAGE } from "@/lib/jobs";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    job?: string | string[];
  }>;
}

const first = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const query = (first(params.q) ?? "").trim();
  const requested = Number.parseInt(first(params.page) ?? "1", 10);
  const page = Number.isNaN(requested) ? 1 : Math.max(requested, 1);

  const selectedId = first(params.job);
  const [{ jobs, total, unavailable }, selectedJob] = await Promise.all([
    fetchJobs({ query, page }),
    selectedId ? fetchJob(selectedId) : Promise.resolve(null),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));

  const closeParams = new URLSearchParams();
  if (query) closeParams.set("q", query);
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
          title="Find your dream job"
          subtext="Looking for jobs? Browse our latest openings"
        />
        <JobListings
          jobs={jobs}
          total={total}
          query={query}
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
