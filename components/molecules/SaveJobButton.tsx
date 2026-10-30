"use client";

import { useState } from "react";
import CandidateAuthDialog from "@/components/organisms/CandidateAuthDialog";
import type { SavedJob } from "@/lib/savedJobs";
import { useSavedJobs } from "@/lib/useSavedJobs";

export default function SaveJobButton({ job }: { job: SavedJob }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const { ids, toggle } = useSavedJobs();
  const saved = ids.has(job.id);

  async function handleClick() {
    const result = await toggle(job);
    if (result === "signin") {
      setSignInOpen(true);
    }
  }

  return (
    <>
      <button
        type="button"
        className="button button--soft"
        aria-pressed={saved}
        onClick={handleClick}
      >
        {saved ? "Saved" : "Save"}
      </button>
      <CandidateAuthDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
    </>
  );
}
