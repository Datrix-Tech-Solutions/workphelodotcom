import Link from "next/link";
import CompanyAvatar from "@/components/atoms/CompanyAvatar";
import Badge from "@/components/atoms/Badge";
import VerifiedMark from "@/components/atoms/VerifiedMark";
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
        <CompanyAvatar name={job.company} />
        <div className="job-card__heading">
          <h3 className="job-card__title">{job.title}</h3>
          <p className="job-card__company">
            {job.company}
            {job.companyVerified && <VerifiedMark />}
          </p>
        </div>
      </div>
      <p className="job-card__salary">{job.salary}</p>
      {(job.workMode === "Remote" ? "Remote" : job.type || job.workMode) && (
        <Badge>
          {job.workMode === "Remote" ? "Remote" : job.type || job.workMode}
        </Badge>
      )}
      <p className="job-card__meta">
        <span>{job.location}</span>
        <span>{job.posted}</span>
      </p>
    </Link>
  );
}
