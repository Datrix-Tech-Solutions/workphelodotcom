import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { candidateAuth, siteOrigin } from "./candidate";
import type { AuthProvider, AuthResult, Session } from "./types";

const NOT_CONFIGURED = "Sign in is not available right now. Please try later.";

/**
 * Advertisers: accounts live in Supabase Auth like candidates'. A row in
 * `advertisers` (made by a database trigger at sign-up) is what tags the
 * account, so everything but sign-up and the session is shared.
 */
export const advertiserAuth: AuthProvider = {
  ...candidateAuth,

  async signUp(input): Promise<AuthResult> {
    if (input.role !== "advertiser") return { error: "Unsupported account." };
    if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

    const origin = await siteOrigin();
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.name, account_type: "advertiser" },
        emailRedirectTo: origin
          ? `${origin}/auth/callback?next=/post-job`
          : undefined,
      },
    });
    if (error) return { error: error.message };
    return data.session ? {} : { needsConfirmation: true };
  },

  async getSession(): Promise<Session | null> {
    const session = await candidateAuth.getSession();
    if (!session || !(await isAdvertiser(session.user.id))) return null;
    return { ...session, role: "advertiser" };
  },
};

/** Whether this Supabase user has the advertiser tag. */
export async function isAdvertiser(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("advertisers")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}
