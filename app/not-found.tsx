import type { Metadata } from "next";
import Button from "@/components/atoms/Button";
import CubeLoader from "@/components/atoms/CubeLoader";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import Navbar from "@/components/organisms/Navbar";

export const metadata: Metadata = {
  title: "Something good is coming | Workphelo",
};

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="hero hero--full coming-soon">
        <Image
          src="/workphelodotcomhero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <HeroParticles />
        <HeroParallax />
        <div className="hero__content coming-soon__content">
          <CubeLoader />
          <h1 className="coming-soon__title">Something good is coming</h1>
          <p className="coming-soon__subtext">
            This page isn’t ready yet. In the meantime, there are plenty of
            roles waiting for you.
          </p>
          <Button href="/" variant="primary">
            Go home
          </Button>
        </div>
      </section>
    </main>
  );
}
