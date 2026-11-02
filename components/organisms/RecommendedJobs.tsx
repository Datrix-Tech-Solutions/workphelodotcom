import Reveal from "@/components/atoms/Reveal";
import Button from "@/components/atoms/Button";
import JobGrid from "@/components/molecules/JobGrid";
import { fetchJobs } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { matchesIndustries } from "@/lib/jobIndustry";
import { jobHref } from "@/lib/jobs";

const SHOWN = 8;
/** Looked at beyond what is shown, so recommended jobs further down the list can come first. */
const SCANNED = 40;

/**
 * The latest jobs. A candidate who has picked industries sees the jobs in those
 * industries first, tagged Recommended; everyone else sees the plain latest list.
 */
export default async function RecommendedJobs() {
  const session = await getSession();
  const picked =
    session?.role === "candidate" ? (session.user.profile?.industries ?? []) : [];

  const { jobs: latest } = await fetchJobs({
    limit: picked.length > 0 ? SCANNED : SHOWN,
  });
  const marked = latest.map((job) => ({
    ...job,
    recommended: matchesIndustries(job, picked),
  }));
  const jobs = [
    ...marked.filter((j) => j.recommended),
    ...marked.filter((j) => !j.recommended),
  ].slice(0, SHOWN);

  return (
    <section className="recommended-jobs" aria-labelledby="recommended-title">
      <Reveal className="recommended-jobs__header">
        <h2 id="recommended-title" className="recommended-jobs__title">
          Latest jobs
        </h2>
        <Button href="/jobs" variant="outline">
          Explore more
        </Button>
      </Reveal>
      {jobs.length === 0 ? (
        <p className="recommended-jobs__empty">
          No jobs have been posted yet. Check back soon.
        </p>
      ) : (
        <JobGrid jobs={jobs} buildHref={(job) => jobHref(job.id)} />
      )}
    </section>
  );
}
