"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Dialog from "@/components/molecules/Dialog";
import CandidateSignInForm from "@/components/organisms/CandidateSignInForm";
import CandidateSignUpForm from "@/components/organisms/CandidateSignUpForm";

/** The candidate sign-in pop-up, which can swap to sign-up in place. */
export default function CandidateAuthDialog({
  open,
  onClose,
  next,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  /** Where to go once signed in or signed up; defaults to staying on this page. */
  next?: string;
  /** Called after a successful sign in (not after sign up, which leaves the page). */
  onSignedIn?: () => void;
}) {
  const pathname = usePathname();
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");

  // Always reopen on the sign-in form.
  useEffect(() => {
    if (open) setView("sign-in");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={view === "sign-in" ? "Sign in" : "Sign up"}
    >
      {view === "sign-in" ? (
        <CandidateSignInForm
          next={next}
          onSuccess={() => {
            onClose();
            onSignedIn?.();
          }}
          onSwitch={() => setView("sign-up")}
        />
      ) : (
        <CandidateSignUpForm
          next={next ?? pathname}
          onSwitch={() => setView("sign-in")}
        />
      )}
    </Dialog>
  );
}
