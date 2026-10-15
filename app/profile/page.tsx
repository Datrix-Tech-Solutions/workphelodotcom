import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CompactJobCard from "@/components/molecules/CompactJobCard";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import SavedJobsList from "@/components/organisms/SavedJobsList";
import CompleteProfile from "@/components/organisms/CompleteProfile";
import ProfileForm from "@/components/organisms/ProfileForm";
import { fetchJobs } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { getCandidateDetails } from "@/lib/candidateDetails";
import { jobHref } from "@/lib/jobs";
import { listSavedJobs } from "@/lib/savedJobs";

export const metadata: Metadata = {
  title: "Your profile | Workphelo",
};

const RECOMMENDED = 4;

export default async function ProfilePage() {
  const session = await getSession();
  if (session?.role !== "candidate") redirect("/sign-in?next=/profile");

  const { name, email, profile } = session.user;
  const role = profile?.role ?? "";

  const [savedJobs, details] = await Promise.all([
    listSavedJobs(),
    getCandidateDetails(),
  ]);

  // Jobs matching the saved role; if none match (or no role yet), the latest.
  let recommended = role
    ? (await fetchJobs({ query: role, limit: RECOMMENDED })).jobs
    : [];
  const matchedRole = recommended.length > 0;
  if (!matchedRole) {
    recommended = (await fetchJobs({ limit: RECOMMENDED })).jobs;
  }

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title="Your profile"
          subtext="Keep your details up to date."
        />
        <section className="account account--wide">
          <div className="profile-grid">
            <ProfileForm
              name={name}
              email={email}
              profile={{
                phone: profile?.phone ?? "",
                country: profile?.country ?? "",
                city: profile?.city ?? "",
                role,
                linkedin: profile?.linkedin ?? "",
                github: profile?.github ?? "",
                portfolio: profile?.portfolio ?? "",
              }}
            />

            <div className="profile-column">
              <section
                className="profile-card"
                aria-labelledby="recent-applications"
              >
                <h2 id="recent-applications" className="profile-card__title">
                  Recent applications
                </h2>
                <p className="profile-card__empty">
                  You haven&apos;t applied to any jobs yet.
                </p>
              </section>

              <section className="profile-card" aria-labelledby="saved-jobs">
                <h2 id="saved-jobs" className="profile-card__title">
                  Saved jobs
                </h2>
                <SavedJobsList jobs={savedJobs} />
              </section>
            </div>

            <section
              className="profile-card"
              aria-labelledby="recommended-jobs"
            >
              <h2 id="recommended-jobs" className="profile-card__title">
                {matchedRole ? `Recommended for ${role}` : "Latest jobs"}
              </h2>
              {recommended.length === 0 ? (
                <p className="profile-card__empty">
                  No jobs to show right now.
                </p>
              ) : (
                <div className="profile-card__jobs">
                  {recommended.map((job) => (
                    <CompactJobCard
                      key={job.id}
                      job={job}
                      href={jobHref(job.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <CompleteProfile initial={details} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
