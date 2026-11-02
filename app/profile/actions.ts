"use server";

import { getSession } from "@/lib/auth";
import { updateCandidateIndustries } from "@/lib/auth/candidate";
import {
  documentUrl,
  removeDocument,
  saveSection,
  uploadDocument,
  type DetailsResult,
} from "@/lib/candidateDetails";
import type {
  DocumentKind,
  Entry,
  SectionKey,
} from "@/lib/candidateDetailsConfig";

export async function saveProfileSection(
  section: SectionKey,
  entries: Entry[],
): Promise<DetailsResult> {
  return saveSection(section, entries);
}

export async function uploadProfileDocument(
  formData: FormData,
): Promise<DetailsResult> {
  const kind = formData.get("kind");
  const file = formData.get("file");
  if (typeof kind !== "string" || !(file instanceof File)) {
    return { error: "Choose a file to upload." };
  }
  return uploadDocument(kind as DocumentKind, file);
}

export async function removeProfileDocument(
  kind: DocumentKind,
): Promise<DetailsResult> {
  return removeDocument(kind);
}

export async function profileDocumentUrl(
  kind: DocumentKind,
): Promise<{ url?: string; error?: string }> {
  return documentUrl(kind);
}

/** Saves the industries the signed-in candidate picked; they drive recommended jobs. */
export async function saveIndustries(
  industries: string[],
): Promise<DetailsResult> {
  const session = await getSession();
  if (session?.role !== "candidate") return { error: "Please sign in again." };
  return updateCandidateIndustries(industries);
}
