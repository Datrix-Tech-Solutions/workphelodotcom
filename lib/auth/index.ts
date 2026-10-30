import { advertiserAuth, isAdvertiser } from "./advertiser";
import { candidateAuth } from "./candidate";
import { recruiterAuth } from "./recruiter";
import type { AuthProvider, Role, Session } from "./types";

export type * from "./types";

/** The toggle on the forms picks the provider; the lookups never mix. */
export function authFor(role: Role): AuthProvider {
  if (role === "recruiter") return recruiterAuth;
  return role === "advertiser" ? advertiserAuth : candidateAuth;
}

/**
 * The current session from whichever provider has one. Advertisers and
 * candidates share one Supabase login; the advertiser tag decides which it is.
 */
export async function getSession(): Promise<Session | null> {
  const supabaseSession = await candidateAuth.getSession();
  if (supabaseSession) {
    return (await isAdvertiser(supabaseSession.user.id))
      ? { ...supabaseSession, role: "advertiser" }
      : supabaseSession;
  }
  return recruiterAuth.getSession();
}
