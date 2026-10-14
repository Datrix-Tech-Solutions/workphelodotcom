import type { ComponentProps } from "react";
import type Icon from "@/components/atoms/Icon";

export interface ProductModule {
  icon: ComponentProps<typeof Icon>["name"];
  title: string;
  description: string;
  image: string;
  comingSoon?: boolean;
}

export const productModules: ProductModule[] = [
  {
    icon: "users",
    title: "HR Management",
    image: "/products/modules/hr-employees.png",
    description:
      "Employee records, leave and attendance, recruitment, payroll and self-service in one place.",
  },
  {
    icon: "megaphone",
    title: "Marketing & Business Development",
    image: "/products/modules/mkt-leads.png",
    description:
      "Track leads, opportunities and the sales pipeline, and keep customer follow-ups on schedule.",
  },
  {
    icon: "calculator",
    title: "Accounting",
    image: "/products/modules/acc-ledger.png",
    description:
      "General ledger, payables and receivables, banking, budgets and financial reporting across branches.",
  },
  {
    icon: "settings",
    title: "Operations",
    image: "/products/modules/ops-process.png",
    description:
      "Industry-specific workflows for insurance, healthcare, education and manufacturing.",
  },
  {
    icon: "sparkles",
    title: "Agentic AI",
    image: "/products/modules/agentic-ai.png",
    description:
      "AI agents that work alongside your teams, automating tasks and surfacing insights across every department.",
    comingSoon: true,
  },
];
