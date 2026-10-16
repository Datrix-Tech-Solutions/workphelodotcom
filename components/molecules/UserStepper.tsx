const MAX_USERS = 100000;

export function clampUsers(value: number): number {
  return Math.min(MAX_USERS, Math.max(1, Math.round(value) || 1));
}

interface UserStepperProps {
  users: number;
  onChange: (users: number) => void;
}

/** A labelled number-of-users stepper. */
export default function UserStepper({ users, onChange }: UserStepperProps) {
  return (
    <div className="pricing-widget__users">
      <label htmlFor="user-count" className="pricing-widget__users-label">
        Users
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__button"
          aria-label="Decrease users"
          disabled={users <= 1}
          onClick={() => onChange(clampUsers(users - 1))}
        >
          &minus;
        </button>
        <input
          id="user-count"
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_USERS}
          value={users}
          onChange={(e) => onChange(clampUsers(Number(e.target.value)))}
        />
        <button
          type="button"
          className="stepper__button"
          aria-label="Increase users"
          disabled={users >= MAX_USERS}
          onClick={() => onChange(clampUsers(users + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
