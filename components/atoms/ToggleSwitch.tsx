interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

export default function ToggleSwitch({
  enabled,
  onChange,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`toggle${enabled ? " toggle--on" : ""}`}
      onClick={() => onChange(!enabled)}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
