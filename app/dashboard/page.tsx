import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
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
  const drafts = jobs.filter((j) => j.status === "DRAFT").length;
  const closed = jobs.filter((j) => j.status === "CLOSED").length;
  const stats = [
    { label: "Open jobs", value: open, icon: "briefcase" as const },
    { label: "Applicants", value: applicants, icon: "users" as const },
    { label: "Drafts", value: drafts, icon: "file" as const },
    { label: "Closed", value: closed, icon: "clipboard-check" as const },
  ];

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
        <section className="account account--dashboard">
          <div className="dashboard__summary">
            {stats.map((stat) => (
              <div className="dashboard__stat" key={stat.label}>
                <span className="dashboard__stat-icon">
                  <Icon name={stat.icon} size={20} />
                </span>
                <span className="dashboard__stat-value">{stat.value}</span>
                <span className="dashboard__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <section className="profile-card" aria-labelledby="your-jobs">
            <header className="dashboard__toolbar">
              <div>
                <h2 id="your-jobs" className="profile-card__title">
                  Your jobs
                </h2>
                <p className="dashboard__toolbar-sub">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} posted
                </p>
              </div>
              <Button href="/post-job" variant="solid">
                Post a job
              </Button>
            </header>
            {!result.ok ? (
              <p className="profile-card__empty">{result.error}</p>
            ) : jobs.length === 0 ? (
              <div className="dashboard__empty">
                <p className="profile-card__empty">
                  You haven&apos;t posted a job yet.
                </p>
                <Button href="/post-job" variant="solid">
                  Post your first job
                </Button>
              </div>
            ) : (
              <div className="recruiter-table" role="table">
                <div
                  className="recruiter-table__row recruiter-table__row--head"
                  role="row"
                >
                  <span role="columnheader">Job</span>
                  <span role="columnheader">Status</span>
                  <span role="columnheader">Applicants</span>
                  <span role="columnheader">
                    <span className="sr-only">Actions</span>
                  </span>
                </div>
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
                    <span role="cell">
                      <span
                        className={`recruiter-table__status recruiter-table__status--${job.status.toLowerCase()}`}
                      >
                        {STATUS_LABELS[job.status]}
                      </span>
                    </span>
                    <span className="recruiter-table__count" role="cell">
                      <strong>{job.applicantCount}</strong>
                      <span className="recruiter-table__count-label">
                        {job.applicantCount === 1 ? "applicant" : "applicants"}
                      </span>
                    </span>
                    <span className="recruiter-table__action" role="cell">
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

          {!session.user.companyVerified && (
            <p className="dashboard__note">
              Your company appears without a verified check mark. Companies on
              WorkPhelo are verified.{" "}
              <Link href="/pricing" className="sign-in__link">
                See plans
              </Link>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
