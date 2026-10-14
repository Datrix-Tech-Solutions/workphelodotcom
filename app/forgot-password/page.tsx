import type { Metadata } from "next";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import ForgotPasswordForm from "@/components/organisms/ForgotPasswordForm";
import Navbar from "@/components/organisms/Navbar";

export const metadata: Metadata = {
  title: "Forgot password | Workphelo",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; expired?: string }>;
}) {
  const { role, expired } = await searchParams;

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
          <ForgotPasswordForm
            role={role === "recruiter" ? "recruiter" : "candidate"}
            expired={expired === "1"}
          />
        </div>
      </section>
    </main>
  );
}
