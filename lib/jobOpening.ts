/** Form values and the API body for a recruiter's job opening. */

export type OpeningStatus = "DRAFT" | "OPEN";
export type SalaryType = "FIXED" | "RANGE" | "NEGOTIABLE" | "NON_DISCLOSED";
export type AnswerType = "YES_NO" | "SHORT_ANSWER";
export type IncludableField =
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | "certificates"
  | "description"
  | "responsibilities"
  | "perksAndBenefits";

export interface QuestionRow {
  id: string;
  question: string;
  answerType: AnswerType;
  required: boolean;
}

export interface OpeningValues {
  title: string;
  type: "" | "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  workMode: "" | "ONSITE" | "REMOTE" | "HYBRID";
  vacancies: string;
  location: string;
  city: string;
  closingDate: string;
  description: string;
  responsibilities: string;
  perksAndBenefits: string;
  educationLevels: string[];
  educationRequired: boolean;
  experienceMin: string;
  experienceMax: string;
  experienceRequired: boolean;
  skills: string[];
  skillsRequired: boolean;
  languages: string[];
  languagesRequired: boolean;
  certificates: string[];
  certificatesRequired: boolean;
  included: Record<IncludableField, boolean>;
  salaryType: SalaryType;
  salaryAmount: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  requireCoverLetter: boolean;
  requestPortfolio: boolean;
  requestGithub: boolean;
  questions: QuestionRow[];
}

export const EMPTY_OPENING: OpeningValues = {
  title: "",
  type: "",
  workMode: "",
  vacancies: "1",
  location: "",
  city: "",
  closingDate: "",
  description: "",
  responsibilities: "",
  perksAndBenefits: "",
  educationLevels: [],
  educationRequired: false,
  experienceMin: "",
  experienceMax: "",
  experienceRequired: false,
  skills: [],
  skillsRequired: false,
  languages: [],
  languagesRequired: false,
  certificates: [],
  certificatesRequired: false,
  included: {
    education: true,
    experience: true,
    skills: true,
    languages: true,
    certificates: true,
    description: true,
    responsibilities: true,
    perksAndBenefits: true,
  },
  salaryType: "FIXED",
  salaryAmount: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "GHS",
  requireCoverLetter: false,
  requestPortfolio: false,
  requestGithub: false,
  questions: [],
};

interface ListDetail {
  items: string[];
  required: boolean;
}

/** The body the HR API's create-vacancy call takes. */
export interface OpeningPayload {
  title: string;
  location: string | null;
  city: string | null;
  jobType: Exclude<OpeningValues["type"], "">;
  workMode?: Exclude<OpeningValues["workMode"], "">;
  vacancies: number;
  closingDate: string | null;
  description: string | null;
  responsibilities: string | null;
  perksAndBenefits: string | null;
  details: {
    documents: {
      resume: false;
      coverLetter: boolean;
      portfolio: boolean;
      github: boolean;
    };
    education?: { levels: string[]; required: boolean };
    experience?: { minYears?: number; maxYears?: number; required: boolean };
    skills?: ListDetail;
    languages?: ListDetail;
    certificates?: ListDetail;
  };
  salaryType: SalaryType;
  salaryAmount?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  status: OpeningStatus;
  questions: {
    question: string;
    type: AnswerType;
    required: boolean;
    sortOrder: number;
  }[];
}

const textOrNull = (value: string) => value.trim() || null;
const wholeNumber = (value: string) =>
  value.trim() === "" ? undefined : Number(value);

/** An excluded field is sent as null so it never shows on the posting. */
const textIf = (value: string, included: boolean) =>
  included ? textOrNull(value) : null;

export function toOpeningPayload(
  values: OpeningValues,
  status: OpeningStatus,
): OpeningPayload {
  const { included } = values;
  const details: OpeningPayload["details"] = {
    // Resume details are read from the applicant's resume, so it is never requested.
    documents: {
      resume: false,
      coverLetter: values.requireCoverLetter,
      portfolio: values.requestPortfolio,
      github: values.requestGithub,
    },
  };
  if (included.education && values.educationLevels.length > 0) {
    details.education = {
      levels: values.educationLevels,
      required: values.educationRequired,
    };
  }
  if (included.experience) {
    const minYears = wholeNumber(values.experienceMin);
    const maxYears = wholeNumber(values.experienceMax);
    if (minYears !== undefined || maxYears !== undefined) {
      details.experience = {
        ...(minYears !== undefined ? { minYears } : {}),
        ...(maxYears !== undefined ? { maxYears } : {}),
        required: values.experienceRequired,
      };
    }
  }
  if (included.skills && values.skills.length > 0) {
    details.skills = { items: values.skills, required: values.skillsRequired };
  }
  if (included.languages && values.languages.length > 0) {
    details.languages = {
      items: values.languages,
      required: values.languagesRequired,
    };
  }
  if (included.certificates && values.certificates.length > 0) {
    details.certificates = {
      items: values.certificates,
      required: values.certificatesRequired,
    };
  }

  const salary: Partial<OpeningPayload> = {};
  if (values.salaryType === "FIXED") {
    salary.salaryAmount = Number(values.salaryAmount);
    salary.salaryCurrency = values.salaryCurrency;
  } else if (values.salaryType === "RANGE") {
    salary.salaryMin = Number(values.salaryMin);
    salary.salaryMax = Number(values.salaryMax);
    salary.salaryCurrency = values.salaryCurrency;
  }

  return {
    title: values.title.trim(),
    location: textOrNull(values.location),
    city: textOrNull(values.city),
    jobType: values.type as OpeningPayload["jobType"],
    ...(values.workMode ? { workMode: values.workMode } : {}),
    vacancies: Number(values.vacancies),
    closingDate: values.closingDate || null,
    description: textIf(values.description, included.description),
    responsibilities: textIf(
      values.responsibilities,
      included.responsibilities,
    ),
    perksAndBenefits: textIf(
      values.perksAndBenefits,
      included.perksAndBenefits,
    ),
    details,
    salaryType: values.salaryType,
    ...salary,
    status,
    questions: values.questions
      .filter((q) => q.question.trim())
      .map((q, index) => ({
        question: q.question.trim(),
        type: q.answerType,
        required: q.required,
        sortOrder: index + 1,
      })),
  };
}
