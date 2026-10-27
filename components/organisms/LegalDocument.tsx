import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import type { TermsBlock, TermsSection } from "@/lib/terms";

interface LegalDocumentProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string[];
  sections: TermsSection[];
  closing: TermsSection;
}

function Blocks({ blocks }: { blocks: TermsBlock[] }) {
  return blocks.map((block, i) => {
    if (typeof block === "string") return <p key={i}>{block}</p>;
    if (!Array.isArray(block)) return <h3 key={i}>{block.subheading}</h3>;
    return (
      <ul key={i}>
        {block.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  });
}

function Section({
  section,
  number,
}: {
  section: TermsSection;
  number?: number;
}) {
  return (
    <section className="legal-doc__section">
      <h2>{number ? `${number}. ${section.heading}` : section.heading}</h2>
      <Blocks blocks={section.blocks} />
    </section>
  );
}

export default function LegalDocument({
  title,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  closing,
}: LegalDocumentProps) {
  return (
    <>
      <Navbar />
      <main>
        <Hero
          size="compact"
          title={title}
          subtext={`Effective ${effectiveDate} · Last updated ${lastUpdated}`}
          showSearch={false}
        />
        <article className="legal-doc">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {sections.map((section, i) => (
            <Section key={section.heading} section={section} number={i + 1} />
          ))}
          <Section section={closing} />
        </article>
      </main>
      <Footer />
    </>
  );
}
