"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { featureGroups, pricingTiers } from "@/lib/pricing";

export default function PricingPlans() {
  // Groups open together across every plan so the columns stay comparable.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([featureGroups[0].id]),
  );

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="pricing" aria-label="Plans and features">
      <div className="pricing__scroll">
        <div className="pricing__grid">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.featured
                  ? "plan-head plan-head--featured"
                  : "plan-head"
              }
            >
              <h2 className="plan-head__name">{tier.name}</h2>
              <p className="plan-head__tagline">{tier.tagline}</p>
              <p className="plan-head__price">{tier.price}</p>
              <p className="plan-head__note">{tier.priceNote ?? " "}</p>
              <div className="plan-head__cta">
                <Button href="/sign-in" variant="solid">
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}

          {featureGroups.map((group, groupIndex) => {
            const isOpen = open.has(group.id);
            const isLast = groupIndex === featureGroups.length - 1;
            return pricingTiers.map((tier, tierIndex) => {
              const items = group.items.filter(
                (item) => item.from <= tierIndex,
              );
              const panelId = `${group.id}-${tier.id}`;
              const classes = ["plan-cell"];
              if (tier.featured) classes.push("plan-cell--featured");
              if (isLast) classes.push("plan-cell--last");
              return (
                <div key={panelId} className={classes.join(" ")}>
                  <button
                    type="button"
                    className="plan-cell__toggle"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(group.id)}
                  >
                    <span>{group.title}</span>
                    <span
                      className={
                        isOpen
                          ? "plan-cell__chevron plan-cell__chevron--open"
                          : "plan-cell__chevron"
                      }
                    >
                      <Icon name="chevron-down" size={18} />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    className={
                      isOpen
                        ? "plan-cell__panel plan-cell__panel--open"
                        : "plan-cell__panel"
                    }
                  >
                    <div className="plan-cell__panel-inner">
                      {items.length > 0 ? (
                        <ul className="plan-cell__list">
                          {items.map((item) => (
                            <li key={item.label} className="plan-cell__item">
                              <span className="plan-cell__check">
                                <Icon name="check" size={16} strokeWidth={3} />
                              </span>
                              {item.label}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="plan-cell__empty">
                          Not included in this plan
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </section>
  );
}
