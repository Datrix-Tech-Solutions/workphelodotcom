import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  DEFAULT_FIELD_LENGTH,
  DOCUMENT_EXTENSIONS,
  EMPTY_DETAILS,
  MAX_DOCUMENT_BYTES,
  MAX_ENTRIES,
  SECTIONS,
  type CandidateDetails,
  type DocumentKind,
  type Entry,
  type SectionKey,
} from "@/lib/candidateDetailsConfig";

const BUCKET = "candidate-documents";

export type DetailsResult = { error?: string };

/** The signed-in candidate's Supabase client and id, or null. */
async function candidate() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, userId: data.user.id } : null;
}

const COLUMNS: Record<DocumentKind, { path: string; name: string }> = {
  resume: { path: "resume_path", name: "resume_name" },
  cover_letter: { path: "cover_letter_path", name: "cover_letter_name" },
};

/** Keeps only configured fields, trims and caps them, drops incomplete entries. */
function sanitize(section: SectionKey, entries: unknown): Entry[] {
  if (!Array.isArray(entries)) return [];
  const { fields } = SECTIONS[section];
  const out: Entry[] = [];

  for (const raw of entries.slice(0, MAX_ENTRIES)) {
    if (!raw || typeof raw !== "object") continue;
    const entry: Entry = {};
    for (const f of fields) {
      const value = (raw as Record<string, unknown>)[f.name];
      entry[f.name] =
        typeof value === "string"
          ? value.trim().slice(0, f.maxLength ?? DEFAULT_FIELD_LENGTH)
          : "";
    }
    if (section === "education") {
      // Education used to store a start/end year; carry those over as months.
      const legacy = raw as Record<string, unknown>;
      const year = (value: unknown) =>
        typeof value === "string" && /^\d{4}$/.test(value.trim())
          ? value.trim()
          : "";
      if (!entry.startDate && year(legacy.startYear)) {
        entry.startDate = `${year(legacy.startYear)}-01`;
      }
      if (!entry.endDate && year(legacy.endYear)) {
        entry.endDate = `${year(legacy.endYear)}-12`;
      }
    }
    if (fields.every((f) => !f.required || entry[f.name])) out.push(entry);
  }
  return out;
}

export async function getCandidateDetails(): Promise<CandidateDetails> {
  const ctx = await candidate();
  if (!ctx) return EMPTY_DETAILS;

  const { data, error } = await ctx.supabase
    .from("candidate_details")
    .select("education, career, certificates, resume_name, cover_letter_name")
    .maybeSingle();
  if (error || !data) return EMPTY_DETAILS;

  return {
    education: sanitize("education", data.education),
    career: sanitize("career", data.career),
    certificates: sanitize("certificates", data.certificates),
    resume: data.resume_name ? { name: data.resume_name } : null,
    coverLetter: data.cover_letter_name
      ? { name: data.cover_letter_name }
      : null,
  };
}

export async function saveSection(
  section: SectionKey,
  entries: unknown,
): Promise<DetailsResult> {
  if (!(section in SECTIONS)) return { error: "Unknown section." };
  const ctx = await candidate();
  if (!ctx) return { error: "Please sign in again." };

  const { error } = await ctx.supabase.from("candidate_details").upsert({
    user_id: ctx.userId,
    [section]: sanitize(section, entries),
    updated_at: new Date().toISOString(),
  });
  return error ? { error: "Couldn't save. Please try again." } : {};
}

async function currentPath(
  ctx: NonNullable<Awaited<ReturnType<typeof candidate>>>,
  kind: DocumentKind,
): Promise<string | null> {
  const { data } = await ctx.supabase
    .from("candidate_details")
    .select(COLUMNS[kind].path)
    .maybeSingle();
  const value = (data as Record<string, unknown> | null)?.[COLUMNS[kind].path];
  return typeof value === "string" ? value : null;
}

export async function uploadDocument(
  kind: DocumentKind,
  file: File,
): Promise<DetailsResult> {
  if (!(kind in COLUMNS)) return { error: "Unknown document." };
  const ctx = await candidate();
  if (!ctx) return { error: "Please sign in again." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(DOCUMENT_EXTENSIONS as readonly string[]).includes(ext)) {
    return { error: "Upload a PDF, DOC or DOCX file." };
  }
  if (file.size === 0) return { error: "That file is empty." };
  if (file.size > MAX_DOCUMENT_BYTES) {
    return { error: "File is too large (4 MB maximum)." };
  }

  const previous = await currentPath(ctx, kind);
  const path = `${ctx.userId}/${kind}-${Date.now()}.${ext}`;

  const { error: uploadError } = await ctx.supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined });
  if (uploadError) return { error: "Couldn't upload the file. Try again." };

  const { error } = await ctx.supabase.from("candidate_details").upsert({
    user_id: ctx.userId,
    [COLUMNS[kind].path]: path,
    [COLUMNS[kind].name]: file.name.slice(0, 200),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    await ctx.supabase.storage.from(BUCKET).remove([path]);
    return { error: "Couldn't save the file. Try again." };
  }

  if (previous) await ctx.supabase.storage.from(BUCKET).remove([previous]);
  return {};
}

export async function removeDocument(
  kind: DocumentKind,
): Promise<DetailsResult> {
  if (!(kind in COLUMNS)) return { error: "Unknown document." };
  const ctx = await candidate();
  if (!ctx) return { error: "Please sign in again." };

  const previous = await currentPath(ctx, kind);
  const { error } = await ctx.supabase.from("candidate_details").upsert({
    user_id: ctx.userId,
    [COLUMNS[kind].path]: null,
    [COLUMNS[kind].name]: null,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Couldn't remove the file. Try again." };

  if (previous) await ctx.supabase.storage.from(BUCKET).remove([previous]);
  return {};
}

/** A short-lived link to download one of the candidate's own documents. */
export async function documentUrl(
  kind: DocumentKind,
): Promise<{ url?: string; error?: string }> {
  if (!(kind in COLUMNS)) return { error: "Unknown document." };
  const ctx = await candidate();
  if (!ctx) return { error: "Please sign in again." };

  const path = await currentPath(ctx, kind);
  if (!path) return { error: "No file uploaded." };
  const { data, error } = await ctx.supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60);
  return error || !data
    ? { error: "Couldn't open the file." }
    : { url: data.signedUrl };
}
