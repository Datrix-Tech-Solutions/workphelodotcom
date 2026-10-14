interface CheckListProps {
  legend: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  error?: string;
  hint?: string;
}

export default function CheckList({
  legend,
  items,
  selected,
  onChange,
  required,
  error,
  hint,
}: CheckListProps) {
  const toggle = (item: string) =>
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item],
    );

  return (
    <fieldset className="form-field">
      <legend className="form-field__label">
        {legend}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      {hint && <span className="form-field__hint">{hint}</span>}
      <div className="check-list">
        {items.map((item) => (
          <label key={item} className="check-list__item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
            />{" "}
            {item}
          </label>
        ))}
      </div>
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}
