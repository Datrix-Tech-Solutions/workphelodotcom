'use client';

import { motion } from 'framer-motion';
import { fadeUp, smoothSpring } from '@/landing/lib/animations';

export function Reveal({
  children,
  className = '',
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={fadeUp}
      transition={{ ...smoothSpring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
