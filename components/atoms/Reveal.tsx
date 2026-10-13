"use client";

import { useEffect, useRef } from "react";

interface RevealProps {
  as?: "div" | "li" | "section";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("reveal--visible");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
