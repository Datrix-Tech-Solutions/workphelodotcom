import type { Metadata } from "next";
import LegalDocument from "@/components/organisms/LegalDocument";
import {
  termsAcceptance,
  termsEffectiveDate,
  termsIntro,
  termsLastUpdated,
  termsSections,
} from "@/lib/terms";

export const metadata: Metadata = {
  title: "Terms of Service | Workphelo",
  description:
    "The terms that govern your access to and use of the WorkPhelo platform.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      effectiveDate={termsEffectiveDate}
      lastUpdated={termsLastUpdated}
      intro={termsIntro}
      sections={termsSections}
      closing={termsAcceptance}
    />
  );
}
