import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EmptyStateIllustration } from '@/components/svg/DashboardVisuals';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-4 text-center", className)}>
      <EmptyStateIllustration className="w-40 h-32 text-foreground mb-6" />
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
