"use client";

import CompactJobCard from "@/components/molecules/CompactJobCard";
import { jobHref } from "@/lib/jobs";
import type { SavedJob } from "@/lib/savedJobs";
import { useSavedJobs } from "@/lib/useSavedJobs";

export default function SavedJobsList({ jobs }: { jobs: SavedJob[] }) {
  const { ids, loaded } = useSavedJobs();
  // Once the live ids are known, hide anything unsaved right away.
  const visible = loaded ? jobs.filter((j) => ids.has(j.id)) : jobs;

  if (visible.length === 0) {
    return <p className="profile-card__empty">No saved jobs yet.</p>;
  }

  return (
    <div className="profile-card__jobs">
      {visible.map((job) => (
        <CompactJobCard key={job.id} job={job} href={jobHref(job.id)} />
      ))}
    </div>
  );
}
