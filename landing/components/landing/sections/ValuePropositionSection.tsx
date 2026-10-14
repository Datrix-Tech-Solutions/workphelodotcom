'use client';

import { motion } from 'framer-motion';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';

export function ValuePropositionSection() {
  return (
    <section className="py-14 sm:py-24 lg:py-32 bg-stone-50/70 relative overflow-hidden cursor-dot">
      <FloatingOrb size={120} color="amber" className="top-8 right-[5%] hidden sm:block" delay={0} />
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-gray-100 p-5 sm:p-14 lg:p-16 shadow-sm overflow-hidden card-shimmer">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center">
                Workphelo&apos;s Core Value Proposition
              </h2>
              <div className="mt-5 sm:mt-8 mx-auto max-w-2xl text-center">
                <p className="text-base sm:text-xl text-muted-foreground leading-relaxed italic">
                  &ldquo;Workphelo unifies HR, Marketing, Sales, Accounting, Operations,
                  Fleet Management, and Executive Reporting into one intelligent platform,
                  giving organizations a single source of truth, a single login, and a
                  complete view of their business.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z" fill="#172554"/>
        </svg>
      </div>
    </section>
  );
}
