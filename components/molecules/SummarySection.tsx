import Button from "@/components/atoms/Button";

interface SummarySectionProps {
  title: string;
  rows: { label: string; value?: string }[];
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
          <div key={row.label} className="summary__row">
            <dt className="summary__label">{row.label}</dt>
            <dd className="summary__value">{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
