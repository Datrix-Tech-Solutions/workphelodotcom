import {
  RECRUITER_ACCESS_MAX_AGE,
  RECRUITER_REFRESH_MAX_AGE,
} from "./constants";

/** Cookie options shared by every recruiter cookie. */
export function recruiterCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export const accessCookieOptions = () =>
  recruiterCookieOptions(RECRUITER_ACCESS_MAX_AGE);
export const refreshCookieOptions = () =>
  recruiterCookieOptions(RECRUITER_REFRESH_MAX_AGE);

export interface RecruiterTokens {
  access: string;
  refresh: string;
}

/**
 * Trades a refresh token for a new pair. The API answers with Set-Cookie
 * headers (it was built for browsers), so the values are read from those.
 */
export async function refreshRecruiterTokens(
  apiUrl: string,
  refresh: string,
): Promise<RecruiterTokens | null> {
  try {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refresh}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const cookies = new Map<string, string>();
    for (const header of res.headers.getSetCookie()) {
      const [pair] = header.split(";");
      const at = pair.indexOf("=");
      if (at > 0) {
        cookies.set(
          pair.slice(0, at).trim(),
          decodeURIComponent(pair.slice(at + 1)),
        );
      }
    }
    const access = cookies.get("access_token");
    const next = cookies.get("refresh_token");
    return access && next ? { access, refresh: next } : null;
  } catch {
    return null;
  }
}
