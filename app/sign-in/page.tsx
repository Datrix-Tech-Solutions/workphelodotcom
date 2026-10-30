import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import AuthPageContent from "@/components/molecules/AuthPageContent";
import Navbar from "@/components/organisms/Navbar";
import CandidateSignInForm from "@/components/organisms/CandidateSignInForm";

export const metadata: Metadata = {
  title: "Sign in | Workphelo",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only same-site relative paths, so this can't be used as an open redirect.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

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
          <CandidateSignInForm next={safeNext} />
        </AuthPageContent>
      </section>
    </main>
  );
}
