import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const workTypeConfig = {
  remote: { label: 'Remote', className: 'bg-primary/8 text-primary border-primary/15' },
  onsite: { label: 'On-site', className: '' },
  hybrid: { label: 'Hybrid', className: 'bg-accent text-accent-foreground' },
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
  const wt = workTypeConfig[workType];

  return (
    <div className="group relative bg-card rounded-xl border border-border/60 p-6 transition-all duration-300 hover:shadow-elevated hover:border-primary/20 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Org + Field */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {organizationName}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs text-muted-foreground">{field}</span>
          </div>

          {/* Title */}
          <Link to={`/internships/${id}`}>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {location && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            )}
            {isPaid && (
              <span className="flex items-center gap-1.5 text-sm text-success font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                Paid
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className={cn("text-xs rounded-full", wt.className)}>
              {wt.label}
            </Badge>
          </div>
        </div>

        {/* Save Button */}
        {showSaveButton && onToggleSave && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave();
            }}
            className={cn(
              "flex-shrink-0 rounded-full transition-all",
              isSaved
                ? "text-primary bg-primary/8 hover:bg-primary/15"
                : "text-muted-foreground hover:text-primary hover:bg-primary/8"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
