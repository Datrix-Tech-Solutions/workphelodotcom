"use client";

import { useCallback, useState } from "react";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import Dialog from "@/components/molecules/Dialog";
import SignInForm from "@/components/organisms/SignInForm";
import SignUpForm from "@/components/organisms/SignUpForm";

type View = "sign-up" | "sign-in";

/** The "Try it out" column: opens the recruiter sign-up or sign-in form. */
export default function RecruiterTrial() {
  const [view, setView] = useState<View | null>(null);
  const close = useCallback(() => setView(null), []);

  return (
    <aside className="plan-aside trial" aria-label="Try it out">
      <div className="trial__body">
        <span className="trial__icon">
          <Icon name="rocket" size={20} />
        </span>
        <h3 className="trial__title">Try it out</h3>
        <p className="trial__text">
          Create a free recruiter account and post your first job in minutes.
        </p>
      </div>
      <div className="trial__actions">
        <Button
          type="button"
          variant="solid"
          onClick={() => setView("sign-up")}
        >
          Try it out
        </Button>
        <p className="trial__switch">
          Already have an account?{" "}
          <button
            type="button"
            className="trial__link"
            onClick={() => setView("sign-in")}
          >
            Sign in
          </button>
        </p>
      </div>

      <Dialog
        open={view !== null}
        onClose={close}
        label={view === "sign-in" ? "Recruiter sign in" : "Recruiter sign up"}
      >
        {view === "sign-in" ? (
          <SignInForm
            lockedRole="recruiter"
            next="/dashboard"
            onSwitch={() => setView("sign-up")}
          />
        ) : (
          <SignUpForm
            lockedRole="recruiter"
            onSwitch={() => setView("sign-in")}
          />
        )}
      </Dialog>
    </aside>
  );
}
