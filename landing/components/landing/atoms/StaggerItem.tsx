'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { fadeUp, smoothSpring } from '@/landing/lib/animations';

export function StaggerItem({
  children,
  className = '',
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div variants={variants} transition={smoothSpring} className={className}>
      {children}
    </motion.div>
  );
}
