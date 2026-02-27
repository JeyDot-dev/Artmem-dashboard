import { useState } from 'react';
import { ChevronDown, TrendingUp, Pause, ClipboardList, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { tactileSpring, gentleSpring } from '@/lib/animations';
import type { CurriculumStatus } from '../../../../shared/types';

interface StatusSectionProps {
  status: CurriculumStatus;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const statusConfig: Record<
  CurriculumStatus,
  { icon: React.ElementType; label: string; color: string }
> = {
  ongoing: {
    icon: TrendingUp,
    label: 'Ongoing',
    color: 'text-primary',
  },
  standby: {
    icon: Pause,
    label: 'Standby',
    color: 'text-warning',
  },
  planned: {
    icon: ClipboardList,
    label: 'Planned',
    color: 'text-accent',
  },
  wishlist: {
    icon: Star,
    label: 'Wishlist',
    color: 'text-accent-pink',
  },
};

export function StatusSection({
  status,
  count,
  children,
  defaultExpanded = false,
}: StatusSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div className="mb-8">
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileTap={{ scale: 0.97 }}
        transition={tactileSpring}
        className="flex items-center gap-2 mb-4 text-lg font-semibold hover:text-primary transition-colors w-full"
      >
        <motion.span
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={tactileSpring}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
        <IconComponent className={cn('h-5 w-5', config.color)} />
        <span>{config.label}</span>
        <span className="text-muted-foreground font-mono">
          (<span>{count}</span>)
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={gentleSpring}
            style={{ overflow: 'hidden' }}
          >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
