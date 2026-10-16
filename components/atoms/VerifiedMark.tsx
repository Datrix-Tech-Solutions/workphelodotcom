import Icon from "@/components/atoms/Icon";

/** The check mark next to a company WorkPhelo has verified. */
export default function VerifiedMark() {
  return (
    <span className="verified-mark" role="img" aria-label="Verified employer">
      <Icon name="check" size={10} strokeWidth={3} />
    </span>
  );
}
