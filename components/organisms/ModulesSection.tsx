import Button from "@/components/atoms/Button";
import Reveal from "@/components/atoms/Reveal";
import ModuleCard from "@/components/molecules/ModuleCard";
import { productModules } from "@/lib/modules";
import { getRandomModuleImage } from "@/lib/productImages";

export default function ModulesSection() {
  return (
    <section className="modules" aria-labelledby="modules-title">
      <Reveal className="modules__header">
        <p className="modules__label">Core Modules</p>
        <h2 id="modules-title" className="modules__title">
          Everything Your Business Needs, In One Place
        </h2>
        <p className="modules__subtitle">
          Four powerful modules designed to cover every aspect of your business
          operations, plus an AI-powered future on the horizon.
        </p>
      </Reveal>
      <ul className="modules__grid">
        {productModules.map((module, index) => (
          <Reveal as="li" key={module.title} delay={index * 100}>
            <ModuleCard
              {...module}
              image={
                (module.slug && getRandomModuleImage(module.slug)) ||
                module.image
              }
            />
          </Reveal>
        ))}
      </ul>
      <Reveal className="modules__cta">
        <Button href="/pricing" variant="solid">
          See pricing list
        </Button>
      </Reveal>
    </section>
  );
}
