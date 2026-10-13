interface CompanyAvatarProps {
  name: string;
  size?: "sm" | "md";
}

export default function CompanyAvatar({
  name,
  size = "md",
}: CompanyAvatarProps) {
  return (
    <span
      className={`company-avatar company-avatar--${size}`}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
