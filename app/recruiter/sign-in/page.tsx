import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import AuthPageContent from "@/components/molecules/AuthPageContent";
import Navbar from "@/components/organisms/Navbar";
import SignInForm, { POSTER_ROLES } from "@/components/organisms/SignInForm";

export const metadata: Metadata = {
  title: "Recruiter sign in | Workphelo",
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
          <SignInForm
            roles={POSTER_ROLES}
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
        </AuthPageContent>
      </section>
    </main>
  );
}
