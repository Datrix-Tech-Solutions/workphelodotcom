const MAX_USERS = 100000;

export function clampUsers(
  value: number,
  min = 1,
  max = MAX_USERS,
): number {
  return Math.min(max, Math.max(min, Math.round(value) || min));
}

interface UserStepperProps {
  users: number;
  onChange: (users: number) => void;
  /** Distinguishes steppers when several are on the page. */
  id?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Hides the "Users" label and lays the stepper out on its own. */
  compact?: boolean;
}

/** A labelled number-of-users stepper. */
export default function UserStepper({
  users,
  onChange,
  id = "user-count",
  min = 1,
  max = MAX_USERS,
  disabled = false,
  compact = false,
}: UserStepperProps) {
  const set = (value: number) => onChange(clampUsers(value, min, max));
  return (
    <div
      className={
        compact
          ? "pricing-widget__users pricing-widget__users--compact"
          : "pricing-widget__users"
      }
    >
      <label
        htmlFor={id}
        className={
          compact ? "pricing-widget__users-label sr-only" : "pricing-widget__users-label"
        }
      >
        Users
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__button"
          aria-label="Decrease users"
          disabled={disabled || users <= min}
          onClick={() => set(users - 1)}
        >
          &minus;
        </button>
        <input
          id={id}
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={users}
          disabled={disabled}
          onChange={(e) => set(Number(e.target.value))}
        />
        <button
          type="button"
          className="stepper__button"
          aria-label="Increase users"
          disabled={disabled || users >= max}
          onClick={() => set(users + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
