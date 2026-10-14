"use server";

import {
  listSavedJobs,
  saveJob,
  unsaveJob,
  type SavedJob,
} from "@/lib/savedJobs";

export type SaveResult = "ok" | "signin" | "error";

export async function savedJobIds(): Promise<string[]> {
  return (await listSavedJobs()).map((j) => j.id);
}

export async function setJobSaved(
  job: SavedJob,
  saved: boolean,
): Promise<SaveResult> {
  return saved ? saveJob(job) : unsaveJob(job.id);
}
