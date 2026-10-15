"use server";

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
