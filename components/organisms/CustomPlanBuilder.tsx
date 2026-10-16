"use client";

import { useState } from "react";
import { clampUsers } from "@/components/molecules/UserStepper";
import PlanPriceSummary from "@/components/organisms/PlanPriceSummary";
import Icon from "@/components/atoms/Icon";
import {
  customFeatures,
  formatPrice,
  featurePrice,
  pricingHref,
  type Billing,
} from "@/lib/pricing";

export default function CustomPlanBuilder({
  billing,
  signedIn,
}: {
  billing: Billing;
  signedIn: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
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

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        // A feature that something else needs stays on.
        if (!lockedBy.has(id)) next.delete(id);
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
  const oneTime = chosen.reduce((sum, f) => sum + (f.oneTime ?? 0), 0);

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
            const lockedFor = lockedBy.get(feature.id);
            return (
              <button
                key={feature.id}
                type="button"
                className={
                  lockedFor
                    ? "feature-widget feature-widget--selected feature-widget--locked"
                    : isSelected
                      ? "feature-widget feature-widget--selected"
                      : "feature-widget"
                }
                aria-pressed={isSelected}
                aria-disabled={lockedFor ? true : undefined}
                title={lockedFor ? `Required by ${lockedFor}` : undefined}
                onClick={() => toggle(feature.id)}
              >
                <span className="feature-widget__icon">
                  <Icon name={feature.icon} size={20} />
                </span>
                <span className="feature-widget__text">
                  <span className="feature-widget__label">{feature.label}</span>
                  <span className="feature-widget__price">
                    {featurePrice(feature, billing) === 0
                      ? "Free"
                      : `${formatPrice(featurePrice(feature, billing))}/user/${suffix}`}
                    {feature.oneTime
                      ? ` + ${formatPrice(feature.oneTime)} one time set-up`
                      : ""}
                  </span>
                  {lockedFor && (
                    <span className="feature-widget__note">
                      Included with {lockedFor}
                    </span>
                  )}
                </span>
                <span className="feature-widget__check" aria-hidden="true">
                  <Icon name="check" size={14} strokeWidth={3} />
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
          oneTime: f.oneTime,
        }))}
        perUser={perUser}
        monthlyPerUser={chosen.reduce((sum, f) => sum + f.monthly, 0)}
        oneTime={oneTime}
        emptyText="Select features to build your plan and see the price."
        ctaLabel="Request this plan"
        planName="Custom plan"
        returnTo={pricingHref("custom", billing)}
        signedIn={signedIn}
      />
    </>
  );
}
