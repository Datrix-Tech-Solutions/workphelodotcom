// Shared by the profile UI and the server so both agree on the fields.

export type SectionKey = "education" | "career" | "certificates";
export type DocumentKind = "resume" | "cover_letter";

export type Entry = Record<string, string>;

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "month" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface SectionConfig {
  title: string;
  itemLabel: string;
  /** Field shown as the entry's headline in the list. */
  primary: string;
  /** Field shown under the headline. */
  secondary: string;
  fields: FieldConfig[];
}

export const SECTIONS: Record<SectionKey, SectionConfig> = {
  education: {
    title: "Education",
    itemLabel: "education",
    primary: "qualification",
    secondary: "school",
    fields: [
      {
        name: "school",
        label: "School or institution",
        type: "text",
        required: true,
      },
      {
        name: "qualification",
        label: "Qualification",
        type: "text",
        required: true,
        placeholder: "e.g. BSc Computer Science",
      },
      { name: "field", label: "Field of study", type: "text" },
      { name: "startDate", label: "Start date", type: "month" },
      {
        name: "endDate",
        label: "End date (leave empty if current)",
        type: "month",
      },
    ],
  },
  career: {
    title: "Career",
    itemLabel: "role",
    primary: "title",
    secondary: "company",
    fields: [
      { name: "title", label: "Job title", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "startDate", label: "Start date", type: "month" },
      {
        name: "endDate",
        label: "End date (leave empty if current)",
        type: "month",
      },
      {
        name: "description",
        label: "What you did",
        type: "textarea",
        maxLength: 1000,
      },
    ],
  },
  certificates: {
    title: "Certificates",
    itemLabel: "certificate",
    primary: "name",
    secondary: "issuer",
    fields: [
      {
        name: "name",
        label: "Certificate name",
        type: "text",
        required: true,
      },
      { name: "issuer", label: "Issued by", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "url", label: "Credential URL", type: "url" },
    ],
  },
};

export const MAX_ENTRIES = 20;
export const DEFAULT_FIELD_LENGTH = 200;

export const DOCUMENTS: Record<DocumentKind, { title: string }> = {
  resume: { title: "Resume" },
  cover_letter: { title: "Cover letter" },
};

export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx"] as const;
// Kept under common 4.5 MB request limits on serverless hosts.
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;

export interface CandidateDetails {
  education: Entry[];
  career: Entry[];
  certificates: Entry[];
  resume: { name: string } | null;
  coverLetter: { name: string } | null;
}

export const EMPTY_DETAILS: CandidateDetails = {
  education: [],
  career: [],
  certificates: [],
  resume: null,
  coverLetter: null,
};
