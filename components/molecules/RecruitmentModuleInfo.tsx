const FEATURES = [
  {
    title: "Job openings",
    text: "Build openings step by step, with screening questions, and share them.",
  },
  {
    title: "Applicant tracking",
    text: "See every applicant's profile, experience, education and documents in one place.",
  },
  {
    title: "Hiring pipeline",
    text: "Move candidates through stages you configure for your own process.",
  },
  {
    title: "Interviews",
    text: "Schedule video, phone or in-person interviews and record the outcome.",
  },
];

/** A hover/focus card listing what the recruitment module covers. */
export default function RecruitmentModuleInfo() {
  return (
    <span className="module-info">
      <button
        type="button"
        className="module-info__trigger"
        aria-describedby="module-info-card"
      >
        workphelo recruitment module.
      </button>
      <span id="module-info-card" role="tooltip" className="module-info__card">
        <span className="module-info__list">
          {FEATURES.map(({ title, text }) => (
            <span className="module-info__item" key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
