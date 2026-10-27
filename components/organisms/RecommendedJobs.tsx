import Reveal from "@/components/atoms/Reveal";
import Button from "@/components/atoms/Button";
import JobGrid from "@/components/molecules/JobGrid";
import { fetchJobs } from "@/lib/api";
import { jobHref } from "@/lib/jobs";

export default async function RecommendedJobs() {
  const { jobs } = await fetchJobs({ limit: 8 });

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
