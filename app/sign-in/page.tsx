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
  searchParams: Promise<{ next?: string; confirm?: string }>;
}) {
  const { next, confirm } = await searchParams;
  // Only same-site relative paths, so this can't be used as an open redirect.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <main>
      <Navbar />
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
          <SignInForm
            next={safeNext}
            notice={
              confirm === "success"
                ? "Email confirmed. Sign in as a recruiter to start posting jobs."
                : undefined
            }
            noticeError={
              confirm === "failed"
                ? "That confirmation link is invalid or has expired. Sign in to have a new one sent."
                : undefined
            }
          />
        </div>
      </section>
    </main>
  );
}
