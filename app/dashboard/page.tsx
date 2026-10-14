import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Button from "@/components/atoms/Button";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import RecommendedJobs from "@/components/organisms/RecommendedJobs";
import { fetchJobs } from "@/lib/api";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | Workphelo",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (session?.role !== "recruiter") redirect("/sign-in?next=/dashboard");

  const { total, unavailable } = await fetchJobs({ limit: 1 });

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
        <section className="account">
          <div className="dashboard__summary">
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">
                {unavailable ? "–" : total}
              </span>
              <span className="dashboard__stat-label">
                Open jobs on Workphelo
              </span>
            </div>
            <Button href="/post-job" variant="solid">
              Post a job
            </Button>
          </div>
        </section>
        <RecommendedJobs />
      </main>
      <Footer />
    </>
  );
}
