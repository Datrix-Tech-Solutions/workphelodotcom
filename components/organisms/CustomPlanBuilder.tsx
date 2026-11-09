"use client";

import { useState } from "react";
import UserStepper, { clampUsers } from "@/components/molecules/UserStepper";
import PlanPriceSummary from "@/components/organisms/PlanPriceSummary";
import Icon from "@/components/atoms/Icon";
import {
  CORE_GROUP_ID,
  customFeatures,
  featureListPrice,
  featurePrice,
  formatPrice,
  oneTimeTotal,
  planGroups,
  type Billing,
} from "@/lib/pricing";

type GroupUsers = Record<string, number>;

const initialSelected = () =>
  new Set(customFeatures.filter((f) => f.required).map((f) => f.id));

/**
 * Keeps the user counts consistent with the selection: a group with no
 * features has no users, a group with features has at least one, and no
 * group has more users than the core group.
 */
function normalise(selected: Set<string>, users: GroupUsers): GroupUsers {
  const core = clampUsers(users[CORE_GROUP_ID] ?? 1);
  const next: GroupUsers = {};
  for (const group of planGroups) {
    const active =
      group.id === CORE_GROUP_ID ||
      customFeatures.some((f) => f.group === group.id && selected.has(f.id));
    next[group.id] = active
      ? clampUsers(users[group.id] ?? 1, 1, core)
      : 0;
  }
  return next;
}

export default function CustomPlanBuilder({ billing }: { billing: Billing }) {
  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [users, setUsers] = useState<GroupUsers>(() =>
    normalise(initialSelected(), {}),
  );

  /** Applies a new selection and brings the user counts in line with it. */
  const commit = (next: Set<string>, nextUsers: GroupUsers = users) => {
    setSelected(next);
    setUsers(normalise(next, nextUsers));
  };

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
  const isLocked = (id: string) => isRequired(id) || lockedBy.has(id);

  const select = (next: Set<string>, id: string) => {
    next.add(id);
    for (const required of customFeatures.find((f) => f.id === id)?.requires ??
      []) {
      next.add(required);
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      // A feature that something else needs stays on.
      if (isLocked(id)) return;
      next.delete(id);
    } else {
      select(next, id);
    }
    commit(next);
  };

  /** Ticking a group adds its first feature; unticking clears the group. */
  const toggleGroup = (groupId: string) => {
    if (groupId === CORE_GROUP_ID) return;
    const members = customFeatures.filter((f) => f.group === groupId);
    const next = new Set(selected);
    if (members.some((f) => next.has(f.id))) {
      for (const f of members) if (!isLocked(f.id)) next.delete(f.id);
    } else if (members[0]) {
      select(next, members[0].id);
    }
    commit(next);
  };

  const setGroupUsers = (groupId: string, value: number) => {
    const max = groupId === CORE_GROUP_ID ? undefined : users[CORE_GROUP_ID];
    commit(selected, { ...users, [groupId]: clampUsers(value, 1, max) });
  };

  const chosen = customFeatures.filter((f) => selected.has(f.id));
  const suffix = billing === "year" ? "yr" : "mo";
  const oneTime = oneTimeTotal(chosen);

  const summaryGroups = planGroups.flatMap((group) => {
    const features = chosen.filter((f) => f.group === group.id);
    if (features.length === 0) return [];
    return [
      {
        id: group.id,
        icon: group.icon,
        label: group.title,
        users: users[group.id],
        perUser: features.reduce((sum, f) => sum + featurePrice(f, billing), 0),
        monthlyPerUser: features.reduce((sum, f) => sum + f.monthly, 0),
        features: features.map((f) => f.label),
      },
    ];
  });

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
        <p className="plan-details__hint">
          Choose the groups you need, pick the features in each, and set the
          number of users per group.
        </p>

        <div className="plan-groups">
          {planGroups.map((group) => {
            const features = customFeatures.filter(
              (f) => f.group === group.id,
            );
            const picked = features.filter((f) => selected.has(f.id));
            const active = picked.length > 0;
            const groupLocked =
              group.id === CORE_GROUP_ID || features.some((f) => isLocked(f.id));
            const perUser = picked.reduce(
              (sum, f) => sum + featurePrice(f, billing),
              0,
            );
            const stepperId = `users-${group.id}`;
            const max =
              group.id === CORE_GROUP_ID ? undefined : users[CORE_GROUP_ID];
            return (
              <section
                key={group.id}
                className={
                  active ? "plan-group plan-group--active" : "plan-group"
                }
                aria-labelledby={`group-${group.id}`}
              >
                <header className="plan-group__header">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    aria-labelledby={`group-${group.id}`}
                    aria-disabled={groupLocked ? true : undefined}
                    className="plan-group__check"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <Icon name="check" size={12} strokeWidth={3} />
                  </button>
                  <span className="plan-group__icon">
                    <Icon name={group.icon} size={22} />
                  </span>
                  <div className="plan-group__text">
                    <h3 id={`group-${group.id}`} className="plan-group__title">
                      {group.title}
                    </h3>
                    <p className="plan-group__description">
                      {group.description}
                    </p>
                  </div>
                  <div className="plan-group__users">
                    <UserStepper
                      compact
                      id={stepperId}
                      users={users[group.id]}
                      min={1}
                      max={max}
                      disabled={!active}
                      onChange={(n) => setGroupUsers(group.id, n)}
                    />
                    <p className="plan-group__price">
                      {active
                        ? `${formatPrice(perUser * users[group.id])} / ${billing}`
                        : "Not selected"}
                    </p>
                    {max !== undefined && active && (
                      <p className="plan-group__cap">Up to {max} (Core HR)</p>
                    )}
                  </div>
                </header>

                <div
                  className="feature-picker"
                  role="group"
                  aria-label={`${group.title} features`}
                >
                  {features.map((feature) => {
                    const isSelected = selected.has(feature.id);
                    const required = isRequired(feature.id);
                    const lockedFor = lockedBy.get(feature.id);
                    const locked = required || Boolean(lockedFor);
                    const description = lockedFor
                      ? (feature.lockedDescription ?? feature.description)
                      : feature.description;
                    const list = featureListPrice(feature, billing);
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
                          <Icon
                            name={feature.icon}
                            size={96}
                            strokeWidth={1.25}
                          />
                        </span>
                        <span className="feature-widget__text">
                          <span className="feature-widget__label">
                            {feature.label}
                          </span>
                          <span className="feature-widget__price">
                            {list !== undefined && (
                              <>
                                <s>{formatPrice(list)}</s>{" "}
                              </>
                            )}
                            {featurePrice(feature, billing) === 0
                              ? list !== undefined
                                ? `$0.00/user/${suffix}`
                                : "Free"
                              : `${formatPrice(featurePrice(feature, billing))}/user/${suffix}`}
                          </span>
                          {description && (
                            <span className="feature-widget__note">
                              {description}
                            </span>
                          )}
                        </span>
                        <span
                          className="feature-widget__check"
                          aria-hidden="true"
                        >
                          <Icon name="check" size={10} strokeWidth={3} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </article>

      <PlanPriceSummary
        ariaLabel="Custom plan price"
        billing={billing}
        groups={summaryGroups}
        oneTime={oneTime}
        emptyText="Select features to build your plan and see the price."
        ctaLabel="Request this plan"
        planName="Custom plan"
      />
    </>
  );
}
