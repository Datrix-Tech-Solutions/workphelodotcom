export type QuestionType =
  | "SHORT_ANSWER"
  | "PARAGRAPH"
  | "YES_NO"
  | "MULTIPLE_CHOICE"
  | "CHECKBOXES"
  | "DROPDOWN";

export interface JobQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  required: boolean;
}

export interface Job {
  /** `{tenantId}_{vacancyId}`: the API needs both to look a vacancy up or apply. */
  id: string;
  title: string;
  company: string;
  /** True when WorkPhelo has verified the employer; shown as a check mark. */
  companyVerified: boolean;
  salary: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site" | null;
  type: string;
  posted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  questions: JobQuestion[];
  /** What the employer's setup asks applicants for. */
  apply: ApplyRequirements;
}

export interface ListRequirement {
  items: string[];
  required: boolean;
}

export interface ApplyRequirements {
  experience: { min?: number; max?: number; required: boolean } | null;
  educationLevels: string[];
  educationRequired: boolean;
  skills: ListRequirement | null;
  languages: ListRequirement | null;
  certificates: ListRequirement | null;
  documents: { portfolio: boolean; github: boolean; coverLetter: boolean };
}

/** A vacancy as the hr-service public endpoints return it. */
export interface ApiVacancy {
  id: string;
  tenantId: string;
  companyName: string | null;
  companyVerified?: boolean;
  title: string | null;
  location: string | null;
  city: string | null;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | null;
  workMode: "ONSITE" | "REMOTE" | "HYBRID" | null;
  description: string | null;
  responsibilities: string | null;
  perksAndBenefits: string | null;
  requirements: string | null;
  salaryType: "FIXED" | "RANGE" | "NON_DISCLOSED";
  salaryAmount: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  createdAt: string;
  details?: {
    experience?: { minYears?: number; maxYears?: number; required: boolean };
    education?: { levels: string[]; required: boolean };
    skills?: ListRequirement;
    languages?: ListRequirement;
    certificates?: ListRequirement;
    documents?: {
      resume: boolean;
      coverLetter: boolean;
      portfolio: boolean;
      github: boolean;
    };
  } | null;
  questions: {
    id: string;
    question: string;
    type: QuestionType;
    options: string[];
    required: boolean;
  }[];
}

export const JOBS_PER_PAGE = 15;

const JOB_TYPES: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERN: "Internship",
};

const WORK_MODES = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
} as const;

export function toJobId(tenantId: string, vacancyId: string): string {
  return `${tenantId}_${vacancyId}`;
}

/** Returns null when the value is not a job id this site produced. */
export function parseJobId(
  jobId: string,
): { tenantId: string; vacancyId: string } | null {
  const [tenantId, vacancyId, ...rest] = jobId.split("_");
  if (!tenantId || !vacancyId || rest.length > 0) return null;
  return { tenantId, vacancyId };
}

function formatMoney(value: number, currency: string | null): string {
  const amount = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
  return currency ? `${currency} ${amount}` : amount;
}

function formatSalary(v: ApiVacancy): string {
  if (v.salaryType === "FIXED" && v.salaryAmount !== null) {
    return formatMoney(v.salaryAmount, v.salaryCurrency);
  }
  if (
    v.salaryType === "RANGE" &&
    v.salaryMin !== null &&
    v.salaryMax !== null
  ) {
    return `${formatMoney(v.salaryMin, v.salaryCurrency)} – ${new Intl.NumberFormat(
      "en",
      { maximumFractionDigits: 0 },
    ).format(v.salaryMax)}`;
  }
  return "Salary not disclosed";
}

function formatPosted(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/** The API stores these as plain text, one item per line. */
function toList(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function listRequirement(
  value: ListRequirement | undefined,
): ListRequirement | null {
  return value && value.items.length > 0
    ? { items: value.items, required: value.required }
    : null;
}

function toApplyRequirements(
  details: ApiVacancy["details"],
): ApplyRequirements {
  const experience = details?.experience;
  return {
    experience: experience
      ? {
          min: experience.minYears,
          max: experience.maxYears,
          required: experience.required,
        }
      : null,
    educationLevels: details?.education?.levels ?? [],
    educationRequired: details?.education?.required ?? false,
    skills: listRequirement(details?.skills),
    languages: listRequirement(details?.languages),
    certificates: listRequirement(details?.certificates),
    // Openings saved before the document options existed only ever asked for a portfolio.
    documents: details?.documents
      ? {
          portfolio: details.documents.portfolio,
          github: details.documents.github,
          coverLetter: details.documents.coverLetter,
        }
      : { portfolio: true, github: false, coverLetter: false },
  };
}

export function toJob(v: ApiVacancy): Job {
  const place = [v.city, v.location].filter(
    (part, i, all): part is string => !!part && all.indexOf(part) === i,
  );
  return {
    id: toJobId(v.tenantId, v.id),
    title: v.title ?? "Untitled role",
    company: v.companyName ?? "Company",
    companyVerified: v.companyVerified === true,
    salary: formatSalary(v),
    location: place.join(", ") || "Location not specified",
    workMode: v.workMode ? WORK_MODES[v.workMode] : null,
    type: v.jobType ? JOB_TYPES[v.jobType] : "",
    posted: formatPosted(v.createdAt),
    description: v.description ?? "",
    responsibilities: toList(v.responsibilities),
    requirements: toList(v.requirements),
    perks: toList(v.perksAndBenefits),
    questions: v.questions,
    apply: toApplyRequirements(v.details),
  };
}

/** Values of the `type` search param, mapped to the API's filter fields. */
export const TYPE_FILTERS: Record<
  string,
  { label: string; field: "jobType" | "workMode"; value: string }
> = {
  FULL_TIME: { label: "Full-time", field: "jobType", value: "FULL_TIME" },
  PART_TIME: { label: "Part-time", field: "jobType", value: "PART_TIME" },
  CONTRACT: { label: "Contract", field: "jobType", value: "CONTRACT" },
  INTERN: { label: "Internship", field: "jobType", value: "INTERN" },
  REMOTE: { label: "Remote", field: "workMode", value: "REMOTE" },
  HYBRID: { label: "Hybrid", field: "workMode", value: "HYBRID" },
  ONSITE: { label: "On-site", field: "workMode", value: "ONSITE" },
};

export function jobHref(
  jobId: string,
  {
    query,
    location,
    type,
    page,
  }: { query?: string; location?: string; type?: string; page?: number } = {},
): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (location) params.set("location", location);
  if (type) params.set("type", type);
  if (page && page > 1) params.set("page", String(page));
  params.set("job", jobId);
  return `/jobs?${params.toString()}`;
}
