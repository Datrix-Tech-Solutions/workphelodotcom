import { NextResponse, type NextRequest } from "next/server";
import { RECRUITER_DEV_COOKIE } from "@/lib/auth/constants";
import { updateSession } from "@/lib/supabase/proxy";

/** Pages that only one kind of account may open. */
const GUARDED = [
  { prefix: "/profile", role: "candidate" },
  { prefix: "/dashboard", role: "recruiter" },
] as const;

export async function proxy(request: NextRequest) {
  const { response, isCandidate } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const guard = GUARDED.find(
    (g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`),
  );
  if (!guard) return response;

  const isRecruiter =
    process.env.NODE_ENV !== "production" &&
    request.cookies.has(RECRUITER_DEV_COOKIE);
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
