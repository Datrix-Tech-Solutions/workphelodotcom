import Icon, { type IconName } from "@/components/atoms/Icon";
import Image from "@/components/atoms/Image";
import Reveal from "@/components/atoms/Reveal";

const steps: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "user-plus",
    title: "Create your profile",
    description:
      "Build a standout profile that showcases your skills and experience.",
  },
  {
    icon: "briefcase",
    title: "Discover opportunities",
    description:
      "Search and filter jobs that match your interests and career goals.",
  },
  {
    icon: "clipboard-check",
    title: "Apply & Track",
    description:
      "Apply with a click and track your applications in one place.",
  },
];

export default function AppShowcase() {
  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <div className="hero hero--half">
        <Image
          src="/workphelodotcomhero.png"
          alt="Glowing world map"
          fill
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__content">
          <Reveal>
            <h2 id="app-showcase-title" className="app-showcase__title">
              How WorkPhelo works
            </h2>
          </Reveal>
          <ol className="app-showcase__columns">
            {steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={150 + index * 150}
                className="app-showcase__step"
              >
                <div className="app-showcase__step-top">
                  <span className="app-showcase__icon">
                    <Icon name={step.icon} size={22} />
                  </span>
                  <span className="app-showcase__number">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="app-showcase__step-title">{step.title}</h3>
                <p className="app-showcase__step-description">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
