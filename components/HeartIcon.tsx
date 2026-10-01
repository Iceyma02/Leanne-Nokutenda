export default function HeartIcon({ className = "", size = 24, glow = true }: { className?: string; size?: number; glow?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden style={glow ? { filter: "drop-shadow(0 0 10px rgba(255,61,127,.9))" } : undefined}>
      <defs>
        <radialGradient id="hg" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#ff9ec0" /><stop offset=".5" stopColor="#ff3d7f" /><stop offset="1" stopColor="#b0124f" /></radialGradient>
      </defs>
      <path d="M16 28.5C6 21 2.5 15.5 2.5 10.6 2.5 6.6 5.6 3.8 9.2 3.8c2.6 0 5 1.4 6.8 4 1.8-2.6 4.2-4 6.8-4 3.6 0 6.7 2.8 6.7 6.8 0 4.9-3.5 10.4-13.5 17.9z" fill="url(#hg)" />
    </svg>
  );
}
