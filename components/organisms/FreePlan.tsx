import Icon, { type IconName } from "@/components/atoms/Icon";
import RecruiterTrial from "@/components/organisms/RecruiterTrial";

const abilities: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "file",
    title: "Post jobs",
    description:
      "Publish openings with the role, location, job type, pay and requirements, and have them appear on the Workphelo job board.",
  },
  {
    icon: "users",
    title: "View applicants",
    description:
      "See who has applied to each of your jobs, along with their details and documents, and keep track of applicant numbers from your dashboard.",
  },
];

export default function FreePlan() {
  return (
    <>
      <article className="plan-details" aria-labelledby="free-title">
        <header className="plan-details__header">
          <h2 id="free-title" className="plan-details__title">
            What you can do as a recruiter
          </h2>
        </header>
        <ul className="premium-modules">
          {abilities.map((ability) => (
            <li key={ability.title} className="premium-module">
              <span className="premium-module__icon">
                <Icon name={ability.icon} size={20} />
              </span>
              <div>
                <h3 className="premium-module__title">{ability.title}</h3>
                <p className="premium-module__description">
                  {ability.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>
      <RecruiterTrial />
    </>
  );
}
