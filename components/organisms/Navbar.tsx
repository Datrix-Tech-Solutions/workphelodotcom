"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WorkPheloWordmark from "@/components/atoms/WorkPheloWordmark";
import AccountActions from "@/components/molecules/AccountActions";
import MobileMenu from "@/components/molecules/MobileMenu";
import NavTabs from "@/components/molecules/NavTabs";

/** `minimal` shows only the wordmark (used on the sign-in and sign-up pages). */
export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progressRef.current?.style.setProperty("--progress", String(ratio));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "navbar navbar--scrolled" : "navbar"}>
      <Link href="/" aria-label="WorkPhelo home" className="navbar__brand">
        <WorkPheloWordmark />
      </Link>
      {!minimal && (
        <>
          <nav aria-label="Main" className="navbar__tabs">
            <NavTabs />
          </nav>
          <div className="navbar__actions">
            <AccountActions />
          </div>
          <div className="navbar__menu">
            <MobileMenu />
          </div>
        </>
      )}
      {!minimal && (
        <span
          ref={progressRef}
          className="navbar__progress"
          aria-hidden="true"
        />
      )}
    </header>
  );
}
