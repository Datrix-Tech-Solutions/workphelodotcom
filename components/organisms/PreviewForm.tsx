"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import SummarySection from "@/components/molecules/SummarySection";
import type { Answers, FormValues, Profile } from "@/lib/apply";
import { durationLabel } from "@/lib/resume/parse";
import type { ApplyRequirements, JobQuestion } from "@/lib/jobs";

interface PreviewFormProps {
  jobId: string;
  values: FormValues;
  answers: Answers;
  profile: Profile;
  questions: JobQuestion[];
  showLinks: boolean;
  requirements: ApplyRequirements;
  onEdit: (step: "basic" | "professional" | "links" | "questions") => void;
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
  profile,
  questions,
  showLinks,
  requirements,
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
        body: JSON.stringify({ values, answers, profile }),
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
        onEdit={() => onEdit("basic")}
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
        onEdit={() => onEdit("professional")}
        rows={[
          { label: "Current job title", value: values.jobTitle },
          { label: "Years of experience", value: values.experience },
          { label: "Current employer", value: values.employer },
          {
            label: "Work experience",
            value: profile.experience
              .map((role) =>
                [
                  [role.role, role.company].filter(Boolean).join(" at "),
                  durationLabel(role.start, role.end),
                ]
                  .filter(Boolean)
                  .join(" — "),
              )
              .join("; "),
          },
          {
            label: "Education",
            value: profile.education
              .map((q) =>
                [q.qualification, q.institution].filter(Boolean).join(", "),
              )
              .join("; "),
          },
          { label: "Highest education level", value: values.education },
          { label: "Skills", value: values.skills },
          ...(requirements.languages
            ? [{ label: "Languages", value: profile.languages.join(", ") }]
            : []),
          ...(requirements.certificates
            ? [
                {
                  label: "Certificates",
                  value: profile.certificates.join(", "),
                },
              ]
            : []),
          {
            label: "Expected salary",
            value: values.salary
              ? `${values.currency ?? ""} ${values.salary}`.trim()
              : "",
          },
          { label: "Notice period", value: values.notice },
        ]}
      />

      {showLinks && (
        <SummarySection
          title="Links"
          onEdit={() => onEdit("links")}
          rows={[
            ...(requirements.documents.portfolio
              ? [{ label: "Portfolio link", value: values.portfolio }]
              : []),
            ...(requirements.documents.github
              ? [{ label: "GitHub profile", value: values.github }]
              : []),
          ]}
        />
      )}

      {questions.length > 0 && (
        <SummarySection
          title="Employer Questions"
          onEdit={() => onEdit("questions")}
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
