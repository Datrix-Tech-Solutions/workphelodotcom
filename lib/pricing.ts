import type { IconName } from "@/components/atoms/Icon";

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  icon: IconName;
  price: string;
  /** Priced as every Custom feature together, per user, for the billing period. */
  priceFromFeatures?: boolean;
  priceNote?: string;
  cta: string;
  href: string;
  featured?: boolean;
  summary: string;
  groups: FeatureGroup[];
}

export interface FeatureGroup {
  title: string;
  items: string[];
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free plan",
    icon: "zap",
    tagline: "Get started with the basics",
    price: "Free",
    cta: "Get started",
    href: "/sign-in",
    summary: "Everything you need to start hiring, at no cost.",
    groups: [{ title: "Recruitment", items: ["Hiring"] }],
  },
  {
    id: "premium",
    name: "Premium",
    icon: "layers",
    tagline: "The complete Workphelo platform",
    // yearly
    price: "$10/month/user",
    priceFromFeatures: true,
    cta: "Choose plan",
    href: "/sign-in",
    featured: true,
    summary:
      "Every Workphelo module, from recruitment to accounting, in one platform.",
    groups: [
      { title: "Recruitment", items: ["Hiring", "Vetting"] },
      {
        title: "Employee Management",
        items: ["Onboarding and off-boarding", "Leave management"],
      },
      {
        title: "Payroll Management",
        items: ["Manage payroll", "Payroll linked to accounting"],
      },
      {
        title: "Employee Performance",
        items: ["Manage employee performance"],
      },
      { title: "Project Management", items: ["Create projects"] },
      {
        title: "Fleet Management",
        items: ["Manage fleets", "Real-time vehicle tracking"],
      },
      {
        title: "Campaign Management",
        items: ["Client management", "Manage campaigns"],
      },
      {
        title: "Prospecting",
        items: ["Prospect management", "Schedule appointments and follow-ups"],
      },
      {
        title: "Accounting",
        items: ["Manage entries", "Manage budgets and cost centres"],
      },
    ],
  },
  {
    id: "custom",
    name: "Custom",
    icon: "settings",
    tagline: "Built around your organisation",
    price: "Custom",
    priceNote: "Tailored to your needs",
    cta: "Talk to us",
    href: "/sign-in",
    summary:
      "Everything in Premium, shaped around how your organisation works.",
    groups: [
      {
        title: "Everything in Premium",
        items: ["All modules and features"],
      },
      {
        title: "Operations",
        items: ["Personalized company operations software"],
      },
    ],
  },
];

export interface CustomFeature {
  id: string;
  label: string;
  icon: IconName;
  /** USD per user per month. */
  monthly: number;
  /** USD per user per month when billed yearly. The year is charged in full. */
  yearly: number;
  /** Extra one-off USD payment when the feature is added, not per user. */
  oneTime?: number;
  /** Ids of features that are selected along with this one. */
  requires?: string[];
}

/** The modules a Custom plan can be built from. */
export const customFeatures: CustomFeature[] = [
  {
    id: "recruitment",
    label: "Recruitment",
    icon: "users",
    monthly: 0.5,
    yearly: 0.5,
  },
  {
    id: "file-storage",
    label: "File storage",
    icon: "folder",
    monthly: 1,
    yearly: 0.5,
  },
  {
    id: "smart-scheduling",
    label: "Smart scheduling",
    icon: "calendar",
    monthly: 0,
    yearly: 0,
  },
  {
    id: "payroll",
    label: "Payroll management",
    icon: "wallet",
    monthly: 0.5,
    yearly: 0.5,
    oneTime: 10,
  },
  {
    id: "performance",
    label: "Employee performance",
    icon: "trending-up",
    monthly: 0.5,
    yearly: 0.5,
  },
  {
    id: "projects",
    label: "Project management",
    icon: "clipboard-check",
    monthly: 0.5,
    yearly: 0.5,
  },
  {
    id: "assets",
    label: "Asset management",
    icon: "package",
    monthly: 0.5,
    yearly: 0.5,
  },
  {
    id: "marketing-crm",
    label: "Marketing CRM",
    icon: "target",
    monthly: 1,
    yearly: 1,
  },
  {
    id: "fleet",
    label: "Fleet management",
    icon: "truck",
    monthly: 1,
    yearly: 1,
    requires: ["assets"],
  },
  {
    id: "campaigns",
    label: "Campaign management",
    icon: "megaphone",
    monthly: 1,
    yearly: 0.5,
    oneTime: 10,
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: "calculator",
    monthly: 3,
    yearly: 2.5,
    oneTime: 10,
  },
];

const MONTHS_PER_YEAR = 12;

/** Price per user for the billing period: a month, or the full year. */
export function featurePrice(feature: CustomFeature, billing: Billing): number {
  return billing === "year"
    ? feature.yearly * MONTHS_PER_YEAR
    : feature.monthly;
}

export function formatPrice(amount: number): string {
  return amount === 0 ? "Free" : `$${amount.toFixed(2)}`;
}

export type Billing = "month" | "year";

export function pricingHref(plan?: string, billing: Billing = "month"): string {
  const params = new URLSearchParams();
  if (plan) params.set("plan", plan);
  if (billing === "year") params.set("billing", "year");
  const qs = params.toString();
  return qs ? `/pricing?${qs}` : "/pricing";
}

/** Premium includes every feature, so it is their prices added together. */
export function allFeaturesPrice(billing: Billing): number {
  return customFeatures.reduce((sum, f) => sum + featurePrice(f, billing), 0);
}

export function allFeaturesOneTime(): number {
  return customFeatures.reduce((sum, f) => sum + (f.oneTime ?? 0), 0);
}

/**
 * Volume discounts, keyed on the monthly price of the selection (users times
 * the monthly feature prices), highest tier first. The rate is taken off the
 * recurring total whichever billing period is shown.
 */
const volumeDiscounts = [
  { above: 1000, rate: 0.2 },
  { above: 200, rate: 0.1 },
  { above: 100, rate: 0.05 },
];

export function volumeDiscountRate(monthlyTotal: number): number {
  return volumeDiscounts.find((tier) => monthlyTotal > tier.above)?.rate ?? 0;
}

/** Free optional health insurance cover (GHC), keyed on the same monthly price. */
const healthInsuranceTiers = [
  { above: 20, cover: 3600 },
  { above: 15, cover: 2400 },
  { above: 10, cover: 1200 },
];

export function healthInsuranceCover(monthlyTotal: number): number {
  return (
    healthInsuranceTiers.find((tier) => monthlyTotal > tier.above)?.cover ?? 0
  );
}

/** The modules Premium includes; descriptions come from the products page. */
export const premiumModuleTitles = [
  { label: "HR", productTitle: "HR Management" },
  { label: "Marketing", productTitle: "Marketing & Business Development" },
  { label: "Accounting", productTitle: "Accounting" },
];
