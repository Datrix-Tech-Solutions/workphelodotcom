/** Education levels, lowest first. Codes and labels match the HR app's job opening setup. */
export const EDUCATION_LEVELS = [
  { code: "NO_FORMAL_EDUCATION", label: "No Formal Education" },
  { code: "BASIC_EDUCATION", label: "Basic Education (Primary)" },
  { code: "JHS", label: "Junior High School (JHS / BECE)" },
  { code: "SHS", label: "Senior High School (SHS / WASSCE)" },
  { code: "TVET", label: "Technical or Vocational Education (TVET)" },
  { code: "CERTIFICATE", label: "Certificate" },
  { code: "DIPLOMA", label: "Diploma" },
  { code: "HND", label: "Higher National Diploma (HND)" },
  { code: "BACHELORS", label: "Bachelor's Degree" },
  { code: "POSTGRADUATE_DIPLOMA", label: "Postgraduate Diploma" },
  { code: "MASTERS", label: "Master's Degree" },
  { code: "DOCTORATE", label: "Doctorate (PhD)" },
] as const;

export type EducationCode = (typeof EDUCATION_LEVELS)[number]["code"];

export function educationLabel(code: string): string {
  return EDUCATION_LEVELS.find((level) => level.code === code)?.label ?? code;
}

function rank(code: string): number {
  return EDUCATION_LEVELS.findIndex((level) => level.code === code);
}

/** The highest level in the list, or "" when it is empty. */
export function highestLevel(codes: string[]): string {
  return codes.reduce(
    (best, code) => (rank(code) > rank(best) ? code : best),
    "",
  );
}
