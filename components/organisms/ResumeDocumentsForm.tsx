"use client";

import { useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import type { FormValues } from "@/lib/apply";

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
              maxLength={5000}
              className="input field-control"
              placeholder="Type your cover letter here"
              defaultValue={defaultValues.coverLetter}
            />
          </FormField>
          <FormField id="cover-letter-file" label="Or upload a file">
            <input
              id="cover-letter-file"
              name="coverLetterFile"
              type="file"
              accept=".pdf,.doc,.docx"
            />
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
