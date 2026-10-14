import Reveal from "@/components/atoms/Reveal";
import BenefitCard from "@/components/molecules/BenefitCard";
import { allBenefits } from "@/lib/benefits";

export default function BenefitsSection() {
  return (
    <section className="benefits" aria-labelledby="benefits-title">
      <Reveal className="benefits__header reveal--from-left" delay={200}>
        <p className="benefits__label">Key Benefits</p>
        <h2 id="benefits-title" className="benefits__title">
          Reduced Cost, Improved Efficiency with Enterprise-Grade Capabilities
          Built for the{" "}
          <span className="benefits__accent">African Market</span>
        </h2>
        <p className="benefits__subtitle">
          By replacing multiple standalone applications with a single integrated
          platform, organizations can transform how they work.
        </p>
        <p className="benefits__subtitle">
          Workphelo is designed with the realities of African businesses in
          mind, providing enterprise-grade capabilities while remaining
          affordable, flexible, and easy to set up.
        </p>
      </Reveal>
      <ul className="benefits__grid">
        {allBenefits.map((benefit, index) => (
          <Reveal
            as="li"
            key={benefit.title}
            className="reveal--from-right"
            delay={400 + Math.floor(index / 3) * 300 + (index % 3) * 120}
          >
            <BenefitCard {...benefit} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
