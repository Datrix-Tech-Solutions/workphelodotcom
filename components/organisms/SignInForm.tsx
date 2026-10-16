"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import { WhitePanel } from "@/components/atoms/GlassPanel";
import Input from "@/components/atoms/Input";
import PasswordField from "@/components/molecules/PasswordField";
import { resendRecruiterConfirmation, signIn } from "@/app/auth/actions";
import { resetSavedJobs } from "@/lib/useSavedJobs";
import { notifySessionChange } from "@/lib/useSession";

type Role = "candidate" | "recruiter";

const ROLES: { value: Role; label: string }[] = [
  { value: "candidate", label: "Candidate" },
  { value: "recruiter", label: "Recruiter" },
];

export default function SignInForm({
  next = "/",
  notice,
  noticeError,
}: {
  next?: string;
  notice?: string;
  noticeError?: string;
}) {
  const [role, setRole] = useState<Role>("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(noticeError ?? "");
  const [resent, setResent] = useState(false);
  const router = useRouter();
  const needsConfirmation =
    role === "recruiter" && error.toLowerCase().includes("confirm your email");

  async function handleResend() {
    await resendRecruiterConfirmation(email);
    setResent(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn(role, email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      resetSavedJobs();
      notifySessionChange();
      // Recruiters have no use for the home page; take them to their dashboard.
      router.push(role === "recruiter" && next === "/" ? "/dashboard" : next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhitePanel className="sign-in">
      <h1 className="sign-in__title">Welcome back</h1>
      <p className="sign-in__subtext">
        {role === "recruiter"
          ? "Sign in to post jobs."
          : "Sign in to continue to view Jobs."}
      </p>
      <form
        className="sign-in__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        <div className="sign-in__roles" role="radiogroup" aria-label="I am a">
          {ROLES.map(({ value, label }) => (
            <label
              key={value}
              className={`sign-in__role${role === value ? " sign-in__role--active" : ""}`}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="sign-in__role-input"
              />
              {label}
            </label>
          ))}
        </div>
        <label className="sign-in__field">
          <span className="sign-in__label">Email</span>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-in__input"
          />
        </label>
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link
          href={`/forgot-password?role=${role}`}
          className="sign-in__forgot"
        >
          Forgot password?
        </Link>
        {notice && !error && (
          <p className="sign-in__notice sign-in__message" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="sign-in__error sign-in__message" role="alert">
            {error}
          </p>
        )}
        {needsConfirmation &&
          (resent ? (
            <p className="sign-in__notice sign-in__message" role="status">
              If that email is waiting for confirmation, a new link is on its
              way.
            </p>
          ) : (
            <button
              type="button"
              className="sign-in__link"
              onClick={handleResend}
            >
              Resend confirmation email
            </button>
          ))}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <span className="sign-in__spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      <p className="sign-in__switch">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="sign-in__link">
          Sign up
        </Link>
      </p>
    </WhitePanel>
  );
}
