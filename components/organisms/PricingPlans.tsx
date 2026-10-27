import Link from "next/link";
import Icon from "@/components/atoms/Icon";
import Money from "@/components/atoms/Money";
import Button from "@/components/atoms/Button";
import FreePlan from "@/components/organisms/FreePlan";
import PremiumPlan from "@/components/organisms/PremiumPlan";
import CustomPlanBuilder from "@/components/organisms/CustomPlanBuilder";
import BillingToggle from "@/components/molecules/BillingToggle";
import {
  allFeaturesOneTime,
  allFeaturesPrice,
  formatPrice,
  pricingHref,
  premiumModuleTitles,
  pricingTiers,
  type Billing,
  type PricingTier,
} from "@/lib/pricing";

interface PricingPlansProps {
  selectedId?: string;
  billing: Billing;
  signedIn: boolean;
}

function PlanCard({
  tier,
  selected,
  compact,
  billing,
  signedIn,
}: {
  tier: PricingTier;
  selected: boolean;
  compact: boolean;
  billing: Billing;
  signedIn: boolean;
}) {
  // Signed-in users already have an account, so the free sign-up is no use.
  const unavailable = signedIn && tier.id === "free";
  const classes = ["plan-head"];
  if (tier.featured) classes.push("plan-head--featured");
  if (selected) classes.push("plan-head--selected");
  if (unavailable) classes.push("plan-head--disabled");
  return (
    <div
      className={classes.join(" ")}
      aria-disabled={unavailable ? true : undefined}
    >
      <div className="plan-head__top">
        <span className="plan-head__icon">
          <Icon name={tier.icon} size={18} />
        </span>
        <h2 className="plan-head__name">
          {unavailable ? (
            <span className="plan-head__link">{tier.name}</span>
          ) : (
            <Link
              href={pricingHref(tier.id, billing)}
              scroll={false}
              className="plan-head__link"
              aria-current={selected ? "true" : undefined}
            >
              {tier.name}
            </Link>
          )}
        </h2>
        {tier.featured && <span className="plan-head__badge">Recommended</span>}
      </div>
      <p className="plan-head__tagline">{tier.tagline}</p>
      <p className="plan-head__price">
        {tier.priceFromFeatures ? (
          <Money
            amount={allFeaturesPrice(billing)}
            unit={`/ user / ${billing}`}
            size="md"
          />
        ) : (
          tier.price
        )}
      </p>
      <p
        className={
          tier.priceFromFeatures
            ? "plan-head__note plan-head__note--small"
            : "plan-head__note"
        }
      >
        {tier.priceFromFeatures
          ? `+ ${formatPrice(allFeaturesOneTime())} one time set-up payment`
          : (tier.priceNote ?? " ")}
      </p>
      {!compact && tier.priceFromFeatures && (
        <div className="plan-head__included">
          <p className="plan-head__summary">{tier.summary}</p>
          <ul className="plan-head__features">
            {premiumModuleTitles.map((module) => (
              <li key={module.label}>
                <Icon name="check" size={14} strokeWidth={3} />
                <span>{module.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!compact && (
        <div className="plan-head__cta">
          {unavailable ? (
            <Button type="button" variant="solid" disabled>
              {tier.cta}
            </Button>
          ) : (
            <Button href={pricingHref(tier.id, billing)} variant="solid">
              {tier.cta}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PricingPlans({
  selectedId,
  billing,
  signedIn,
}: PricingPlansProps) {
  const selected = pricingTiers.find((t) => t.id === selectedId);

  if (!selected) {
    return (
      <section className="pricing" aria-label="Plans">
        <BillingToggle billing={billing} />
        <div className="pricing__grid">
          {pricingTiers.map((tier) => (
            <PlanCard
              key={tier.id}
              tier={tier}
              selected={false}
              compact={false}
              billing={billing}
              signedIn={signedIn}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pricing" aria-label="Plans">
      <BillingToggle billing={billing} plan={selected.id} />
      <div className="pricing__split">
        <div className="pricing__list">
          {pricingTiers.map((tier) => (
            <PlanCard
              key={tier.id}
              tier={tier}
              selected={tier.id === selected.id}
              compact
              billing={billing}
              signedIn={signedIn}
            />
          ))}
        </div>
        <div className="plan-panel">
          {selected.id === "custom" ? (
            <CustomPlanBuilder billing={billing} />
          ) : selected.id === "premium" ? (
            <PremiumPlan billing={billing} />
          ) : selected.id === "free" ? (
            <FreePlan />
          ) : (
            <>
              <article
                className="plan-details"
                aria-label={`${selected.name} details`}
              />
              <aside
                className="plan-aside"
                aria-label={`${selected.name} summary`}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
