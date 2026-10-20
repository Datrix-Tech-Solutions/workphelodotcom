import type { Metadata } from "next";
import LegalDocument from "@/components/organisms/LegalDocument";
import {
  privacyAcknowledgement,
  privacyEffectiveDate,
  privacyIntro,
  privacyLastUpdated,
  privacySections,
} from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Workphelo",
  description: "How WorkPhelo collects, uses, stores and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      effectiveDate={privacyEffectiveDate}
      lastUpdated={privacyLastUpdated}
      intro={privacyIntro}
      sections={privacySections}
      closing={privacyAcknowledgement}
    />
  );
}
