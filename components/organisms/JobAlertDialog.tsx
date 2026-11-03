"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/atoms/Icon";
import Dialog from "@/components/molecules/Dialog";
import { SuccessModal } from "@/components/molecules/SuccessModal";
import { industries } from "@/lib/company";
import {
  frequencies,
  removeJobAlert,
  saveJobAlert,
  type AlertFrequency,
  type JobAlert,
} from "@/lib/jobAlerts";

interface JobAlertDialogProps {
  open: boolean;
  onClose: () => void;
  /** The address alerts go to. */
  email: string;
  /** Present when editing an existing subscription. */
  existing: JobAlert | null;
}

/** Pop-up for choosing what job alerts to receive. */
export default function JobAlertDialog({
  open,
  onClose,
  email,
  existing,
}: JobAlertDialogProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<AlertFrequency>("daily");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [done, setDone] = useState<"saved" | "removed" | null>(null);

  // Start from the saved choice each time the pop-up opens.
  useEffect(() => {
    if (!open) return;
    setPicked(existing?.industries ?? []);
    setFrequency(existing?.frequency ?? "daily");
    setDone(null);
    setError(null);
    setJobsOpen(false);
    // Only reset on open: saving changes `existing` while the success view shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const allIndustries = picked.length === 0;
  const summary = allIndustries
    ? "All industries"
    : picked.length <= 2
      ? picked.join(", ")
      : `${picked.length} industries selected`;

  function toggle(name: string) {
    setPicked((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const failure = await saveJobAlert({ industries: picked, frequency });
    setBusy(false);
    if (failure) setError(failure);
    else setDone("saved");
  }

  async function handleUnsubscribe() {
    setBusy(true);
    setError(null);
    const failure = await removeJobAlert();
    setBusy(false);
    if (failure) setError(failure);
    else setDone("removed");
  }

  const message =
    done === "saved"
      ? `We'll email ${email} ${
          frequency === "instant"
            ? "when a matching job is posted"
            : frequency === "daily"
              ? "a daily digest of matching jobs"
              : "a weekly digest of matching jobs"
        }${allIndustries ? "." : ` in ${picked.length} industr${picked.length === 1 ? "y" : "ies"}.`}`
      : "You won't get any more job alerts.";

  return (
    <>
      <Dialog open={open && !done} onClose={onClose} label="Job alerts">
        <form className="alerts-dialog" onSubmit={handleSubmit}>
          <h2 className="alerts-dialog__title">
            {existing ? "Manage job alerts" : "Get job alerts"}
          </h2>
          <p className="alerts-dialog__lead">
            Alerts go to <strong>{email}</strong>.
          </p>

          <div className="alerts-dialog__group">
            <button
              type="button"
              className="alerts-dialog__toggle"
              aria-expanded={jobsOpen}
              aria-controls="alerts-jobs"
              onClick={() => setJobsOpen((o) => !o)}
            >
              <span>
                <strong>Jobs</strong>
                <small>{summary}</small>
              </span>
              <Icon name="chevron-down" size={18} />
            </button>
            {jobsOpen && (
              <div id="alerts-jobs" className="alerts-dialog__chips">
                <button
                  type="button"
                  className="alerts-chip"
                  aria-pressed={allIndustries}
                  onClick={() => setPicked([])}
                >
                  All industries
                </button>
                {industries.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="alerts-chip"
                    aria-pressed={picked.includes(name)}
                    onClick={() => toggle(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <fieldset className="alerts-dialog__group">
            <legend>How often?</legend>
            <div className="alerts-dialog__frequency">
              {frequencies.map((f) => (
                <label key={f.value} className="alerts-option">
                  <input
                    type="radio"
                    name="alert-frequency"
                    value={f.value}
                    checked={frequency === f.value}
                    onChange={() => setFrequency(f.value)}
                  />
                  <span>
                    <strong>{f.label}</strong>
                    <small>{f.hint}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="job-status-button__error" role="alert">
              {error}
            </p>
          )}
          <div className="alerts-dialog__actions">
            {existing && (
              <button
                type="button"
                className="button button--outline"
                onClick={handleUnsubscribe}
                disabled={busy}
              >
                Unsubscribe
              </button>
            )}
            <button
              type="submit"
              className="button button--solid"
              disabled={busy}
            >
              {busy ? "Saving…" : existing ? "Save changes" : "Subscribe"}
            </button>
          </div>
        </form>
      </Dialog>
      <SuccessModal
        isOpen={open && done !== null}
        onClose={onClose}
        title={done === "saved" ? "You're subscribed" : "You've unsubscribed"}
        message={message}
      />
    </>
  );
}
