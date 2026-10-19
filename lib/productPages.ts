import type { IconName } from "@/components/atoms/Icon";

export interface ProductSection {
  /** Anchor id, so other pages can link straight to the section. */
  id: string;
  title: string;
  icon: IconName;
  description: string;
  items: string[];
  /** Another page this section builds on or feeds into. */
  link?: { label: string; href: string; note: string };
}

export interface ProductPage {
  slug: string;
  /** Matches a title in productModules. */
  moduleTitle: string;
  heading: string;
  headingAccent: string;
  intro: string;
  sections: ProductSection[];
}

export const productPages: ProductPage[] = [
  {
    slug: "hrm",
    moduleTitle: "HR Management",
    heading: "Human Resource",
    headingAccent: "Management.",
    intro:
      "Employee records, leave and attendance, recruitment, payroll and self-service in one place.",
    sections: [
      {
        id: "employee-management",
        title: "Employee management",
        icon: "users",
        description:
          "Every employee's records, time away and performance in one directory.",
        items: [
          "Onboarding and off-boarding",
          "Leave management",
          "Manage employee performance",
        ],
      },
      {
        id: "recruitment",
        title: "Recruitment",
        icon: "user-plus",
        description:
          "Find, screen and bring in the right people, from the first application to the offer.",
        items: ["Hiring", "Vetting"],
      },
      {
        id: "payroll",
        title: "Payroll management",
        icon: "wallet",
        description: "Run payroll on time and keep it in step with the books.",
        items: ["Manage payroll", "Payroll linked to accounting"],
        link: {
          label: "Accounting",
          href: "/products/accounting",
          note: "Payroll posts straight to your accounts.",
        },
      },
      {
        id: "projects",
        title: "Project management",
        icon: "clipboard-check",
        description: "Plan work, assign it and keep teams on track.",
        items: ["Create projects"],
      },
      {
        id: "asset-management",
        title: "Asset management",
        icon: "package",
        description:
          "Know what the company owns, what condition it is in and who has it.",
        items: ["Register and track company assets"],
        link: {
          label: "Fleet management",
          href: "/products/marketing#fleet-management",
          note: "Fleet management builds on your assets.",
        },
      },
    ],
  },
  {
    slug: "marketing",
    moduleTitle: "Marketing & Business Development",
    heading: "Marketing &",
    headingAccent: "Business Development.",
    intro:
      "Track leads, opportunities and the sales pipeline, and keep customer follow-ups on schedule.",
    sections: [
      {
        id: "campaign-management",
        title: "Campaign management",
        icon: "megaphone",
        description: "Plan campaigns and see what they bring in.",
        items: ["Client management", "Manage campaigns"],
      },
      {
        id: "prospecting",
        title: "Prospecting",
        icon: "target",
        description: "Turn leads into customers without dropping the thread.",
        items: ["Prospect management", "Schedule appointments and follow-ups"],
      },
      {
        id: "fleet-management",
        title: "Fleet management",
        icon: "truck",
        description: "Run the vehicles that serve your customers.",
        items: ["Manage fleets", "Real-time vehicle tracking"],
        link: {
          label: "Asset management",
          href: "/products/hrm#asset-management",
          note: "Vehicles are company assets, so Fleet management needs Asset management from HR.",
        },
      },
    ],
  },
  {
    slug: "accounting",
    moduleTitle: "Accounting",
    heading: "Accounting",
    headingAccent: "Software.",
    intro:
      "General ledger, payables and receivables, banking, budgets and financial reporting across branches.",
    sections: [
      {
        id: "entries",
        title: "Entries",
        icon: "calculator",
        description: "Record every transaction in one ledger.",
        items: ["Manage entries"],
      },
      {
        id: "budgets",
        title: "Budgets and cost centres",
        icon: "bar-chart",
        description: "Plan spending and see it by branch or team.",
        items: ["Manage budgets and cost centres"],
      },
      {
        id: "payroll-link",
        title: "Payroll link",
        icon: "wallet",
        description: "Payroll from HR flows into the books.",
        items: ["Payroll linked to accounting"],
        link: {
          label: "Payroll management",
          href: "/products/hrm#payroll",
          note: "Payroll is run from HR Management.",
        },
      },
    ],
  },
  {
    slug: "company-operations",
    moduleTitle: "Operations",
    heading: "Company Operations",
    headingAccent: "Software.",
    intro:
      "Industry-specific workflows for insurance, healthcare, education and manufacturing.",
    sections: [
      {
        id: "operations",
        title: "Personalized operations",
        icon: "settings",
        description: "Software shaped around how your organisation works.",
        items: [
          "Insurance",
          "Healthcare",
          "Education",
          "Manufacturing",
          "Personalized company operations software",
        ],
      },
    ],
  },
];

export function getProductPage(slug: string): ProductPage | undefined {
  return productPages.find((page) => page.slug === slug);
}
