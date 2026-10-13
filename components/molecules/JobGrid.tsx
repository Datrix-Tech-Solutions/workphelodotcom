import Reveal from "@/components/atoms/Reveal";
import JobCard from "@/components/molecules/JobCard";
import type { Job } from "@/lib/jobs";

interface JobGridProps {
  jobs: Job[];
  buildHref: (job: Job) => string;
  selectedId?: string;
  single?: boolean;
  columns?: 4 | 5;
}

export default function JobGrid({
  jobs,
  buildHref,
  selectedId,
  single,
  columns = 4,
}: JobGridProps) {
  return (
    <ul
      className={`jobs-grid ${columns === 5 ? "jobs-grid--five" : ""} ${
        single ? "jobs-grid--single" : ""
      }`}
    >
      {jobs.map((job, i) => (
        <Reveal as="li" key={job.id} delay={(i % 4) * 70}>
          <JobCard
            job={job}
            href={buildHref(job)}
            selected={job.id === selectedId}
          />
        </Reveal>
      ))}
    </ul>
  );
}
