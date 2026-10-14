'use client';

import { motion } from 'framer-motion';
import { Globe, Building2, Settings, Zap } from 'lucide-react';
import { Badge } from '@/landing/components/ui/badge';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';
import { StaggerReveal } from '../atoms/StaggerReveal';
import { StaggerItem } from '../atoms/StaggerItem';
import { snappySpring, scaleIn } from '@/landing/lib/animations';

export function BuiltForAfricaSection() {
  return (
    <section id="about" className="py-20 sm:py-28 lg:py-36 bg-white relative overflow-hidden cursor-logo">
      <FloatingOrb size={140} color="blue" className="top-16 left-[10%] hidden sm:block" delay={1} />
      <FloatingOrb size={100} color="orange" className="bottom-24 right-[8%] hidden sm:block" delay={2} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <Badge variant="secondary" className="mb-5 bg-orange-50 text-orange-600 border-orange-200">
            <Globe className="mr-1.5 h-3.5 w-3.5" />
            Built for African Businesses
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Enterprise-Grade Capabilities,{' '}
            <span className="text-orange-600">African-First Design</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Workphelo is designed with the realities of African businesses in mind,
            providing enterprise-grade capabilities while remaining affordable,
            flexible, and easy to set up.
          </p>
        </Reveal>

        <StaggerReveal className="mt-10 sm:mt-16 grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            { icon: Building2, label: 'Affordable', desc: 'Pricing that works for businesses of every size across Africa' },
            { icon: Settings, label: 'Flexible', desc: 'Highly customizable to match your specific workflow requirements' },
            { icon: Zap, label: 'Easy to Setup', desc: 'Cloud-based with minimal setup time and no complex infrastructure' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.label} variants={scaleIn}>
                <motion.div
                  whileHover={{ y: -4, transition: snappySpring }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl sm:rounded-3xl bg-stone-50 border border-gray-100 p-6 sm:p-8 text-center h-full shadow-sm hover:shadow-md transition-shadow duration-500"
                >
                  <motion.div
                    className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-300 flex items-center justify-center mb-4 sm:mb-5"
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                  >
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-blue-900" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{item.label}</h3>
                  <p className="mt-2 sm:mt-2.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 0L60 10C120 20 240 40 360 52.5C480 65 600 70 720 65C840 60 960 45 1080 37.5C1200 30 1320 30 1380 30L1440 30V100H0Z" fill="#fafaf9"/>
        </svg>
      </div>
    </section>
  );
}
