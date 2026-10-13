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
}

/** A vacancy as the hr-service public endpoints return it. */
export interface ApiVacancy {
  id: string;
  tenantId: string;
  companyName: string | null;
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

export function toJob(v: ApiVacancy): Job {
  const place = [v.city, v.location].filter(
    (part, i, all): part is string => !!part && all.indexOf(part) === i,
  );
  return {
    id: toJobId(v.tenantId, v.id),
    title: v.title ?? "Untitled role",
    company: v.companyName ?? "Company",
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
  };
}

export function jobHref(
  jobId: string,
  { query, page }: { query?: string; page?: number } = {},
): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page && page > 1) params.set("page", String(page));
  params.set("job", jobId);
  return `/jobs?${params.toString()}`;
}
