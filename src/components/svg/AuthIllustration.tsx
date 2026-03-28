/**
 * Abstract SVG illustration for auth pages —
 * represents growth, connection, and opportunity
 */
export function AuthIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background grid */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <circle
            key={`g-${row}-${col}`}
            cx={60 + col * 55}
            cy={80 + row * 60}
            r={1}
            fill="white"
            opacity={0.1}
          />
        ))
      )}

      {/* Central abstract figure — stacked geometric shapes suggesting upward growth */}
      <rect x="200" y="400" width="100" height="120" rx="4" fill="white" opacity="0.06" />
      <rect x="210" y="320" width="80" height="100" rx="4" fill="white" opacity="0.08" />
      <rect x="220" y="250" width="60" height="90" rx="4" fill="white" opacity="0.1" />
      <rect x="225" y="190" width="50" height="80" rx="4" fill="white" opacity="0.12" />

      {/* Rising arrow/path */}
      <path
        d="M250 500 L250 180 L230 200 M250 180 L270 200"
        stroke="white"
        strokeWidth="2"
        opacity="0.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Orbital circles — representing ecosystem */}
      <circle cx="250" cy="300" r="120" stroke="white" strokeWidth="1" opacity="0.06" fill="none" />
      <circle cx="250" cy="300" r="180" stroke="white" strokeWidth="1" opacity="0.04" fill="none" strokeDasharray="4 8" />

      {/* Satellite nodes */}
      <circle cx="370" cy="300" r="8" fill="hsl(217, 91%, 60%)" opacity="0.6" />
      <circle cx="370" cy="300" r="20" fill="hsl(217, 91%, 60%)" opacity="0.1" />
      
      <circle cx="180" cy="220" r="6" fill="white" opacity="0.4" />
      <circle cx="320" cy="420" r="5" fill="white" opacity="0.3" />
      <circle cx="130" cy="350" r="4" fill="hsl(217, 91%, 60%)" opacity="0.4" />

      {/* Decorative text-like lines */}
      <rect x="80" y="520" width="60" height="3" rx="1.5" fill="white" opacity="0.08" />
      <rect x="80" y="530" width="40" height="3" rx="1.5" fill="white" opacity="0.06" />
      <rect x="360" y="140" width="50" height="3" rx="1.5" fill="white" opacity="0.08" />
      <rect x="360" y="150" width="30" height="3" rx="1.5" fill="white" opacity="0.06" />

      {/* Accent diamond */}
      <rect x="100" y="150" width="20" height="20" rx="2" fill="hsl(217, 91%, 60%)" opacity="0.15" transform="rotate(45 110 160)" />
    </svg>
  );
}

/**
 * Small decorative mark for section accents
 */
export function AccentMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="hsl(217, 91%, 60%)" opacity="0.1" />
      <rect x="6" y="6" width="12" height="12" rx="1" fill="hsl(217, 91%, 60%)" opacity="0.2" />
    </svg>
  );
}
