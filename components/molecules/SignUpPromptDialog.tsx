"use client";

import Button from "@/components/atoms/Button";
import Dialog from "@/components/molecules/Dialog";

interface SignUpPromptDialogProps {
  open: boolean;
  /** "No": just close. */
  onClose: () => void;
  /** "Yes": move on to the sign-in / sign-up form. */
  onAccept: () => void;
}

/** Offered to a guest after applying, so they can track it and apply faster next time. */
export default function SignUpPromptDialog({
  open,
  onClose,
  onAccept,
}: SignUpPromptDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} label="Create an account">
      <div className="white-panel success-modal">
        <div className="success-modal__text">
          <h2 className="success-modal__title">Track your applications?</h2>
          <p className="success-modal__message">
            Sign up to view your job application progress and make applying
            easier next time.
          </p>
        </div>
        <Button type="button" variant="solid" onClick={onAccept}>
          Yes
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          No
        </Button>
      </div>
    </Dialog>
  );
}
