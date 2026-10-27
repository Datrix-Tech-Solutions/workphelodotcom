import Image from "@/components/atoms/Image";
import Reveal from "@/components/atoms/Reveal";

export default function FeatureSplit() {
  return (
    <section className="feature-split" aria-labelledby="feature-split-title">
      <Reveal className="feature-split__text reveal--from-left" delay={200}>
        <h2 id="feature-split-title" className="feature-split__title">
          Grow beyond your career.
        </h2>
        <p className="feature-split__body">
          Success isn't just about getting hired—it's about growing in the workplace. 
          Life at Work brings together practical career advice, workplace etiquette, 
          productivity tips, communication skills, leadership insights, 
          and professional development resources to help you build a successful and fulfilling career.
        </p>
      </Reveal>
      <Reveal className="feature-split__media reveal--from-right" delay={400}>
        <Image
          src="/landing/images/homepageimg.png"
          alt="Professionals collaborating"
          width={607}
          height={421}
          sizes="(max-width: 800px) 100vw, 50vw"
          className="feature-split__image"
        />
      </Reveal>
    </section>
  );
}
