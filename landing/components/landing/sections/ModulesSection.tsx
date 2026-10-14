'use client';

import { motion } from 'framer-motion';
import { Users, Calculator, Megaphone, Settings, BarChart3, Sparkles } from 'lucide-react';
import { FloatingOrb } from '../atoms/FloatingOrb';
import { Reveal } from '../atoms/Reveal';
import { SectionLabel } from '../atoms/SectionLabel';
import { StaggerReveal } from '../atoms/StaggerReveal';
import { StaggerItem } from '../atoms/StaggerItem';
import { FeaturePreview } from '../atoms/FeaturePreview';
import { modules } from '@/landing/data/landing';
import { stagger, snappySpring, fadeInScale, aiAgentStagger } from '@/landing/lib/animations';

export function ModulesSection() {
  return (
    <section id="modules" className="py-20 sm:py-28 lg:py-36 bg-stone-50/70 relative cursor-dot">
      <FloatingOrb size={160} color="purple" className="top-32 -right-24 hidden lg:block" delay={2} />
      <FloatingOrb size={130} color="amber" className="bottom-40 -left-20 hidden lg:block" delay={0} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-3xl mx-auto text-center">
          <SectionLabel>Core Modules</SectionLabel>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3">
            Everything Your Business Needs,
            <br className="hidden sm:block" /> In One Place
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Four powerful modules designed to cover every aspect of your business operations — plus an AI-powered future on the horizon.
          </p>
        </Reveal>

        <StaggerReveal className="mt-10 sm:mt-16 grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-7" variant={stagger}>
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <StaggerItem key={mod.title}>
                <motion.div
                  whileHover={{ y: -6, transition: snappySpring }}
                  whileTap={{ scale: 0.98 }}
                  data-module-card=""
                  className="group relative z-0 h-full bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl hover:shadow-black/6 hover:z-20 p-5 sm:p-9 transition-[shadow,z-index] duration-300 card-shimmer"
                >
                  <div className={`absolute top-0 left-8 right-8 h-0.75 rounded-b-full bg-linear-to-r ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br ${mod.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground pt-2">{mod.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {mod.features.map((f) => (
                      <FeaturePreview key={f.name} image={f.image} featureName={f.name}>
                        {f.name}
                      </FeaturePreview>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>

        {/* Agentic AI — upcoming */}
        <Reveal delay={0.3} className="mt-6 sm:mt-8">
          <motion.div
            whileHover={{ y: -4, transition: snappySpring }}
            whileTap={{ scale: 0.995 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-linear-to-br from-orange-50/80 via-white to-amber-50/60 p-5 sm:p-10 lg:p-12 animated-gradient-border"
          >
            <motion.div
              className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
                <motion.div
                  className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Agentic AI Module</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] sm:text-xs font-semibold tracking-wide uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl text-sm sm:text-[17px]">
                    Intelligent AI Agents that work alongside your teams — automating tasks, surfacing insights, and making proactive recommendations across every department.
                  </p>
                </div>
              </div>

              <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4" variant={aiAgentStagger}>
                {[
                  { dept: 'HR Agent', desc: 'Automate onboarding, leave approvals & performance reviews', icon: Users },
                  { dept: 'Accounting Agent', desc: 'Smart reconciliation, invoice processing & financial insights', icon: Calculator },
                  { dept: 'Marketing Agent', desc: 'Lead scoring, campaign optimization & follow-up automation', icon: Megaphone },
                  { dept: 'Operations Agent', desc: 'Process automation, inventory alerts & workflow triggers', icon: Settings },
                  { dept: 'Executive Agent', desc: 'AI-powered briefings, KPI monitoring & decision support', icon: BarChart3 },
                ].map((agent) => {
                  const AgentIcon = agent.icon;
                  return (
                    <StaggerItem key={agent.dept} variants={fadeInScale}>
                      <motion.div
                        whileHover={{ y: -3, transition: snappySpring }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-orange-100/80 p-3.5 sm:p-5 hover:shadow-lg hover:shadow-orange-500/8 hover:border-orange-200 transition-all duration-300 h-full"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center mb-2.5 sm:mb-3 transition-colors duration-300">
                          <AgentIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-orange-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h4 className="font-semibold text-foreground text-xs sm:text-sm lg:text-[15px] mb-1 sm:mb-1.5">{agent.dept}</h4>
                        <p className="text-[11px] sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{agent.desc}</p>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerReveal>
            </div>
          </motion.div>
        </Reveal>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-auto block ml-[-5%] animate-wave-sway" preserveAspectRatio="none">
          <path d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  );
}
