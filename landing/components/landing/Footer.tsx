'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/landing/components/ui/button';
import { Separator } from '@/landing/components/ui/separator';
import { StaggerReveal } from './atoms/StaggerReveal';
import { staggerBottom } from '@/landing/lib/animations';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export function Footer() {
  return (
    <footer className="bg-blue-950 text-white/60 border-t border-white/6 cursor-dot">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 lg:py-20">
        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10" variant={staggerBottom}>
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-5">
              <Image
                src="/landing/images/workphelo-logo.png"
                alt="Workphelo"
                width={120}
                height={32}
                className="h-6 sm:h-7 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-white/40">
              The all-in-one ERP platform built for African businesses. Unified,
              intelligent, and affordable.
            </p>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold text-white/80 uppercase tracking-widest mb-3 sm:mb-5">Modules</h4>
            <ul className="space-y-0.5 text-xs sm:text-sm">
              {['HR Management', 'Marketing & BD', 'Accounting', 'Operations'].map((m) => (
                <li key={m}>
                  <motion.button
                    onClick={() => scrollTo('modules')}
                    whileTap={{ scale: 0.97 }}
                    className="py-2 text-white/40 hover:text-white transition-colors cursor-pointer min-h-11 flex items-center"
                  >
                    {m}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold text-white/80 uppercase tracking-widest mb-3 sm:mb-5">Company</h4>
            <ul className="space-y-0.5 text-xs sm:text-sm">
              {[
                { label: 'About', id: 'about' },
                { label: 'Benefits', id: 'benefits' },
                { label: 'Dashboard', id: 'dashboard' },
                { label: 'Waitlist', id: 'waitlist-cta' },
              ].map((item) => (
                <li key={item.label}>
                  <motion.button
                    onClick={() => scrollTo(item.id)}
                    whileTap={{ scale: 0.97 }}
                    className="block py-2 text-white/40 hover:text-white transition-colors cursor-pointer min-h-11 items-center"
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Powered by */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] sm:text-xs font-semibold text-white/80 uppercase tracking-widest mb-3 sm:mb-5">Powered By</h4>
            <p className="text-xs sm:text-sm leading-relaxed text-white/40">
              <span className="text-white/80 font-semibold text-sm sm:text-base">Datrix Tech Solutions</span>
              <br />
              Enterprise software for the African market.
            </p>
            <div className="mt-4 sm:mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo('waitlist-cta')}
                className="rounded-full border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200 hover:border-orange-500/50 min-h-11 cursor-pointer"
              >
                Join Waitlist
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </StaggerReveal>

        <Separator className="my-8 sm:my-10 bg-white/6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-white/25">
          <p>&copy; {new Date().getFullYear()} Datrix Tech Solutions. All rights reserved.</p>
          <p>Workphelo ERP — Built for Africa, Ready for the World.</p>
        </div>
      </div>
    </footer>
  );
}
