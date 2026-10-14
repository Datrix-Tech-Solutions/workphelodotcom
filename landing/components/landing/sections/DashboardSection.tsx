'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';
import { SectionLabel } from '../atoms/SectionLabel';
import { StaggerReveal } from '../atoms/StaggerReveal';
import { StaggerItem } from '../atoms/StaggerItem';
import { dashboardFeatures } from '@/landing/data/landing';
import { smoothSpring, snappySpring, slideInLeft, slideInRight, slowStagger } from '@/landing/lib/animations';

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 sm:py-28 lg:py-36 bg-white overflow-hidden relative cursor-logo">
      <FloatingOrb size={170} color="blue" className="top-24 -left-20 hidden lg:block" delay={1} />
      <FloatingOrb size={130} color="orange" className="bottom-32 -right-16 hidden lg:block" delay={2} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={slideInLeft}
            transition={{ ...smoothSpring, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-4 sm:-inset-6 bg-blue-400/20 rounded-3xl sm:rounded-4xl blur-3xl"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-100"
                whileHover={{ scale: 1.01, transition: snappySpring }}
              >
                <Image
                  src="/landing/images/dashboard-preview.png"
                  alt="Executive Dashboard Preview"
                  width={1344}
                  height={768}
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideInRight}
              transition={{ ...smoothSpring }}
            >
              <SectionLabel>Executive Dashboard</SectionLabel>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideInRight}
              transition={{ ...smoothSpring, delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Better Decisions with
                <br className="hidden sm:block" /> Real-Time Visibility
              </h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideInRight}
              transition={{ ...smoothSpring, delay: 0.2 }}
            >
              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                CEOs, Managing Directors, and Department Heads can access
                real-time dashboards that provide:
              </p>
            </motion.div>
            <StaggerReveal variant={slowStagger} className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5">
              {dashboardFeatures.map((f) => (
                <StaggerItem key={f} className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-foreground font-medium text-sm sm:text-[15px]">{f}</span>
                </StaggerItem>
              ))}
            </StaggerReveal>
            <Reveal delay={0.5}>
              <p className="mt-8 text-muted-foreground leading-relaxed text-base">
                This enables faster, data-driven decision-making and greater
                organizational control.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 0L60 8C120 16 240 32 360 42.5C480 53 600 58 720 55C840 52 960 41 1080 35C1200 29 1320 28 1380 27.5L1440 27V100H0Z" fill="#172554"/>
        </svg>
      </div>
    </section>
  );
}
