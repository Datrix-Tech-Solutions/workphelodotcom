interface PanelProps {
  className?: string;
  children: React.ReactNode;
}

export default function GlassPanel({ className, children }: PanelProps) {
  return (
    <div className={["glass-panel", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function WhitePanel({ className, children }: PanelProps) {
  return (
    <div className={["white-panel", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
