import TextCycle from "@/components/atoms/TextCycle";
import BenefitsSection from "@/components/organisms/BenefitsSection";
import Hero from "@/components/organisms/Hero";
import ModulesSection from "@/components/organisms/ModulesSection";
import ProblemSection from "@/components/organisms/ProblemSection";
import ValuePropositionSection from "@/components/organisms/ValuePropositionSection";

const modules = [
  "HR",
  "Marketing",
  "Accounting",
  "Operations",
  "Fleet Management",
];

const highlights = [
  "One Platform.",
  "One Login.",
  "No credit card required",
  "Free early access",
  "Built for Africa",
];

export default function ProductsPage() {
  return (
    <>
      <Hero
        title="Complete Business"
        titleAccent="Visibility."
        subtext={
          <>
            Workphelo unifies <TextCycle words={modules} />, and Executive
            Reporting — giving organizations a single source of truth.
          </>
        }
        highlights={highlights}
        showSearch={false}
      />
      <ProblemSection />
      <ModulesSection />
      <BenefitsSection />
      <ValuePropositionSection />
    </>
  );
}
