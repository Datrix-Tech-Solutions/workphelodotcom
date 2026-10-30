"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import CandidateAuthDialog from "@/components/organisms/CandidateAuthDialog";
import { useSession } from "@/lib/useSession";

/** Goes to the application form; a signed-out visitor signs in first, in a pop-up. */
export default function ApplyButton({ href }: { href: string }) {
  const router = useRouter();
  const session = useSession();
  const [signInOpen, setSignInOpen] = useState(false);

  function handleClick() {
    if (session === null) setSignInOpen(true);
    else router.push(href);
  }

  return (
    <>
      <Button type="button" variant="solid" onClick={handleClick}>
        Apply Now
      </Button>
      <CandidateAuthDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        next={href}
      />
    </>
  );
}
