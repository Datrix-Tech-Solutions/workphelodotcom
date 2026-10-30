import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import AdvertTable from "@/components/molecules/AdvertTable";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import { listMyAdverts } from "@/lib/advertiserJobs";

/** The advertiser's dashboard: the jobs they advertise, from Supabase. */
export default async function AdvertiserDashboard({ name }: { name: string }) {
  const result = await listMyAdverts();
  const jobs = result.ok ? result.data : [];
  const open = jobs.filter((j) => j.status === "OPEN").length;
  const stats = [
    { label: "Open jobs", value: open, icon: "briefcase" as const },
    {
      label: "Closed",
      value: jobs.length - open,
      icon: "clipboard-check" as const,
      muted: true,
    },
  ];

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title="Dashboard"
          subtext={`Welcome back, ${name}.`}
        />
        <section className="account account--dashboard">
          <div className="dashboard__summary">
            {stats.map((stat) => (
              <div
                className={`dashboard__stat${"muted" in stat ? " dashboard__stat--muted" : ""}`}
                key={stat.label}
              >
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
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} advertised
                </p>
              </div>
              <Button href="/post-job" variant="solid">
                Advertise a job
              </Button>
            </header>
            {!result.ok ? (
              <p className="profile-card__empty">{result.error}</p>
            ) : jobs.length === 0 ? (
              <div className="dashboard__empty">
                <p className="profile-card__empty">
                  You haven&apos;t advertised a job yet.
                </p>
                <Button href="/post-job" variant="solid">
                  Advertise your first job
                </Button>
              </div>
            ) : (
              <AdvertTable jobs={jobs} />
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
