export type Role = "candidate" | "recruiter";

/** The basic details a candidate keeps on their account. */
export interface CandidateProfile {
  phone: string;
  country: string;
  city: string;
  /** The job role they work in or want, e.g. "Frontend Developer". */
  role: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  /** Present for candidates. */
  profile?: CandidateProfile;
}

/** What the rest of the app sees, whichever provider issued the session. */
export interface Session {
  role: Role;
  user: AuthUser;
}

export interface ProfileInput extends CandidateProfile {
  name: string;
}

export interface AuthResult {
  error?: string;
  /** Sign-up succeeded but the email must be confirmed before signing in. */
  needsConfirmation?: boolean;
}

export interface CandidateSignUp {
  role: "candidate";
  name: string;
  email: string;
  password: string;
}

export interface RecruiterSignUp {
  role: "recruiter";
  companyName: string;
  industry: string;
  companySize: string;
  country: string;
  address: string;
  /** The company admin's name. */
  name: string;
  email: string;
  password: string;
}

export type SignUpInput = CandidateSignUp | RecruiterSignUp;

export interface AuthProvider {
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signOut(): Promise<void>;
  /** Emails a reset link. Never reveals whether the address has an account. */
  requestPasswordReset(email: string): Promise<AuthResult>;
  /** Changes the password of the currently signed-in user. */
  updatePassword(password: string): Promise<AuthResult>;
  /** The signed-in user for this provider, or null. */
  getSession(): Promise<Session | null>;
}
