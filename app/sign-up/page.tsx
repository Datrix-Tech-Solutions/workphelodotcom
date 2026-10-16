import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import Navbar from "@/components/organisms/Navbar";
import SignUpForm from "@/components/organisms/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up | Workphelo",
};

export default function SignUpPage() {
  return (
    <main>
      <Navbar minimal />
      <section className="hero hero--full hero--auth">
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
        <div className="hero__content sign-in__content">
          <SignUpForm />
        </div>
      </section>
    </main>
  );
}
