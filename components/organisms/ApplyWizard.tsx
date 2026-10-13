"use client";

import { useEffect, useRef, useState } from "react";
import StepProgressBar from "@/components/molecules/StepProgressBar";
import BasicInfoForm from "@/components/organisms/BasicInfoForm";
import EmployerQuestionsForm from "@/components/organisms/EmployerQuestionsForm";
import PreviewForm from "@/components/organisms/PreviewForm";
import ProfessionalInfoForm from "@/components/organisms/ProfessionalInfoForm";
import ResumeDocumentsForm from "@/components/organisms/ResumeDocumentsForm";
import { applySteps, type Answers, type FormValues } from "@/lib/apply";
import type { JobQuestion } from "@/lib/jobs";

interface ApplyWizardProps {
  jobId: string;
  questions: JobQuestion[];
}

export default function ApplyWizard({ jobId, questions }: ApplyWizardProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [answers, setAnswers] = useState<Answers>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Bring the top of the form back into view when the step changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const save = (next: FormValues) =>
    setValues((current) => ({ ...current, ...next }));

  const goTo = (target: number, next?: FormValues, nextAnswers?: Answers) => {
    if (next) save(next);
    if (nextAnswers) setAnswers(nextAnswers);
    setStep(target);
  };

  return (
    <div ref={wrapperRef} className="apply-wizard">
      <StepProgressBar steps={applySteps} currentStep={step} card />

      {step === 0 && (
        <BasicInfoForm
          defaultValues={values}
          onNext={(next) => goTo(1, next)}
        />
      )}

      {step === 1 && (
        <ProfessionalInfoForm
          defaultValues={values}
          onNext={(next) => goTo(2, next)}
          onBack={(next) => goTo(0, next)}
        />
      )}

      {step === 2 && (
        <ResumeDocumentsForm
          defaultValues={values}
          onNext={(next) => goTo(3, next)}
          onBack={(next) => goTo(1, next)}
        />
      )}

      {step === 3 && (
        <EmployerQuestionsForm
          questions={questions}
          defaultAnswers={answers}
          onNext={(next) => goTo(4, undefined, next)}
          onBack={(next) => goTo(2, undefined, next)}
        />
      )}

      {step === 4 && (
        <PreviewForm
          jobId={jobId}
          values={values}
          answers={answers}
          questions={questions}
          onEdit={(target) => goTo(target)}
          onBack={() => goTo(3)}
        />
      )}
    </div>
  );
}
