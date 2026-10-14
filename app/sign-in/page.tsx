import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import Navbar from "@/components/organisms/Navbar";
import SignInForm from "@/components/organisms/SignInForm";

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
      <Navbar />
      <section className="hero hero--full">
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
          <SignInForm next={safeNext} />
        </div>
      </section>
    </main>
  );
}
