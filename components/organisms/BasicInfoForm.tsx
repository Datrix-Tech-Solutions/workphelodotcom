"use client";

import { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { countries } from "@/lib/countries";
import { isValidPhone, type FormValues } from "@/lib/apply";
import Button from "@/components/atoms/Button";

interface BasicInfoFormProps {
  defaultValues: FormValues;
  onNext: (values: FormValues) => void;
}

export default function BasicInfoForm({
  defaultValues,
  onNext,
}: BasicInfoFormProps) {
  const [phoneError, setPhoneError] = useState("");

  return (
    <form
      className="apply-form"
      aria-labelledby="basic-info-title"
      onSubmit={(e) => {
        e.preventDefault();
        const values = Object.fromEntries(
          new FormData(e.currentTarget) as unknown as Iterable<
            [string, string]
          >,
        );
        if (!isValidPhone(values.phone ?? "")) {
          setPhoneError("Include your country code, e.g. +233 24 000 0000.");
          return;
        }
        onNext(values);
      }}
    >
      <h2 id="basic-info-title" className="apply-form__title">
        Basic Info
      </h2>

      <div className="apply-form__grid">
        <FormField id="last-name" label="Last name" required>
          <Input
            id="last-name"
            name="lastName"
            required
            defaultValue={defaultValues.lastName}
            className="field-control"
            autoComplete="family-name"
          />
        </FormField>
        <FormField id="first-name" label="First name" required>
          <Input
            id="first-name"
            name="firstName"
            required
            defaultValue={defaultValues.firstName}
            className="field-control"
            autoComplete="given-name"
          />
        </FormField>
      </div>

      <FormField id="email" label="Email address" required>
        <Input
          id="email"
          name="email"
          required
          defaultValue={defaultValues.email}
          type="email"
          className="field-control"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </FormField>

      <FormField id="phone" label="Phone number" required>
        <Input
          id="phone"
          name="phone"
          required
          defaultValue={defaultValues.phone}
          type="tel"
          className="field-control"
          autoComplete="tel"
          placeholder="+233 24 000 0000"
          aria-describedby="phone-error"
          onChange={() => setPhoneError("")}
        />
        {phoneError && (
          <span id="phone-error" className="form-field__error" role="alert">
            {phoneError}
          </span>
        )}
      </FormField>

      <FormField id="country" label="Country" required>
        <Select
          id="country"
          name="country"
          required
          autoComplete="country-name"
          defaultValue={defaultValues.country ?? ""}
        >
          <option value="" disabled>
            Select your country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="location" label="City" required>
        <Input
          id="location"
          name="location"
          required
          defaultValue={defaultValues.location}
          className="field-control"
          autoComplete="address-level2"
          placeholder="e.g. Accra"
        />
      </FormField>

      <div className="apply-form__actions">
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
