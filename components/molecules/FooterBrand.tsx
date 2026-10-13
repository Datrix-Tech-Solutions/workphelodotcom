import Link from "next/link";
import WorkPheloWordmark from "@/components/atoms/WorkPheloWordmark";

export default function FooterBrand() {
  return (
    <div className="footer-brand">
      <Link href="/" aria-label="WorkPhelo home" className="footer-brand__logo">
        <WorkPheloWordmark />
      </Link>
      <p className="footer-brand__description">
        Helping professionals discover meaningful careers while helping
        companies find exceptional talent.
      </p>
    </div>
  );
}
