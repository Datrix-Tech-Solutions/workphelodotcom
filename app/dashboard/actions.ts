"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  closeJob,
  createJob,
  reopenJob,
  type NewJob,
} from "@/lib/recruiterApi";

export interface ActionResult {
  error?: string;
}

async function requireRecruiter(): Promise<ActionResult | null> {
  const session = await getSession();
  return session?.role === "recruiter"
    ? null
    : { error: "Please sign in again." };
}

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"];
const SALARY_TYPES = ["NON_DISCLOSED", "FIXED", "RANGE"];

/** Checks the posting form on the server; the API validates again. */
function validate(job: NewJob): string | null {
  if (job.title.trim().length < 2) return "Please enter a job title.";
  if (job.location.trim().length < 2) return "Please enter a location.";
  if (!JOB_TYPES.includes(job.jobType)) return "Please choose a job type.";
  if (job.description.trim().length < 20) {
    return "Please describe the role in a few sentences.";
  }
  if (!SALARY_TYPES.includes(job.salaryType)) return "Choose how to show pay.";
  if (job.salaryType === "FIXED" && !job.salaryAmount) {
    return "Enter the salary amount.";
  }
  if (job.salaryType === "RANGE") {
    if (!job.salaryMin || !job.salaryMax) return "Enter the salary range.";
    if (job.salaryMin > job.salaryMax) {
      return "The minimum salary can't be higher than the maximum.";
    }
  }
  return null;
}

export async function postJob(job: NewJob): Promise<ActionResult> {
  const denied = await requireRecruiter();
  if (denied) return denied;
  const invalid = validate(job);
  if (invalid) return { error: invalid };

  const result = await createJob(job);
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return {};
}

export async function setJobOpen(
  id: string,
  open: boolean,
): Promise<ActionResult> {
  const denied = await requireRecruiter();
  if (denied) return denied;
  const result = open ? await reopenJob(id) : await closeJob(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/jobs/${id}`);
  revalidatePath("/jobs");
  return {};
}
