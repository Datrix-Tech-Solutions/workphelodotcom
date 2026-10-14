"use client";

import { useEffect, useState } from "react";

interface TextCycleProps {
  words: string[];
  interval?: number;
}

const EXIT_MS = 350;

// Vertical word carousel: the current word slides up and out, the next slides
// up and in. Sits inline so it can live inside a sentence.
export default function TextCycle({ words, interval = 2500 }: TextCycleProps) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (words.length < 2) return;
    let swap: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setLeaving(true);
      swap = setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setLeaving(false);
      }, EXIT_MS);
    }, interval);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [words.length, interval]);

  return (
    <span className="text-cycle">
      <span
        key={index}
        className={
          leaving
            ? "text-cycle__word text-cycle__word--out"
            : "text-cycle__word"
        }
      >
        {words[index]}
      </span>
    </span>
  );
}
