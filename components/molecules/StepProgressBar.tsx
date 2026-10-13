import Icon from "@/components/atoms/Icon";

interface StepProgressBarProps {
  steps: string[];
  currentStep: number; // 0-indexed
  /** Adds a soft shadow so the bar reads as a raised card. */
  card?: boolean;
}

export default function StepProgressBar({
  steps,
  currentStep,
  card = false,
}: StepProgressBarProps) {
  const progressPct = ((currentStep + 1) / steps.length) * 100;
  const prev = steps[currentStep - 1];
  const next = steps[currentStep + 1];

  return (
    <div
      className={`step-progress ${card ? "step-progress--card" : ""}`}
      role="group"
      aria-label="Application progress"
    >
      {/* Mobile: compact bar */}
      <div className="step-progress__compact">
        <div className="step-progress__compact-head">
          <span className="step-progress__current-label">
            {steps[currentStep]}
          </span>
          <span className="step-progress__count">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div
          className="step-progress__track"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentStep + 1}
          aria-valuetext={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}
        >
          <div
            className="step-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="step-progress__neighbours">
          {prev ? (
            <span className="step-progress__neighbour">
              <Icon name="chevron-left" size={12} />
              <span>{prev}</span>
            </span>
          ) : (
            <span />
          )}
          {next ? (
            <span className="step-progress__neighbour">
              <span>{next}</span>
              <Icon name="chevron-right" size={12} />
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Desktop: circles and labels */}
      <ol className="step-progress__steps">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const state = isCompleted
            ? "completed"
            : isCurrent
              ? "current"
              : "upcoming";

          return (
            <li
              key={label}
              className={`step-progress__step step-progress__step--${state}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="step-progress__node">
                <div className="step-progress__marker-wrap">
                  {isCurrent && <span className="step-progress__ring" />}
                  <span className="step-progress__marker">
                    {isCompleted && (
                      <Icon name="check" size={16} strokeWidth={2.5} />
                    )}
                    {isCurrent && <span className="step-progress__dot" />}
                  </span>
                </div>
                <span className="step-progress__label">{label}</span>
              </div>
              {index < steps.length - 1 && (
                <span className="step-progress__connector" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
