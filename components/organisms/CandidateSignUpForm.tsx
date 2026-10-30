"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import { WhitePanel } from "@/components/atoms/GlassPanel";
import Input from "@/components/atoms/Input";
import PasswordField from "@/components/molecules/PasswordField";
import { signUp } from "@/app/auth/actions";
import { resetSavedJobs } from "@/lib/useSavedJobs";
import { notifySessionChange } from "@/lib/useSession";

/** The candidate sign-up form, for the sign-up page and the sign-in pop-up. */
export default function CandidateSignUpForm({
  next = "/",
  onSwitch,
}: {
  /** Where to go once the account is created. */
  next?: string;
  /** Swaps to the sign-in form in place instead of linking to its page. */
  onSwitch?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const mismatch = confirmPassword !== "" && confirmPassword !== password;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || password !== confirmPassword) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const result = await signUp({ role: "candidate", name, email, password });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsConfirmation) {
        setNotice("Check your email to confirm your account, then sign in.");
        return;
      }
      resetSavedJobs();
      notifySessionChange();
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhitePanel className="sign-in">
      <h1 className="sign-in__title">Create your account</h1>
      <p className="sign-in__subtext">Sign up to find your next role.</p>
      <form
        className="sign-in__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        <label className="sign-in__field">
          <span className="sign-in__label">Full name</span>
          <Input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sign-in__input"
          />
        </label>
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
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="sign-in__field">
          <PasswordField
            label="Confirm password"
            fieldClassName="sign-in__field--bare"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
            aria-invalid={mismatch}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {mismatch && (
            <p className="sign-in__error" role="alert">
              Passwords don&apos;t match.
            </p>
          )}
        </div>
        {error && (
          <p className="sign-in__error sign-in__message" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="sign-in__notice sign-in__message" role="status">
            {notice}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <span className="sign-in__spinner" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
      <p className="sign-in__switch">
        Already have an account?{" "}
        {onSwitch ? (
          <button type="button" className="sign-in__link" onClick={onSwitch}>
            Sign in
          </button>
        ) : (
          <Link href="/sign-in" className="sign-in__link">
            Sign in
          </Link>
        )}
      </p>
    </WhitePanel>
  );
}
