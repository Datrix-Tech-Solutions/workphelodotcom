import Link from "next/link";
import { legalLinks } from "@/lib/navigation";

export default function FooterLegal() {
  return (
    <div className="footer-legal">
      <p className="footer-legal__copyright">
        &copy; {new Date().getFullYear()} WorkPhelo. All rights reserved.
      </p>
      <ul className="footer-legal__list">
        {legalLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="footer-links__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
