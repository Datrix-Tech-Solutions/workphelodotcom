"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import PostJobForm from "@/components/organisms/PostJobForm";
import RecruiterJobWizard from "@/components/organisms/RecruiterJobWizard";

type Kind = "opening" | "advert";

/** A recruiter chooses between a job opening (with applicants) and an advert. */
export default function RecruiterPostChoice() {
  const [kind, setKind] = useState<Kind>("opening");

  return (
    <div className="post-choice">
      <div className="post-choice__tabs" role="group" aria-label="What to post">
        <Button
          type="button"
          variant={kind === "opening" ? "solid" : "outline"}
          onClick={() => setKind("opening")}
        >
          Job opening
        </Button>
        <Button
          type="button"
          variant={kind === "advert" ? "solid" : "outline"}
          onClick={() => setKind("advert")}
        >
          Advert
        </Button>
      </div>
      <p className="post-choice__hint">
        {kind === "opening"
          ? "Applicants apply on Workphelo and you review them from your dashboard."
          : "An advert is listed on the job board for people to see. It has no Apply or Save button."}
      </p>
      {kind === "opening" ? <RecruiterJobWizard /> : <PostJobForm advert />}
    </div>
  );
}
