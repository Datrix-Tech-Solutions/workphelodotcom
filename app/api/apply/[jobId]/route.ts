import { NextResponse } from "next/server";
import { PUBLIC_API } from "@/lib/api";
import { normalizePhone, periodLabel, type ApplyPayload } from "@/lib/apply";
import { parseJobId } from "@/lib/jobs";

interface ApiQuestion {
  id: string;
  type: string;
  required: boolean;
}

type AnswerBody =
  | { questionId: string; answer: string }
  | { questionId: string; selectedOptions: string[] };

const TEXT_TYPES = new Set(["SHORT_ANSWER", "PARAGRAPH"]);

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function errorMessage(body: unknown, fallback: string): string {
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return fallback;
}

function fail(status: number, error: string, missing?: unknown) {
  return NextResponse.json({ error, missing }, { status });
}

/**
 * Creates the draft and submits it in one request, so the one-time draft access token
 * never reaches the browser.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const ids = parseJobId(jobId);
  if (!ids) return fail(404, "Job not found");

  let payload: ApplyPayload;
  try {
    payload = (await request.json()) as ApplyPayload;
  } catch {
    return fail(400, "Invalid request");
  }
  const values = payload.values ?? {};
  const answers = payload.answers ?? {};
  const qualifications = (payload.profile?.education ?? [])
    .map((q) =>
      [
        [str(q.qualification), str(q.institution)].filter(Boolean).join(" — "),
        periodLabel(str(q.start), str(q.end)),
      ]
        .filter(Boolean)
        .join(" — "),
    )
    .filter(Boolean);

  const tenant = `tenantId=${encodeURIComponent(ids.tenantId)}`;
  const vacancyUrl = `${PUBLIC_API}/vacancies/${encodeURIComponent(ids.vacancyId)}`;

  // Questions come from the API so answers can only target the job's real questions.
  const vacancyRes = await fetch(`${vacancyUrl}?${tenant}`, {
    cache: "no-store",
  }).catch(() => null);
  if (!vacancyRes) return fail(502, "Applications are unavailable right now.");
  if (!vacancyRes.ok)
    return fail(404, "This job is no longer accepting applications.");
  const vacancy = (await vacancyRes.json()) as { questions: ApiQuestion[] };

  const experience = str(values.experience);
  const salary = str(values.salary);
  const profile = payload.profile;
  const strings = (list: unknown) =>
    Array.isArray(list) ? list.map((item) => str(item)).filter(Boolean) : [];
  const skills = [
    ...new Set(
      str(values.skills)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  ];
  const workHistory = (profile?.experience ?? [])
    .filter((role) => str(role.role))
    .map((role) => ({
      role: str(role.role),
      company: str(role.company),
      start: /^\d{4}-\d{2}$/.test(str(role.start))
        ? str(role.start)
        : undefined,
      end: /^\d{4}-\d{2}$/.test(str(role.end)) ? str(role.end) : undefined,
    }));
  const educationHistory = (profile?.education ?? [])
    .filter((entry) => str(entry.qualification) || str(entry.institution))
    .map((entry) => ({
      level: str(entry.level),
      qualification: str(entry.qualification),
      institution: str(entry.institution),
    }));

  const body = {
    firstName: str(values.firstName),
    lastName: str(values.lastName),
    email: str(values.email).toLowerCase(),
    phone: normalizePhone(str(values.phone)),
    country: str(values.country),
    city: str(values.location),
    currentJobTitle: str(values.jobTitle),
    yearsOfExperience: experience === "" ? undefined : Number(experience),
    currentEmployer: str(values.employer) || undefined,
    highestEducationLevel: str(values.education),
    education: qualifications.join("\n").slice(0, 3900) || undefined,
    skills,
    expectedSalary: salary === "" ? undefined : Number(salary),
    expectedSalaryCurrency:
      salary === "" ? undefined : str(values.currency) || undefined,
    noticePeriod: str(values.notice),
    portfolioUrl: str(values.portfolio) || undefined,
    githubUrl: str(values.github) || undefined,
    languages: strings(profile?.languages),
    certificates: strings(profile?.certificates),
    educationHistory,
    workHistory,
    answers: vacancy.questions.flatMap((question): AnswerBody[] => {
      const given = (answers[question.id] ?? [])
        .map((a) => str(a))
        .filter(Boolean);
      if (given.length === 0) return [];
      return TEXT_TYPES.has(question.type)
        ? [{ questionId: question.id, answer: given[0] }]
        : [{ questionId: question.id, selectedOptions: given }];
    }),
  };

  const draftRes = await fetch(`${vacancyUrl}/applications?${tenant}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  }).catch(() => null);
  if (!draftRes) return fail(502, "Applications are unavailable right now.");
  const draft = await draftRes.json().catch(() => null);
  if (!draftRes.ok) {
    return fail(
      draftRes.status === 404 ? 404 : 400,
      errorMessage(draft, "We couldn't save your application."),
    );
  }

  const { application, accessToken } = draft as {
    application: { id: string };
    accessToken: string;
  };

  const submitRes = await fetch(
    `${PUBLIC_API}/applications/${encodeURIComponent(application.id)}/submit`,
    {
      method: "POST",
      headers: { "x-application-access-token": accessToken },
      cache: "no-store",
    },
  ).catch(() => null);
  if (!submitRes) return fail(502, "Applications are unavailable right now.");
  if (!submitRes.ok) {
    const result = (await submitRes.json().catch(() => null)) as {
      missing?: { field: string; label: string }[];
    } | null;
    return fail(
      submitRes.status === 409 ? 409 : 400,
      submitRes.status === 409
        ? "You have already applied for this job with this email address."
        : errorMessage(result, "We couldn't submit your application."),
      result?.missing,
    );
  }

  return NextResponse.json({ ok: true });
}
