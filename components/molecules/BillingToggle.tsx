import Link from "next/link";
import { pricingHref, type Billing } from "@/lib/pricing";

interface BillingToggleProps {
  billing: Billing;
  plan?: string;
}

const options: { value: Billing; label: string }[] = [
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
];

export default function BillingToggle({ billing, plan }: BillingToggleProps) {
  return (
    <nav className="billing-toggle" aria-label="Billing period">
      {options.map((option) => (
        <Link
          key={option.value}
          href={pricingHref(plan, option.value)}
          scroll={false}
          className={
            option.value === billing
              ? "billing-toggle__option billing-toggle__option--active"
              : "billing-toggle__option"
          }
          aria-current={option.value === billing ? "true" : undefined}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
