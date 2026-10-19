import Link from "next/link";
import Icon from "@/components/atoms/Icon";
import Reveal from "@/components/atoms/Reveal";
import Slideshow from "@/components/molecules/Slideshow";
import { getSectionImages } from "@/lib/productImages";
import type { ProductSection } from "@/lib/productPages";

export default function ProductSections({
  slug,
  sections,
}: {
  slug: string;
  sections: ProductSection[];
}) {
  return (
    <>
      {sections.length > 1 && (
        <nav className="product-nav" aria-label="On this page">
          <ul className="product-nav__list">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="product-nav__link">
                  <Icon name={section.icon} size={16} />
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="product-sections">
        {sections.map((section, index) => {
          const images = getSectionImages(slug, section.id);
          return (
            <section
              key={section.id}
              id={section.id}
              className={
                index % 2 === 1
                  ? "product-section product-section--flip"
                  : "product-section"
              }
              aria-labelledby={`${section.id}-title`}
            >
              <Reveal className="product-section__media">
                {images.length > 0 ? (
                  <div className="product-shot">
                    <div className="product-shot__bar" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <Slideshow
                      images={images}
                      label={`${section.title} in Workphelo`}
                    />
                  </div>
                ) : (
                  <div className="product-panel" aria-hidden="true">
                    <span className="product-panel__icon">
                      <Icon name={section.icon} size={40} strokeWidth={1.5} />
                    </span>
                    <ul className="product-panel__chips">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
              <Reveal className="product-section__body" delay={80}>
                <span className="product-section__backdrop" aria-hidden="true">
                  <Icon name={section.icon} size={288} strokeWidth={0.6} />
                </span>
                <h2
                  id={`${section.id}-title`}
                  className="product-section__title"
                >
                  {section.title}
                </h2>
                <p className="product-section__description">
                  {section.description}
                </p>
                <ul className="product-section__items">
                  {section.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={14} strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {section.link && (
                  <p className="product-section__link">
                    {section.link.note}{" "}
                    <Link href={section.link.href}>
                      {section.link.label} &rarr;
                    </Link>
                  </p>
                )}
              </Reveal>
            </section>
          );
        })}
      </div>
    </>
  );
}
