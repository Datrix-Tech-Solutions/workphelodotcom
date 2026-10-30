"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import Button from "@/components/atoms/Button";
import { WhitePanel } from "@/components/atoms/GlassPanel";
import Input from "@/components/atoms/Input";
import type { Role } from "@/lib/auth/types";

interface ForgotPasswordFormProps {
  role?: Role;
  expired?: boolean;
}

export default function ForgotPasswordForm({
  role = "candidate",
  expired = false,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    expired ? "That reset link has expired. Request a new one." : "",
  );
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await requestPasswordReset(role, email);
      if (result.error) setError(result.error);
      else setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhitePanel className="sign-in">
      <h1 className="sign-in__title">Forgot password?</h1>
      <p className="sign-in__subtext">
        {sent
          ? "If an account exists for that email, we've sent a link to reset your password."
          : "Enter your email and we'll send you a link to reset your password."}
      </p>
      {!sent && (
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
          {error && (
            <p className="sign-in__error sign-in__message" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <span className="sign-in__spinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
      <p className="sign-in__switch">
        <Link
          href={role === "recruiter" ? "/recruiter/sign-in" : "/sign-in"}
          className="sign-in__link"
        >
          Back to sign in
        </Link>
      </p>
    </WhitePanel>
  );
}
