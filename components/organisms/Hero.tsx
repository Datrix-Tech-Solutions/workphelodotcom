import type { ReactNode } from "react";
import HeroParticles from "@/components/atoms/HeroParticles";
import HeroParallax from "@/components/atoms/HeroParallax";
import Image from "@/components/atoms/Image";
import SearchBar from "@/components/molecules/SearchBar";

interface HeroProps {
  size?: "full" | "compact";
  query?: string;
  location?: string;
  type?: string;
  title?: string;
  titleAccent?: string;
  subtext?: ReactNode;
  highlights?: string[];
  showSearch?: boolean;
}

export default function Hero({
  size = "full",
  query,
  location,
  type,
  title,
  titleAccent,
  showSearch = true,
  highlights,
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
              <>
                <span className="hero__title-line">{title}</span>
                {titleAccent && (
                  <span className="hero__title-line hero__title-line--accent">
                    {titleAccent}
                  </span>
                )}
              </>
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
          {highlights && highlights.length > 0 && (
            <ul className="hero__highlights">
              {highlights.map((highlight) => (
                <li key={highlight} className="hero__highlight">
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
        {showSearch && (
          <SearchBar defaultValue={query} location={location} type={type} />
        )}
      </div>
    </section>
  );
}
