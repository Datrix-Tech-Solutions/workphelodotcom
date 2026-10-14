'use client';

import { motion } from 'framer-motion';
import { smoothSpring } from '@/landing/lib/animations';
import { Reveal } from './Reveal';

export function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <Reveal className="inline-flex flex-col items-start">
      <p className={`text-sm font-semibold tracking-widest uppercase mb-1 ${light ? 'text-orange-400' : 'text-orange-600'}`}>
        {children}
      </p>
      <motion.div
        className="h-0.5 rounded-full bg-linear-to-r from-orange-500 to-amber-400"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ ...smoothSpring, delay: 0.15 }}
        style={{ width: '3rem' }}
      />
    </Reveal>
  );
}
