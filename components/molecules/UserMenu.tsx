"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import type { Session } from "@/lib/auth/types";
import { resetSavedJobs } from "@/lib/useSavedJobs";
import { notifySessionChange } from "@/lib/useSession";

function displayName(session: Session): string {
  return session.user.name.trim() || session.user.email.split("@")[0];
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

interface UserMenuProps {
  session: Session;
  /** Render the items as a plain list (mobile menu) instead of a dropdown. */
  inline?: boolean;
}

export default function UserMenu({ session, inline = false }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const name = displayName(session);
  const isRecruiter = session.role === "recruiter";
  const home = isRecruiter
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/profile", label: "Profile" };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    resetSavedJobs();
    notifySessionChange();
    router.push("/");
    router.refresh();
  }

  const items = (
    <>
      <Link
        href={home.href}
        className="user-menu__item"
        role={inline ? undefined : "menuitem"}
        onClick={() => setOpen(false)}
      >
        {home.label}
      </Link>
      {!isRecruiter && (
        <Link
          href="/reset-password"
          className="user-menu__item"
          role={inline ? undefined : "menuitem"}
          onClick={() => setOpen(false)}
        >
          Reset password
        </Link>
      )}
      <button
        type="button"
        className="user-menu__item"
        role={inline ? undefined : "menuitem"}
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </>
  );

  if (inline) {
    return (
      <div className="user-menu user-menu--inline">
        <div className="user-menu__identity">
          <span className="user-menu__avatar" aria-hidden="true">
            {initials(name)}
          </span>
          <span className="user-menu__name">{name}</span>
        </div>
        {items}
      </div>
    );
  }

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {initials(name)}
        </span>
        <span className="user-menu__name">{name}</span>
      </button>
      {open && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            <span className="user-menu__header-name">{name}</span>
            <span className="user-menu__header-email">
              {session.user.email}
            </span>
          </div>
          {items}
        </div>
      )}
    </div>
  );
}
