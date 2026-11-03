import { NextRequest, NextResponse } from "next/server";
import type { AlertFrequency } from "@/lib/jobAlerts";
import { runJobAlerts } from "@/lib/jobAlertRunner";

export const dynamic = "force-dynamic";

const FREQUENCIES: AlertFrequency[] = ["instant", "daily", "weekly"];

/**
 * Called on a schedule to send job alerts:
 *   /api/cron/job-alerts?frequency=instant   every 15 minutes or so
 *   /api/cron/job-alerts?frequency=daily     once a day
 *   /api/cron/job-alerts?frequency=weekly    once a week
 * Requires `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends this itself).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const frequency = request.nextUrl.searchParams.get(
    "frequency",
  ) as AlertFrequency | null;
  if (!frequency || !FREQUENCIES.includes(frequency)) {
    return NextResponse.json({ error: "Unknown frequency." }, { status: 400 });
  }

  const result = await runJobAlerts(frequency);
  if ("error" in result) {
    console.error("Job alerts did not run:", result.error);
    return NextResponse.json(result, { status: 503 });
  }
  return NextResponse.json(result);
}
