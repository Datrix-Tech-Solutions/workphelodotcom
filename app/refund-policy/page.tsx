import type { Metadata } from "next";
import LegalDocument from "@/components/organisms/LegalDocument";
import {
  refundAcknowledgement,
  refundEffectiveDate,
  refundIntro,
  refundLastUpdated,
  refundSections,
} from "@/lib/refund";

export const metadata: Metadata = {
  title: "Refund Policy | Workphelo",
  description: "When WorkPhelo subscriptions may be eligible for a refund.",
};

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund Policy"
      effectiveDate={refundEffectiveDate}
      lastUpdated={refundLastUpdated}
      intro={refundIntro}
      sections={refundSections}
      closing={refundAcknowledgement}
    />
  );
}
