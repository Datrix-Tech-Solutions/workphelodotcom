import type { CandidateDetails } from "@/lib/candidateDetailsConfig";
import { levelOf } from "@/lib/resume/parse";
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

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthLabel(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return "";
  const month = MONTH_NAMES[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : "";
}

/** "Sep 2019 – Jun 2023", "Sep 2019 – Present", or "" with no usable dates. */
export function periodLabel(start = "", end = ""): string {
  const from = monthLabel(start);
  const to = monthLabel(end);
  if (from && to) return `${from} – ${to}`;
  if (from) return `${from} – Present`;
  if (to) return `Until ${to}`;
  return "";
}

/** Starts an application from what the candidate already saved on their profile. */
export function profileFromDetails(details: CandidateDetails): Profile {
  return {
    ...emptyProfile,
    education: details.education.map((entry) => ({
      level: levelOf(entry.qualification ?? "") ?? "BACHELORS",
      qualification: entry.qualification ?? "",
      institution: entry.school ?? "",
      start: entry.startDate ?? "",
      end: entry.endDate ?? "",
    })),
    experience: details.career.map((entry) => ({
      role: entry.title ?? "",
      company: entry.company ?? "",
      start: entry.startDate ?? "",
      end: entry.endDate ?? "",
    })),
  };
}

/** Basic Info answers taken from the signed-in candidate's account and profile. */
export function valuesFromAccount(account: {
  name?: string | null;
  email?: string | null;
  profile?: {
    phone?: string | null;
    country?: string | null;
    city?: string | null;
  } | null;
}): FormValues {
  // The account keeps one name; the first word is the first name.
  const [firstName = "", ...rest] = (account.name ?? "").trim().split(/\s+/);
  const candidates: FormValues = {
    firstName,
    lastName: rest.join(" "),
    email: account.email ?? "",
    phone: account.profile?.phone ?? "",
    country: account.profile?.country ?? "",
    location: account.profile?.city ?? "",
  };
  return Object.fromEntries(
    Object.entries(candidates).filter(([, value]) => value),
  );
}

/**
 * The role someone holds right now: one with no end date, preferring ones that
 * have a start date and, among those, the most recently started. Null when
 * every role has ended (or there are none).
 */
export function currentRole(
  roles: ParsedExperience[],
): ParsedExperience | null {
  const open = roles.filter((role) => role.role && role.end === "");
  const dated = open
    .filter((role) => /^\d{4}-\d{2}$/.test(role.start))
    .sort((a, b) => b.start.localeCompare(a.start));
  return dated[0] ?? open[0] ?? null;
}

/** Sent as the current job title when the applicant is not employed. */
export const UNEMPLOYED_TITLE = "Unemployed";
