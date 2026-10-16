import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/api";
import {
  RECRUITER_ACCESS_COOKIE,
  RECRUITER_REFRESH_COOKIE,
  RECRUITER_USER_COOKIE,
} from "@/lib/auth/constants";
import {
  accessCookieOptions,
  refreshCookieOptions,
  refreshRecruiterTokens,
  type RecruiterTokens,
} from "@/lib/auth/recruiterTokens";
import { updateSession } from "@/lib/supabase/proxy";

/** Pages that only one kind of account may open. */
const GUARDED = [
  { prefix: "/profile", role: "candidate" },
  { prefix: "/dashboard", role: "recruiter" },
  { prefix: "/post-job", role: "recruiter" },
] as const;

export async function proxy(request: NextRequest) {
  // A recruiter's access token lasts minutes; swap it for a new one here, before
  // any page renders, so pages never have to handle expiry themselves.
  let renewed: RecruiterTokens | null = null;
  let recruiterExpired = false;
  const refresh = request.cookies.get(RECRUITER_REFRESH_COOKIE)?.value;
  if (refresh && !request.cookies.has(RECRUITER_ACCESS_COOKIE)) {
    renewed = await refreshRecruiterTokens(API_URL, refresh);
    if (renewed) {
      request.cookies.set(RECRUITER_ACCESS_COOKIE, renewed.access);
      request.cookies.set(RECRUITER_REFRESH_COOKIE, renewed.refresh);
    } else {
      recruiterExpired = true;
      request.cookies.delete(RECRUITER_ACCESS_COOKIE);
      request.cookies.delete(RECRUITER_REFRESH_COOKIE);
      request.cookies.delete(RECRUITER_USER_COOKIE);
    }
  }

  const { response, isCandidate } = await updateSession(request);
  if (renewed) {
    response.cookies.set(
      RECRUITER_ACCESS_COOKIE,
      renewed.access,
      accessCookieOptions(),
    );
    response.cookies.set(
      RECRUITER_REFRESH_COOKIE,
      renewed.refresh,
      refreshCookieOptions(),
    );
  }
  if (recruiterExpired) {
    response.cookies.delete(RECRUITER_ACCESS_COOKIE);
    response.cookies.delete(RECRUITER_REFRESH_COOKIE);
    response.cookies.delete(RECRUITER_USER_COOKIE);
  }

  const { pathname } = request.nextUrl;
  const guard = GUARDED.find(
    (g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`),
  );
  if (!guard) return response;

  const isRecruiter = request.cookies.has(RECRUITER_REFRESH_COOKIE);
  const role = isCandidate ? "candidate" : isRecruiter ? "recruiter" : null;
  if (role === guard.role) return response;

  const url = request.nextUrl.clone();
  url.search = "";
  if (role === null) {
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
  } else {
    url.pathname = "/";
  }
  const redirect = NextResponse.redirect(url);
  // Keep any refreshed auth cookies.
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
