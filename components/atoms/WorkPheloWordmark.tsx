interface WorkPheloWordmarkProps {
  className?: string;
}

export default function WorkPheloWordmark({
  className,
}: WorkPheloWordmarkProps) {
  return (
    <span className={["wordmark", className].filter(Boolean).join(" ")}>
      <span className="wordmark__work">Work</span>
      <span className="wordmark__phelo">Phelo</span>
    </span>
  );
}
