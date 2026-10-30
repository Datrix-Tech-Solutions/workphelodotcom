import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import Navbar from "@/components/organisms/Navbar";
import RecruiterPostChoice from "@/components/organisms/RecruiterPostChoice";
import PostJobForm from "@/components/organisms/PostJobForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Post a job | Workphelo",
};

export default async function PostJobPage() {
  const session = await getSession();
  if (!session || session.role === "candidate") {
    redirect("/recruiter/sign-in?next=/post-job");
  }

  return (
    <>
      <main>
        <Navbar />
        <Hero
          size="compact"
          showSearch={false}
          title="Post a job"
          subtext="Your job goes live as soon as you post it."
        />
        <section className="apply">
          {session.role === "advertiser" ? (
            <PostJobForm advert />
          ) : (
            <RecruiterPostChoice />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
