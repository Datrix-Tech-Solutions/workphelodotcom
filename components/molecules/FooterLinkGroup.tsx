import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinkGroup({
  title,
  links,
}: FooterLinkGroupProps) {
  return (
    <nav aria-label={title} className="footer-links">
      <h3 className="footer-links__title">{title}</h3>
      <ul className="footer-links__list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="footer-links__link"
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
