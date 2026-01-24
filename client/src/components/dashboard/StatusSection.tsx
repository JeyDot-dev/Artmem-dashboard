import { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, Pause, ClipboardList, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CurriculumStatus } from '../../../../shared/types';

interface StatusSectionProps {
  status: CurriculumStatus;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const statusConfig = {
  ongoing: {
    icon: TrendingUp,
    label: 'Ongoing',
  },
  standby: {
    icon: Pause,
    label: 'Standby',
  },
  planned: {
    icon: ClipboardList,
    label: 'Planned',
  },
  wishlist: {
    icon: Star,
    label: 'Wishlist',
  },
};

export function StatusSection({ 
  status, 
  count, 
  children, 
  defaultExpanded = false 
}: StatusSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const config = statusConfig[status];
  
  const IconComponent = config.icon;
  
  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4 text-lg font-semibold hover:text-primary transition-colors w-full"
      >
        {expanded ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
        <IconComponent className="h-5 w-5" />
        <span>{config.label}</span>
        <span className="text-muted-foreground">({count})</span>
      </button>
      
      {expanded && (
        <div className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}>
          {children}
        </div>
      )}
    </div>
  );
}
