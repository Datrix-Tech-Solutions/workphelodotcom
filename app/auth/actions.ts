"use server";

import {
  authFor,
  getSession,
  type AuthResult,
  type Role,
  type ProfileInput,
  type Session,
  type SignUpInput,
} from "@/lib/auth";
import { updateCandidateProfile } from "@/lib/auth/candidate";
import { resendRecruiterConfirmation as resendConfirmation } from "@/lib/auth/recruiter";

export type { AuthResult };

export async function signIn(
  role: Role,
  email: string,
  password: string,
): Promise<AuthResult> {
  return authFor(role).signIn(email, password);
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  return authFor(input.role).signUp(input);
}

export async function signOut(): Promise<void> {
  // Clear every provider so a stale session can't linger.
  await Promise.all([
    authFor("candidate").signOut(),
    authFor("recruiter").signOut(),
  ]);
}

export async function currentSession(): Promise<Session | null> {
  return getSession();
}

export async function updateProfile(input: ProfileInput): Promise<AuthResult> {
  // Only a signed-in candidate may change their own profile.
  const session = await getSession();
  if (session?.role !== "candidate") return { error: "Please sign in again." };
  return updateCandidateProfile(input);
}

export async function requestPasswordReset(
  role: Role,
  email: string,
): Promise<AuthResult> {
  return authFor(role).requestPasswordReset(email);
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const session = await getSession();
  if (!session) return { error: "Please sign in again." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  return authFor(session.role).updatePassword(password);
}

export async function resendRecruiterConfirmation(
  email: string,
): Promise<void> {
  await resendConfirmation(email);
}
