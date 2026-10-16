import type { Metadata } from "next";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import PricingPlans from "@/components/organisms/PricingPlans";
import { getSession } from "@/lib/auth";
import { pricingTiers } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing | Workphelo",
  description: "Compare the Workphelo Free, Premium and Custom plans.",
};

interface PricingPageProps {
  searchParams: Promise<{
    plan?: string | string[];
    billing?: string | string[];
  }>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const { plan, billing: billingParam } = await searchParams;
  const signedIn = (await getSession()) !== null;
  const billing =
    (Array.isArray(billingParam) ? billingParam[0] : billingParam) === "year"
      ? "year"
      : "month";
  const requested = Array.isArray(plan) ? plan[0] : plan;
  // The Free plan is only for people without an account.
  const selectedId =
    pricingTiers.some((t) => t.id === requested) &&
    !(signedIn && requested === "free")
      ? requested
      : undefined;

  return (
    <>
      <Navbar />
      <main>
        <Hero
          size="compact"
          title="Plans and pricing"
          subtext="Start free and add modules as your business grows."
          showSearch={false}
        />
        <PricingPlans
          selectedId={selectedId}
          billing={billing}
          signedIn={signedIn}
        />
      </main>
      <Footer />
    </>
  );
}
