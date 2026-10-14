'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/landing/components/ui/badge';
import { WaitlistForm } from '@/landing/components/waitlist-form';
import { Reveal } from '../atoms/Reveal';
import { CountUp } from '../atoms/CountUp';

const stats = [
  { value: 5, suffix: '+', label: 'Core Modules' },
  { value: 1, suffix: '', label: 'Unified Platform' },
  { value: 24, suffix: '/7', label: 'Cloud Access' },
];

export function WaitlistSection() {
  return (
    <section id="waitlist-cta" className="py-20 sm:py-28 lg:py-36 bg-blue-950 relative overflow-hidden cursor-dot">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.08)_0%,transparent_50%)]" />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`waitlist-particle-${i}`}
          className="absolute rounded-full bg-orange-500/6 pointer-events-none"
          style={{
            width: 6 + i * 4,
            height: 6 + i * 4,
            top: `${20 + i * 18}%`,
            left: `${15 + i * 20}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
        />
      ))}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-orange-500/5 rounded-full blur-[100px]"
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-2xl mx-auto px-5 sm:px-8">
        {/* Slim header */}
        <Reveal className="text-center mb-10 sm:mb-14">
          <Badge variant="secondary" className="mb-4 bg-orange-500/15 text-orange-300 border-orange-500/20">
            Early Access
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Be among the first to experience Workphelo when we launch.
          </p>
        </Reveal>

        {/* Form — the centerpiece */}
        <Reveal delay={0.15}>
          <WaitlistForm variant="section" className="mx-auto" />
        </Reveal>

        {/* Stats — social proof below the card */}
        <Reveal delay={0.3} className="mt-8 flex justify-center gap-10 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] sm:text-xs text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
