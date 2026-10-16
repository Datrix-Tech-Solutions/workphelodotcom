import type { Metadata } from "next";
import { redirect } from "next/navigation";
import HeroParallax from "@/components/atoms/HeroParallax";
import HeroParticles from "@/components/atoms/HeroParticles";
import Image from "@/components/atoms/Image";
import Navbar from "@/components/organisms/Navbar";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Reset password | Workphelo",
};

export default async function ResetPasswordPage() {
  // Reached from the account menu or from a reset email (which signs the user in).
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/reset-password");

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
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
