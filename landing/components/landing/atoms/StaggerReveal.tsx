'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { stagger } from '@/landing/lib/animations';

export function StaggerReveal({
  children,
  className = '',
  variant = stagger,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
