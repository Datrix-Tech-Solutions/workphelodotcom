"use client";

import { useEffect, useRef } from "react";

interface ParallaxLayerProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Writes the parent's offset from the viewport centre to `--parallax` on
 * itself, so the layer can drift slower than the content scrolling over it.
 */
export default function ParallaxLayer({
  className,
  children,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      layer.style.setProperty("--parallax", String(offset));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
