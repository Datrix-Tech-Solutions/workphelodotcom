"use client";

import Divider from "@/components/atoms/Divider";
import Reveal from "@/components/atoms/Reveal";
import SubscribeForm from "@/components/molecules/SubscribeForm";
import { useSession } from "@/lib/useSession";

/**
 * The job-alert sign-up in the footer. It is for candidates, so it is shown to
 * signed-out visitors and candidates, and hidden once a recruiter or advertiser
 * is signed in.
 */
export default function FooterNewsletter() {
  const session = useSession();
  if (session && session.role !== "candidate") return null;

  return (
    <>
      <Reveal className="footer__newsletter">
        <div className="footer__copy">
          <h2 className="footer__headline">Never miss an opportunity</h2>
          <p className="footer__subtext">
            Received personalized job recommendations and career insights every
            week
          </p>
        </div>
        <SubscribeForm />
      </Reveal>
      <Divider />
    </>
  );
}
