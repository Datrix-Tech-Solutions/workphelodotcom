import Link from "next/link";
import CompanyAvatar from "@/components/atoms/CompanyAvatar";
import Divider from "@/components/atoms/Divider";
import Icon from "@/components/atoms/Icon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SaveJobButton from "@/components/molecules/SaveJobButton";
import type { Job } from "@/lib/jobs";

interface JobDetailsProps {
  job: Job;
  closeHref: string;
}

export default function JobDetails({ job, closeHref }: JobDetailsProps) {
  return (
    <article className="job-details" aria-labelledby="job-details-title">
      <div className="job-details__topbar">
        {/* <Link
          href={closeHref}
          scroll={false}
          className="job-details__close"
          aria-label="Close job details"
        >
          <Icon name="close" size={16} />
          Close
        </Link> */}
      </div>
      <header className="job-details__header">
        <div className="job-details__heading">
          <p className="job-details__employer">
            <CompanyAvatar name={job.company} size="sm" />
            {job.company}
          </p>
          <h2 id="job-details-title" className="job-details__title">
            {job.title} at {job.company}
          </h2>
          <p className="job-details__meta">
            <span>{job.location}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{job.posted}</span>
          </p>
          <div className="job-details__tags">
            <Badge>{job.salary}</Badge>
            {job.workMode && <Badge>{job.workMode}</Badge>}
            {job.type && <Badge>{job.type}</Badge>}
          </div>
        </div>
        <div className="job-details__actions">
          <Button href={`/jobs/${job.id}/apply`} variant="solid">
            Apply Now
          </Button>
          <SaveJobButton
            job={{ id: job.id, title: job.title, company: job.company }}
          />
        </div>
      </header>
      <Divider />

      {job.description && (
        <>
          <h3 className="job-details__subheading">Job Overview</h3>
          <p className="job-details__text">{job.description}</p>
        </>
      )}

      {job.responsibilities.length > 0 && (
        <>
          <h3 className="job-details__subheading">Key Responsibilities</h3>
          <ul className="job-details__list">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {job.requirements.length > 0 && (
        <>
          <h3 className="job-details__subheading">
            Requirements &amp; Qualifications
          </h3>
          <ul className="job-details__list">
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {job.perks.length > 0 && (
        <>
          <h3 className="job-details__subheading">Perks &amp; Benefits</h3>
          <ul className="job-details__list">
            {job.perks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
