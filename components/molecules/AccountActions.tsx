"use client";

import Button from "@/components/atoms/Button";
import UserMenu from "@/components/molecules/UserMenu";
import { useSession } from "@/lib/useSession";

/** Auth-aware nav buttons shared by the desktop navbar and the mobile menu. */
export default function AccountActions({
  inline = false,
}: {
  inline?: boolean;
}) {
  const session = useSession();

  // Until the session is known, show the signed-out buttons.
  if (!session) {
    return (
      <>
        <Button href="/sign-in" variant="ghost">
          Sign in
        </Button>
        {session === null && (
          <Button href="/post-job" variant="glass">
            Post job
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      {session.role === "recruiter" && (
        <Button href="/post-job" variant="glass">
          Post job
        </Button>
      )}
      <UserMenu session={session} inline={inline} />
    </>
  );
}
