'use client';

export function FloatingOrb({
  size = 200,
  color = 'blue',
  className = '',
  delay = 0,
}: {
  size?: number;
  color?: 'blue' | 'orange' | 'purple' | 'amber';
  className?: string;
  delay?: number;
}) {
  const colorMap = {
    blue: 'bg-blue-400/15',
    orange: 'bg-orange-400/12',
    purple: 'bg-purple-400/10',
    amber: 'bg-amber-400/12',
  };
  const animClass = delay === 0 ? 'animate-orb-1' : delay === 1 ? 'animate-orb-2' : 'animate-orb-3';

  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${colorMap[color]} ${animClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
