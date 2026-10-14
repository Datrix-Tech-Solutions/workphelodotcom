'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { Layers } from 'lucide-react';
import { TextCycle } from '../atoms/TextCycle';
import { gentleSpring, smoothSpring, snappySpring } from '@/landing/lib/animations';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const heroContentScale = useTransform(heroProgress, [0, 1], [1, 0.97]);

  return (
    <section ref={heroRef} className="relative flex items-center justify-center overflow-hidden lg:min-h-screen min-h-svh cursor-dot">
      <Image
        src="/landing/images/hero-bg.png"
        alt=""
        fill
        className="object-cover object-center scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/30 via-transparent to-orange-950/20 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/3 pointer-events-none"
          style={{
            width: 4 + (i * 3),
            height: 4 + (i * 3),
            top: `${15 + (i * 12)}%`,
            left: `${10 + (i * 15)}%`,
          }}
          animate={{
            y: [0, -30 - (i * 8), 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
        />
      ))}

      <motion.div
        style={{ y: heroContentY, opacity: heroContentOpacity, scale: heroContentScale }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-0 lg:pb-0 text-center"
      >
        <motion.h1
          className="text-[1.9rem] sm:text-[2.6rem] md:text-[3.15rem] lg:text-[4.2rem] xl:text-[4.9rem] font-extrabold tracking-tight text-white leading-[0.95]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
          }}
        >
          <motion.span
            className="block text-white/80"
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: gentleSpring },
            }}
          >
            Complete Business
          </motion.span>
          <motion.span
            className="block bg-linear-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent animate-gradient-text"
            variants={{
              hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: gentleSpring },
            }}
          >
            Visibility.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothSpring, delay: 1.1 }}
          className="mt-8 sm:mt-10 text-sm sm:text-base text-white/40 max-w-xl mx-auto leading-relaxed"
        >
          Workphelo unifies{' '}
          <TextCycle
            words={['HR', 'Marketing', 'Accounting', 'Operations', 'Fleet Management']}
            interval={2500}
          />
          , and Executive Reporting — giving organizations a single source of truth.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } },
          }}
        >
          {['No credit card required', 'Free early access', 'Built for Africa'].map((t) => (
            <motion.div
              key={t}
              className="flex items-center gap-1.5 text-[13px] text-white/25"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6 } },
              }}
            >
              <span className="w-1 h-1 rounded-full bg-orange-400/50" />
              <span>{t}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating badge — left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...snappySpring, delay: 0.8 }}
        className="absolute z-20 hidden lg:flex items-center gap-3 bg-white/[0.07] border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-md"
        style={{ bottom: '18%', left: '8%' }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
        </motion.div>
        <span className="text-white text-base font-semibold tracking-tight">One Platform.</span>
      </motion.div>

      {/* Floating badge — right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...snappySpring, delay: 1.0 }}
        className="absolute z-20 hidden lg:flex items-center gap-3 bg-white/[0.07] border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-md"
        style={{ bottom: '18%', right: '8%' }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
        </motion.div>
        <span className="text-white text-base font-semibold tracking-tight">One Login.</span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
