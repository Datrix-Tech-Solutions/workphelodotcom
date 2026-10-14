import { cookies } from "next/headers";
import { RECRUITER_DEV_COOKIE } from "./constants";
import type { AuthProvider, AuthResult, Session } from "./types";

// Placeholder for the recruiter authentication service (not chosen yet).
// Recruiter accounts never touch Supabase. Replace the bodies below with calls
// to that service; the rest of the app only depends on the AuthProvider shape.
//
// Until then, development builds accept any credentials and remember them in a
// cookie so the recruiter UI can be exercised, and production builds refuse
// rather than pretend to sign in.
const isDev = process.env.NODE_ENV !== "production";
const UNAVAILABLE = "Recruiter sign in is not available yet.";

async function remember(email: string, name: string): Promise<AuthResult> {
  if (!isDev) return { error: UNAVAILABLE };
  (await cookies()).set(
    RECRUITER_DEV_COOKIE,
    JSON.stringify({ email, name: name || email.split("@")[0] }),
    { httpOnly: true, sameSite: "lax", path: "/" },
  );
  return {};
}

export const recruiterAuth: AuthProvider = {
  async signIn(email): Promise<AuthResult> {
    return remember(email, "");
  },

  async signUp(input): Promise<AuthResult> {
    return remember(input.email, input.name);
  },

  async requestPasswordReset(): Promise<AuthResult> {
    return isDev ? {} : { error: UNAVAILABLE };
  },

  async updatePassword(): Promise<AuthResult> {
    return isDev ? {} : { error: UNAVAILABLE };
  },

  async signOut() {
    (await cookies()).delete(RECRUITER_DEV_COOKIE);
  },

  async getSession(): Promise<Session | null> {
    if (!isDev) return null;
    const raw = (await cookies()).get(RECRUITER_DEV_COOKIE)?.value;
    if (!raw) return null;
    try {
      const { email, name } = JSON.parse(raw) as {
        email: string;
        name: string;
      };
      return { role: "recruiter", user: { id: email, email, name } };
    } catch {
      return null;
    }
  },
};
