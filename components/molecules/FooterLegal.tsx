import Link from "next/link";
import LanguageSelect from "@/components/molecules/LanguageSelect";
import { legalLinks } from "@/lib/navigation";

// TODO: replace with the real Datrix site URL once provided
const DATRIX_URL = "https://www.datrixtechsolutions.com";

export default function FooterLegal() {
  return (
    <div className="footer-legal">
      <div className="footer-legal__start">
        <p className="footer-legal__copyright">
          &copy; {new Date().getFullYear()} WorkPhelo. All rights reserved.
        </p>
        <p className="footer-legal__copyright">
          Powered by{" "}
          <a
            href={DATRIX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-links__link"
          >
            Datrix Tech
          </a>
        </p>
      </div>
      <ul className="footer-legal__list">
        {legalLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="footer-links__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="footer-legal__end">
        <LanguageSelect />
      </div>
    </div>
  );
}
