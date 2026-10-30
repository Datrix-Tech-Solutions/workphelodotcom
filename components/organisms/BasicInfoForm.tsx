"use client";

import { useRef, useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { countries } from "@/lib/countries";
import { dialCodeOf, dialCodes, splitPhone } from "@/lib/dialCodes";
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
  const initialPhone = splitPhone(defaultValues.phone ?? "");
  const [dialCountry, setDialCountry] = useState(initialPhone.country);
  // Picking a country fills in its code until the user chooses a code themselves.
  const dialTouched = useRef(!!defaultValues.phone);

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
        const { phoneCode, phoneNumber, ...rest } = values;
        const code = dialCodeOf(phoneCode ?? "") ?? "";
        // A leading 0 is how local numbers are written; the code replaces it.
        const phone = `${code} ${(phoneNumber ?? "").replace(/^[\s0]+/, "")}`;
        if (!isValidPhone(phone)) {
          setPhoneError("Enter a valid phone number, e.g. 24 000 0000.");
          return;
        }
        onNext({ ...rest, phone });
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

      <div className="apply-form__grid apply-form__grid--three">
        <FormField id="country" label="Country" required>
          <Select
            id="country"
            name="country"
            required
            autoComplete="country-name"
            defaultValue={defaultValues.country ?? ""}
            onChange={(e) => {
              if (!dialTouched.current && dialCodeOf(e.target.value)) {
                setDialCountry(e.target.value);
              }
            }}
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
        <FormField id="address" label="Address">
          <Input
            id="address"
            name="address"
            defaultValue={defaultValues.address}
            className="field-control"
            autoComplete="street-address"
            placeholder="e.g. 12 Oxford Street"
          />
        </FormField>
      </div>

      <div className="apply-form__grid">
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
          <div className="phone-field">
            <Select
              id="phone-code"
              name="phoneCode"
              aria-label="Country code"
              value={dialCountry}
              onChange={(e) => {
                dialTouched.current = true;
                setDialCountry(e.target.value);
                setPhoneError("");
              }}
            >
              {dialCodes.map(({ country, code }) => (
                <option key={country} value={country}>
                  {code} {country}
                </option>
              ))}
            </Select>
            <Input
              id="phone"
              name="phoneNumber"
              required
              defaultValue={initialPhone.number}
              type="tel"
              className="field-control"
              autoComplete="tel-national"
              placeholder="24 000 0000"
              aria-describedby="phone-error"
              onChange={() => setPhoneError("")}
            />
          </div>
          {phoneError && (
            <span id="phone-error" className="form-field__error" role="alert">
              {phoneError}
            </span>
          )}
        </FormField>
      </div>

      <div className="apply-form__actions">
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
