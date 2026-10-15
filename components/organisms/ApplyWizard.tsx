"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StepProgressBar from "@/components/molecules/StepProgressBar";
import BasicInfoForm from "@/components/organisms/BasicInfoForm";
import EmployerQuestionsForm from "@/components/organisms/EmployerQuestionsForm";
import PreviewForm from "@/components/organisms/PreviewForm";
import ProfessionalInfoForm from "@/components/organisms/ProfessionalInfoForm";
import ResumeDocumentsForm from "@/components/organisms/ResumeDocumentsForm";
import {
  emptyProfile,
  type Answers,
  type FormValues,
  type Profile,
} from "@/lib/apply";
import type { Job } from "@/lib/jobs";

interface ApplyWizardProps {
  job: Pick<Job, "id" | "questions" | "apply">;
  /** Saved profile details to start from, when the applicant has them. */
  initialProfile?: Profile;
  /** Basic Info answers to start from, e.g. from the applicant's account. */
  initialValues?: FormValues;
}

type StepKey = "basic" | "professional" | "links" | "questions" | "preview";

const STEP_LABELS: Record<StepKey, string> = {
  basic: "Basic Info",
  professional: "Professional Info",
  links: "Links",
  questions: "Employer Questions",
  preview: "Preview",
};

export default function ApplyWizard({
  job,
  initialProfile = emptyProfile,
  initialValues = {},
}: ApplyWizardProps) {
  const { id: jobId, questions, apply } = job;

  // Steps with nothing to ask for this job are left out.
  const steps = useMemo(() => {
    const keys: StepKey[] = ["basic", "professional"];
    const { portfolio, github, coverLetter } = apply.documents;
    if (portfolio || github || coverLetter) keys.push("links");
    if (questions.length > 0) keys.push("questions");
    keys.push("preview");
    return keys;
  }, [apply.documents, questions.length]);

  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [answers, setAnswers] = useState<Answers>({});
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Bring the top of the form back into view when the step changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [index]);

  const current = steps[index];

  const move = (
    delta: 1 | -1,
    next?: FormValues,
    nextAnswers?: Answers,
    nextProfile?: Profile,
  ) => {
    if (next) setValues((existing) => ({ ...existing, ...next }));
    if (nextAnswers) setAnswers(nextAnswers);
    if (nextProfile) setProfile(nextProfile);
    setIndex((i) => Math.min(Math.max(i + delta, 0), steps.length - 1));
  };

  const editStep = (key: StepKey) => setIndex(steps.indexOf(key));

  return (
    <div ref={wrapperRef} className="apply-wizard">
      <StepProgressBar
        steps={steps.map((key) => STEP_LABELS[key])}
        currentStep={index}
        card
      />

      {current === "basic" && (
        <BasicInfoForm
          defaultValues={values}
          onNext={(next) => move(1, next)}
        />
      )}

      {current === "professional" && (
        <ProfessionalInfoForm
          defaultValues={values}
          defaultProfile={profile}
          requirements={apply}
          onNext={(next, nextProfile) => move(1, next, undefined, nextProfile)}
          onBack={(next, nextProfile) => move(-1, next, undefined, nextProfile)}
        />
      )}

      {current === "links" && (
        <ResumeDocumentsForm
          defaultValues={values}
          documents={apply.documents}
          onNext={(next) => move(1, next)}
          onBack={(next) => move(-1, next)}
        />
      )}

      {current === "questions" && (
        <EmployerQuestionsForm
          questions={questions}
          defaultAnswers={answers}
          onNext={(next) => move(1, undefined, next)}
          onBack={(next) => move(-1, undefined, next)}
        />
      )}

      {current === "preview" && (
        <PreviewForm
          jobId={jobId}
          values={values}
          answers={answers}
          profile={profile}
          questions={questions}
          showLinks={apply.documents.portfolio || apply.documents.github}
          requirements={apply}
          onEdit={editStep}
          onBack={() => move(-1)}
        />
      )}
    </div>
  );
}
