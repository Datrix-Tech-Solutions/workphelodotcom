import type { ComponentProps } from "react";
import type Icon from "@/components/atoms/Icon";

export interface Benefit {
  icon: ComponentProps<typeof Icon>["name"];
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: "trending-up",
    title: "Reduce Software Costs",
    description:
      "Replace multiple standalone applications with a single integrated platform to lower subscription and licensing expenses.",
  },
  {
    icon: "layers",
    title: "Eliminate Duplicate Data",
    description:
      "A single source of truth means no more re-entering data across disconnected systems.",
  },
  {
    icon: "users",
    title: "Improve Collaboration",
    description:
      "Departments share real-time data, breaking down silos and boosting teamwork.",
  },
  {
    icon: "bar-chart",
    title: "Enhance Reporting",
    description:
      "Consolidated, accurate reports replace fragmented spreadsheets and guesswork.",
  },
  {
    icon: "zap",
    title: "Increase Productivity",
    description:
      "One login, one platform. Employees spend less time switching tools and more time delivering results.",
  },
  {
    icon: "shield-check",
    title: "Simplify IT Administration",
    description:
      "Manage one system instead of dozens, reducing IT overhead and complexity.",
  },
];

const africaTraits: Benefit[] = [
  {
    icon: "building",
    title: "Affordable",
    description:
      "Pricing that works for businesses of every size across Africa.",
  },
  {
    icon: "settings",
    title: "Flexible",
    description:
      "Highly customizable to match your specific workflow requirements.",
  },
  {
    icon: "zap",
    title: "Easy to Setup",
    description:
      "Cloud-based with minimal setup time and no complex infrastructure.",
  },
];

export const allBenefits: Benefit[] = [...benefits, ...africaTraits];
