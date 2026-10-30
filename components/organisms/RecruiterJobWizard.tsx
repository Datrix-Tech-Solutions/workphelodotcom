"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postOpening } from "@/app/dashboard/actions";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ToggleSwitch from "@/components/atoms/ToggleSwitch";
import FormField from "@/components/molecules/FormField";
import IncludeField from "@/components/molecules/IncludeField";
import StepProgressBar from "@/components/molecules/StepProgressBar";
import TagInput from "@/components/molecules/TagInput";
import { currencies } from "@/lib/apply";
import {
  EMPTY_OPENING,
  toOpeningPayload,
  type AnswerType,
  type IncludableField,
  type OpeningStatus,
  type OpeningValues,
  type QuestionRow,
  type SalaryType,
} from "@/lib/jobOpening";

const STEPS = [
  "Job Information",
  "Job Description",
  "Requirements",
  "Application Settings",
  "Preview",
];

const TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
] as const;

const WORK_MODE_OPTIONS = [
  { value: "ONSITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

const SALARY_TYPE_OPTIONS: { value: SalaryType; label: string }[] = [
  { value: "FIXED", label: "Fixed" },
  { value: "RANGE", label: "Range" },
  { value: "NEGOTIABLE", label: "Negotiable" },
  { value: "NON_DISCLOSED", label: "Non-disclosed" },
];

const EDUCATION_LEVELS = [
  { value: "NO_FORMAL_EDUCATION", label: "No Formal Education" },
  { value: "BASIC_EDUCATION", label: "Basic Education (Primary)" },
  { value: "JHS", label: "Junior High School (JHS / BECE)" },
  { value: "SHS", label: "Senior High School (SHS / WASSCE)" },
  { value: "TVET", label: "Technical or Vocational Education (TVET)" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "HND", label: "Higher National Diploma (HND)" },
  { value: "BACHELORS", label: "Bachelor's Degree" },
  { value: "POSTGRADUATE_DIPLOMA", label: "Postgraduate Diploma" },
  { value: "MASTERS", label: "Master's Degree" },
  { value: "DOCTORATE", label: "Doctorate (PhD)" },
];

const ANSWER_TYPES: { value: AnswerType; label: string }[] = [
  { value: "YES_NO", label: "Yes / No" },
  { value: "SHORT_ANSWER", label: "Short answer" },
];

const DOCUMENT_REQUESTS = [
  {
    key: "requireCoverLetter",
    label: "Cover letter",
    hint: "Ask applicants for a cover letter.",
  },
  {
    key: "requestPortfolio",
    label: "Portfolio link",
    hint: "Ask applicants for a portfolio link.",
  },
  {
    key: "requestGithub",
    label: "GitHub link",
    hint: "Ask applicants for a GitHub profile link.",
  },
] as const;

type Errors = Partial<Record<keyof OpeningValues, string>>;

const labelOf = (
  options: readonly { value: string; label: string }[],
  v: string,
) => options.find((o) => o.value === v)?.label ?? "";

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="opening-preview__row">
      <span className="opening-preview__label">{label}</span>
      <span className="opening-preview__value">{value || "—"}</span>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="profile-card opening-section">
      <h2 className="profile-card__title">{title}</h2>
      {description && (
        <p className="opening-section__description">{description}</p>
      )}
      <div className="profile-form__fields">{children}</div>
    </section>
  );
}

