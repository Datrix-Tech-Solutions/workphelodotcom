import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import AuthPageContent from "@/components/molecules/AuthPageContent";
import Navbar from "@/components/organisms/Navbar";
import SignUpForm from "@/components/organisms/SignUpForm"
import { POSTER_ROLES } from "@/components/organisms/SignInForm";

export const metadata: Metadata = {
  title: "Recruiter sign up | Workphelo",
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
          <SignUpForm roles={POSTER_ROLES} />
        </AuthPageContent>
      </section>
    </main>
  );
}
