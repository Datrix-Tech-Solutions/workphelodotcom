import AppShowcase from "@/components/organisms/AppShowcase";
import FeatureSplit from "@/components/organisms/FeatureSplit";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import RecommendedJobs from "@/components/organisms/RecommendedJobs";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <Hero />
        <RecommendedJobs />
        <AppShowcase />
        <FeatureSplit />
      </main>
      <Footer />
    </>
  );
}
