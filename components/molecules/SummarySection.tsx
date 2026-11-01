import Button from "@/components/atoms/Button";

interface SummarySectionProps {
  title: string;
  /** A wide row spans both columns, and a new line in its value starts a new line. */
  rows: {
    label: string;
    value?: string;
    wide?: boolean;
    /** Shown as a list of entries, each with a title, a subtitle and a period. */
    entries?: { title: string; subtitle?: string; period?: string }[];
  }[];
  onEdit: () => void;
}

export default function SummarySection({
  title,
  rows,
  onEdit,
}: SummarySectionProps) {
  return (
    <section className="summary">
      <header className="summary__header">
        <h3 className="summary__title">{title}</h3>
        <Button variant="soft" type="button" onClick={onEdit}>
          Edit
        </Button>
      </header>
      <dl className="summary__list">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`summary__row${row.wide || row.entries ? " summary__row--wide" : ""}`}
          >
            <dt className="summary__label">{row.label}</dt>
            {row.entries && row.entries.length > 0 ? (
              <dd className="summary__entries">
                {row.entries.map((entry, i) => (
                  <div key={i} className="summary__entry">
                    <p className="summary__entry-title">
                      {entry.title || "Untitled"}
                    </p>
                    {entry.subtitle && (
                      <p className="summary__entry-subtitle">
                        {entry.subtitle}
                      </p>
                    )}
                    {entry.period && (
                      <p className="summary__entry-period">{entry.period}</p>
                    )}
                  </div>
                ))}
              </dd>
            ) : (
              <dd
                className={`summary__value${row.value ? "" : " summary__value--empty"}`}
              >
                {row.value || "—"}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
