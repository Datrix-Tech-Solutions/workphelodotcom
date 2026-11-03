import type { Metadata } from "next";
import Button from "@/components/atoms/Button";
import Navbar from "@/components/organisms/Navbar";
import { unsubscribeByTokenAction } from "@/app/job-alerts/actions";

export const metadata: Metadata = {
  title: "Unsubscribe from job alerts | Workphelo",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string; done?: string }>;
}

/** Asks first, so an email scanner opening the link can't unsubscribe anyone. */
export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token, done } = await searchParams;

  return (
    <main>
      <Navbar />
      <section className="unsubscribe">
        {done ? (
          <>
            <h1>You&apos;ve unsubscribed</h1>
            <p>You won&apos;t get any more job alerts from WorkPhelo.</p>
            <Button href="/jobs" variant="solid">
              Browse jobs
            </Button>
          </>
        ) : token ? (
          <>
            <h1>Unsubscribe from job alerts?</h1>
            <p>You&apos;ll stop getting emails about new jobs.</p>
            <form action={unsubscribeByTokenAction}>
              <input type="hidden" name="token" value={token} />
              <Button variant="solid">Unsubscribe</Button>
            </form>
          </>
        ) : (
          <>
            <h1>This link isn&apos;t valid</h1>
            <p>Use the unsubscribe link from one of your job alert emails.</p>
          </>
        )}
      </section>
    </main>
  );
}
