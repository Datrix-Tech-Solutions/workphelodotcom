"use client";

import { useEffect } from "react";

/** Writes the page scroll offset to `--parallax` on the enclosing .hero. */
export default function HeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, hero.offsetHeight);
      hero.style.setProperty("--parallax", String(y));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
