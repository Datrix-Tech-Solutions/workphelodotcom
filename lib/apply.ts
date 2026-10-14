import type { ParsedEducation, ParsedExperience } from "@/lib/resume/parse";

export const applySteps = [
  "Basic Info",
  "Professional Info",
  "Links",
  "Employer Questions",
  "Preview",
];

export type FormValues = Record<string, string>;

/** Selected or typed answers, keyed by question id. Text answers hold one entry. */
export type Answers = Record<string, string[]>;

/** Qualifications and work history, usually read from the applicant's resume. */
export interface Profile {
  education: ParsedEducation[];
  experience: ParsedExperience[];
  /** Items ticked from the employer's lists. */
  languages: string[];
  certificates: string[];
}

export const emptyProfile: Profile = {
  education: [],
  experience: [],
  languages: [],
  certificates: [],
};

export interface ApplyPayload {
  values: FormValues;
  answers: Answers;
  profile: Profile;
}

export const noticePeriods = [
  "Immediately",
  "1 week",
  "2 weeks",
  "1 month",
  "2 months",
  "3 months or more",
];

export const currencies = ["GHS", "USD", "EUR", "GBP", "NGN", "KES", "ZAR"];

/** The API only accepts international numbers: + then 8–15 digits. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s().-]/g, "");
}

export function isValidPhone(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhone(value));
}
