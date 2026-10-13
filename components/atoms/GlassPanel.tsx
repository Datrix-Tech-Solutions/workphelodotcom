interface GlassPanelProps {
  className?: string;
  children: React.ReactNode;
}

export default function GlassPanel({ className, children }: GlassPanelProps) {
  return (
    <div className={["glass-panel", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
