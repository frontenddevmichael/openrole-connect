import { Link } from 'react-router-dom';
import { PinIcon, ClockIcon, CurrencyIcon, BookmarkIcon } from '@/components/icons';

interface InternshipCardProps {
  id: string;
  title: string;
  organizationName: string;
  field: string;
  location: string | null;
  workType: 'remote' | 'onsite' | 'hybrid';
  duration: string | null;
  isPaid: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
  showSaveButton?: boolean;
}

const workTypeLabels = {
  remote: 'Remote',
  onsite: 'On-site',
  hybrid: 'Hybrid',
};

export function InternshipCard({
  id,
  title,
  organizationName,
  field,
  location,
  workType,
  duration,
  isPaid,
  isSaved = false,
  onToggleSave,
  showSaveButton = true,
}: InternshipCardProps) {
  return (
    <div className="card-interactive p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Org + Field */}
          <div className="flex items-center gap-2 mb-2">
            <span className="section-eyebrow">{organizationName}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs text-muted-foreground font-sans">{field}</span>
          </div>

          {/* Title */}
          <Link to={`/internships/${id}`}>
            <h3 className="font-serif text-lg text-foreground leading-snug hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {location && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans">
                <PinIcon size={14} />
                {location}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans">
                <ClockIcon size={14} />
                {duration}
              </span>
            )}
            {isPaid && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans">
                <CurrencyIcon size={14} />
                Paid
              </span>
            )}
            <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">
              {workTypeLabels[workType]}
            </span>
          </div>
        </div>

        {/* Save Button */}
        {showSaveButton && onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave();
            }}
            className={`flex-shrink-0 p-2 rounded transition-colors ${
              isSaved
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookmarkIcon size={18} filled={isSaved} />
          </button>
        )}
      </div>
    </div>
  );
}
