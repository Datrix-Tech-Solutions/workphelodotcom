"use client";

import { useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import type { FormValues } from "@/lib/apply";

interface LinksFormProps {
  defaultValues: FormValues;
  onNext: (values: FormValues) => void;
  onBack: (values: FormValues) => void;
}

export default function ResumeDocumentsForm({
  defaultValues,
  onNext,
  onBack,
}: LinksFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const readPortfolio = (): FormValues => ({
    portfolio: formRef.current
      ? (new FormData(formRef.current).get("portfolio")?.toString() ?? "")
      : "",
  });

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
