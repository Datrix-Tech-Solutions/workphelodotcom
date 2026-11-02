import VerifiedMark from "@/components/atoms/VerifiedMark";

/** A company name; when WorkPhelo has verified it, the check mark follows and hovering either shows who verified it. */
export default function VerifiedName({
  name,
  verified,
}: {
  name: string;
  verified: boolean;
}) {
  // A long name is cut with an ellipsis; hovering shows it in full.
  const text = (
    <span className="verified-name__text" title={name}>
      {name}
    </span>
  );
  if (!verified) return text;
  return (
    <span className="verified-name" tabIndex={0}>
      {text}
      <VerifiedMark />
      <span className="verified-name__tip" role="tooltip">
        Verified by Workphelo
      </span>
    </span>
  );
}
