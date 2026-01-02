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
  const workTypeLabels = {
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid',
  };

  return (
    <div className="card-interactive p-6 animate-fade-in group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Organization */}
          <p className="text-sm text-muted-foreground mb-1">
            {organizationName}
          </p>
          
          {/* Title */}
          <Link to={`/internships/${id}`}>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            )}
            {isPaid && (
              <span className="flex items-center gap-1 text-success">
                <DollarSign className="w-3.5 h-3.5" />
                Paid
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {field}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                workType === 'remote' && "border-primary/30 text-primary bg-primary/5"
              )}
            >
              {workTypeLabels[workType]}
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
              "flex-shrink-0 transition-colors",
              isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
