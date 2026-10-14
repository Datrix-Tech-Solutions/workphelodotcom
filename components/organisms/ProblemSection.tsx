import Image from "@/components/atoms/Image";
import Reveal from "@/components/atoms/Reveal";

export default function ProblemSection() {
  return (
    <section className="problem" aria-labelledby="problem-title">
      <Reveal className="problem__text reveal--from-left" delay={300}>
        <p className="problem__label">The Problem</p>
        <h2 id="problem-title" className="problem__title">
          Why Workphelo Is Better Than Traditional ERP Systems
        </h2>
        <p className="problem__body">
          Most organizations in Ghana and Africa operate with multiple
          disconnected software solutions for HR, accounting, sales, operations,
          fleet management, and reporting. This creates inefficiencies,
          duplicate data entry, poor visibility, and higher operational costs.
        </p>
        <p className="problem__body">
          Workphelo solves this by bringing all critical business functions into
          a single integrated platform. Unlike traditional setups where
          employees switch between multiple applications for different tasks,
          Workphelo enables teams to work from a single platform with one login,
          improving productivity and collaboration across departments.
        </p>
      </Reveal>
      <Reveal className="problem__media reveal--from-right" delay={600}>
        <div className="problem__image">
          <Image
            src="/wpimg.jpg"
            alt="Workphelo team working together"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className="problem__image-img"
          />
        </div>
      </Reveal>
    </section>
  );
}
