"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setAdvertOpen, setJobOpen } from "@/app/dashboard/actions";

/** Closes an open job or reopens a closed one. */
export default function JobStatusButton({
  id,
  open,
  advert = false,
}: {
  id: string;
  open: boolean;
  /** The job is an advert, kept in Supabase rather than the HR API. */
  advert?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    if (loading) return;
    setLoading(true);
    setError("");
    const result = await (advert ? setAdvertOpen : setJobOpen)(id, !open);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <span className="job-status-button">
      <button
        type="button"
        className="button button--outline"
        onClick={toggle}
        disabled={loading}
      >
        {loading ? "Saving…" : open ? "Close job" : "Reopen job"}
      </button>
      {error && (
        <span className="job-status-button__error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
