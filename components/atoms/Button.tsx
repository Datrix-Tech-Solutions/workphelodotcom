import Link from "next/link";

interface ButtonProps {
  href?: string;
  variant?: "primary" | "ghost" | "glass" | "outline" | "solid" | "soft";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  href,
  variant = "primary",
  type = "submit",
  onClick,
  disabled,
  children,
}: ButtonProps) {
  const className = `button button--${variant}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
