/**
 * Stat card decorative background pattern
 */
export function StatPattern({ className = '', variant = 'default' }: { className?: string; variant?: 'default' | 'blue' | 'green' }) {
  const colors = {
    default: 'currentColor',
    blue: 'hsl(217, 91%, 60%)',
    green: 'hsl(142, 76%, 36%)',
  };
  const color = colors[variant];

  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <circle cx="100" cy="10" r="30" fill={color} opacity="0.04" />
      <circle cx="110" cy="60" r="20" fill={color} opacity="0.03" />
      <rect x="80" y="30" width="15" height="15" rx="2" fill={color} opacity="0.05" transform="rotate(30 87 37)" />
    </svg>
  );
}

/**
 * Empty state illustration
 */
export function EmptyStateIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      {/* Document stack */}
      <rect x="55" y="35" width="90" height="110" rx="4" fill="currentColor" opacity="0.04" />
      <rect x="50" y="30" width="90" height="110" rx="4" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
      
      {/* Content lines */}
      <rect x="65" y="50" width="50" height="4" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="65" y="62" width="35" height="4" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="65" y="78" width="55" height="4" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="65" y="90" width="40" height="4" rx="2" fill="currentColor" opacity="0.06" />
      
      {/* Search/magnifier accent */}
      <circle cx="145" cy="55" r="18" stroke="hsl(217, 91%, 60%)" strokeWidth="2" opacity="0.2" fill="none" />
      <line x1="158" y1="68" x2="170" y2="80" stroke="hsl(217, 91%, 60%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Section divider with geometric pattern
 */
export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 40" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
      <line x1="0" y1="20" x2="1200" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.06" />
      {[200, 400, 600, 800, 1000].map((x) => (
        <circle key={x} cx={x} cy="20" r="2" fill="currentColor" opacity="0.1" />
      ))}
      <circle cx="600" cy="20" r="4" fill="hsl(217, 91%, 60%)" opacity="0.3" />
    </svg>
  );
}
