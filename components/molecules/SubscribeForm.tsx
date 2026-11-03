"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import CandidateAuthDialog from "@/components/organisms/CandidateAuthDialog";
import JobAlertDialog from "@/components/organisms/JobAlertDialog";
import { syncJobAlert, useJobAlert } from "@/lib/jobAlerts";
import { useSession } from "@/lib/useSession";

/**
 * Footer job-alert sign-up, for signed-in candidates.
 * - Signed out: a Subscribe button that opens the candidate sign-in form, then
 *   the choices pop-up once they are signed in.
 * - Signed in, not subscribed: a Subscribe button that opens the choices pop-up.
 * - Subscribed: a "Subscribed" button that opens the manage pop-up.
 */
export default function SubscribeForm() {
  const session = useSession();
  const stored = useJobAlert();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [afterSignIn, setAfterSignIn] = useState(false);

  const signedIn = session === undefined ? undefined : !!session;
  const alert = signedIn ? stored : null;

  // Once we know who is here, refresh this browser's copy from the server
  // (which also clears it after signing out).
  useEffect(() => {
    if (signedIn !== undefined) void syncJobAlert();
  }, [signedIn]);

  // Signed in from the Subscribe button: carry on to the choices.
  useEffect(() => {
    if (afterSignIn && session) {
      setAfterSignIn(false);
      setOpen(true);
    }
  }, [afterSignIn, session]);

  function handleClick() {
    if (session) setOpen(true);
    else setSignInOpen(true);
  }

  return (
    <>
      {alert ? (
        <button
          type="button"
          className="button button--soft"
          onClick={handleClick}
        >
          <span aria-hidden="true">✓</span> Subscribed
        </button>
      ) : (
        <div className="subscribe-form subscribe-form--solo">
          <Button
            type="button"
            onClick={handleClick}
            disabled={signedIn === undefined}
          >
            Subscribe
          </Button>
        </div>
      )}
      <JobAlertDialog
        open={open}
        onClose={() => setOpen(false)}
        email={session?.user.email ?? ""}
        existing={alert ?? null}
      />
      <CandidateAuthDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => setAfterSignIn(true)}
      />
    </>
  );
}
