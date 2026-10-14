"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/auth/actions";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import type { CandidateProfile } from "@/lib/auth/types";
import { countries } from "@/lib/countries";
import { notifySessionChange } from "@/lib/useSession";

interface ProfileFormProps {
  name: string;
  email: string;
  profile: CandidateProfile;
}

export default function ProfileForm({
  name,
  email,
  profile,
}: ProfileFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({ name, ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  function bind(field: keyof typeof values) {
    return {
      value: values[field],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      ) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        setSaved(false);
      },
    };
  }

  function handleCancel() {
    setValues({ name, ...profile });
    setError("");
    setEditing(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const result = await updateProfile(values);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setEditing(false);
      notifySessionChange();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="profile-card profile-form"
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <h2 className="profile-card__title">Basic details</h2>

      <fieldset className="profile-form__fields" disabled={!editing}>
        <FormField id="profile-name" label="Full name" required>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="field-control"
            {...bind("name")}
          />
        </FormField>

        <FormField id="profile-email" label="Email">
          <input
            id="profile-email"
            type="email"
            className="field-control"
            value={email}
            readOnly
            disabled
          />
        </FormField>

        <FormField id="profile-phone" label="Phone number">
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 24 000 0000"
            className="field-control"
            {...bind("phone")}
          />
        </FormField>

        <div className="profile-form__row">
          <FormField id="profile-country" label="Country">
            <Select
              id="profile-country"
              name="country"
              autoComplete="country-name"
              {...bind("country")}
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="profile-city" label="City">
            <input
              id="profile-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              className="field-control"
              {...bind("city")}
            />
          </FormField>
        </div>

        <FormField id="profile-role" label="Role">
          <input
            id="profile-role"
            name="role"
            type="text"
            placeholder="e.g. Frontend Developer"
            className="field-control"
            {...bind("role")}
          />
          <span className="form-field__hint">
            We use this to recommend jobs for you.
          </span>
        </FormField>

        <fieldset className="profile-form__socials">
          <legend className="form-field__label">Socials</legend>
          <input
            aria-label="LinkedIn"
            name="linkedin"
            type="url"
            placeholder="LinkedIn URL"
            className="field-control"
            {...bind("linkedin")}
          />
          <input
            aria-label="GitHub"
            name="github"
            type="url"
            placeholder="GitHub URL"
            className="field-control"
            {...bind("github")}
          />
          <input
            aria-label="Portfolio or website"
            name="portfolio"
            type="url"
            placeholder="Portfolio or website URL"
            className="field-control"
            {...bind("portfolio")}
          />
        </fieldset>
      </fieldset>

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="account__saved" role="status">
          Changes saved.
        </p>
      )}
      <div className="profile-form__actions">
        {editing ? (
          <>
            <Button type="submit" variant="solid" disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="solid"
            onClick={() => {
              setSaved(false);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
}
