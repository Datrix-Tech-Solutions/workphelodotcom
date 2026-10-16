"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/atoms/Icon";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

/** A modal over the page. Closes on Escape or a click on the backdrop. */
export default function Dialog({
  open,
  onClose,
  label,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        <button
          type="button"
          className="dialog__close"
          aria-label="Close"
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
