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
      </main>
      <Footer />
    </>
  );
}
