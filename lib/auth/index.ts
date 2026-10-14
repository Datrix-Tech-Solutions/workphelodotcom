import { candidateAuth } from "./candidate";
import { recruiterAuth } from "./recruiter";
import type { AuthProvider, Role, Session } from "./types";

export type * from "./types";

/** The toggle on the forms picks the provider; the lookups never mix. */
export function authFor(role: Role): AuthProvider {
  return role === "recruiter" ? recruiterAuth : candidateAuth;
}

/** The current session from whichever provider has one. */
export async function getSession(): Promise<Session | null> {
  return (
    (await candidateAuth.getSession()) ?? (await recruiterAuth.getSession())
  );
}
