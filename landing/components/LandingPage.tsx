'use client';

import { Footer } from '@/landing/components/landing/Footer';
import { HeroSection } from '@/landing/components/landing/sections/HeroSection';
import { ProblemSection } from '@/landing/components/landing/sections/ProblemSection';
import { MarqueeStrip } from '@/landing/components/landing/sections/MarqueeStrip';
import { ModulesSection } from '@/landing/components/landing/sections/ModulesSection';
import { DashboardSection } from '@/landing/components/landing/sections/DashboardSection';
import { BenefitsSection } from '@/landing/components/landing/sections/BenefitsSection';
import { BuiltForAfricaSection } from '@/landing/components/landing/sections/BuiltForAfricaSection';
import { ValuePropositionSection } from '@/landing/components/landing/sections/ValuePropositionSection';
import { WaitlistSection } from '@/landing/components/landing/sections/WaitlistSection';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <MarqueeStrip
          items={['HR Management', 'Accounting', 'Marketing & BD', 'Operations', 'Fleet Management', 'Executive Dashboard', 'Agentic AI', 'Cloud-Based', 'Single Login', 'Built for Africa']}
          speed={40}
        />
        <ModulesSection />
        <DashboardSection />
        <BenefitsSection />
        <MarqueeStrip
          items={['Unified Platform', 'One Login', 'Real-Time Data', 'African-First', 'Cloud-Based', 'AI-Powered', 'Affordable', 'Scalable', 'Secure', 'Enterprise-Grade']}
          speed={35}
          reverse
          dotColor="bg-blue-400/60"
          textColor="text-blue-950/60"
          bgClass="bg-white border-b border-gray-100/80"
        />
        <BuiltForAfricaSection />
        <ValuePropositionSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
