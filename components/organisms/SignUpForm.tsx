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
import Select from "@/components/atoms/Select";
import { companySizes, industries } from "@/lib/company";
import { countries } from "@/lib/countries";

type Role = "candidate" | "recruiter";

const ROLES: { value: Role; label: string }[] = [
  { value: "candidate", label: "Candidate" },
  { value: "recruiter", label: "Recruiter" },
];

export default function SignUpForm({
  lockedRole,
  onSwitch,
  next = "/",
}: {
  /** Fixes the account type and hides the picker. */
  lockedRole?: Role;
  /** Swaps to the sign-in form in place instead of linking to its page. */
  onSwitch?: () => void;
  /** Where to go once the account is created. */
  next?: string;
}) {
  const [role, setRole] = useState<Role>(lockedRole ?? "candidate");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
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
      const result = await signUp(
        role === "recruiter"
          ? {
              role,
              companyName,
              industry,
              companySize,
              country,
              address,
              name,
              email,
              password,
            }
          : { role, name, email, password },
      );
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
    <WhitePanel
      className={`sign-in${role === "recruiter" ? " sign-in--wide" : " sign-in--wide"}`}
    >
      <h1 className="sign-in__title">Create your account</h1>
      <p className="sign-in__subtext">
        {role === "recruiter"
          ? "Sign up to start posting jobs."
          : "Sign up to find your next role."}
      </p>
      <form
        className="sign-in__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        {!lockedRole && (
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
        )}
        {role === "recruiter" && (
          <>
            <label className="sign-in__field sign-in__field--full">
              <span className="sign-in__label">Company name</span>
              <Input
                type="text"
                name="companyName"
                autoComplete="organization"
                placeholder="Your company"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="sign-in__input"
              />
            </label>
            <label className="sign-in__field">
              <span className="sign-in__label">Industry</span>
              <Select
                name="industry"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="sign-in__input sign-in__select"
              >
                <option value="" disabled>
                  Select an industry
                </option>
                {industries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </label>
            <label className="sign-in__field">
              <span className="sign-in__label">Company size</span>
              <Select
                name="companySize"
                required
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="sign-in__input sign-in__select"
              >
                <option value="" disabled>
                  Select company size
                </option>
                {companySizes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </label>
            <label className="sign-in__field">
              <span className="sign-in__label">Country</span>
              <Select
                name="country"
                autoComplete="country-name"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="sign-in__input sign-in__select"
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            <label className="sign-in__field">
              <span className="sign-in__label">Address</span>
              <Input
                type="text"
                name="address"
                autoComplete="street-address"
                placeholder="Company address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="sign-in__input"
              />
            </label>
          </>
        )}
        <label className="sign-in__field sign-in__field--full">
          <span className="sign-in__label">
            {role === "recruiter" ? "Admin name" : "Full name"}
          </span>
          <Input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={
              role === "recruiter" ? "Account admin's name" : "Your full name"
            }
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sign-in__input"
          />
        </label>
        <label className="sign-in__field sign-in__field--full">
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
          fieldClassName="sign-in__field--full"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="sign-in__field sign-in__field--full">
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
