"use client";

import Button from "@/components/atoms/Button";

/** Goes to the application form. No account is needed; signing in only prefills it. */
export default function ApplyButton({ href }: { href: string }) {
  return (
    <Button href={href} variant="solid">
      Apply Now
    </Button>
  );
}
