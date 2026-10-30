"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createAdvert, setAdvertStatus } from "@/lib/advertiserJobs";
import type { OpeningPayload } from "@/lib/jobOpening";
import {
  closeJob,
  createJob,
  createOpening,
  publishJob,
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

export async function publishDraft(id: string): Promise<ActionResult> {
  const denied = await requireRecruiter();
  if (denied) return denied;
  const result = await publishJob(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/jobs/${id}`);
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

/** The signed-in advertiser or recruiter as the owner of their adverts, or null. */
async function advertActor() {
  const session = await getSession();
  if (session?.role === "advertiser") {
    return {
      owner: { kind: "advertiser" } as const,
      name: session.user.name,
    };
  }
  if (session?.role === "recruiter") {
    return {
      owner: { kind: "recruiter", id: session.user.id } as const,
      name: session.user.company || session.user.name,
    };
  }
  return null;
}

/** Posts an advert; advertisers and recruiters can both do this. */
export async function postAdvert(job: NewJob): Promise<ActionResult> {
  const actor = await advertActor();
  if (!actor) return { error: "Please sign in again." };
  const invalid = validate(job);
  if (invalid) return { error: invalid };

  const result = await createAdvert(job, actor.name, actor.owner);
  if (result.error) return result;
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return {};
}

export async function setAdvertOpen(
  id: string,
  open: boolean,
): Promise<ActionResult> {
  const actor = await advertActor();
  if (!actor) return { error: "Please sign in again." };
  const result = await setAdvertStatus(
    id,
    open ? "OPEN" : "CLOSED",
    actor.owner,
  );
  if (result.error) return result;
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return {};
}

/** Posts or drafts an opening from the recruiter wizard. */
export async function postOpening(
  opening: OpeningPayload,
): Promise<ActionResult> {
  const denied = await requireRecruiter();
  if (denied) return denied;
  if (opening.title.trim().length < 2) return { error: "Enter a job title." };
  if (!JOB_TYPES.includes(opening.jobType)) {
    return { error: "Choose an employment type." };
  }
  if (!Number.isInteger(opening.vacancies) || opening.vacancies < 1) {
    return { error: "Enter at least 1 vacancy." };
  }
  if (
    opening.status === "OPEN" &&
    (!opening.location || !opening.description)
  ) {
    return { error: "Add a location and job summary before publishing." };
  }

  const result = await createOpening(opening);
  if (!result.ok) return { error: result.error };
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return {};
}
