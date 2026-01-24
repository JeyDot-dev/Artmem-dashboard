import { getDaysRemaining } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface DaysRemainingProps {
  endDate: Date | string | null;
  className?: string;
}

export function DaysRemaining({ endDate, className }: DaysRemainingProps) {
  const days = getDaysRemaining(endDate);
  
  if (days === null) return null;
  
  // Determine styling based on urgency
  const getStyle = () => {
    if (days === 0) return 'text-destructive font-bold';
    if (days < 0) return 'text-destructive';
    if (days <= 7) return 'text-destructive';
    if (days <= 30) return 'text-accent';
    return 'text-muted-foreground';
  };
  
  // Format display text
  const getText = () => {
    if (days === 0) return 'Today!';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return `${days} days`;
  };
  
  return (
    <div className={cn('text-sm font-medium', getStyle(), className)}>
      {getText()}
    </div>
  );
}
