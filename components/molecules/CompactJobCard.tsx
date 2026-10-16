"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CompanyAvatar from "@/components/atoms/CompanyAvatar";
import VerifiedMark from "@/components/atoms/VerifiedMark";
import Icon from "@/components/atoms/Icon";
import type { SavedJob } from "@/lib/savedJobs";
import { useSavedJobs } from "@/lib/useSavedJobs";

interface CompactJobCardProps {
  job: SavedJob & { companyVerified?: boolean };
  href: string;
}

/** A slim row: company avatar, role, company name and a save button. */
export default function CompactJobCard({ job, href }: CompactJobCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ids, toggle } = useSavedJobs();
  const saved = ids.has(job.id);

  async function handleSave() {
    const result = await toggle({
      id: job.id,
      title: job.title,
      company: job.company,
    });
    if (result === "signin") {
      router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
    } else {
      // Refresh server data so the saved list on the profile page updates.
      router.refresh();
    }
  }

  return (
    <div className="compact-job">
      <Link href={href} className="compact-job__link">
        <CompanyAvatar name={job.company} />
        <span className="compact-job__text">
          <span className="compact-job__title">{job.title}</span>
          <span className="compact-job__company">
            {job.company}
            {job.companyVerified && <VerifiedMark />}
          </span>
        </span>
      </Link>
      <button
        type="button"
        className={`compact-job__save${saved ? " compact-job__save--active" : ""}`}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        onClick={handleSave}
      >
        <Icon name="heart" filled={saved} />
      </button>
    </div>
  );
}
