type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
};

export function ProgressRing({ value, size = 140, stroke = 12 }: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(40,178,158,0.22),transparent_70%)] blur-2xl" />
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} className="relative -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#portal-progress)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.45s ease" }}
        />
        <defs>
          <linearGradient id="portal-progress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35ccb3" />
            <stop offset="100%" stopColor="#8af2df" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-[var(--font-heading)] text-2xl font-bold text-ink">{normalized}%</span>
    </div>
  );
}
