"use client";

import { CheckmarkAnimation } from "@/components/atoms/CheckmarkAnimation";
import Button from "@/components/atoms/Button";
import Dialog from "@/components/molecules/Dialog";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  actionLabel?: string;
}

/** A confirmation with an animated checkmark. Closes on Escape too. */
export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "Done",
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} label={title}>
      <div className="white-panel success-modal">
        <CheckmarkAnimation size={72} />
        <div className="success-modal__text">
          <h2 className="success-modal__title">{title}</h2>
          {message && <p className="success-modal__message">{message}</p>}
        </div>
        <Button type="button" variant="solid" onClick={onClose}>
          {actionLabel}
        </Button>
      </div>
    </Dialog>
  );
}
