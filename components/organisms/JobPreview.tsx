import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { closingLabel, type Job } from "@/lib/jobs";

/** A read-only view of a job as applicants will see it, shown before it is posted. */
export default function JobPreview({
  job,
  onPost,
  onEdit,
  posting,
  error,
}: {
  job: Job;
  onPost: () => void;
  onEdit: () => void;
  posting: boolean;
  error?: string;
}) {
  return (
    <div className="job-preview">
      <p className="job-preview__note">Preview — this is not posted yet.</p>
      <article className="job-details" aria-labelledby="job-preview-title">
        <h2 id="job-preview-title" className="job-details__title">
          {job.title}
          {job.company ? ` at ${job.company}` : ""}
        </h2>
        <p className="job-details__meta">
          <span>{job.location}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{closingLabel(job.closingDate)}</span>
        </p>
        <div className="job-details__tags">
          <Badge>{job.salary}</Badge>
          {job.workMode && <Badge>{job.workMode}</Badge>}
          {job.type && <Badge>{job.type}</Badge>}
        </div>

        {job.description && (
          <>
            <h3 className="job-details__subheading">Job Overview</h3>
            <p className="job-details__text">{job.description}</p>
          </>
        )}
        {(
          [
            ["Key Responsibilities", job.responsibilities],
            ["Requirements & Qualifications", job.requirements],
            ["Skills Required", job.apply.skills?.items ?? []],
            ["Perks & Benefits", job.perks],
          ] as const
        ).map(
          ([heading, items]) =>
            items.length > 0 && (
              <section key={heading}>
                <h3 className="job-details__subheading">{heading}</h3>
                <ul className="job-details__list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ),
        )}
      </article>

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      <div className="job-preview__actions">
        <Button
          type="button"
          variant="solid"
          onClick={onPost}
          disabled={posting}
        >
          {posting ? "Posting…" : "Post job"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          disabled={posting}
        >
          Keep editing
        </Button>
      </div>
    </div>
  );
}
