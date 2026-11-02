import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import PostJobForm, {
  type AdvertFormValues,
} from "@/components/organisms/PostJobForm";
import { getSession } from "@/lib/auth";
import { getMyAdvert } from "@/lib/advertiserJobs";

export const metadata: Metadata = {
  title: "Edit job | Workphelo",
};

const text = (n?: number) => (n === undefined ? "" : String(n));

export default async function EditAdvertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role === "candidate") {
    redirect(`/recruiter/sign-in?next=/dashboard/adverts/${id}/edit`);
  }

  const advert = await getMyAdvert(
    id,
    session.role === "recruiter"
      ? { kind: "recruiter", id: session.user.id }
      : { kind: "advertiser" },
  );
  if (!advert) notFound();

  const { job } = advert;
  const values: AdvertFormValues = {
    companyName: advert.companyName,
    title: job.title,
    location: job.location,
    city: job.city ?? "",
    jobType: job.jobType,
    workMode: job.workMode ?? "",
    vacancies: text(job.vacancies),
    closingDate: job.closingDate ?? "",
    description: job.description,
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    perksAndBenefits: job.perksAndBenefits ?? "",
    salaryType: job.salaryType,
    salaryAmount: text(job.salaryAmount),
    salaryMin: text(job.salaryMin),
    salaryMax: text(job.salaryMax),
    salaryCurrency: job.salaryCurrency ?? "GHS",
  };

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title="Edit job"
          subtext="Your changes go live as soon as you save."
        />
        <section className="apply">
          <Link href="/dashboard" className="sign-in__link">
            ← Back to dashboard
          </Link>
          <PostJobForm advert editing={{ id, values }} />
        </section>
      </main>
      <Footer />
    </>
  );
}
