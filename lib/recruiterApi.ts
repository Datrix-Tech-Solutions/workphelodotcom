import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { RECRUITER_ACCESS_COOKIE } from "@/lib/auth/constants";
import type { OpeningPayload } from "@/lib/jobOpening";

const RECRUITMENT = `${API_URL}/hr/recruitment`;

export type VacancyStatus = "DRAFT" | "OPEN" | "CLOSED";

/** A recruiter's own opening, as the HR API lists it. */
export interface MyJob {
  id: string;
  tenantId: string;
  title: string | null;
  location: string | null;
  jobType: string | null;
  status: VacancyStatus;
  closingDate: string | null;
  applicantCount: number;
  createdAt: string;
}

export interface Applicant {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  currentJobTitle: string | null;
  yearsOfExperience: number | null;
  appliedAt: string;
  submittedAt: string | null;
  currentStage: { name: string } | null;
}

export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; status: number; error: string };

const FAILED = "Something went wrong. Please try again.";

/** Calls the HR API as the signed-in recruiter. */
async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  const token = (await cookies()).get(RECRUITER_ACCESS_COOKIE)?.value;
  if (!token) return { ok: false, status: 401, error: "Please sign in again." };

  try {
    const res = await fetch(`${RECRUITMENT}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      let error = FAILED;
      try {
        const body = (await res.json()) as { message?: string | string[] };
        error =
          (Array.isArray(body.message) ? body.message[0] : body.message) ||
          FAILED;
      } catch {
        // Keep the generic message.
      }
      return { ok: false, status: res.status, error };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, status: 0, error: "The job service is unavailable." };
  }
}

interface Page<T> {
  items: T[];
  meta: { total: number };
}

export async function listMyJobs(): Promise<ApiResult<MyJob[]>> {
  const result = await call<Page<MyJob>>("/vacancies?limit=100");
  return result.ok ? { ok: true, data: result.data.items } : result;
}

export function getMyJob(id: string): Promise<ApiResult<MyJob>> {
  return call<MyJob>(`/vacancies/${encodeURIComponent(id)}`);
}

export async function listApplicants(
  vacancyId: string,
): Promise<ApiResult<{ items: Applicant[]; total: number }>> {
  const result = await call<Page<Applicant>>(
    `/candidates?vacancyId=${encodeURIComponent(vacancyId)}&limit=100`,
  );
  return result.ok
    ? {
        ok: true,
        data: { items: result.data.items, total: result.data.meta.total },
      }
    : result;
}

/** The limited posting form; everything else about an opening keeps its defaults. */
export interface NewJob {
  title: string;
  location: string;
  city?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  workMode?: "ONSITE" | "REMOTE" | "HYBRID";
  vacancies?: number;
  closingDate?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  perksAndBenefits?: string;
  salaryType: "NON_DISCLOSED" | "FIXED" | "RANGE";
  salaryAmount?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
}

/** Posts the job live straight away. */
export function createJob(job: NewJob): Promise<ApiResult<MyJob>> {
  return call<MyJob>("/vacancies", {
    method: "POST",
    body: { ...job, status: "OPEN" },
  });
}

/** Posts a job opening built by the recruiter wizard. */
export function createOpening(
  opening: OpeningPayload,
): Promise<ApiResult<MyJob>> {
  return call<MyJob>("/vacancies", { method: "POST", body: opening });
}

/** Takes a draft live; the API refuses it while required fields are missing. */
export function publishJob(id: string): Promise<ApiResult<MyJob>> {
  return call<MyJob>(`/vacancies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { status: "OPEN" },
  });
}

export function closeJob(id: string): Promise<ApiResult<MyJob>> {
  return call<MyJob>(`/vacancies/${encodeURIComponent(id)}/close`, {
    method: "POST",
  });
}

export function reopenJob(id: string): Promise<ApiResult<MyJob>> {
  return call<MyJob>(`/vacancies/${encodeURIComponent(id)}/reopen`, {
    method: "POST",
  });
}
