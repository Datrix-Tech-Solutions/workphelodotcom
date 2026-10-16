"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJob } from "@/app/dashboard/actions";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import type { NewJob } from "@/lib/recruiterApi";

const JOB_TYPES: { value: NewJob["jobType"]; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Internship" },
];

const WORK_MODES: { value: NonNullable<NewJob["workMode"]>; label: string }[] =
  [
    { value: "ONSITE", label: "On-site" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "REMOTE", label: "Remote" },
  ];

const SALARY_TYPES: { value: NewJob["salaryType"]; label: string }[] = [
  { value: "NON_DISCLOSED", label: "Don't show pay" },
  { value: "FIXED", label: "Fixed amount" },
  { value: "RANGE", label: "Range" },
];

const toNumber = (value: string) => (value.trim() ? Number(value) : undefined);

export default function PostJobForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    title: "",
    location: "",
    city: "",
    jobType: "FULL_TIME",
    workMode: "ONSITE",
    vacancies: "1",
    closingDate: "",
    description: "",
    responsibilities: "",
    requirements: "",
    perksAndBenefits: "",
    salaryType: "NON_DISCLOSED",
    salaryAmount: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "GHS",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function bind(field: keyof typeof values) {
    return {
      value: values[field],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => setValues((v) => ({ ...v, [field]: e.target.value })),
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await postJob({
        title: values.title,
        location: values.location,
        city: values.city.trim() || undefined,
        jobType: values.jobType as NewJob["jobType"],
        workMode: values.workMode as NewJob["workMode"],
        vacancies: toNumber(values.vacancies),
        closingDate: values.closingDate || undefined,
        description: values.description,
        responsibilities: values.responsibilities.trim() || undefined,
        requirements: values.requirements.trim() || undefined,
        perksAndBenefits: values.perksAndBenefits.trim() || undefined,
        salaryType: values.salaryType as NewJob["salaryType"],
        salaryAmount: toNumber(values.salaryAmount),
        salaryMin: toNumber(values.salaryMin),
        salaryMax: toNumber(values.salaryMax),
        salaryCurrency: values.salaryCurrency.trim().toUpperCase() || undefined,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const showAmount = values.salaryType === "FIXED";
  const showRange = values.salaryType === "RANGE";

  return (
    <form
      className="profile-card profile-form"
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <h2 className="profile-card__title">Job details</h2>
      <div className="profile-form__fields">
        <FormField id="job-title" label="Job title" required>
          <input
            id="job-title"
            type="text"
            required
            maxLength={160}
            className="field-control"
            {...bind("title")}
          />
        </FormField>

        <div className="profile-form__row">
          <FormField id="job-location" label="Location" required>
            <input
              id="job-location"
              type="text"
              required
              maxLength={160}
              placeholder="Accra, Ghana"
              className="field-control"
              {...bind("location")}
            />
          </FormField>
          <FormField id="job-city" label="City">
            <input
              id="job-city"
              type="text"
              maxLength={120}
              className="field-control"
              {...bind("city")}
            />
          </FormField>
        </div>

        <div className="profile-form__row">
          <FormField id="job-type" label="Job type" required>
            <Select id="job-type" required {...bind("jobType")}>
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="job-mode" label="Work mode">
            <Select id="job-mode" {...bind("workMode")}>
              {WORK_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="profile-form__row">
          <FormField id="job-positions" label="Open positions">
            <input
              id="job-positions"
              type="number"
              min={1}
              max={1000}
              className="field-control"
              {...bind("vacancies")}
            />
          </FormField>
          <FormField id="job-closing" label="Closing date">
            <input
              id="job-closing"
              type="date"
              className="field-control"
              {...bind("closingDate")}
            />
          </FormField>
        </div>

        <FormField id="job-description" label="Description" required>
          <textarea
            id="job-description"
            required
            rows={6}
            maxLength={8000}
            className="field-control"
            {...bind("description")}
          />
        </FormField>
        <FormField id="job-responsibilities" label="Responsibilities">
          <textarea
            id="job-responsibilities"
            rows={4}
            maxLength={8000}
            className="field-control"
            {...bind("responsibilities")}
          />
        </FormField>
        <FormField id="job-requirements" label="Requirements">
          <textarea
            id="job-requirements"
            rows={4}
            maxLength={8000}
            className="field-control"
            {...bind("requirements")}
          />
        </FormField>
        <FormField id="job-perks" label="Perks and benefits">
          <textarea
            id="job-perks"
            rows={3}
            maxLength={8000}
            className="field-control"
            {...bind("perksAndBenefits")}
          />
        </FormField>

        <FormField id="job-salary-type" label="Pay">
          <Select id="job-salary-type" {...bind("salaryType")}>
            {SALARY_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>
        {(showAmount || showRange) && (
          <div className="profile-form__row">
            {showAmount && (
              <FormField id="job-salary" label="Amount" required>
                <input
                  id="job-salary"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  className="field-control"
                  {...bind("salaryAmount")}
                />
              </FormField>
            )}
            {showRange && (
              <>
                <FormField id="job-salary-min" label="Minimum" required>
                  <input
                    id="job-salary-min"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    className="field-control"
                    {...bind("salaryMin")}
                  />
                </FormField>
                <FormField id="job-salary-max" label="Maximum" required>
                  <input
                    id="job-salary-max"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    className="field-control"
                    {...bind("salaryMax")}
                  />
                </FormField>
              </>
            )}
            <FormField id="job-currency" label="Currency">
              <input
                id="job-currency"
                type="text"
                maxLength={3}
                className="field-control"
                {...bind("salaryCurrency")}
              />
            </FormField>
          </div>
        )}
      </div>

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      <div className="profile-form__actions">
        <Button type="submit" variant="solid" disabled={loading}>
          {loading ? "Posting…" : "Post job"}
        </Button>
        <Button href="/dashboard" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
