"use client";

import { useRouter } from "next/navigation";

/** Content area of an auth page; a click on the empty space around the form leaves the page. */
export default function AuthPageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function leave() {
    // A direct visit has no page to go back to.
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <div
      className="hero__content sign-in__content"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) leave();
      }}
    >
      {children}
    </div>
  );
}
