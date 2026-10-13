import HeroParticles from "@/components/atoms/HeroParticles";
import HeroParallax from "@/components/atoms/HeroParallax";
import Image from "@/components/atoms/Image";
import SearchBar from "@/components/molecules/SearchBar";

interface HeroProps {
  size?: "full" | "compact";
  query?: string;
  title?: string;
  subtext?: string;
  showSearch?: boolean;
}

export default function Hero({
  size = "full",
  query,
  title,
  showSearch = true,
  subtext = "Skip the generic recruiter filters. Explore premium roles, apply with fully-parsed resumes, and track your application status in real-time.",
}: HeroProps) {
  return (
    <section className={`hero hero--${size}`}>
      <Image
        src="/workphelodotcomhero.png"
        alt="Glowing world map"
        fill
        priority
        sizes="100vw"
        className="hero__image"
      />
      <HeroParticles />
      <HeroParallax />
      <div className="hero__content">
        <div className="hero__text">
          <h1 className="hero__title">
            {title ? (
              <span className="hero__title-line">{title}</span>
            ) : (
              <>
                <span className="hero__title-line">
                  Find your next role with
                </span>
                <span className="hero__title-line hero__title-line--accent">
                  absolute clarity
                </span>
              </>
            )}
          </h1>
          <p className="hero__subtext">{subtext}</p>
        </div>
        {showSearch && <SearchBar defaultValue={query} />}
      </div>
    </section>
  );
}
