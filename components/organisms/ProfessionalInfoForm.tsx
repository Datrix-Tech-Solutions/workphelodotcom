"use client";

import { useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ResumeAutofill from "@/components/molecules/ResumeAutofill";
import {
  currencies,
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

/** Whether the number of years sits inside the range the employer asked for. */
function rangeNote(years: number, range: ApplyRequirements["experience"]) {
  if (!range) return null;
  const text = rangeText(range);
  if (!text) return null;
  if (range.min !== undefined && years < range.min) {
    return { tone: "warn", message: `Below the employer's range (${text}).` };
  }
  if (range.max !== undefined && years > range.max) {
    return { tone: "warn", message: `Above the employer's range (${text}).` };
  }
  return { tone: "ok", message: `Within the employer's range (${text}).` };
}

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
      jobTitle,
      employer,
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
    // The current job is the role with no end date, otherwise the first one listed.
    const current =
      parsed.experience.find((role) => role.end === "") ?? parsed.experience[0];
    if (current && !jobTitle) setJobTitle(current.role);
    if (current && !employer) setEmployer(current.company);
  };

  const yearsNumber = years === "" ? null : Number(years);
  const note =
    yearsNumber !== null && !Number.isNaN(yearsNumber)
      ? rangeNote(yearsNumber, requirements.experience)
      : null;
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
        <FormField id="job-title" label="Current job title" required>
          <Input
            id="job-title"
            name="jobTitle"
            required
            className="field-control"
            autoComplete="organization-title"
            value={jobTitle}
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
          {note && (
            <span className={`range-note range-note--${note.tone}`}>
              {note.message}
            </span>
          )}
        </FormField>
      </div>

      <FormField id="employer" label="Current employer">
        <Input
          id="employer"
          name="employer"
          className="field-control"
          autoComplete="organization"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
        />
      </FormField>

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
            <div className="profile-list__row-footer">
              <span />
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
                { level: "BACHELORS", qualification: "", institution: "" },
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