/** The recruiter's job-opening form: five steps, saved as a draft or published. */
export default function RecruiterJobWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<OpeningValues>(EMPTY_OPENING);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof OpeningValues>(key: K, value: OpeningValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setIncluded(field: IncludableField, included: boolean) {
    setValues((v) => ({
      ...v,
      included: { ...v.included, [field]: included },
    }));
  }

  function bind(
    field:
      | "title"
      | "location"
      | "city"
      | "vacancies"
      | "closingDate"
      | "salaryAmount"
      | "salaryMin"
      | "salaryMax"
      | "salaryCurrency"
      | "experienceMin"
      | "experienceMax",
  ) {
    return {
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        set(field, e.target.value),
    };
  }

  function validate(): boolean {
    const next: Errors = {};
    if (step === 0) {
      if (!values.title.trim()) next.title = "Job title is required.";
      if (!values.type) next.type = "Employment type is required.";
      const vacancies = Number(values.vacancies);
      if (!Number.isInteger(vacancies) || vacancies < 1) {
        next.vacancies = "Enter at least 1 vacancy.";
      }
      if (
        values.salaryType === "FIXED" &&
        !(parseFloat(values.salaryAmount) > 0)
      ) {
        next.salaryAmount = "Enter the salary amount.";
      }
      if (values.salaryType === "RANGE") {
        const min = parseFloat(values.salaryMin);
        const max = parseFloat(values.salaryMax);
        if (!(min > 0)) next.salaryMin = "Enter the minimum salary.";
        if (!(max > 0)) next.salaryMax = "Enter the maximum salary.";
        else if (min > 0 && max < min) {
          next.salaryMax = "Maximum salary cannot be less than the minimum.";
        }
      }
    }
    if (step === 2 && values.included.experience) {
      const min = values.experienceMin.trim();
      const max = values.experienceMax.trim();
      const isYears = (v: string) =>
        Number.isInteger(Number(v)) && Number(v) >= 0;
      if (min && !isYears(min))
        next.experienceMin = "Enter whole years, 0 or more.";
      if (max && !isYears(max))
        next.experienceMax = "Enter whole years, 0 or more.";
      if (
        !next.experienceMin &&
        !next.experienceMax &&
        min &&
        max &&
        Number(max) < Number(min)
      ) {
        next.experienceMax = "Maximum cannot be less than the minimum.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (validate()) setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setError("");
    setStep((s) => s - 1);
  }

  /** Publishing needs more than a draft does; the API enforces the same fields. */
  function missingForPublish() {
    const missing: string[] = [];
    if (!values.title.trim()) missing.push("job title");
    if (!values.type) missing.push("employment type");
    if (!values.location.trim()) missing.push("location");
    if (!values.included.description || !values.description.trim()) {
      missing.push("job summary");
    }
    return missing;
  }

  async function handleSubmit(status: OpeningStatus) {
    if (loading) return;
    setError("");
    if (status === "OPEN") {
      const missing = missingForPublish();
      if (missing.length > 0) {
        setError(`Add the ${missing.join(", ")} before publishing.`);
        return;
      }
    }
    setLoading(true);
    try {
      const result = await postOpening(toOpeningPayload(values, status));
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

  function updateQuestion(id: string, patch: Partial<QuestionRow>) {
    set(
      "questions",
      values.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  }

  const fieldError = (key: keyof OpeningValues) =>
    errors[key] && (
      <p className="form-field__error" role="alert">
        {errors[key]}
      </p>
    );

  const experienceText = (() => {
    const min = values.experienceMin.trim();
    const max = values.experienceMax.trim();
    if (min && max) return `${min} – ${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
    return "";
  })();

  const salaryText = (() => {
    const c = values.salaryCurrency;
    if (values.salaryType === "FIXED") {
      return values.salaryAmount ? `${c} ${values.salaryAmount}` : "";
    }
    if (values.salaryType === "RANGE") {
      return `${c} ${values.salaryMin || "—"} – ${values.salaryMax || "—"}`;
    }
    return labelOf(SALARY_TYPE_OPTIONS, values.salaryType);
  })();

  const included = values.included;
  const requirementText = (
    label: string,
    on: boolean,
    required: boolean,
    text: string,
  ) => (
    <PreviewRow
      label={required && on ? `${label} (required)` : label}
      value={on ? text : "Not included"}
    />
  );

  return (
    <div className="opening-wizard">
      <StepProgressBar steps={STEPS} currentStep={step} card />

      {step === 0 && (
        <>
          <Section title="Job Information">
            <FormField id="opening-title" label="Job title" required>
              <input
                id="opening-title"
                type="text"
                maxLength={160}
                placeholder="e.g. Senior Accountant"
                className="field-control"
                {...bind("title")}
              />
              {fieldError("title")}
            </FormField>
            <div className="profile-form__row profile-form__row--three">
              <FormField id="opening-type" label="Employment type" required>
                <Select
                  id="opening-type"
                  value={values.type}
                  onChange={(e) =>
                    set("type", e.target.value as OpeningValues["type"])
                  }
                >
                  <option value="">Select type</option>
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                {fieldError("type")}
              </FormField>
              <FormField id="opening-mode" label="Work mode">
                <Select
                  id="opening-mode"
                  value={values.workMode}
                  onChange={(e) =>
                    set("workMode", e.target.value as OpeningValues["workMode"])
                  }
                >
                  <option value="">Select work mode</option>
                  {WORK_MODE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="opening-vacancies" label="Vacancies" required>
                <input
                  id="opening-vacancies"
                  type="number"
                  min={1}
                  max={1000}
                  className="field-control"
                  {...bind("vacancies")}
                />
                {fieldError("vacancies")}
              </FormField>
            </div>
            <div className="profile-form__row">
              <FormField id="opening-location" label="Location">
                <input
                  id="opening-location"
                  type="text"
                  maxLength={160}
                  placeholder="e.g. Airport Residential Area"
                  className="field-control"
                  {...bind("location")}
                />
              </FormField>
              <FormField id="opening-city" label="City">
                <input
                  id="opening-city"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Accra"
                  className="field-control"
                  {...bind("city")}
                />
              </FormField>
            </div>
          </Section>

          <Section title="Salary Information">
            <FormField id="opening-salary-type" label="Pay">
              <Select
                id="opening-salary-type"
                value={values.salaryType}
                onChange={(e) =>
                  set("salaryType", e.target.value as SalaryType)
                }
              >
                {SALARY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            {(values.salaryType === "FIXED" ||
              values.salaryType === "RANGE") && (
              <div className="salary-row">
                <FormField id="opening-currency" label="Currency">
                  <Select
                    id="opening-currency"
                    value={values.salaryCurrency}
                    onChange={(e) => set("salaryCurrency", e.target.value)}
                  >
                    {currencies.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </Select>
                </FormField>
                {values.salaryType === "FIXED" ? (
                  <FormField id="opening-salary" label="Amount" required>
                    <input
                      id="opening-salary"
                      type="number"
                      min={0}
                      step="0.01"
                      className="field-control"
                      {...bind("salaryAmount")}
                    />
                    {fieldError("salaryAmount")}
                  </FormField>
                ) : (
                  <>
                    <FormField id="opening-salary-min" label="Minimum" required>
                      <input
                        id="opening-salary-min"
                        type="number"
                        min={0}
                        step="0.01"
                        className="field-control"
                        {...bind("salaryMin")}
                      />
                      {fieldError("salaryMin")}
                    </FormField>
                    <FormField id="opening-salary-max" label="Maximum" required>
                      <input
                        id="opening-salary-max"
                        type="number"
                        min={0}
                        step="0.01"
                        className="field-control"
                        {...bind("salaryMax")}
                      />
                      {fieldError("salaryMax")}
                    </FormField>
                  </>
                )}
              </div>
            )}
          </Section>
        </>
      )}

      {step === 1 && (
        <Section title="Job Description">
          <IncludeField
            label="Job Summary"
            included={included.description}
            onIncludedChange={(v) => setIncluded("description", v)}
          >
            <textarea
              rows={6}
              maxLength={8000}
              placeholder="A short overview of the role"
              className="field-control"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </IncludeField>
          <IncludeField
            label="Key Responsibilities"
            included={included.responsibilities}
            onIncludedChange={(v) => setIncluded("responsibilities", v)}
          >
            <textarea
              rows={5}
              maxLength={8000}
              placeholder="What will the person be doing?"
              className="field-control"
              value={values.responsibilities}
              onChange={(e) => set("responsibilities", e.target.value)}
            />
          </IncludeField>
          <IncludeField
            label="Perks and Benefits"
            included={included.perksAndBenefits}
            onIncludedChange={(v) => setIncluded("perksAndBenefits", v)}
          >
            <textarea
              rows={4}
              maxLength={8000}
              placeholder="e.g. Health insurance, transport allowance, annual bonus"
              className="field-control"
              value={values.perksAndBenefits}
              onChange={(e) => set("perksAndBenefits", e.target.value)}
            />
          </IncludeField>
        </Section>
      )}

      {step === 2 && (
        <>
          <Section title="Requirements">
            <IncludeField
              label="Education"
              included={included.education}
              onIncludedChange={(v) => setIncluded("education", v)}
              required={values.educationRequired}
              onRequiredChange={(v) => set("educationRequired", v)}
            >
              <div className="opening-checks">
                {EDUCATION_LEVELS.map((level) => (
                  <label className="opening-check" key={level.value}>
                    <input
                      type="checkbox"
                      checked={values.educationLevels.includes(level.value)}
                      onChange={(e) =>
                        set(
                          "educationLevels",
                          e.target.checked
                            ? [...values.educationLevels, level.value]
                            : values.educationLevels.filter(
                                (l) => l !== level.value,
                              ),
                        )
                      }
                    />
                    {level.label}
                  </label>
                ))}
              </div>
            </IncludeField>
            <IncludeField
              label="Experience"
              included={included.experience}
              onIncludedChange={(v) => setIncluded("experience", v)}
              required={values.experienceRequired}
              onRequiredChange={(v) => set("experienceRequired", v)}
            >
              <div className="profile-form__row">
                <FormField id="opening-exp-min" label="Minimum years">
                  <input
                    id="opening-exp-min"
                    type="number"
                    min={0}
                    placeholder="e.g. 2"
                    className="field-control"
                    {...bind("experienceMin")}
                  />
                  {fieldError("experienceMin")}
                </FormField>
                <FormField id="opening-exp-max" label="Maximum years">
                  <input
                    id="opening-exp-max"
                    type="number"
                    min={0}
                    placeholder="e.g. 5"
                    className="field-control"
                    {...bind("experienceMax")}
                  />
                  {fieldError("experienceMax")}
                </FormField>
              </div>
            </IncludeField>
            <IncludeField
              label="Skills"
              included={included.skills}
              onIncludedChange={(v) => setIncluded("skills", v)}
              required={values.skillsRequired}
              onRequiredChange={(v) => set("skillsRequired", v)}
            >
              <TagInput
                id="opening-skills"
                value={values.skills}
                onChange={(v) => set("skills", v)}
                placeholder="Type a skill and press Enter"
              />
            </IncludeField>
            <IncludeField
              label="Languages"
              included={included.languages}
              onIncludedChange={(v) => setIncluded("languages", v)}
              required={values.languagesRequired}
              onRequiredChange={(v) => set("languagesRequired", v)}
            >
              <TagInput
                id="opening-languages"
                value={values.languages}
                onChange={(v) => set("languages", v)}
                placeholder="Type a language and press Enter"
              />
            </IncludeField>
            <IncludeField
              label="Certificates"
              included={included.certificates}
              onIncludedChange={(v) => setIncluded("certificates", v)}
              required={values.certificatesRequired}
              onRequiredChange={(v) => set("certificatesRequired", v)}
            >
              <TagInput
                id="opening-certificates"
                value={values.certificates}
                onChange={(v) => set("certificates", v)}
                placeholder="Type a certificate and press Enter"
              />
            </IncludeField>
          </Section>

          <Section
            title="Screening Questions"
            description="Optional. Applicants answer these when they apply."
          >
            {values.questions.map((q, index) => (
              <div className="opening-question" key={q.id}>
                <div className="opening-question__main">
                  <input
                    type="text"
                    aria-label={`Question ${index + 1}`}
                    placeholder={`Question ${index + 1}`}
                    className="field-control"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(q.id, { question: e.target.value })
                    }
                  />
                  <Select
                    aria-label="Answer type"
                    value={q.answerType}
                    onChange={(e) =>
                      updateQuestion(q.id, {
                        answerType: e.target.value as AnswerType,
                      })
                    }
                  >
                    {ANSWER_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="opening-question__foot">
                  <span className="include-field__switch">
                    Required
                    <ToggleSwitch
                      enabled={q.required}
                      onChange={(required) =>
                        updateQuestion(q.id, { required })
                      }
                      label={`Question ${index + 1} required`}
                    />
                  </span>
                  <button
                    type="button"
                    className="opening-question__remove"
                    onClick={() =>
                      set(
                        "questions",
                        values.questions.filter((x) => x.id !== q.id),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  set("questions", [
                    ...values.questions,
                    {
                      id: crypto.randomUUID(),
                      question: "",
                      answerType: "SHORT_ANSWER",
                      required: false,
                    },
                  ])
                }
              >
                Add Question
              </Button>
            </div>
          </Section>
        </>
      )}

      {step === 3 && (
        <>
          <Section title="Closing Date">
            <FormField id="opening-closing" label="Applications close on">
              <input
                id="opening-closing"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                className="field-control"
                {...bind("closingDate")}
              />
            </FormField>
          </Section>
          <Section
            title="Documents"
            description="Choose what applicants are asked to provide when they apply."
          >
            {DOCUMENT_REQUESTS.map(({ key, label, hint }) => (
              <div className="opening-document" key={key}>
                <div>
                  <span className="include-field__label">{label}</span>
                  <p className="opening-section__description">{hint}</p>
                </div>
                <ToggleSwitch
                  enabled={values[key]}
                  onChange={(v) => set(key, v)}
                  label={label}
                />
              </div>
            ))}
          </Section>
        </>
      )}

      {step === 4 && (
        <>
          <Section title="Job Information">
            <div className="opening-preview">
              <PreviewRow label="Job Title" value={values.title} />
              <PreviewRow
                label="Employment Type"
                value={labelOf(TYPE_OPTIONS, values.type)}
              />
              <PreviewRow
                label="Work Mode"
                value={labelOf(WORK_MODE_OPTIONS, values.workMode)}
              />
              <PreviewRow
                label="Number of Vacancies"
                value={values.vacancies}
              />
              <PreviewRow label="Location" value={values.location} />
              <PreviewRow label="City" value={values.city} />
              <PreviewRow label="Salary" value={salaryText} />
            </div>
          </Section>
          <Section title="Job Description">
            <div className="opening-preview">
              <PreviewRow
                label="Job Summary"
                value={
                  included.description ? values.description : "Not included"
                }
              />
              <PreviewRow
                label="Key Responsibilities"
                value={
                  included.responsibilities
                    ? values.responsibilities
                    : "Not included"
                }
              />
              <PreviewRow
                label="Perks and Benefits"
                value={
                  included.perksAndBenefits
                    ? values.perksAndBenefits
                    : "Not included"
                }
              />
            </div>
          </Section>
          <Section title="Requirements">
            <div className="opening-preview">
              {requirementText(
                "Education",
                included.education,
                values.educationRequired,
                values.educationLevels
                  .map((l) => labelOf(EDUCATION_LEVELS, l))
                  .join(", "),
              )}
              {requirementText(
                "Experience",
                included.experience,
                values.experienceRequired,
                experienceText,
              )}
              {requirementText(
                "Skills",
                included.skills,
                values.skillsRequired,
                values.skills.join(", "),
              )}
              {requirementText(
                "Languages",
                included.languages,
                values.languagesRequired,
                values.languages.join(", "),
              )}
              {requirementText(
                "Certificates",
                included.certificates,
                values.certificatesRequired,
                values.certificates.join(", "),
              )}
            </div>
          </Section>
          <Section title="Screening Questions">
            <div className="opening-preview">
              {values.questions.filter((q) => q.question.trim()).length ===
              0 ? (
                <PreviewRow label="Screening Questions" value="None" />
              ) : (
                values.questions
                  .filter((q) => q.question.trim())
                  .map((q, index) => (
                    <PreviewRow
                      key={q.id}
                      label={`Question ${index + 1}${q.required ? " (required)" : ""}`}
                      value={`${q.question} (${labelOf(ANSWER_TYPES, q.answerType)})`}
                    />
                  ))
              )}
            </div>
          </Section>
          <Section title="Application Settings">
            <div className="opening-preview">
              <PreviewRow label="Closing Date" value={values.closingDate} />
              {DOCUMENT_REQUESTS.map(({ key, label }) => (
                <PreviewRow
                  key={key}
                  label={label}
                  value={values[key] ? "Yes" : "No"}
                />
              ))}
            </div>
          </Section>
        </>
      )}

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      <div className="profile-form__actions opening-wizard__actions">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={loading}
        >
          Cancel
        </Button>
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="solid" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="solid"
              onClick={() => handleSubmit("OPEN")}
              disabled={loading}
            >
              {loading ? "Saving…" : "Publish"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
