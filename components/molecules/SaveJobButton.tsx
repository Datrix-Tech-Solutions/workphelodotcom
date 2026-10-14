"use client";

import { usePathname, useRouter } from "next/navigation";
import type { SavedJob } from "@/lib/savedJobs";
import { useSavedJobs } from "@/lib/useSavedJobs";

export default function SaveJobButton({ job }: { job: SavedJob }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ids, toggle } = useSavedJobs();
  const saved = ids.has(job.id);

  async function handleClick() {
    const result = await toggle(job);
    if (result === "signin") {
      router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }

  return (
    <button
      type="button"
      className="button button--soft"
      aria-pressed={saved}
      onClick={handleClick}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
