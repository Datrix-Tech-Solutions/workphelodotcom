import type { Metadata } from "next";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import PricingPlans from "@/components/organisms/PricingPlans";

export const metadata: Metadata = {
  title: "Pricing | Workphelo",
  description: "Compare the Workphelo Free, Essentials, Plus and Premium plans.",
};

export default function PricingPage() {
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
        <PricingPlans />
      </main>
      <Footer />
    </>
  );
}
