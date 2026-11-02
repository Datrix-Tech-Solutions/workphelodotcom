"use client";

import Button from "@/components/atoms/Button";
import Dialog from "@/components/molecules/Dialog";

interface CheckEmailDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  /** Swaps to the sign-in form in place (when inside a pop-up). */
  onSignIn?: () => void;
  /** The sign-in page to go to when there is no in-place swap. */
  signInHref: string;
}

/** Shown after sign-up when the email needs confirming before signing in. */
export default function CheckEmailDialog({
  open,
  onClose,
  email,
  onSignIn,
  signInHref,
}: CheckEmailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} label="Check your email">
      <div className="white-panel success-modal">
        <div className="success-modal__text">
          <h2 className="success-modal__title">Check your email</h2>
          <p className="success-modal__message">
            An email has been sent to <strong>{email}</strong>. Check your email
            to continue to sign in.
          </p>
        </div>
        {onSignIn ? (
          <Button type="button" variant="solid" onClick={onSignIn}>
            Sign in
          </Button>
        ) : (
          <Button href={signInHref} variant="solid">
            Sign in
          </Button>
        )}
      </div>
    </Dialog>
  );
}
