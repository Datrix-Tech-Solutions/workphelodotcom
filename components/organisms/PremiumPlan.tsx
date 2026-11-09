"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon";
import UserStepper, { clampUsers } from "@/components/molecules/UserStepper";
import PlanPriceSummary from "@/components/organisms/PlanPriceSummary";
import {
  CORE_GROUP_ID,
  allFeaturesOneTime,
  customFeatures,
  featurePrice,
  formatPrice,
  planGroups,
  type Billing,
} from "@/lib/pricing";

type GroupUsers = Record<string, number>;

export default function PremiumPlan({ billing }: { billing: Billing }) {
  // Premium includes every group, so each one has users from the start.
  const [users, setUsers] = useState<GroupUsers>(() =>
    Object.fromEntries(planGroups.map((group) => [group.id, 1])),
  );
  const oneTime = allFeaturesOneTime();

  /** A group can't have more users than the core group. */
  const setGroupUsers = (groupId: string, value: number) =>
    setUsers((current) => {
      if (groupId !== CORE_GROUP_ID) {
        return {
          ...current,
          [groupId]: clampUsers(value, 1, current[CORE_GROUP_ID]),
        };
      }
      const core = clampUsers(value);
      const next: GroupUsers = { [CORE_GROUP_ID]: core };
      for (const group of planGroups) {
        if (group.id !== CORE_GROUP_ID) {
          next[group.id] = Math.min(current[group.id], core);
        }
      }
      return next;
    });

  const groups = planGroups.map((group) => {
    const features = customFeatures.filter((f) => f.group === group.id);
    return {
      group,
      features,
      perUser: features.reduce((sum, f) => sum + featurePrice(f, billing), 0),
      monthlyPerUser: features.reduce((sum, f) => sum + f.monthly, 0),
    };
  });

  return (
    <>
      <article className="plan-details" aria-labelledby="premium-title">
        <header className="plan-details__header">
          <h2 id="premium-title" className="plan-details__title">
            Premium modules
          </h2>
        </header>
        <p className="plan-details__hint">
          Every module is included. Set the number of users for each group.
        </p>
        <div className="plan-groups">
          {groups.map(({ group, features, perUser }) => {
            const max =
              group.id === CORE_GROUP_ID ? undefined : users[CORE_GROUP_ID];
            return (
              <section
                key={group.id}
                className="plan-group plan-group--active"
                aria-labelledby={`premium-${group.id}`}
              >
                <header className="plan-group__header">
                  <span className="plan-group__icon">
                    <Icon name={group.icon} size={22} />
                  </span>
                  <div className="plan-group__text">
                    <h3
                      id={`premium-${group.id}`}
                      className="plan-group__title"
                    >
                      {group.title}
                    </h3>
                    <p className="plan-group__description">
                      {group.description}
                    </p>
                  </div>
                  <div className="plan-group__users">
                    <UserStepper
                      compact
                      id={`premium-users-${group.id}`}
                      users={users[group.id]}
                      min={1}
                      max={max}
                      onChange={(n) => setGroupUsers(group.id, n)}
                    />
                    <p className="plan-group__price">
                      {formatPrice(perUser * users[group.id])} / {billing}
                    </p>
                    {max !== undefined && (
                      <p className="plan-group__cap">Up to {max} (Core HR)</p>
                    )}
                  </div>
                </header>
                <ul className="plan-group__features">
                  {features.map((feature) => (
                    <li key={feature.id}>
                      <Icon name="check" size={12} strokeWidth={3} />
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </article>

      <PlanPriceSummary
        ariaLabel="Premium plan price"
        billing={billing}
        groups={groups.map(({ group, features, perUser, monthlyPerUser }) => ({
          id: group.id,
          icon: group.icon,
          label: group.title,
          users: users[group.id],
          perUser,
          monthlyPerUser,
          features: features.map((f) => f.label),
        }))}
        oneTime={oneTime}
        emptyText=""
        ctaLabel="Choose plan"
        planName="Premium plan"
      />
    </>
  );
}
