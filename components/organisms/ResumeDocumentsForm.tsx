"use client";

import { useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import type { FormValues } from "@/lib/apply";
import {
  extractResumeText,
  RESUME_ACCEPT,
  ResumeReadError,
} from "@/lib/resume/extractText";

const COVER_LETTER_MAX = 5000;

interface LinksFormProps {
  defaultValues: FormValues;
  documents: { portfolio: boolean; github: boolean; coverLetter: boolean };
  onNext: (values: FormValues) => void;
  onBack: (values: FormValues) => void;
}

export default function ResumeDocumentsForm({
  defaultValues,
  documents,
  onNext,
  onBack,
}: LinksFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [coverLetter, setCoverLetter] = useState(
    defaultValues.coverLetter ?? "",
  );
  const [status, setStatus] = useState<{
    kind: "idle" | "reading" | "done" | "error";
    message: string;
  }>({ kind: "idle", message: "" });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus({ kind: "reading", message: "Reading your cover letter…" });
    try {
      const text = (await extractResumeText(file)).trim();
      setCoverLetter(text.slice(0, COVER_LETTER_MAX));
      setStatus({
        kind: "done",
        message:
          text.length > COVER_LETTER_MAX
            ? `Your cover letter was cut to the first ${COVER_LETTER_MAX} characters. Please check it below.`
            : "Your cover letter is filled in below. Please check it.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof ResumeReadError
            ? error.message
            : "We couldn't read that file. You can type your cover letter below.",
      });
    }
  };

  const readPortfolio = (): FormValues => {
    const data = formRef.current ? new FormData(formRef.current) : null;
    return {
      portfolio: data?.get("portfolio")?.toString() ?? "",
      github: data?.get("github")?.toString() ?? "",
      coverLetter: data?.get("coverLetter")?.toString() ?? "",
    };
  };

  return (
    <form
      ref={formRef}
      className="apply-form"
      aria-labelledby="documents-title"
      onSubmit={(e) => {
        e.preventDefault();
        onNext(readPortfolio());
      }}
    >
      <h2 id="documents-title" className="apply-form__title">
        Links
      </h2>

      {documents.coverLetter && (
        <>
          <FormField id="cover-letter" label="Cover letter">
            <textarea
              id="cover-letter"
              name="coverLetter"
              rows={8}
              maxLength={COVER_LETTER_MAX}
              className="input field-control"
              placeholder="Type your cover letter here"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </FormField>
          <FormField id="cover-letter-file" label="Or upload a file">
            <input
              id="cover-letter-file"
              type="file"
              accept={RESUME_ACCEPT}
              disabled={status.kind === "reading"}
              onChange={(e) => {
                void handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <span className="form-field__hint">
              PDF or DOCX, up to 5 MB. Its text is read in your browser and
              placed in the box above. The file isn&apos;t uploaded.
            </span>
            {status.message && (
              <p
                className={`resume-autofill__status ${
                  status.kind === "error"
                    ? "resume-autofill__status--error"
                    : ""
                }`}
                role="status"
              >
                {status.message}
              </p>
            )}
          </FormField>
        </>
      )}

      {documents.portfolio && (
        <FormField id="portfolio" label="Portfolio or profile link">
          <Input
            id="portfolio"
            name="portfolio"
            type="url"
            className="field-control"
            placeholder="https://yourportfolio.com"
            autoComplete="url"
            defaultValue={defaultValues.portfolio}
          />
        </FormField>
      )}

      {documents.github && (
        <FormField id="github" label="GitHub profile">
          <Input
            id="github"
            name="github"
            type="url"
            className="field-control"
            placeholder="https://github.com/username"
            defaultValue={defaultValues.github}
          />
        </FormField>
      )}

      <div className="apply-form__actions">
        <Button
          variant="soft"
          type="button"
          onClick={() => onBack(readPortfolio())}
        >
          Back
        </Button>
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
