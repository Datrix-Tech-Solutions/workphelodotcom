import JobGrid from "@/components/molecules/JobGrid";
import Pagination from "@/components/molecules/Pagination";
import JobDetails from "@/components/organisms/JobDetails";
import { jobHref, postedRange, TYPE_FILTERS, type Job } from "@/lib/jobs";

interface JobListingsProps {
  jobs: Job[];
  total: number;
  query: string;
  location: string;
  type: string;
  posted: string;
  page: number;
  totalPages: number;
  selectedJob?: Job;
  closeHref: string;
  unavailable?: boolean;
}

export default function JobListings({
  jobs,
  total,
  query,
  location,
  type,
  posted,
  page,
  totalPages,
  selectedJob,
  closeHref,
  unavailable,
}: JobListingsProps) {
  const buildHref = (job: Job) =>
    jobHref(job.id, { query, location, type, posted, page });
  const filtered = !!(query || location || type || posted);
  const heading = query
    ? `Results for "${query}"`
    : filtered
      ? "Results"
      : "All jobs";
  const activeFilters = [
    location,
    type ? TYPE_FILTERS[type]?.label : "",
    postedRange(posted)?.label ?? "",
  ]
    .filter(Boolean)
    .join(" · ");

  const empty = (
    <p className="job-listings__empty">
      {unavailable
        ? "Jobs are unavailable right now. Please try again shortly."
        : "No jobs match your search. Try different keywords or filters."}
    </p>
  );

  if (!selectedJob) {
    return (
      <section className="job-listings" aria-labelledby="job-listings-title">
        <h2 id="job-listings-title" className="job-listings__title">
          {heading}
          <span className="job-listings__count">{total}</span>
        </h2>
        {activeFilters && (
          <p className="job-listings__filters">{activeFilters}</p>
        )}
        {jobs.length > 0 ? (
          <>
            <JobGrid jobs={jobs} buildHref={buildHref} columns={5} />
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/jobs"
              query={query}
              location={location}
              type={type}
              posted={posted}
            />
          </>
        ) : (
          empty
        )}
      </section>
    );
  }

  return (
    <section
      className="job-listings job-listings--split"
      aria-labelledby="job-listings-title"
    >
      <div className="job-split job-split--detail">
        <div className="panel job-split__list">
          <header className="job-split__header">
            <h2 id="job-listings-title" className="job-split__title">
              {heading}
            </h2>
            <p className="job-split__sub">
              Based on your profile, preferences, and activity like applies,
              search, and saves
            </p>
            <p className="job-split__count">
              {total} {total === 1 ? "Result" : "Results"}
            </p>
          </header>
          <div className="job-split__scroll">
            {jobs.length > 0 ? (
              <JobGrid
                jobs={jobs}
                buildHref={buildHref}
                selectedId={selectedJob.id}
                single
              />
            ) : (
              empty
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/jobs"
            query={query}
            location={location}
            type={type}
            posted={posted}
          />
        </div>
        <div className="panel job-split__details">
          <JobDetails job={selectedJob} closeHref={closeHref} />
        </div>
      </div>
    </section>
  );
}
