import { notFound } from "next/navigation";
import ApplyWizard from "@/components/organisms/ApplyWizard";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import { fetchJob } from "@/lib/api";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;
  const job = await fetchJob(id);
  if (!job) notFound();

  const article = /^(HR|[AEIOU])/i.test(job.title) ? "an" : "a";

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          title="You’re one step closer!"
          subtext={`You are applying for ${article} ${job.title} at ${job.company}`}
          showSearch={false}
        />
        <section className="apply">
          <ApplyWizard jobId={job.id} questions={job.questions} />
        </section>
      </main>
      <Footer />
    </>
  );
}
