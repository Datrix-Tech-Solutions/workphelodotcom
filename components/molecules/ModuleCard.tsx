import Image from "@/components/atoms/Image";
import Icon from "@/components/atoms/Icon";
import type { ProductModule } from "@/lib/modules";

export default function ModuleCard({
  icon,
  title,
  description,
  image,
  comingSoon,
}: ProductModule) {
  return (
    <article className="module-card">
      <div className="module-card__media">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 600px) 100vw, 33vw"
          className="module-card__image"
        />
      </div>
      <div className="module-card__body">
        <span className="module-card__icon" aria-hidden="true">
          <Icon name={icon} size={24} />
        </span>
        <h3 className="module-card__title">
          {title}
          {comingSoon && (
            <span className="module-card__badge">Coming soon</span>
          )}
        </h3>
        <p className="module-card__description">{description}</p>
      </div>
    </article>
  );
}
