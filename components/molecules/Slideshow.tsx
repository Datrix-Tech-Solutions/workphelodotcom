"use client";

import { useEffect, useState } from "react";
import Image from "@/components/atoms/Image";

const INTERVAL_MS = 3500;

/** Fades between images in place, advancing on its own until hovered or focused. */
export default function Slideshow({
  images,
  label,
}: {
  images: string[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % count),
      INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [count, paused]);

  return (
    <div
      className="slideshow"
      role="group"
      aria-roledescription="slideshow"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="slideshow__frame">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${label}, ${i + 1} of ${count}`}
            fill
            sizes="(max-width: 56rem) 100vw, 55vw"
            className={
              i === index
                ? "slideshow__slide slideshow__slide--active"
                : "slideshow__slide"
            }
            aria-hidden={i === index ? undefined : true}
          />
        ))}
      </div>
      {count > 1 && (
        <div className="slideshow__dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={
                i === index
                  ? "slideshow__dot slideshow__dot--active"
                  : "slideshow__dot"
              }
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
