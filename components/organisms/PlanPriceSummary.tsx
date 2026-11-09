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

/** One section of a plan, billed on its own number of users. */
export interface PriceGroup {
  id: string;
  icon: IconName;
  label: string;
  users: number;
  /** Price per user for the billing period. */
  perUser: number;
  /** Per-user monthly price, which decides the discount and perk tiers. */
  monthlyPerUser: number;
  /** The features chosen in the group, listed under it. */
  features: string[];
}

interface PlanPriceSummaryProps {
  ariaLabel: string;
  billing: Billing;
  groups: PriceGroup[];
  /** Shows a stepper above the groups, for plans with one user count. */
  users?: number;
  onUsersChange?: (users: number) => void;
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
  groups,
  users,
  onUsersChange,
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const close = useCallback(() => {
    setOpen(false);
    setStep("order");
    setError("");
  }, []);
  const subtotal = groups.reduce((sum, g) => sum + g.perUser * g.users, 0);
  // The one time set-up payment is part of the total, so it counts towards
  // the volume discount and the perks too.
  const billable = subtotal + oneTime;
  const qualifying =
    groups.reduce((sum, g) => sum + g.monthlyPerUser * g.users, 0) + oneTime;
  const discountRate = volumeDiscountRate(qualifying);
  const insuranceCover = healthInsuranceCover(qualifying);
  const discount = Math.round(billable * discountRate * 100) / 100;
  const total = billable - discount;
  const period = billing === "year" ? "year" : "month";
  const recurring = Math.round(subtotal * (1 - discountRate) * 100) / 100;

  /** Emails the order to the WorkPhelo team and a confirmation to the requester. */
  async function confirmOrder() {
    if (sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          planName,
          billing,
          groups: groups.map((g) => ({
            title: g.label,
            users: g.users,
            features: g.features,
            subtotal: Math.round(g.perUser * g.users * 100) / 100,
          })),
          oneTime,
          discount,
          discountRate,
          insuranceCover,
          total,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(
          body?.error ?? "We couldn't send your order. Please try again.",
        );
        return;
      }
      setStep("success");
    } catch {
      setError("We couldn't send your order. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <aside className="plan-aside pricing-widget" aria-label={ariaLabel}>
      <header className="pricing-widget__header">
        <h2 className="pricing-widget__title">Plan summary</h2>
        {groups.length > 0 && (
          <span className="pricing-widget__count">
            {groups.length} {groups.length === 1 ? "Module" : "Modules"}
          </span>
        )}
      </header>

      {users !== undefined && onUsersChange && (
        <UserStepper users={users} onChange={onUsersChange} />
      )}

      {groups.length > 0 ? (
        <ul className="pricing-widget__lines">
          {groups.map((group) => (
            <li
              key={group.id}
              className="pricing-widget__line pricing-widget__line--group"
            >
              <span className="pricing-widget__line-icon">
                <Icon name={group.icon} size={16} />
              </span>
              <span className="pricing-widget__line-name">
                {group.label}
                <span className="pricing-widget__line-note">
                  {group.users} {group.users === 1 ? "user" : "users"} &times;{" "}
                  {formatPrice(group.perUser)}
                </span>
                {group.features.length > 0 && (
                  <ul className="pricing-widget__features">
                    {group.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                )}
              </span>
              <span className="pricing-widget__line-price">
                {formatPrice(group.perUser * group.users)}
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
        {subtotal > 0 ? (
          <>
            <Money amount={recurring} unit={`/ ${period}`} />
            <span className="pricing-widget__total-sub">
              {formatPrice(total)} first {period}, including set-up
            </span>
          </>
        ) : (
          <Money amount={total} unit={`first ${billing}`} />
        )}
      </div>

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
        {groups.length > 0 ? (
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
            void confirmOrder();
          }}
        >
          <section
            className="order-confirm__details"
            aria-label="Order details"
          >
            <h2 className="order-confirm__title">Order summary</h2>
            {groups.map(
              (group) =>
                group.features.length > 0 && (
                  <div key={group.id} className="order-confirm__features">
                    <p className="order-confirm__features-title">
                      {group.label} ({group.users}{" "}
                      {group.users === 1 ? "user" : "users"})
                    </p>
                    <ul className="order-confirm__features-list">
                      {group.features.map((feature) => (
                        <li key={feature}>
                          <Icon name="check" size={12} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
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
              {groups.map((group) => (
                <div key={group.id}>
                  <dt>{group.label} users</dt>
                  <dd>{group.users}</dd>
                </div>
              ))}
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
            {error && (
              <p className="sign-in__error" role="alert">
                {error}
              </p>
            )}
            <div className="order-confirm__actions">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid" disabled={sending}>
                {sending ? "Sending…" : "Confirm order"}
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </aside>
  );
}
