interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  id,
  label,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
