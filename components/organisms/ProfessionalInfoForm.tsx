"use client";

import { useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import {
  currencies,
  educationLevels,
  noticePeriods,
  type FormValues,
} from "@/lib/apply";

interface ProfessionalInfoFormProps {
  defaultValues: FormValues;
  onNext: (values: FormValues) => void;
  onBack: (values: FormValues) => void;
}

const readValues = (form: HTMLFormElement): FormValues =>
  Object.fromEntries(
    new FormData(form) as unknown as Iterable<[string, string]>,
  );

export default function ProfessionalInfoForm({
  defaultValues,
  onNext,
  onBack,
}: ProfessionalInfoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className="apply-form"
      aria-labelledby="professional-info-title"
      onSubmit={(e) => {
        e.preventDefault();
        onNext(readValues(e.currentTarget));
      }}
    >
      <h2 id="professional-info-title" className="apply-form__title">
        Professional Info
      </h2>

      <div className="apply-form__grid">
        <FormField id="job-title" label="Current job title" required>
          <Input
            id="job-title"
            name="jobTitle"
            required
            className="field-control"
            autoComplete="organization-title"
            defaultValue={defaultValues.jobTitle}
          />
        </FormField>
        <FormField id="experience" label="Years of experience" required>
          <Input
            id="experience"
            name="experience"
            required
            type="number"
            min={0}
            max={60}
            inputMode="numeric"
            className="field-control"
            defaultValue={defaultValues.experience}
          />
        </FormField>
      </div>

      <FormField id="employer" label="Current employer">
        <Input
          id="employer"
          name="employer"
          className="field-control"
          autoComplete="organization"
          defaultValue={defaultValues.employer}
        />
      </FormField>

      <FormField id="education" label="Highest education level" required>
        <Select
          id="education"
          name="education"
          required
          defaultValue={defaultValues.education ?? ""}
        >
          <option value="" disabled>
            Select education level
          </option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="skills" label="Skills" required>
        <Input
          id="skills"
          name="skills"
          required
          className="field-control"
          placeholder="e.g. React, Project management, Excel"
          aria-describedby="skills-hint"
          defaultValue={defaultValues.skills}
        />
        <span id="skills-hint" className="form-field__hint">
          Separate skills with commas.
        </span>
      </FormField>

      <div className="apply-form__grid">
        <FormField id="salary" label="Expected salary (per year)">
          <Input
            id="salary"
            name="salary"
            type="number"
            min={0}
            inputMode="numeric"
            className="field-control"
            placeholder="e.g. 60000"
            defaultValue={defaultValues.salary}
          />
        </FormField>
        <FormField id="currency" label="Currency">
          <Select
            id="currency"
            name="currency"
            defaultValue={defaultValues.currency ?? "GHS"}
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="apply-form__grid">
        <FormField id="notice" label="Notice period" required>
          <Select
            id="notice"
            name="notice"
            required
            defaultValue={defaultValues.notice ?? ""}
          >
            <option value="" disabled>
              Select notice period
            </option>
            {noticePeriods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="apply-form__actions">
        <Button
          variant="soft"
          type="button"
          onClick={() => formRef.current && onBack(readValues(formRef.current))}
        >
          Back
        </Button>
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
