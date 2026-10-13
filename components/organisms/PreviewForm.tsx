"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import SummarySection from "@/components/molecules/SummarySection";
import type { Answers, FormValues } from "@/lib/apply";
import type { JobQuestion } from "@/lib/jobs";

interface PreviewFormProps {
  jobId: string;
  values: FormValues;
  answers: Answers;
  questions: JobQuestion[];
  onEdit: (step: number) => void;
  onBack: () => void;
}

interface SubmitError {
  message: string;
  missing?: { field: string; label: string }[];
}

export default function PreviewForm({
  jobId,
  values,
  answers,
  questions,
  onEdit,
  onBack,
}: PreviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<SubmitError | null>(null);

  const fullName = [values.firstName, values.lastName]
    .filter(Boolean)
    .join(" ");

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/apply/${encodeURIComponent(jobId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, answers }),
      });
      if (res.ok) {
        setSubmitted(true);
        return;
      }
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        missing?: SubmitError["missing"];
      } | null;
      setError({
        message: body?.error ?? "We couldn't submit your application.",
        missing: body?.missing,
      });
    } catch {
      setError({
        message:
          "We couldn't reach the server. Check your connection and retry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="apply-form" role="status">
        <h2 className="apply-form__title">Application submitted</h2>
        <p className="apply-form__note">
          Thanks, {values.firstName || "there"}. The employer has received your
          application and will be in touch.
        </p>
        <div className="apply-form__actions">
          <Button href="/jobs" variant="solid">
            Browse more jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="apply-form"
      aria-labelledby="preview-title"
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting) void submit();
      }}
    >
      <h2 id="preview-title" className="apply-form__title">
        Preview
      </h2>
      <p className="apply-form__note">
        Check your details before submitting your application.
      </p>

      <SummarySection
        title="Basic Info"
        onEdit={() => onEdit(0)}
        rows={[
          { label: "Name", value: fullName },
          { label: "Email address", value: values.email },
          { label: "Phone number", value: values.phone },
          { label: "Country", value: values.country },
          { label: "City", value: values.location },
        ]}
      />

      <SummarySection
        title="Professional Info"
        onEdit={() => onEdit(1)}
        rows={[
          { label: "Current job title", value: values.jobTitle },
          { label: "Years of experience", value: values.experience },
          { label: "Current employer", value: values.employer },
          { label: "Highest education level", value: values.education },
          { label: "Skills", value: values.skills },
          {
            label: "Expected salary",
            value: values.salary
              ? `${values.currency ?? ""} ${values.salary}`.trim()
              : "",
          },
          { label: "Notice period", value: values.notice },
        ]}
      />

      <SummarySection
        title="Links"
        onEdit={() => onEdit(2)}
        rows={[{ label: "Portfolio link", value: values.portfolio }]}
      />

      {questions.length > 0 && (
        <SummarySection
          title="Employer Questions"
          onEdit={() => onEdit(3)}
          rows={questions.map((question) => ({
            label: question.question,
            value: (answers[question.id] ?? []).join(", "),
          }))}
        />
      )}

      {error && (
        <div className="apply-form__notice" role="alert">
          <p>{error.message}</p>
          {error.missing && error.missing.length > 0 && (
            <ul>
              {error.missing.map((item) => (
                <li key={item.field}>{item.label}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="apply-form__actions">
        <Button
          variant="soft"
          type="button"
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </Button>
        <Button variant="solid" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
