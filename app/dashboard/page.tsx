import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "@/components/atoms/Button";
import JobStatusButton from "@/components/molecules/JobStatusButton";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import { getSession } from "@/lib/auth";
import { listMyJobs } from "@/lib/recruiterApi";

export const metadata: Metadata = {
  title: "Dashboard | Workphelo",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_LABELS = { OPEN: "Open", CLOSED: "Closed", DRAFT: "Draft" };

export default async function DashboardPage() {
  const session = await getSession();
  if (session?.role !== "recruiter") redirect("/sign-in?next=/dashboard");

  const result = await listMyJobs();
  const jobs = result.ok ? result.data : [];
  const open = jobs.filter((j) => j.status === "OPEN").length;
  const applicants = jobs.reduce((sum, j) => sum + j.applicantCount, 0);

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title="Dashboard"
          subtext={`Welcome back, ${session.user.name}.`}
        />
        <section className="account account--wide">
          <div className="dashboard__summary">
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{open}</span>
              <span className="dashboard__stat-label">Open jobs</span>
            </div>
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{applicants}</span>
              <span className="dashboard__stat-label">Applicants</span>
            </div>
            <Button href="/post-job" variant="solid">
              Post a job
            </Button>
          </div>

          <section className="profile-card" aria-labelledby="your-jobs">
            <h2 id="your-jobs" className="profile-card__title">
              Your jobs
            </h2>
            {!result.ok ? (
              <p className="profile-card__empty">{result.error}</p>
            ) : jobs.length === 0 ? (
              <p className="profile-card__empty">
                You haven&apos;t posted a job yet.
              </p>
            ) : (
              <div className="recruiter-table" role="table">
                {jobs.map((job) => (
                  <div className="recruiter-table__row" role="row" key={job.id}>
                    <div className="recruiter-table__main" role="cell">
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="recruiter-table__title"
                      >
                        {job.title || "Untitled job"}
                      </Link>
                      <span className="recruiter-table__meta">
                        {[job.location, `Posted ${formatDate(job.createdAt)}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                    <span
                      className={`recruiter-table__status recruiter-table__status--${job.status.toLowerCase()}`}
                      role="cell"
                    >
                      {STATUS_LABELS[job.status]}
                    </span>
                    <span className="recruiter-table__count" role="cell">
                      {job.applicantCount}{" "}
                      {job.applicantCount === 1 ? "applicant" : "applicants"}
                    </span>
                    <span role="cell">
                      {job.status !== "DRAFT" && (
                        <JobStatusButton
                          id={job.id}
                          open={job.status === "OPEN"}
                        />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <p className="dashboard__note">
            Your company appears without a verified check mark. Companies on
            WorkPhelo are verified.{" "}
            <Link href="/pricing" className="sign-in__link">
              See plans
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
