'use client';

import { motion } from 'framer-motion';
import { Globe, MonitorSmartphone } from 'lucide-react';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';
import { SectionLabel } from '../atoms/SectionLabel';
import { smoothSpring, snappySpring, rotateIn } from '@/landing/lib/animations';

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white relative overflow-hidden cursor-logo">
      <FloatingOrb size={180} color="blue" className="top-10 -right-20 hidden sm:block" delay={0} />
      <FloatingOrb size={120} color="orange" className="bottom-20 -left-16 hidden sm:block" delay={1} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Reveal>
          <SectionLabel>The Problem</SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl">
            Why Workphelo Is Better
            <br className="hidden sm:block" />
            {' '}Than Traditional ERP Systems
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 sm:mt-8 text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Most organizations in Ghana and Africa operate with multiple disconnected
            software solutions for HR, accounting, sales, operations, fleet management,
            and reporting. This creates inefficiencies, duplicate data entry, poor
            visibility, and higher operational costs.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-10 sm:mt-16">
          <motion.div
            whileHover={{ y: -4, transition: snappySpring }}
            whileTap={{ scale: 0.99 }}
            className="relative rounded-2xl sm:rounded-3xl bg-blue-200/60 border border-blue-300/60 p-6 sm:p-14 card-shimmer"
          >
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-[0.07]">
              <MonitorSmartphone className="h-28 w-28 sm:h-36 sm:w-36 text-blue-900" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={rotateIn}
                transition={{ ...smoothSpring, delay: 0.5 }}
                className="shrink-0 w-12 h-12 rounded-2xl bg-blue-900 items-center justify-center shadow-lg shadow-blue-900/20 flex"
              >
                <Globe className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground leading-snug">
                  Workphelo solves this by bringing all critical business
                  functions into a single integrated platform.
                </h3>
                <p className="mt-3 sm:mt-4 text-muted-foreground leading-relaxed max-w-2xl text-sm sm:text-lg">
                  Unlike traditional setups where employees switch between multiple
                  applications for different tasks, Workphelo enables teams to work
                  from a single platform with one login, improving productivity and
                  collaboration across departments.
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 0L60 10C120 20 240 40 360 52.5C480 65 600 70 720 65C840 60 960 45 1080 37.5C1200 30 1320 30 1380 30L1440 30V100H0Z" fill="#fafaf9"/>
        </svg>
      </div>
    </section>
  );
}
