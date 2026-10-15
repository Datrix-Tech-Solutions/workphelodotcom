import type { EducationCode } from "@/lib/resume/education";

export interface ParsedEducation {
  level: EducationCode;
  /** The qualification line as written on the resume, e.g. "BSc Computer Science". */
  qualification: string;
  institution: string;
  /** `YYYY-MM`, or "" / missing when unknown. */
  start?: string;
  /** `YYYY-MM`, or "" while still studying. */
  end?: string;
}

export interface ParsedExperience {
  role: string;
  company: string;
  /** `YYYY-MM`. */
  start: string;
  /** `YYYY-MM`, or "" while the role is current. */
  end: string;
}

export interface ParsedResume {
  education: ParsedEducation[];
  experience: ParsedExperience[];
}

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const SECTION_HEADINGS: Record<string, RegExp> = {
  // Any short heading that is about work history, e.g. "Work Experience & Internships".
  experience:
    /^(?:[a-z&,/ ]*\b(?:experience|employment|work history|career history|career summary|professional background|internships?)\b[a-z&,/ ]*)$/i,
  education:
    /^(?:[a-z&,/ ]*\b(?:education|academic|qualifications?|academic background)\b[a-z&,/ ]*)$/i,
  other:
    /^(?:skills?|key skills|technical skills|core competenc(?:y|ies)|projects?|certifications?|certificates?|licen[cs]es?|languages?|references?|referees?|summary|profile|professional summary|objective|career objective|interests?|hobbies|awards?|achievements?|publications?|volunteer(?:ing)?(?:\s+experience)?|training|courses?|personal (?:details|information|profile)|contact|contact details|about me)$/i,
};

/** Order matters: "other" headings win so "Skills & Experience" style lines are not sections. */
function headingOf(line: string): keyof typeof SECTION_HEADINGS | null {
  const text = line.replace(/[:\-–—_|]+$/g, "").trim();
  if (text.length === 0 || text.length > 40 || /\d/.test(text)) return null;
  if (SECTION_HEADINGS.other.test(text)) return "other";
  if (SECTION_HEADINGS.experience.test(text)) return "experience";
  if (SECTION_HEADINGS.education.test(text)) return "education";
  return null;
}

/** Lines under the first heading of the given kind, until the next heading. */
function sectionLines(lines: string[], kind: "experience" | "education") {
  const out: string[] = [];
  let inside = false;
  for (const line of lines) {
    const heading = headingOf(line);
    if (heading) {
      inside = heading === kind;
      continue;
    }
    if (inside) out.push(line);
  }
  return out;
}

