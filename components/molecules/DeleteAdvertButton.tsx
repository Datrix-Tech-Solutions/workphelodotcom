"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeAdvert } from "@/app/dashboard/actions";
import Icon from "@/components/atoms/Icon";
import Dialog from "@/components/molecules/Dialog";

/** An icon button that deletes an advert after the owner confirms. */
export default function DeleteAdvertButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    if (loading) return;
    setLoading(true);
    setError("");
    const result = await removeAdvert(id);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="share-job-button share-job-button--icon share-job-button--danger"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${title}`}
        title="Delete"
      >
        <Icon name="trash" size={16} />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} label="Delete job">
        <div className="share-dialog">
          <h2 className="share-dialog__title">Delete this job?</h2>
          <p className="share-dialog__job">
            &ldquo;{title}&rdquo; will be removed from the job board for good.
          </p>
          {error && (
            <p className="job-status-button__error" role="alert">
              {error}
            </p>
          )}
          <div className="share-dialog__copy">
            <button
              type="button"
              className="button button--outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--solid"
              onClick={confirm}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
