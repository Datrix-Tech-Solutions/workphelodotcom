import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/api";

/** Landing point for the confirmation link in a recruiter's email. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  let confirmed = false;
  if (token) {
    try {
      const res = await fetch(`${API_URL}/auth/recruiters/confirm-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      confirmed = res.ok;
    } catch {
      confirmed = false;
    }
  }

  const url = new URL("/recruiter/sign-in", origin);
  url.searchParams.set("confirm", confirmed ? "success" : "failed");
  return NextResponse.redirect(url);
}
