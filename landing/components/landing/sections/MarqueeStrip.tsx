'use client';

import { Marquee } from '../atoms/Marquee';

type MarqueeStripProps = {
  items: string[];
  speed?: number;
  reverse?: boolean;
  dotColor?: string;
  textColor?: string;
  bgClass?: string;
};

export function MarqueeStrip({
  items,
  speed = 35,
  reverse = false,
  dotColor = 'bg-orange-400/60',
  textColor = 'text-foreground/60',
  bgClass = 'bg-stone-50/70 border-y border-gray-100/80',
}: MarqueeStripProps) {
  return (
    <div className={`py-5 sm:py-6 overflow-hidden cursor-dot ${bgClass}`}>
      <Marquee speed={speed} reverse={reverse} className="opacity-40">
        {items.map((t) => (
          <span key={t} className={`text-xs sm:text-sm font-semibold tracking-widest uppercase ${textColor} whitespace-nowrap flex items-center gap-8`}>
            {reverse && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            {t}
            {!reverse && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
