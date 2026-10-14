'use client';

import { motion } from 'framer-motion';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';
import { SectionLabel } from '../atoms/SectionLabel';
import { StaggerReveal } from '../atoms/StaggerReveal';
import { StaggerItem } from '../atoms/StaggerItem';
import { benefits } from '@/landing/data/landing';
import { stagger, snappySpring, scaleIn } from '@/landing/lib/animations';

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 sm:py-28 lg:py-36 bg-blue-950 relative overflow-hidden cursor-dot">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <FloatingOrb size={200} color="orange" className="top-20 -right-16 hidden sm:block" delay={1} />
      <FloatingOrb size={150} color="blue" className="bottom-32 -left-20 hidden sm:block" delay={2} />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.06)_0%,transparent_70%)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-3xl mx-auto text-center">
          <SectionLabel light>Key Benefits</SectionLabel>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Reduced Costs.
            <br className="hidden sm:block" />
            {' '}Improved Efficiency.
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/45 max-w-2xl mx-auto">
            By replacing multiple standalone applications with a single integrated platform,
            organizations can transform how they work.
          </p>
        </Reveal>

        <StaggerReveal className="mt-10 sm:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6" variant={stagger}>
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <StaggerItem key={b.title} variants={scaleIn}>
                <motion.div
                  whileHover={{ y: -4, transition: snappySpring }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full bg-white/4 backdrop-blur-sm border border-white/8 rounded-2xl sm:rounded-3xl p-5 sm:p-8 hover:bg-white/[0.07] transition-colors duration-500 card-shimmer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-orange-500/15 flex items-center justify-center mb-5 group-hover:bg-orange-500/25 transition-colors duration-500">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2.5">{b.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{b.desc}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 100L60 85C120 70 240 40 360 27.5C480 15 600 20 720 27.5C840 35 960 45 1080 52.5C1200 60 1320 65 1380 67.5L1440 70V100H0Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  );
}
