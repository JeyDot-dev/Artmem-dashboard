import { useState } from 'react';
import { ExternalLink, Zap, Target, CheckCircle2, Square, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';
import { DaysRemaining } from './DaysRemaining';
import { cn, getCurrentOrNextTask } from '../../lib/utils';
import { gentleSpring, hoverShadow } from '@/lib/animations';
import type {
  CurriculumWithProgress,
  CurriculumDetail,
  CurriculumPriority,
  ItemStatus,
} from '../../../../shared/types';

interface CurriculumCardProps {
  curriculum: CurriculumWithProgress;
  onClick: (id: number) => void;
}

const priorityConfig: Record<CurriculumPriority, { badge: string; border: string; badgeColor: string }> = {
  high: {
    badge: 'HIGH',
    border: 'border-l-4 border-l-destructive',
    badgeColor: 'text-destructive',
  },
  medium: {
    badge: 'MEDIUM',
    border: 'border-l-4 border-l-primary',
    badgeColor: 'text-primary',
  },
  low: {
    badge: 'LOW',
    border: 'border-l-4 border-l-muted',
    badgeColor: 'text-muted-foreground',
  },
};

const getStatusIcon = (status: ItemStatus) => {
  switch (status) {
    case 'not_started':
      return <Square className="h-4 w-4 text-muted-foreground" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-primary" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    default:
      return null;
  }
};

const formatDate = (date: Date | string | null) => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function TiltCard({
  children,
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 8, y: y * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -2, boxShadow: hoverShadow }}
      whileTap={{ scale: 0.98 }}
      animate={{ rotateX: -tilt.x, rotateY: tilt.y }}
      transition={gentleSpring}
      style={{ perspective: 800 }}
      className={cn(
        'cursor-pointer rounded-lg border bg-card border-border',
        'hover:border-primary/20 transition-colors',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CurriculumCard({ curriculum, onClick }: CurriculumCardProps) {
  const config = priorityConfig[curriculum.priority];

  const handleCardClick = () => onClick(curriculum.id);

  return (
    <TiltCard
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={config.border}
    >
      <div className="p-4 space-y-3">
        {/* Header: Priority Badge + Days Remaining */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className={cn('h-3.5 w-3.5', config.badgeColor)} />
            <span className={cn('text-xs font-bold uppercase tracking-wide', config.badgeColor)}>
              {config.badge}
            </span>
          </div>
          <DaysRemaining endDate={curriculum.endDate} />
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {curriculum.platformUrl ? (
              <a
                href={curriculum.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                {curriculum.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              curriculum.title
            )}
          </h3>

          {(curriculum.author || curriculum.platform) && (
            <p className="text-sm text-muted-foreground">
              {curriculum.author && <span>{curriculum.author}</span>}
              {curriculum.author && curriculum.platform && <span> • </span>}
              {curriculum.platform && <span>{curriculum.platform}</span>}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={curriculum.progress} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">{curriculum.completedItems}/{curriculum.totalItems}</span>
            {' '}items completed{' '}
            (<span className="font-mono">{Math.round(curriculum.progress)}%</span>)
          </p>
        </div>

        {/* Goal Date */}
        {curriculum.endDate && (
          <div className="text-sm flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Goal: </span>
            <span className="font-mono font-medium">{formatDate(curriculum.endDate)}</span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}

// Extended card with current task (for Ongoing status only)
interface CurriculumCardWithTaskProps extends CurriculumCardProps {
  curriculumDetail?: CurriculumDetail;
}

export function CurriculumCardWithTask({
  curriculum,
  curriculumDetail,
  onClick,
}: CurriculumCardWithTaskProps) {
  const currentTask = curriculumDetail ? getCurrentOrNextTask(curriculumDetail) : null;
  const config = priorityConfig[curriculum.priority];

  return (
    <TiltCard
      role="article"
      tabIndex={0}
      onClick={() => onClick(curriculum.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(curriculum.id);
        }
      }}
      className={config.border}
    >
      <div className="p-4 space-y-3">
        {/* Header: Priority Badge + Days Remaining */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className={cn('h-3.5 w-3.5', config.badgeColor)} />
            <span className={cn('text-xs font-bold uppercase tracking-wide', config.badgeColor)}>
              {config.badge}
            </span>
          </div>
          <DaysRemaining endDate={curriculum.endDate} />
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {curriculum.platformUrl ? (
              <a
                href={curriculum.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                {curriculum.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              curriculum.title
            )}
          </h3>

          {(curriculum.author || curriculum.platform) && (
            <p className="text-sm text-muted-foreground">
              {curriculum.author && <span>{curriculum.author}</span>}
              {curriculum.author && curriculum.platform && <span> • </span>}
              {curriculum.platform && <span>{curriculum.platform}</span>}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={curriculum.progress} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">{curriculum.completedItems}/{curriculum.totalItems}</span>
            {' '}items completed{' '}
            (<span className="font-mono">{Math.round(curriculum.progress)}%</span>)
          </p>
        </div>

        {/* Goal Date */}
        {curriculum.endDate && (
          <div className="text-sm flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Goal: </span>
            <span className="font-mono font-medium">
              {typeof curriculum.endDate === 'string'
                ? new Date(curriculum.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : curriculum.endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
            </span>
          </div>
        )}

        {/* Current Task (Ongoing only) */}
        {currentTask && (
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(currentTask.status)}
              <span className="font-medium text-sm">{currentTask.title}</span>
            </div>
            {currentTask.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {currentTask.description}
              </p>
            )}
          </div>
        )}

        {/* All tasks completed */}
        {!currentTask && curriculum.progress === 100 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm">All tasks completed</p>
            </div>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
