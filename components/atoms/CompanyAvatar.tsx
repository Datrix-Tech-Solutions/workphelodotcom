interface CompanyAvatarProps {
  name: string;
  size?: "sm" | "md";
}

const PALETTE = [
  "#03294e",
  "#1d6fd8",
  "#0f766e",
  "#7c3aed",
  "#be185d",
  "#b45309",
  "#4338ca",
  "#0369a1",
];

/** First letters of the first two words, or the first two letters of one. */
export function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const letters =
    words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
  return letters.toUpperCase();
}

/** Same name, same colour, so a company looks consistent across cards. */
function colorFor(name: string): string {
  let hash = 0;
  for (const ch of name.toLowerCase())
    hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function CompanyAvatar({
  name,
  size = "md",
}: CompanyAvatarProps) {
  return (
    <span
      className={`company-avatar company-avatar--${size}`}
      style={{ backgroundColor: colorFor(name) }}
      aria-hidden="true"
    >
      {companyInitials(name)}
    </span>
  );
}