function cleanLines(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .replace(/[•●▪‣·]/g, " ")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const MONTH = `(?:${MONTHS.join("|")})[a-z]*\\.?`;
const DATE = `(?:${MONTH}\\s*,?\\s*)?(?:19|20)\\d{2}|\\d{1,2}[/.](?:19|20)\\d{2}`;
const OPEN_END = "present|current|now|date|ongoing|till date|to date";
const RANGE = new RegExp(
  `(${DATE})\\s*(?:-|–|—|to|until|till)\\s*(${DATE}|${OPEN_END})`,
  "i",
);

function toYearMonth(raw: string, fallbackMonth: number): string {
  const numeric = raw.match(/^(\d{1,2})[/.]((?:19|20)\d{2})$/);
  if (numeric) return `${numeric[2]}-${numeric[1].padStart(2, "0")}`;
  const year = raw.match(/(?:19|20)\d{2}/)?.[0] ?? "";
  const month = MONTHS.findIndex((m) => raw.toLowerCase().includes(m));
  const monthNumber = month >= 0 ? month + 1 : fallbackMonth;
  return `${year}-${String(monthNumber).padStart(2, "0")}`;
}

const ROLE_WORDS =
  /\b(?:engineer|developer|manager|officer|analyst|assistant|accountant|director|intern(?:ship)?|consultant|designer|administrator|coordinator|supervisor|lead|specialist|clerk|teacher|lecturer|nurse|executive|associate|technician|head|chief|president|founder|architect|auditor|representative|secretary|receptionist|driver|cashier|attendant|trainee|programmer|tester|scientist|researcher|advisor|adviser|agent|operator|foreman|clerk|banker|marketer|strategist|producer|editor|writer|pharmacist|doctor|surgeon|lawyer|paralegal|buyer|planner|controller)\b/i;

const SEPARATOR = /\s+(?:at|@|-|–|—)\s+|\s*\|\s*|\s*,\s+/i;

/** Trims separators from the ends only, keeping the ones inside for splitting. */
function trimEdges(text: string): string {
  return text
    .replace(/^[\s,;:|\-–—@]+|[\s,;:|\-–—@]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNoise(text: string): string {
  return trimEdges(text.replace(/[()\[\]]/g, " "));
}

/** Splits "Role at Company" style text, deciding which half is the role by job-title words. */
function splitRoleAndCompany(text: string): { role: string; company: string } {
  const parts = text.split(SEPARATOR).map(stripNoise).filter(Boolean);
  if (parts.length >= 2) {
    const [a, b] = parts;
    return ROLE_WORDS.test(b) && !ROLE_WORDS.test(a)
      ? { role: b, company: a }
      : { role: a, company: b };
  }
  return { role: parts[0] ?? "", company: "" };
}

function parseExperience(lines: string[]): ParsedExperience[] {
  const entries: ParsedExperience[] = [];
  const used = new Set<number>();

  lines.forEach((line, index) => {
    const match = line.match(RANGE);
    if (!match) return;

    const start = toYearMonth(match[1], 1);
    const endRaw = match[2];
    const end = new RegExp(`^(?:${OPEN_END})$`, "i").test(endRaw.trim())
      ? ""
      : toYearMonth(endRaw, 12);

    const before = trimEdges(line.slice(0, match.index));
    const after = trimEdges(line.slice((match.index ?? 0) + match[0].length));
    const sameLine = splitRoleAndCompany(before || after);

    let { role, company } = sameLine;
    if (!role || !company) {
      // Role and company are often on the lines just above the dates; use the line below
      // only when nothing above is free.
      const free = (i: number) =>
        i >= 0 &&
        i < lines.length &&
        !used.has(i) &&
        !RANGE.test(lines[i]) &&
        lines[i].length <= 70 &&
        !/^[-*•]/.test(lines[i]);
      const above = [index - 1, index - 2].filter(free);
      const sources = (above.length > 0 ? above : [index + 1].filter(free)).map(
        (i) => ({ i, text: stripNoise(lines[i]) }),
      );
      const own = role || before || after;
      const candidate = [...(own ? [{ i: -1, text: own }] : []), ...sources];
      const roleItem =
        candidate.find((c) => ROLE_WORDS.test(c.text)) ?? candidate[0];
      const consumed: number[] = [];
      if (roleItem) {
        const split = splitRoleAndCompany(roleItem.text);
        role = split.role || roleItem.text;
        company = company || split.company;
        consumed.push(roleItem.i);
      }
      if (!company) {
        const companyItem =
          candidate.find((c) => c !== roleItem && !ROLE_WORDS.test(c.text)) ??
          candidate.find((c) => c !== roleItem);
        if (companyItem) {
          company = companyItem.text;
          consumed.push(companyItem.i);
        }
      }
      consumed.filter((i) => i >= 0).forEach((i) => used.add(i));
    }

    if (role || company) {
      entries.push({ role, company, start, end });
    }
  });

  return entries;
}

const LEVEL_PATTERNS: Array<[EducationCode, RegExp]> = [
  ["DOCTORATE", /\b(?:ph\.?\s?d|doctorate|doctor of philosophy|dphil)\b/i],
  [
    "MASTERS",
    /\b(?:m\.?\s?sc|m\.?\s?phil|m\.?\s?b\.?\s?a|m\.?\s?eng|m\.?\s?a|m\.?\s?ed|llm|master(?:'?s)?(?:\s+(?:of|degree|in))?)\b/i,
  ],
  [
    "POSTGRADUATE_DIPLOMA",
    /\b(?:post[\s-]?graduate\s+(?:diploma|certificate)|pgd|pgdip)\b/i,
  ],
  [
    "BACHELORS",
    /\b(?:b\.?\s?sc|b\.?\s?a|b\.?\s?eng|b\.?\s?tech|b\.?\s?b\.?\s?a|b\.?\s?ed|llb|bachelor(?:'?s)?(?:\s+(?:of|degree|in))?|undergraduate degree)\b/i,
  ],
  ["HND", /\b(?:hnd|higher national diploma)\b/i],
  ["DIPLOMA", /\bdiploma\b/i],
  ["TVET", /\b(?:tvet|vocational|technical (?:institute|school))\b/i],
  ["CERTIFICATE", /\bcertificate\b/i],
  ["SHS", /\b(?:wassce|ssce|senior high|shs|a[\s-]?levels?|high school)\b/i],
  ["JHS", /\b(?:bece|jhs|junior high|o[\s-]?levels?)\b/i],
];

const INSTITUTION =
  /\b(?:university|college|institute|polytechnic|academy|school|campus)\b/i;

export function levelOf(text: string): EducationCode | null {
  for (const [code, pattern] of LEVEL_PATTERNS) {
    if (pattern.test(text)) return code;
  }
  return null;
}

function parseEducation(lines: string[]): ParsedEducation[] {
  const entries: ParsedEducation[] = [];

  lines.forEach((line, index) => {
    const level = levelOf(line);
    if (!level) return;

    const range = line.match(RANGE);
    const start = range ? toYearMonth(range[1], 1) : "";
    const end =
      range && !new RegExp(`^(?:${OPEN_END})$`, "i").test(range[2].trim())
        ? toYearMonth(range[2], 12)
        : "";

    const own = stripNoise(line.replace(RANGE, "")).replace(
      /^(?:studied|graduated with|completed|obtained|awarded)\s+/i,
      "",
    );
    let qualification = own;
    let institution = "";

    if (INSTITUTION.test(own)) {
      // "BSc Accounting, University of Ghana": split into the two halves.
      const parts = own.split(SEPARATOR).map(trimEdges).filter(Boolean);
      const school = parts.find((part) => INSTITUTION.test(part));
      const rest = parts.filter((part) => part !== school).join(", ");
      if (school && rest) {
        institution = school;
        qualification = rest;
      }
    }
    if (!institution) {
      const neighbour = [lines[index + 1], lines[index - 1]]
        .filter((l): l is string => !!l && l.length <= 120)
        .map((l) => stripNoise(l.replace(RANGE, "")))
        .find((l) => INSTITUTION.test(l) && !levelOf(l));
      institution = neighbour ?? "";
    }

    const duplicate = entries.some(
      (e) => e.level === level && e.qualification === qualification,
    );
    if (!duplicate) {
      entries.push({ level, qualification, institution, start, end });
    }
  });

  return entries;
}

export function parseResume(text: string): ParsedResume {
  const lines = cleanLines(text);
  const educationLines = sectionLines(lines, "education");
  const experienceLines = sectionLines(lines, "experience");

  // Without recognisable headings, look through the whole document. Lines already
  // claimed by the other section are left out so a degree isn't read as a job.
  const educationSet = new Set(educationLines);
  const experience = parseExperience(
    experienceLines.length > 0
      ? experienceLines
      : lines.filter(
          (line) =>
            !educationSet.has(line) &&
            !levelOf(line) &&
            !INSTITUTION.test(line),
        ),
  );
  const education = parseEducation(
    educationLines.length > 0
      ? educationLines
      : lines.filter((line) => headingOf(line) === null),
  );

  return { education, experience };
}

function monthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + (month - 1);
}

/**
 * Total whole years across the roles, counting overlapping roles once. A role without an
 * end date runs to `now`.
 */
export function totalYears(
  roles: Pick<ParsedExperience, "start" | "end">[],
  now: Date = new Date(),
): number {
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const spans = roles
    .filter((role) => /^\d{4}-\d{2}$/.test(role.start))
    .map((role) => ({
      from: monthIndex(role.start),
      to: /^\d{4}-\d{2}$/.test(role.end) ? monthIndex(role.end) : nowIndex,
    }))
    .filter((span) => span.to >= span.from)
    .sort((a, b) => a.from - b.from);

  let months = 0;
  let cursor = -Infinity;
  for (const span of spans) {
    const from = Math.max(span.from, cursor);
    if (span.to > from) months += span.to - from;
    cursor = Math.max(cursor, span.to);
  }
  return Math.round(months / 12);
}

/** "2 yrs 3 mos" for one role. */
export function durationLabel(
  start: string,
  end: string,
  now: Date = new Date(),
): string {
  if (!/^\d{4}-\d{2}$/.test(start)) return "";
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const to = /^\d{4}-\d{2}$/.test(end) ? monthIndex(end) : nowIndex;
  const months = Math.max(0, to - monthIndex(start) + 1);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years > 0 ? `${years} yr${years === 1 ? "" : "s"}` : "",
    rest > 0 ? `${rest} mo${rest === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  return parts.join(" ") || "Less than a month";
}

/** The items from `items` that appear in the text, as whole words, ignoring case. */
export function matchItems(text: string, items: string[]): string[] {
  return items.filter((item) => {
    const escaped = item.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!escaped) return false;
    return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, "i").test(
      text,
    );
  });
}
