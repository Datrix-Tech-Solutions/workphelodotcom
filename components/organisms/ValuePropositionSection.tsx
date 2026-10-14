import Reveal from "@/components/atoms/Reveal";

export default function ValuePropositionSection() {
  return (
    <section className="value-prop" aria-labelledby="value-prop-title">
      <Reveal className="value-prop__card">
        <h2 id="value-prop-title" className="value-prop__title">
          Workphelo&apos;s Core Value Proposition
        </h2>
        <blockquote className="value-prop__quote">
          &ldquo;Workphelo unifies HR, Marketing, Sales, Accounting, Operations,
          Fleet Management, and Executive Reporting into one intelligent
          platform, giving organizations a single source of truth, a single
          login, and a complete view of their business.&rdquo;
        </blockquote>
      </Reveal>
    </section>
  );
}
