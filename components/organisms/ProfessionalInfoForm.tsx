"use client";

import { useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ResumeAutofill from "@/components/molecules/ResumeAutofill";
import {
  UNEMPLOYED_TITLE,
  currencies,
  currentRole,
  noticePeriods,
  type FormValues,
  type Profile,
} from "@/lib/apply";
import CheckList from "@/components/molecules/CheckList";
import type { ApplyRequirements } from "@/lib/jobs";
import {
  EDUCATION_LEVELS,
  educationLabel,
  highestLevel,
} from "@/lib/resume/education";
import {
  durationLabel,
  matchItems,
  totalYears,
  type ParsedEducation,
  type ParsedExperience,
  type ParsedResume,
} from "@/lib/resume/parse";

interface ProfessionalInfoFormProps {
  defaultValues: FormValues;
  defaultProfile: Profile;
  requirements: ApplyRequirements;
  onNext: (values: FormValues, profile: Profile) => void;
  onBack: (values: FormValues, profile: Profile) => void;
}

const readValues = (form: HTMLFormElement): FormValues =>
  Object.fromEntries(
    new FormData(form) as unknown as Iterable<[string, string]>,
  );

const rangeText = (range: NonNullable<ApplyRequirements["experience"]>) => {
  if (range.min !== undefined && range.max !== undefined)
    return `${range.min}–${range.max} years`;
  if (range.min !== undefined) return `${range.min}+ years`;
  if (range.max !== undefined) return `up to ${range.max} years`;
  return "";
};

export default function ProfessionalInfoForm({
  defaultValues,
  defaultProfile,
  requirements,
  onNext,
  onBack,
}: ProfessionalInfoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [education, setEducation] = useState(defaultValues.education ?? "");
  const [years, setYears] = useState(defaultValues.experience ?? "");
  const [jobTitle, setJobTitle] = useState(defaultValues.jobTitle ?? "");
  const [employer, setEmployer] = useState(defaultValues.employer ?? "");
  const [unemployed, setUnemployed] = useState(
    defaultValues.unemployed === "true",
  );
  const [qualifications, setQualifications] = useState<ParsedEducation[]>(
    defaultProfile.education,
  );
  const [roles, setRoles] = useState<ParsedExperience[]>(
    defaultProfile.experience,
  );
  const [languages, setLanguages] = useState(defaultProfile.languages);
  const [certificates, setCertificates] = useState(defaultProfile.certificates);
  const [errors, setErrors] = useState<{
    languages?: string;
    certificates?: string;
  }>({});

  const collect = (): [FormValues, Profile] => [
    {
      ...(formRef.current ? readValues(formRef.current) : {}),
      education,
      experience: years,
      // Typed values are kept in state, so unticking brings them back.
      jobTitle: unemployed ? UNEMPLOYED_TITLE : jobTitle,
      employer: unemployed ? "" : employer,
      unemployed: unemployed ? "true" : "",
    },
    {
      education: qualifications,
      experience: roles,
      languages,
      certificates,
    },
  ];

  const updateRoles = (next: ParsedExperience[]) => {
    setRoles(next);
    if (next.length > 0) setYears(String(totalYears(next)));
  };

  const updateQualifications = (next: ParsedEducation[]) => {
    setQualifications(next);
    const top = highestLevel(next.map((q) => q.level));
    if (top) setEducation(educationLabel(top));
  };

  const applyParsed = (parsed: ParsedResume, text: string) => {
    const union = (current: string[], found: string[]) => [
      ...new Set([...current, ...found]),
    ];
    if (requirements.languages) {
      setLanguages((c) =>
        union(c, matchItems(text, requirements.languages!.items)),
      );
    }
    if (requirements.certificates) {
      setCertificates((c) =>
        union(c, matchItems(text, requirements.certificates!.items)),
      );
    }
    updateRoles(parsed.experience);
    updateQualifications(parsed.education);
    // The current job is the role with no end date; none means not employed.
    const current = currentRole(parsed.experience);
    if (current && !jobTitle) setJobTitle(current.role);
    if (current && !employer) setEmployer(current.company);
  };

  const yearsNumber = years === "" ? null : Number(years);

  const wanted = requirements.educationLevels.map(educationLabel);

  return (
    <form
      ref={formRef}
      className="apply-form"
      aria-labelledby="professional-info-title"
      onSubmit={(e) => {
        e.preventDefault();
        const [values, profile] = collect();
        const next: typeof errors = {};
        if (requirements.languages?.required && languages.length === 0) {
          next.languages = "Select at least one language.";
        }
        if (requirements.certificates?.required && certificates.length === 0) {
          next.certificates = "Select at least one certificate.";
        }
        setErrors(next);
        if (Object.keys(next).length > 0) return;
        onNext(values, profile);
      }}
    >
      <h2 id="professional-info-title" className="apply-form__title">
        Professional Info
      </h2>

      <ResumeAutofill onParsed={applyParsed} />

      <div className="profile-list">
        <span className="form-field__label">Work experience</span>
        {roles.map((role, index) => (
          <div key={index} className="profile-list__row">
            <Input
              aria-label="Role"
              placeholder="Role"
              className="field-control"
              value={role.role}
              onChange={(e) =>
                updateRoles(
                  roles.map((r, i) =>
                    i === index ? { ...r, role: e.target.value } : r,
                  ),
                )
              }
            />
            <Input
              aria-label="Company"
              placeholder="Company"
              className="field-control"
              value={role.company}
              onChange={(e) =>
                updateRoles(
                  roles.map((r, i) =>
                    i === index ? { ...r, company: e.target.value } : r,
                  ),
                )
              }
            />
            <Input
              aria-label="Start date"
              type="month"
              className="field-control"
              value={role.start}
              onChange={(e) =>
                updateRoles(
                  roles.map((r, i) =>
                    i === index ? { ...r, start: e.target.value } : r,
                  ),
                )
              }
            />
            <Input
              aria-label="End date (leave blank if current)"
              type="month"
              className="field-control"
              value={role.end}
              onChange={(e) =>
                updateRoles(
                  roles.map((r, i) =>
                    i === index ? { ...r, end: e.target.value } : r,
                  ),
                )
              }
            />
            <div className="profile-list__row-footer">
              <span>
                {durationLabel(role.start, role.end) ||
                  "Add a start date to see how long"}
                {role.end === "" && role.start ? " · Current" : ""}
              </span>
              <Button
                variant="soft"
                type="button"
                onClick={() => updateRoles(roles.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button
            variant="soft"
            type="button"
            onClick={() =>
              updateRoles([
                ...roles,
                { role: "", company: "", start: "", end: "" },
              ])
            }
          >
            Add a role
          </Button>
        </div>
      </div>

      <div className="apply-form__grid">
        <FormField
          id="job-title"
          label="Current job title"
          required={!unemployed}
        >
          <Input
            id="job-title"
            name="jobTitle"
            required={!unemployed}
            disabled={unemployed}
            className="field-control"
            autoComplete="organization-title"
            value={unemployed ? "" : jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </FormField>
        <FormField
          id="experience"
          label="Years of experience"
          required={requirements.experience?.required}
        >
          <Input
            id="experience"
            name="experience"
            required={requirements.experience?.required}
            type="number"
            min={0}
            max={60}
            inputMode="numeric"
            className="field-control"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </FormField>
      </div>

      <FormField id="employer" label="Current employer">
        <Input
          id="employer"
          name="employer"
          className="field-control"
          autoComplete="organization"
          disabled={unemployed}
          value={unemployed ? "" : employer}
          onChange={(e) => setEmployer(e.target.value)}
        />
      </FormField>

      <label className="check-list__item">
        <input
          type="checkbox"
          checked={unemployed}
          onChange={(e) => setUnemployed(e.target.checked)}
        />
        I&apos;m not currently employed
      </label>

      <div className="profile-list">
        <span className="form-field__label">Education</span>
        {qualifications.map((q, index) => (
          <div key={index} className="profile-list__row">
            <Input
              aria-label="Qualification"
              placeholder="Qualification"
              className="field-control"
              value={q.qualification}
              onChange={(e) =>
                updateQualifications(
                  qualifications.map((item, i) =>
                    i === index
                      ? { ...item, qualification: e.target.value }
                      : item,
                  ),
                )
              }
            />
            <Input
              aria-label="Institution"
              placeholder="Institution"
              className="field-control"
              value={q.institution}
              onChange={(e) =>
                updateQualifications(
                  qualifications.map((item, i) =>
                    i === index
                      ? { ...item, institution: e.target.value }
                      : item,
                  ),
                )
              }
            />
            <Select
              aria-label="Level"
              value={q.level}
              onChange={(e) =>
                updateQualifications(
                  qualifications.map((item, i) =>
                    i === index
                      ? {
                          ...item,
                          level: e.target.value as ParsedEducation["level"],
                        }
                      : item,
                  ),
                )
              }
            >
              {EDUCATION_LEVELS.map((level) => (
                <option key={level.code} value={level.code}>
                  {level.label}
                </option>
              ))}
            </Select>
            <Input
              aria-label="Start date"
              type="month"
              className="field-control"
              value={q.start ?? ""}
              onChange={(e) =>
                updateQualifications(
                  qualifications.map((item, i) =>
                    i === index ? { ...item, start: e.target.value } : item,
                  ),
                )
              }
            />
            <Input
              aria-label="End date (leave blank if current)"
              type="month"
              className="field-control"
              value={q.end ?? ""}
              onChange={(e) =>
                updateQualifications(
                  qualifications.map((item, i) =>
                    i === index ? { ...item, end: e.target.value } : item,
                  ),
                )
              }
            />
            <div className="profile-list__row-footer">
              <span>{q.start && q.end === "" ? "Currently studying" : ""}</span>
              <Button
                variant="soft"
                type="button"
                onClick={() =>
                  updateQualifications(
                    qualifications.filter((_, i) => i !== index),
                  )
                }
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button
            variant="soft"
            type="button"
            onClick={() =>
              updateQualifications([
                ...qualifications,
                {
                  level: "BACHELORS",
                  qualification: "",
                  institution: "",
                  start: "",
                  end: "",
                },
              ])
            }
          >
            Add a qualification
          </Button>
        </div>
      </div>

      <FormField
        id="education"
        label="Highest education level"
        required={requirements.educationRequired}
      >
        <Select
          id="education"
          name="education"
          required={requirements.educationRequired}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
          <option value="">Select education level</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level.code} value={level.label}>
              {level.label}
            </option>
          ))}
        </Select>
        {wanted.length > 0 && (
          <span className="range-note">
            The employer is looking for: {wanted.join(", ")}.
          </span>
        )}
      </FormField>

      <FormField
        id="skills"
        label="Skills"
        required={requirements.skills?.required}
      >
        <Input
          id="skills"
          name="skills"
          required={requirements.skills?.required}
          className="field-control"
          placeholder="e.g. React, Project management, Excel"
          aria-describedby="skills-hint"
          defaultValue={defaultValues.skills}
        />
        <span id="skills-hint" className="form-field__hint">
          Separate skills with commas.
        </span>
      </FormField>

      {requirements.languages && (
        <CheckList
          legend="Languages"
          items={requirements.languages.items}
          selected={languages}
          onChange={(next) => {
            setLanguages(next);
            setErrors((e) => ({ ...e, languages: undefined }));
          }}
          required={requirements.languages.required}
          error={errors.languages}
          hint="Tick the languages you speak."
        />
      )}

      {requirements.certificates && (
        <CheckList
          legend="Certificates"
          items={requirements.certificates.items}
          selected={certificates}
          onChange={(next) => {
            setCertificates(next);
            setErrors((e) => ({ ...e, certificates: undefined }));
          }}
          required={requirements.certificates.required}
          error={errors.certificates}
          hint="Tick the certificates you hold."
        />
      )}

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
          onClick={() => onBack(...collect())}
        >
          Back
        </Button>
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
