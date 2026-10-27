"use client";

import { useState } from "react";
import { clampUsers } from "@/components/molecules/UserStepper";
import PlanPriceSummary from "@/components/organisms/PlanPriceSummary";
import Icon from "@/components/atoms/Icon";
import {
  customFeatures,
  formatPrice,
  featurePrice,
  featureListPrice,
  oneTimeTotal,
  type Billing,
} from "@/lib/pricing";

export default function CustomPlanBuilder({ billing }: { billing: Billing }) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(customFeatures.filter((f) => f.required).map((f) => f.id)),
  );
  const [users, setUsers] = useState(1);

  const setUserCount = (value: number) => setUsers(clampUsers(value));

  /** Features another selected feature depends on, mapped to what needs them. */
  const lockedBy = new Map<string, string>();
  for (const feature of customFeatures) {
    if (!selected.has(feature.id)) continue;
    for (const required of feature.requires ?? []) {
      if (!lockedBy.has(required)) lockedBy.set(required, feature.label);
    }
  }
  const isRequired = (id: string) =>
    customFeatures.some((f) => f.id === id && f.required);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        // A feature that something else needs stays on.
        if (!lockedBy.has(id) && !isRequired(id)) next.delete(id);
      } else {
        next.add(id);
        for (const required of customFeatures.find((f) => f.id === id)
          ?.requires ?? []) {
          next.add(required);
        }
      }
      return next;
    });

  const chosen = customFeatures.filter((f) => selected.has(f.id));
  const suffix = billing === "year" ? "yr" : "mo";
  const perUser = chosen.reduce((sum, f) => sum + featurePrice(f, billing), 0);
  const oneTime = oneTimeTotal(chosen);

  return (
    <>
      <article className="plan-details" aria-labelledby="custom-plan-title">
        <header className="plan-details__header">
          <h2 id="custom-plan-title" className="plan-details__title">
            Your custom plan
          </h2>
          <span className="plan-details__count">
            {chosen.length} {chosen.length === 1 ? "feature" : "features"}
          </span>
        </header>
        <div
          className="feature-picker"
          role="group"
          aria-label="Custom features"
        >
          {customFeatures.map((feature) => {
            const isSelected = selected.has(feature.id);
            const required = isRequired(feature.id);
            const lockedFor = lockedBy.get(feature.id);
            const locked = required || Boolean(lockedFor);
            const description = lockedFor
              ? (feature.lockedDescription ?? feature.description)
              : feature.description;
            return (
              <button
                key={feature.id}
                type="button"
                className={
                  locked
                    ? "feature-widget feature-widget--selected feature-widget--locked"
                    : isSelected
                      ? "feature-widget feature-widget--selected"
                      : "feature-widget"
                }
                aria-pressed={isSelected}
                aria-disabled={locked ? true : undefined}
                title={description}
                onClick={() => toggle(feature.id)}
              >
                <span className="feature-widget__icon">
                  <Icon name={feature.icon} size={96} strokeWidth={1.25} />
                </span>
                <span className="feature-widget__text">
                  <span className="feature-widget__label">{feature.label}</span>
                  <span className="feature-widget__price">
                    {featureListPrice(feature, billing) !== undefined && (
                      <>
                        <s>
                          {formatPrice(featureListPrice(feature, billing)!)}
                        </s>{" "}
                      </>
                    )}
                    {featurePrice(feature, billing) === 0
                      ? featureListPrice(feature, billing) !== undefined
                        ? `$0.00/user/${suffix}`
                        : "Free"
                      : `${formatPrice(featurePrice(feature, billing))}/user/${suffix}`}
                  </span>
                  {description && (
                    <span className="feature-widget__note">{description}</span>
                  )}
                </span>
                <span className="feature-widget__check" aria-hidden="true">
                  <Icon name="check" size={10} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <PlanPriceSummary
        ariaLabel="Custom plan price"
        billing={billing}
        users={users}
        onUsersChange={setUserCount}
        lines={chosen.map((f) => ({
          id: f.id,
          icon: f.icon,
          label: f.label,
          price: featurePrice(f, billing),
          priceText: f.listPrice ? "$0.00" : undefined,
        }))}
        perUser={perUser}
        monthlyPerUser={chosen.reduce((sum, f) => sum + f.monthly, 0)}
        oneTime={oneTime}
        emptyText="Select features to build your plan and see the price."
        ctaLabel="Request this plan"
        planName="Custom plan"
      />
    </>
  );
}
