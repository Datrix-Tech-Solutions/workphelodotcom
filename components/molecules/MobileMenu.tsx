"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import MenuIcon from "@/components/atoms/MenuIcon";
import NavLink from "@/components/atoms/NavLink";
import { navTabs } from "@/lib/navigation";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <MenuIcon open={open} />
      </button>
      {open && (
        <div className="mobile-menu__panel">
          <nav
            id="mobile-menu-panel"
            aria-label="Mobile"
            onClick={() => setOpen(false)}
          >
            <ul className="mobile-menu__list">
              {navTabs.map((tab) => (
                <li key={tab.href}>
                  <NavLink href={tab.href}>{tab.label}</NavLink>
                </li>
              ))}
            </ul>
            <div className="mobile-menu__actions">
              <Button href="/sign-in" variant="ghost">
                Sign in
              </Button>
              <Button href="/post-job" variant="glass">
                Post job
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
