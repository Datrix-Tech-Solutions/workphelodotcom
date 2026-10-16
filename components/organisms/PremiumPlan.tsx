"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon";
import { clampUsers } from "@/components/molecules/UserStepper";
import PlanPriceSummary from "@/components/organisms/PlanPriceSummary";
import { productModules } from "@/lib/modules";
import {
  allFeaturesOneTime,
  allFeaturesPrice,
  premiumModuleTitles,
  pricingHref,
  type Billing,
} from "@/lib/pricing";

const modules = premiumModuleTitles.flatMap(({ label, productTitle }) => {
  const found = productModules.find((m) => m.title === productTitle);
  return found
    ? [{ label, icon: found.icon, description: found.description }]
    : [];
});

export default function PremiumPlan({
  billing,
  signedIn,
}: {
  billing: Billing;
  signedIn: boolean;
}) {
  const [users, setUsers] = useState(1);
  const oneTime = allFeaturesOneTime();

  return (
    <>
      <article className="plan-details" aria-labelledby="premium-title">
        <header className="plan-details__header">
          <h2 id="premium-title" className="plan-details__title">
            Premium modules
          </h2>
        </header>
        <ul className="premium-modules">
          {modules.map((module) => (
            <li key={module.label} className="premium-module">
              <span className="premium-module__icon">
                <Icon name={module.icon} size={20} />
              </span>
              <div>
                <h3 className="premium-module__title">{module.label}</h3>
                <p className="premium-module__description">
                  {module.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <PlanPriceSummary
        ariaLabel="Premium plan price"
        billing={billing}
        users={users}
        onUsersChange={(n) => setUsers(clampUsers(n))}
        lines={[
          {
            id: "premium",
            icon: "layers",
            label: "Premium plan",
            price: allFeaturesPrice(billing),
            oneTime,
          },
        ]}
        perUser={allFeaturesPrice(billing)}
        monthlyPerUser={allFeaturesPrice("month")}
        oneTime={oneTime}
        emptyText=""
        ctaLabel="Choose plan"
        planName="Premium plan"
        returnTo={pricingHref("premium", billing)}
        signedIn={signedIn}
      />
    </>
  );
}
