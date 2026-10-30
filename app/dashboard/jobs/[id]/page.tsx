import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import JobStatusButton from "@/components/molecules/JobStatusButton";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import { getSession } from "@/lib/auth";
import { toJobId } from "@/lib/jobs";
import { getMyJob, listApplicants } from "@/lib/recruiterApi";

export const metadata: Metadata = {
  title: "Applicants | Workphelo",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (session?.role !== "recruiter") {
    redirect(
      `/recruiter/sign-in?next=/dashboard/jobs/${encodeURIComponent(id)}`,
    );
  }

  const [job, applicants] = await Promise.all([
    getMyJob(id),
    listApplicants(id),
  ]);
  if (!job.ok) {
    if (job.status === 404 || job.status === 400) notFound();
    redirect("/dashboard");
  }

  const items = applicants.ok ? applicants.data.items : [];
  const submitted = items.filter((a) => a.submittedAt);

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title={job.data.title || "Untitled job"}
          subtext={`${submitted.length} ${submitted.length === 1 ? "applicant" : "applicants"}`}
        />
        <section className="account account--wide">
          <div className="dashboard__bar">
            <Link href="/dashboard" className="sign-in__link">
              ← All jobs
            </Link>
            <span className="recruiter-table__actions">
              {job.data.status === "OPEN" && (
                <Link
                  href={`/jobs/${toJobId(job.data.tenantId, job.data.id)}`}
                  className="button button--outline"
                >
                  View listing
                </Link>
              )}
              {job.data.status !== "DRAFT" && (
                <JobStatusButton
                  id={job.data.id}
                  open={job.data.status === "OPEN"}
                />
              )}
            </span>
          </div>

          <section className="profile-card" aria-labelledby="applicants">
            <h2 id="applicants" className="profile-card__title">
              Applicants
            </h2>
            {!applicants.ok ? (
              <p className="profile-card__empty">{applicants.error}</p>
            ) : submitted.length === 0 ? (
              <p className="profile-card__empty">
                No one has applied to this job yet.
              </p>
            ) : (
              <div className="recruiter-table" role="table">
                {submitted.map((a) => (
                  <div
                    className="recruiter-table__row recruiter-table__row--applicants"
                    role="row"
                    key={a.id}
                  >
                    <div className="recruiter-table__main" role="cell">
                      <span className="recruiter-table__title">
                        {[a.firstName, a.lastName].filter(Boolean).join(" ") ||
                          "Unnamed applicant"}
                      </span>
                      <span className="recruiter-table__meta">
                        {[a.email, a.phone].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    <span className="recruiter-table__meta" role="cell">
                      {[
                        a.currentJobTitle,
                        a.yearsOfExperience !== null
                          ? `${a.yearsOfExperience} yrs`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </span>
                    <span className="recruiter-table__status" role="cell">
                      {a.currentStage?.name ?? "New"}
                    </span>
                    <span className="recruiter-table__meta" role="cell">
                      Applied {formatDate(a.submittedAt ?? a.appliedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
