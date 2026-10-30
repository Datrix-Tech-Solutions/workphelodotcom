"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import { WhitePanel } from "@/components/atoms/GlassPanel";
import Input from "@/components/atoms/Input";
import PasswordField from "@/components/molecules/PasswordField";
import { signIn } from "@/app/auth/actions";
import { resetSavedJobs } from "@/lib/useSavedJobs";
import { notifySessionChange } from "@/lib/useSession";

/** The candidate sign-in form used in every sign-in pop-up. */
export default function CandidateSignInForm({
  next = "/",
  onSuccess,
  onSwitch,
}: {
  /** Where to go after signing in, when not in a pop-up. */
  next?: string;
  /** Called after a successful sign-in, e.g. to close the pop-up. */
  onSuccess?: () => void;
  /** Swaps to the sign-up form in place instead of linking to its page. */
  onSwitch?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn("candidate", email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      resetSavedJobs();
      notifySessionChange();
      onSuccess?.();
      // In a pop-up the page stays put unless somewhere else was asked for.
      if (!onSuccess || next !== "/") router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhitePanel className="sign-in">
      <h1 className="sign-in__title">Welcome back</h1>
      <p className="sign-in__subtext">Sign in to continue to view Jobs.</p>
      <form
        className="sign-in__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
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
          href="/forgot-password?role=candidate"
          className="sign-in__forgot"
        >
          Forgot password?
        </Link>
        {error && (
          <p className="sign-in__error sign-in__message" role="alert">
            {error}
          </p>
        )}
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
        {onSwitch ? (
          <button type="button" className="sign-in__link" onClick={onSwitch}>
            Sign up
          </button>
        ) : (
          <Link href="/sign-up" className="sign-in__link">
            Sign up
          </Link>
        )}
      </p>
    </WhitePanel>
  );
}
