import ToggleSwitch from "@/components/atoms/ToggleSwitch";

interface IncludeFieldProps {
  label: string;
  included: boolean;
  onIncludedChange: (included: boolean) => void;
  /** When both are passed, a "Required" switch shows while the field is included. */
  required?: boolean;
  onRequiredChange?: (required: boolean) => void;
  /** Not rendered while the field is excluded; its value is kept. */
  children: React.ReactNode;
}

/** A bordered field block with an "Include" switch at the top right. */
export default function IncludeField({
  label,
  included,
  onIncludedChange,
  required,
  onRequiredChange,
  children,
}: IncludeFieldProps) {
  return (
    <div className="include-field">
      <div className="include-field__head">
        <span className="include-field__label">{label}</span>
        <div className="include-field__switches">
          {included && required !== undefined && onRequiredChange && (
            <span className="include-field__switch">
              Required
              <ToggleSwitch
                enabled={required}
                onChange={onRequiredChange}
                label={`${label} required`}
              />
            </span>
          )}
          <span className="include-field__switch">
            Include
            <ToggleSwitch
              enabled={included}
              onChange={onIncludedChange}
              label={`Include ${label}`}
            />
          </span>
        </div>
      </div>
      {included && children}
    </div>
  );
}
