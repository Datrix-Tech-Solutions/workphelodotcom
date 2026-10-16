interface MoneyProps {
  amount: number;
  /** Shown under the cents, e.g. "/ user / month". */
  unit?: string;
  showCents?: boolean;
  size?: "md" | "lg";
}

/** A price with a small currency sign and cents around a large whole number. */
export default function Money({
  amount,
  unit,
  showCents = true,
  size = "lg",
}: MoneyProps) {
  const fixed = Math.abs(amount).toFixed(2);
  const [whole, cents] = fixed.split(".");
  const wholeText = new Intl.NumberFormat("en").format(Number(whole));

  return (
    <span className={`money money--${size}`}>
      <span className="money__currency" aria-hidden="true">
        $
      </span>
      <span className="money__whole">{wholeText}</span>
      <span className="money__aside">
        {showCents && <span className="money__cents">.{cents}</span>}
        {unit && <span className="money__unit">{unit}</span>}
      </span>
      <span className="sr-only">
        {`$${wholeText}${showCents ? `.${cents}` : ""} ${unit ?? ""}`}
      </span>
    </span>
  );
}
