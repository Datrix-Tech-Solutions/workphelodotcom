import Icon from "@/components/atoms/Icon";
import type { Benefit } from "@/lib/benefits";

export default function BenefitCard({ icon, title, description }: Benefit) {
  return (
    <article className="benefit-card">
      <span className="benefit-card__icon" aria-hidden="true">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="benefit-card__title">{title}</h3>
      <p className="benefit-card__description">{description}</p>
    </article>
  );
}
