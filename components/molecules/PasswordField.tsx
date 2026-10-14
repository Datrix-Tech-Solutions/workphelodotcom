"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import Icon from "@/components/atoms/Icon";
import Input from "@/components/atoms/Input";

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  fieldClassName?: string;
}

export default function PasswordField({
  label,
  fieldClassName,
  ...props
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={["sign-in__field", fieldClassName].filter(Boolean).join(" ")}
    >
      <label htmlFor={id} className="sign-in__label">
        {label}
      </label>
      <div className="sign-in__password">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className="sign-in__input sign-in__password-input"
          {...props}
        />
        <button
          type="button"
          className="sign-in__toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? "eye-off" : "eye"} />
        </button>
      </div>
    </div>
  );
}
