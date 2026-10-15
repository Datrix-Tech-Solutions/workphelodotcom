export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceNote?: string;
  cta: string;
  featured?: boolean;
}

export interface FeatureGroup {
  id: string;
  title: string;
  items: { label: string; from: number }[];
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free plan",
    tagline: "Get started with the basics",
    price: "Free",
    cta: "Get started",
  },
  {
    id: "essentials",
    name: "Essentials",
    tagline: "Streamline your people operations",
    price: "Coming soon",
    priceNote: "Pricing to be announced",
    cta: "Choose plan",
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Grow with finance and field tools",
    price: "Coming soon",
    priceNote: "Pricing to be announced",
    cta: "Choose plan",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The complete Workphelo platform",
    price: "Coming soon",
    priceNote: "Pricing to be announced",
    cta: "Choose plan",
    featured: true,
  },
];

// Which tier each feature starts at is a first pass; adjust `from` as needed.
export const featureGroups: FeatureGroup[] = [
  {
    id: "employee-management",
    title: "Employee Management",
    items: [
      { label: "Onboarding and off-boarding", from: 0 },
      { label: "Leave management", from: 0 },
    ],
  },
  {
    id: "recruitment",
    title: "Recruitment",
    items: [
      { label: "Hiring", from: 1 },
      { label: "Vetting", from: 2 },
    ],
  },
  {
    id: "payroll",
    title: "Payroll Management",
    items: [
      { label: "Manage payroll", from: 1 },
      { label: "Payroll linked to accounting", from: 2 },
    ],
  },
  {
    id: "performance",
    title: "Employee Performance",
    items: [{ label: "Manage employee performance", from: 1 }],
  },
  {
    id: "projects",
    title: "Project Management",
    items: [{ label: "Create projects", from: 1 }],
  },
  {
    id: "fleet",
    title: "Fleet Management",
    items: [
      { label: "Manage fleets", from: 2 },
      { label: "Real-time vehicle tracking", from: 3 },
    ],
  },
  {
    id: "campaigns",
    title: "Campaign Management",
    items: [
      { label: "Client management", from: 2 },
      { label: "Manage campaigns", from: 2 },
    ],
  },
  {
    id: "prospecting",
    title: "Prospecting",
    items: [
      { label: "Prospect management", from: 2 },
      { label: "Schedule appointments and follow-ups", from: 3 },
    ],
  },
  {
    id: "accounting",
    title: "Accounting",
    items: [
      { label: "Manage entries", from: 1 },
      { label: "Manage budgets and cost centres", from: 2 },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    items: [{ label: "Personalized company operations software", from: 3 }],
  },
];
