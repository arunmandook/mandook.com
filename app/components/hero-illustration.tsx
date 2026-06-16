/**
 * Abstract "AI core" illustration — a glowing gold core wrapped in orbiting
 * neural-network nodes. Pure SVG in the brand gold palette, so it stays crisp
 * at any size and matches the MANDOOK logo. Decorative only.
 */
export default function HeroIllustration({ className }: { className?: string }) {
  const GOLD = "#E8C25A";

  // Orbit rings (rotation in degrees) and the nodes that sit on each.
  const orbits = [
    { rot: 25, nodes: [[447.9, 286.7], [86.8, 221]] },
    { rot: 85, nodes: [[328.4, 333.3], [191.6, 186.7]] },
    { rot: 145, nodes: [[131.4, 319.7], [388.6, 200.3]] },
  ];

  return (
    <svg
      viewBox="0 0 520 520"
      role="img"
      aria-label="Abstract illustration of an AI core surrounded by a network of connected nodes"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
          <stop offset="65%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hiCore" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff7e0" />
          <stop offset="45%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#9c7616" />
        </radialGradient>
        <linearGradient id="hiGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#9c7616" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="260" cy="260" r="250" fill="url(#hiGlow)" className="hero-pulse" />

      {/* Faint outer tech ring */}
      <circle
        cx="260"
        cy="260"
        r="205"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.16"
        strokeDasharray="2 9"
      />

      {/* Orbits, connecting lines, and nodes */}
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} 260 260)`}>
          <ellipse
            cx="260"
            cy="260"
            rx="200"
            ry="78"
            fill="none"
            stroke="url(#hiGold)"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          {o.nodes.map(([x, y], j) => (
            <g key={j}>
              <line x1={x} y1={y} x2="260" y2="260" stroke={GOLD} strokeOpacity="0.22" strokeWidth="1" />
              <circle cx={x} cy={y} r="9" fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1" />
              <circle cx={x} cy={y} r="4.5" fill="url(#hiGold)" />
            </g>
          ))}
        </g>
      ))}

      {/* Core */}
      <circle cx="260" cy="260" r="70" fill="url(#hiGlow)" className="hero-pulse" />
      <circle cx="260" cy="260" r="34" fill="none" stroke="url(#hiGold)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="24" fill="url(#hiCore)" />
      <circle cx="251" cy="251" r="6" fill="#fff7e0" fillOpacity="0.85" />
    </svg>
  );
}
