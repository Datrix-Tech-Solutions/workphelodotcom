import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import {
  RECRUITER_ACCESS_COOKIE,
  RECRUITER_REFRESH_COOKIE,
  RECRUITER_REFRESH_MAX_AGE,
  RECRUITER_USER_COOKIE,
} from "./constants";
import {
  accessCookieOptions,
  recruiterCookieOptions,
  refreshCookieOptions,
} from "./recruiterTokens";
import type { AuthProvider, AuthResult, Session } from "./types";

// Recruiters never touch Supabase. They are tenants of the HR API: signing up
// creates a restricted company account there, and the rest of the site only
// depends on the AuthProvider shape.
const UNAVAILABLE = "Recruiter sign in is not available right now.";
const GENERIC = "Something went wrong. Please try again.";

interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantName: string;
  };
}

/** The API answers errors with `message` as a string or a list of strings. */
async function errorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    const message = Array.isArray(body.message)
      ? body.message[0]
      : body.message;
    return message || GENERIC;
  } catch {
    return GENERIC;
  }
}

async function post(path: string, body: unknown): Promise<Response | null> {
  try {
    return await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

export const recruiterAuth: AuthProvider = {
  async signIn(email, password): Promise<AuthResult> {
    const res = await post("/auth/recruiters/login", { email, password });
    if (!res) return { error: UNAVAILABLE };
    if (res.status === 401) return { error: "Invalid email or password." };
    if (!res.ok) return { error: await errorMessage(res) };

    const body = (await res.json()) as LoginResponse;
    if (!body.accessToken || !body.refreshToken || !body.user) {
      return { error: UNAVAILABLE };
    }
    const { user } = body;
    const store = await cookies();
    store.set(RECRUITER_ACCESS_COOKIE, body.accessToken, accessCookieOptions());
    store.set(
      RECRUITER_REFRESH_COOKIE,
      body.refreshToken,
      refreshCookieOptions(),
    );
    store.set(
      RECRUITER_USER_COOKIE,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        company: user.tenantName,
      }),
      recruiterCookieOptions(RECRUITER_REFRESH_MAX_AGE),
    );
    return {};
  },

  async signUp(input): Promise<AuthResult> {
    if (input.role !== "recruiter") return { error: "Unsupported account." };
    const { role: _role, ...details } = input;
    const res = await post("/auth/recruiters/register", details);
    if (!res) return { error: UNAVAILABLE };
    if (!res.ok) return { error: await errorMessage(res) };
    // The account stays locked until the emailed link is used.
    return { needsConfirmation: true };
  },

  async requestPasswordReset(): Promise<AuthResult> {
    return { error: "Password reset isn't available for recruiters yet." };
  },

  async updatePassword(): Promise<AuthResult> {
    return { error: "Password change isn't available for recruiters yet." };
  },

  async signOut() {
    const store = await cookies();
    const refresh = store.get(RECRUITER_REFRESH_COOKIE)?.value;
    const access = store.get(RECRUITER_ACCESS_COOKIE)?.value;
    if (refresh && access) {
      // Best effort: revoke the refresh token on the server too.
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          Cookie: `refresh_token=${refresh}`,
        },
        cache: "no-store",
      }).catch(() => undefined);
    }
    store.delete(RECRUITER_ACCESS_COOKIE);
    store.delete(RECRUITER_REFRESH_COOKIE);
    store.delete(RECRUITER_USER_COOKIE);
  },

  async getSession(): Promise<Session | null> {
    const store = await cookies();
    // The refresh cookie outlives the access cookie, so it marks "signed in".
    if (!store.get(RECRUITER_REFRESH_COOKIE)?.value) return null;
    const raw = store.get(RECRUITER_USER_COOKIE)?.value;
    if (!raw) return null;
    try {
      const { id, email, name, company } = JSON.parse(raw) as {
        id: string;
        email: string;
        name: string;
        company: string;
      };
      return { role: "recruiter", user: { id, email, name, company } };
    } catch {
      return null;
    }
  },
};

/** Emails a fresh confirmation link. The API answers the same whoever asks. */
export async function resendRecruiterConfirmation(
  email: string,
): Promise<void> {
  await post("/auth/recruiters/resend-confirmation", { email });
}
