import { notFound } from "next/navigation";
import ApplyWizard from "@/components/organisms/ApplyWizard";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import { fetchJob } from "@/lib/api";
import {
  currentRole,
  profileFromDetails,
  valuesFromAccount,
} from "@/lib/apply";
import { getSession } from "@/lib/auth";
import { getCandidateDetails } from "@/lib/candidateDetails";
import { totalYears } from "@/lib/resume/parse";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;
  const [job, details, session] = await Promise.all([
    fetchJob(id),
    getCandidateDetails(),
    getSession(),
  ]);
  if (!job || job.advertised) notFound();

  const profile = profileFromDetails(details);
  const years = totalYears(profile.experience);
  const current = currentRole(profile.experience);
  const initialValues = {
    ...(session?.role === "candidate" ? valuesFromAccount(session.user) : {}),
    // Years across all saved roles, overlaps counted once.
    ...(years > 0 ? { experience: String(years) } : {}),
    // The role with no end date; blank when every saved role has ended.
    ...(current
      ? { jobTitle: current.role, employer: current.company }
      : {}),
  };

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
          <ApplyWizard
            job={job}
            initialProfile={profile}
            initialValues={initialValues}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
