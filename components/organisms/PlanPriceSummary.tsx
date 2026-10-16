"use client";

import { useCallback, useState } from "react";
import Button from "@/components/atoms/Button";
import Icon, { type IconName } from "@/components/atoms/Icon";
import Money from "@/components/atoms/Money";
import Dialog from "@/components/molecules/Dialog";
import UserStepper from "@/components/molecules/UserStepper";
import SignInForm from "@/components/organisms/SignInForm";
import SignUpForm from "@/components/organisms/SignUpForm";
import {
  formatPrice,
  healthInsuranceCover,
  volumeDiscountRate,
  type Billing,
} from "@/lib/pricing";

export interface PriceLine {
  id: string;
  icon: IconName;
  label: string;
  /** Price per user for the billing period. */
  price: number;
  oneTime?: number;
}

interface PlanPriceSummaryProps {
  ariaLabel: string;
  billing: Billing;
  users: number;
  onUsersChange: (users: number) => void;
  lines: PriceLine[];
  /** Per-user price for the billing period. */
  perUser: number;
  /** Per-user monthly price, which decides the discount and perk tiers. */
  monthlyPerUser: number;
  oneTime: number;
  emptyText: string;
  ctaLabel: string;
  /** Shown in the order confirmation. */
  planName: string;
  /** The page to come back to after signing up or in. */
  returnTo: string;
  signedIn: boolean;
}

/** Users, price lines, volume discount, total and perks for a plan. */
export default function PlanPriceSummary({
  ariaLabel,
  billing,
  users,
  onUsersChange,
  lines,
  perUser,
  monthlyPerUser,
  oneTime,
  emptyText,
  ctaLabel,
  planName,
  returnTo,
  signedIn,
}: PlanPriceSummaryProps) {
  const [open, setOpen] = useState(false);
  const [authView, setAuthView] = useState<"sign-up" | "sign-in">("sign-up");
  const close = useCallback(() => setOpen(false), []);
  const suffix = billing === "year" ? "yr" : "mo";
  const subtotal = perUser * users;
  // The one time set-up payment is part of the total, so it counts towards
  // the volume discount and the perks too.
  const billable = subtotal + oneTime;
  const qualifying = monthlyPerUser * users + oneTime;
  const discountRate = volumeDiscountRate(qualifying);
  const insuranceCover = healthInsuranceCover(qualifying);
  const discount = Math.round(billable * discountRate * 100) / 100;
  const total = billable - discount;

  return (
    <aside className="plan-aside pricing-widget" aria-label={ariaLabel}>
      <UserStepper users={users} onChange={onUsersChange} />

      {lines.length > 0 ? (
        <ul className="pricing-widget__lines">
          {lines.map((line) => (
            <li key={line.id} className="pricing-widget__line">
              <span className="pricing-widget__line-icon">
                <Icon name={line.icon} size={16} />
              </span>
              <span className="pricing-widget__line-name">
                {line.label}
                {line.oneTime ? (
                  <span className="pricing-widget__line-note">
                    + {formatPrice(line.oneTime)} one time set-up
                  </span>
                ) : null}
              </span>
              <span className="pricing-widget__line-price">
                {formatPrice(line.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pricing-widget__empty">{emptyText}</p>
      )}

      {(discount > 0 || oneTime > 0) && (
        <div className="pricing-widget__rows">
          <p className="pricing-widget__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          {oneTime > 0 && (
            <p className="pricing-widget__row">
              <span>One time set-up payment</span>
              <span>{formatPrice(oneTime)}</span>
            </p>
          )}
          {discount > 0 && (
            <p className="pricing-widget__row pricing-widget__row--discount">
              <span>Volume discount ({discountRate * 100}%)</span>
              <span>&minus;{formatPrice(discount)}</span>
            </p>
          )}
        </div>
      )}

      <div className="pricing-widget__total">
        <span className="pricing-widget__total-label">Total</span>
        <Money amount={total} unit={`first ${billing}`} />
      </div>

      {perUser > 0 && (
        <p className="pricing-widget__breakdown">
          {formatPrice(perUser)}/user/{suffix} &times; {users}{" "}
          {users === 1 ? "user" : "users"}
        </p>
      )}

      {insuranceCover > 0 && (
        <p className="pricing-widget__perk">
          <Icon name="shield-check" size={18} />
          <span>
            Plus free optional health insurance up to GHC
            {new Intl.NumberFormat("en").format(insuranceCover)}
          </span>
        </p>
      )}

      <div className="pricing-widget__cta">
        {lines.length > 0 ? (
          <Button type="button" variant="solid" onClick={() => setOpen(true)}>
            {ctaLabel}
          </Button>
        ) : (
          <Button type="button" variant="solid" disabled>
            {ctaLabel}
          </Button>
        )}
      </div>

      <Dialog
        open={open}
        onClose={close}
        label={signedIn ? "Confirm your order" : "Create an account to continue"}
      >
        {signedIn ? (
          <div className="white-panel order-confirm">
            <h2 className="order-confirm__title">Confirm your order</h2>
            <dl className="order-confirm__rows">
              <div>
                <dt>Plan</dt>
                <dd>{planName}</dd>
              </div>
              <div>
                <dt>Billing</dt>
                <dd>{billing === "year" ? "Yearly" : "Monthly"}</dd>
              </div>
              <div>
                <dt>Users</dt>
                <dd>{users}</dd>
              </div>
              {lines.length > 1 && (
                <div>
                  <dt>Features</dt>
                  <dd>{lines.map((line) => line.label).join(", ")}</dd>
                </div>
              )}
              {oneTime > 0 && (
                <div>
                  <dt>One time set-up payment</dt>
                  <dd>{formatPrice(oneTime)}</dd>
                </div>
              )}
              {discount > 0 && (
                <div>
                  <dt>Volume discount ({discountRate * 100}%)</dt>
                  <dd>&minus;{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="order-confirm__total">
                <dt>Total (first {billing})</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="order-confirm__actions">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="button" variant="solid" onClick={close}>
                Confirm order
              </Button>
            </div>
          </div>
        ) : authView === "sign-in" ? (
          <SignInForm
            lockedRole="recruiter"
            next={returnTo}
            onSwitch={() => setAuthView("sign-up")}
          />
        ) : (
          <SignUpForm
            lockedRole="recruiter"
            next={returnTo}
            onSwitch={() => setAuthView("sign-in")}
          />
        )}
      </Dialog>
    </aside>
  );
}
