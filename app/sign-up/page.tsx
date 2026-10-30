import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import AuthPageContent from "@/components/molecules/AuthPageContent";
import Navbar from "@/components/organisms/Navbar";
import CandidateSignUpForm from "@/components/organisms/CandidateSignUpForm";

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
        <AuthPageContent>
          <CandidateSignUpForm />
        </AuthPageContent>
      </section>
    </main>
  );
}
