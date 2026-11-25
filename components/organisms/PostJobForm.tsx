"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { editAdvert, postAdvert, postJob } from "@/app/dashboard/actions";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import MultiSelect from "@/components/molecules/MultiSelect";
import Dialog from "@/components/molecules/Dialog";
import JobPreview from "@/components/organisms/JobPreview";
import FormField from "@/components/molecules/FormField";
import { currencies } from "@/lib/apply";
import { industries } from "@/lib/company";
import { countries } from "@/lib/countries";
import { toJob, toList } from "@/lib/jobs";
import type { NewJob } from "@/lib/recruiterApi";

const JOB_TYPES: { value: NewJob["jobType"]; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Internship" },
];

const WORK_MODES: {
  value: NonNullable<NewJob["workMode"]> | "";
  label: string;
}[] = [
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
  { value: "", label: "Unspecified" },
];

const SALARY_TYPES: { value: NewJob["salaryType"]; label: string }[] = [
  { value: "NON_DISCLOSED", label: "Don't show pay" },
  { value: "FIXED", label: "Fixed amount" },
  { value: "RANGE", label: "Range" },
];

const toNumber = (value: string) => (value.trim() ? Number(value) : undefined);

/** The form's fields as text, the shape an existing advert is loaded into. */
export interface AdvertFormValues {
  companyName: string;
  industry: string;
  title: string;
  location: string;
  city: string;
  jobType: string;
  workMode: string;
  vacancies: string;
  closingDate: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  perksAndBenefits: string;
  howToApply: string;
  salaryType: string;
  salaryAmount: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
}

export default function PostJobForm({
  advert = false,
  editing,
}: {
  advert?: boolean;
  /** Edits this existing advert instead of posting a new one. */
  editing?: { id: string; values: AdvertFormValues };
}) {
  const router = useRouter();
  const [values, setValues] = useState<AdvertFormValues>(
    editing?.values ?? {
      companyName: "",
      industry: "",
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
      skills: "",
      perksAndBenefits: "",
      howToApply: "",
      salaryType: "NON_DISCLOSED",
      salaryAmount: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "GHS",
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewing, setPreviewing] = useState(false);

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

  // An advert can name several countries; they are stored as one comma-separated location.
  const selectedCountries = values.location
    ? values.location.split(", ").filter(Boolean)
    : [];
  const setCountries = (list: string[]) =>
    setValues((v) => ({ ...v, location: list.join(", ") }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPreviewing(true);
  }

  const toPayload = (): NewJob => {
    // One skill per line, like requirements; repeats are dropped.
    const skills = [...new Set(toList(values.skills))];
    return {
      title: values.title,
      location: values.location,
      city: values.city.trim() || undefined,
      jobType: values.jobType as NewJob["jobType"],
      workMode: (values.workMode || undefined) as NewJob["workMode"],
      vacancies: toNumber(values.vacancies),
      closingDate: values.closingDate || undefined,
      description: values.description,
      responsibilities: values.responsibilities.trim() || undefined,
      requirements: values.requirements.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
      perksAndBenefits: values.perksAndBenefits.trim() || undefined,
      // Only adverts take this; the HR API has no such field.
      howToApply: advert ? values.howToApply.trim() || undefined : undefined,
      salaryType: values.salaryType as NewJob["salaryType"],
      salaryAmount: toNumber(values.salaryAmount),
      salaryMin: toNumber(values.salaryMin),
      salaryMax: toNumber(values.salaryMax),
      salaryCurrency: values.salaryCurrency.trim().toUpperCase() || undefined,
    };
  };

  /** The job as applicants would see it, for the preview. */
  function previewJob() {
    const p = toPayload();
    return toJob({
      howToApply: p.howToApply ?? null,
      id: "preview",
      tenantId: "preview",
      companyName: advert ? values.companyName || null : null,
      companyVerified: false,
      title: p.title,
      location: p.location,
      city: p.city ?? null,
      jobType: p.jobType,
      workMode: p.workMode ?? null,
      description: p.description,
      responsibilities: p.responsibilities ?? null,
      requirements: p.requirements ?? null,
      perksAndBenefits: p.perksAndBenefits ?? null,
      salaryType: p.salaryType,
      salaryAmount: p.salaryAmount ?? null,
      salaryMin: p.salaryMin ?? null,
      salaryMax: p.salaryMax ?? null,
      salaryCurrency: p.salaryCurrency ?? null,
      createdAt: new Date().toISOString(),
      closingDate: p.closingDate ?? null,
      details: p.skills?.length
        ? { skills: { items: p.skills, required: false } }
        : null,
      questions: [],
    });
  }

  async function confirmPost() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const payload = toPayload();
      const result = editing
        ? await editAdvert(
            editing.id,
            payload,
            values.companyName,
            values.industry,
          )
        : advert
          ? await postAdvert(payload, values.companyName, values.industry)
          : await postJob(payload);
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
      <h2 className="profile-card__title">
        {editing ? "Edit job" : "Job details"}
      </h2>
      <div className="profile-form__fields">
        {advert && (
          <FormField id="job-company" label="Company name" required>
            <input
              id="job-company"
              type="text"
              required
              minLength={2}
              maxLength={160}
              placeholder="The company advertising this job"
              className="field-control"
              {...bind("companyName")}
            />
          </FormField>
        )}

        <div className="profile-form__row">
          {advert && (
            <FormField id="job-industry" label="Industry">
              <Select id="job-industry" {...bind("industry")}>
                <option value="">Select an industry</option>
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
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
        </div>

        <div className="profile-form__row">
          {advert ? (
            <FormField
              id="job-country"
              label="Country(s)"
              required={selectedCountries.length === 0}
            >
              <MultiSelect
                id="job-country"
                options={countries}
                value={selectedCountries}
                onChange={setCountries}
                placeholder="Select countries"
              />
            </FormField>
          ) : (
            <FormField id="job-country" label="Country" required>
              <select
                id="job-country"
                required
                className="country-select"
                {...bind("location")}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          )}
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
        <FormField id="job-skills" label="Skills required">
          <textarea
            id="job-skills"
            rows={4}
            maxLength={8000}
            className="field-control"
            {...bind("skills")}
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

        <div
          className={`salary-row${showAmount || showRange ? "" : " salary-row--single"}`}
        >
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
            <>
              <FormField id="job-currency" label="Currency">
                <Select id="job-currency" {...bind("salaryCurrency")}>
                  {currencies.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Select>
              </FormField>
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
            </>
          )}
        </div>

        {advert && (
          <FormField id="job-how-to-apply" label="How to apply">
            <textarea
              id="job-how-to-apply"
              rows={3}
              maxLength={2000}
              placeholder="e.g. Send your CV to jobs@company.com with the job title as the subject"
              className="field-control"
              {...bind("howToApply")}
            />
          </FormField>
        )}
      </div>

      <Dialog
        open={previewing}
        onClose={() => !loading && setPreviewing(false)}
        label="Job preview"
      >
        {previewing && (
          <JobPreview
            job={previewJob()}
            onPost={confirmPost}
            onEdit={() => setPreviewing(false)}
            posting={loading}
            error={error}
          />
        )}
      </Dialog>
      <div className="profile-form__actions">
        <Button type="submit" variant="solid">
          {editing ? "Save changes" : "Post job"}
        </Button>
        <Button href="/dashboard" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
