import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  AuthProvider,
  AuthResult,
  CandidateProfile,
  ProfileInput,
  Session,
} from "./types";

const NOT_CONFIGURED = "Sign in is not available right now. Please try later.";

/** Candidates: accounts live in Supabase only. */
export const candidateAuth: AuthProvider = {
  async signIn(email, password): Promise<AuthResult> {
    if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return {
        error:
          error.code === "email_not_confirmed"
            ? "Please confirm your email before signing in."
            : "Invalid email or password.",
      };
    }
    return {};
  },

  async signUp(input): Promise<AuthResult> {
    if (input.role !== "candidate") return { error: "Unsupported account." };
    if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

    const origin = await siteOrigin();
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.name },
        emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      },
    });
    if (error) return { error: error.message };
    // With email confirmation on, no session is returned until the link is used.
    return data.session ? {} : { needsConfirmation: true };
  },

  async signOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = await createClient();
    await supabase.auth.signOut();
  },

  async requestPasswordReset(email): Promise<AuthResult> {
    if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };
    const origin = await siteOrigin();
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin ? `${origin}/auth/reset` : undefined,
    });
    // Unknown emails return no error, so this never reveals who has an account.
    return error
      ? { error: "Couldn't send the reset email. Please try again shortly." }
      : {};
  },

  async updatePassword(password): Promise<AuthResult> {
    if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: error.message } : {};
  },

  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.email) return null;
    const meta = user.user_metadata ?? {};
    return {
      role: "candidate",
      user: {
        id: user.id,
        email: user.email,
        name: clean(meta.full_name),
        profile: {
          phone: clean(meta.phone),
          country: clean(meta.country),
          city: clean(meta.city),
          role: clean(meta.role),
          linkedin: clean(meta.linkedin),
          github: clean(meta.github),
          portfolio: clean(meta.portfolio),
        },
      },
    };
  },
};

/** This site's origin, for building links Supabase puts in emails. */
export async function siteOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return undefined;
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const FIELD_LIMIT = 200;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, FIELD_LIMIT) : "";
}

/** Saves the candidate's basic details on their Supabase account. */
export async function updateCandidateProfile(
  input: ProfileInput,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };
  const name = clean(input.name);
  if (!name) return { error: "Please enter your name." };

  const profile: CandidateProfile = {
    phone: clean(input.phone),
    country: clean(input.country),
    city: clean(input.city),
    role: clean(input.role),
    linkedin: clean(input.linkedin),
    github: clean(input.github),
    portfolio: clean(input.portfolio),
  };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: name, ...profile },
  });
  return error
    ? { error: "Couldn't save your changes. Please try again." }
    : {};
}
