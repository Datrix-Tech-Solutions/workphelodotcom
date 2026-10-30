import JobStatusButton from "@/components/molecules/JobStatusButton";
import type { MyAdvert } from "@/lib/advertiserJobs";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_LABELS = { OPEN: "Open", CLOSED: "Closed" };

/** An owner's adverts with a Close / Reopen button each; adverts have no applicants. */
export default function AdvertTable({ jobs }: { jobs: MyAdvert[] }) {
  return (
    <div className="recruiter-table" role="table">
      <div
        className="recruiter-table__row recruiter-table__row--advert recruiter-table__row--head"
        role="row"
      >
        <span role="columnheader">Job</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">
          <span className="sr-only">Actions</span>
        </span>
      </div>
      {jobs.map((job) => (
        <div
          className="recruiter-table__row recruiter-table__row--advert"
          role="row"
          key={job.id}
        >
          <div className="recruiter-table__main" role="cell">
            <span className="recruiter-table__title">{job.title}</span>
            <span className="recruiter-table__meta">
              {[job.location, `Posted ${formatDate(job.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
          <span role="cell">
            <span
              className={`recruiter-table__status recruiter-table__status--${job.status.toLowerCase()}`}
            >
              {STATUS_LABELS[job.status]}
            </span>
          </span>
          <span className="recruiter-table__action" role="cell">
            <JobStatusButton id={job.id} open={job.status === "OPEN"} advert />
          </span>
        </div>
      ))}
    </div>
  );
}
