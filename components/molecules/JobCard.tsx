import Link from "next/link";
import CompanyAvatar from "@/components/atoms/CompanyAvatar";
import Badge from "@/components/atoms/Badge";
import VerifiedName from "@/components/atoms/VerifiedName";
import type { Job } from "@/lib/jobs";

interface JobCardProps {
  job: Job;
  href: string;
  selected?: boolean;
}

export default function JobCard({ job, href, selected }: JobCardProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`job-card ${selected ? "job-card--selected" : ""}`}
      aria-current={selected ? "true" : undefined}
    >
      <div className="job-card__header">
        <CompanyAvatar name={job.company} size="lg" />
        <div className="job-card__heading">
          <h3 className="job-card__title">{job.title}</h3>
          <p className="job-card__company">
            <VerifiedName name={job.company} verified={job.companyVerified} />
          </p>
          {job.promotedBy && (
            <p className="job-card__promoted" title={`Promoted by ${job.promotedBy}`}>
              Promoted by <strong>{job.promotedBy}</strong>
            </p>
          )}
        </div>
      </div>
      <div className="job-card__tags">
        {job.recommended && (
          <span className="badge badge--recommended">Recommended</span>
        )}
        {(job.workMode === "Remote" ? "Remote" : job.type || job.workMode) && (
          <Badge>
            {job.workMode === "Remote" ? "Remote" : job.type || job.workMode}
          </Badge>
        )}
        {job.salary && <Badge>{job.salary}</Badge>}
      </div>
      <p className="job-card__meta">
        <span>{job.location}</span>
        <span>{job.posted}</span>
      </p>
    </Link>
  );
}
