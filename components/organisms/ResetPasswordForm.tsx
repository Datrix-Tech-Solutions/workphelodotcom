"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";
import Button from "@/components/atoms/Button";
import { WhitePanel } from "@/components/atoms/GlassPanel";
import PasswordField from "@/components/molecules/PasswordField";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const mismatch = confirm !== "" && confirm !== password;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || password !== confirm) return;
    setLoading(true);
    setError("");
    try {
      const result = await updatePassword(password);
      if (result.error) setError(result.error);
      else setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <WhitePanel className="sign-in">
      <h1 className="sign-in__title">Reset password</h1>
      <p className="sign-in__subtext">
        {done
          ? "Your password has been updated."
          : "Choose a new password for your account."}
      </p>
      {done ? (
        <p className="sign-in__switch">
          <Link href="/" className="sign-in__link">
            Continue to Workphelo
          </Link>
        </p>
      ) : (
        <form
          className="sign-in__form"
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <PasswordField
            label="New password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordField
            label="Confirm new password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
            aria-invalid={mismatch}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {mismatch && (
            <p className="sign-in__error sign-in__message" role="alert">
              Passwords don&apos;t match.
            </p>
          )}
          {error && (
            <p className="sign-in__error sign-in__message" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <span className="sign-in__spinner" aria-hidden="true" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      )}
    </WhitePanel>
  );
}
