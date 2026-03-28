/**
 * Conceptual SVG visual — abstract network/constellation pattern
 * representing connections between students and opportunities
 */
export function HeroPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Grid dots */}
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 16 }).map((_, col) => (
          <circle
            key={`dot-${row}-${col}`}
            cx={50 + col * 50}
            cy={50 + row * 50}
            r={1.5}
            fill="currentColor"
            opacity={0.08}
          />
        ))
      )}

      {/* Connection lines — abstract network */}
      <line x1="200" y1="150" x2="400" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="400" y1="200" x2="550" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="400" y1="200" x2="350" y2="350" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="350" y1="350" x2="500" y2="400" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="200" y1="150" x2="150" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="550" y1="150" x2="600" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="150" y1="300" x2="350" y2="350" stroke="currentColor" strokeWidth="1" opacity="0.06" />

      {/* Primary nodes */}
      <circle cx="200" cy="150" r="6" fill="hsl(217, 91%, 60%)" opacity="0.9" />
      <circle cx="200" cy="150" r="16" fill="hsl(217, 91%, 60%)" opacity="0.08" />
      
      <circle cx="400" cy="200" r="8" fill="hsl(217, 91%, 60%)" opacity="0.7" />
      <circle cx="400" cy="200" r="24" fill="hsl(217, 91%, 60%)" opacity="0.06" />
      
      <circle cx="550" cy="150" r="5" fill="currentColor" opacity="0.3" />
      <circle cx="350" cy="350" r="7" fill="hsl(217, 91%, 60%)" opacity="0.5" />
      <circle cx="350" cy="350" r="18" fill="hsl(217, 91%, 60%)" opacity="0.05" />
      
      <circle cx="500" cy="400" r="4" fill="currentColor" opacity="0.2" />
      <circle cx="150" cy="300" r="5" fill="currentColor" opacity="0.25" />
      <circle cx="600" cy="300" r="4" fill="currentColor" opacity="0.15" />

      {/* Geometric accent shapes */}
      <rect x="620" y="100" width="40" height="40" rx="2" fill="hsl(217, 91%, 60%)" opacity="0.04" transform="rotate(15 640 120)" />
      <rect x="100" y="400" width="60" height="60" rx="2" fill="hsl(217, 91%, 60%)" opacity="0.03" transform="rotate(-10 130 430)" />
      
      {/* Abstract path — career trajectory */}
      <path
        d="M100 450 Q 200 380, 300 400 T 500 350 T 700 280"
        stroke="hsl(217, 91%, 60%)"
        strokeWidth="2"
        fill="none"
        opacity="0.12"
        strokeDasharray="8 6"
      />
    </svg>
  );
}

/**
 * Floating geometric shapes for section backgrounds
 */
export function FloatingShapes({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="100" cy="80" r="60" fill="hsl(217, 91%, 60%)" opacity="0.04" />
      <circle cx="500" cy="320" r="80" fill="hsl(217, 91%, 60%)" opacity="0.03" />
      <rect x="450" y="60" width="100" height="100" rx="4" fill="hsl(217, 91%, 60%)" opacity="0.03" transform="rotate(20 500 110)" />
      <polygon points="300,20 340,80 260,80" fill="hsl(217, 91%, 60%)" opacity="0.04" />
      
      {/* Cross marks */}
      <g opacity="0.08" stroke="currentColor" strokeWidth="1.5">
        <line x1="155" y1="200" x2="175" y2="200" />
        <line x1="165" y1="190" x2="165" y2="210" />
      </g>
      <g opacity="0.06" stroke="currentColor" strokeWidth="1.5">
        <line x1="420" y1="180" x2="440" y2="180" />
        <line x1="430" y1="170" x2="430" y2="190" />
      </g>
    </svg>
  );
}

/**
 * Abstract arrows/paths for "How it works" section
 */
export function StepConnector({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 20" fill="none" className={className} aria-hidden="true">
      <path d="M0 10 H80 L75 5 M80 10 L75 15" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
    </svg>
  );
}
