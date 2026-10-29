"use client";

import { useCallback, useState } from "react";
import Button from "@/components/atoms/Button";
import Icon, { type IconName } from "@/components/atoms/Icon";
import Input from "@/components/atoms/Input";
import Money from "@/components/atoms/Money";
import Dialog from "@/components/molecules/Dialog";
import { SuccessModal } from "@/components/molecules/SuccessModal";
import UserStepper from "@/components/molecules/UserStepper";
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
  /** Shown instead of the formatted price, e.g. "$0.00" rather than "Free". */
  priceText?: string;
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
}: PlanPriceSummaryProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [step, setStep] = useState<"order" | "success">("order");
  const close = useCallback(() => {
    setOpen(false);
    setStep("order");
  }, []);
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
  const period = billing === "year" ? "year" : "month";
  const recurring = Math.round(subtotal * (1 - discountRate) * 100) / 100;

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
              <span className="pricing-widget__line-name">{line.label}</span>
              <span className="pricing-widget__line-price">
                {line.priceText ?? formatPrice(line.price)}
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

      <SuccessModal
        isOpen={open && step === "success"}
        onClose={close}
        title="Order confirmed"
        message={`Thank you, ${name}. We'll email the order details to ${email}.`}
        actionLabel="Close"
      />

      <Dialog
        open={open && step !== "success"}
        onClose={close}
        label="Confirm your order"
      >
        <form
          className="white-panel order-confirm"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("success");
          }}
        >
          <section
            className="order-confirm__details"
            aria-label="Order details"
          >
            <h2 className="order-confirm__title">Order summary</h2>
            {lines.length > 0 && (
              <div className="order-confirm__features">
                <p className="order-confirm__features-title">
                  Included features ({lines.length})
                </p>
                <ul className="order-confirm__features-list">
                  {lines.map((line) => (
                    <li key={line.id}>
                      <Icon name="check" size={12} />
                      {line.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <dl className="order-confirm__rows">
              <div>
                <dt>Plan</dt>
                <dd>{planName}</dd>
              </div>
              <div>
                <dt>Billing cycle</dt>
                <dd>{billing === "year" ? "Yearly" : "Monthly"}</dd>
              </div>
              <div>
                <dt>Users</dt>
                <dd>{users}</dd>
              </div>
              {oneTime > 0 && (
                <div>
                  <dt>One time set-up payment (billed once today)</dt>
                  <dd>{formatPrice(oneTime)}</dd>
                </div>
              )}
              {subtotal > 0 && (
                <div>
                  <dt>First {period} subscription</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
              )}
              {discount > 0 && (
                <div>
                  <dt>Volume discount ({discountRate * 100}%)</dt>
                  <dd>&minus;{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="order-confirm__total">
                <dt>Total due today</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            {recurring > 0 && (
              <p className="pricing-widget__perk order-confirm__recurring">
                <span>
                  {formatPrice(recurring)} billed every {period}
                </span>
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
          </section>
          <div className="order-confirm__form">
            <div className="order-confirm__fields">
              <label className="sign-in__field">
                <span className="sign-in__label">Name</span>
                <Input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="sign-in__input"
                />
              </label>
              <label className="sign-in__field">
                <span className="sign-in__label">Email</span>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sign-in__input"
                />
              </label>
              <label className="sign-in__field">
                <span className="sign-in__label">Company</span>
                <Input
                  type="text"
                  name="company"
                  autoComplete="organization"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="sign-in__input"
                />
              </label>
            </div>
            <div className="order-confirm__actions">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" variant="solid">
                Confirm order
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </aside>
  );
}
