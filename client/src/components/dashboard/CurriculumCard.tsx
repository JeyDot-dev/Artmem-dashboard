import { ExternalLink, Zap, Target, CheckCircle2, Square, Play } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { DaysRemaining } from './DaysRemaining';
import { cn, getCurrentOrNextTask } from '../../lib/utils';
import type { CurriculumWithProgress, CurriculumDetail, CurriculumPriority, ItemStatus } from '../../../../shared/types';

interface CurriculumCardProps {
  curriculum: CurriculumWithProgress;
  onClick: (id: number) => void;
}

const priorityConfig: Record<CurriculumPriority, { badge: string; border: string }> = {
  high: {
    badge: 'HIGH',
    border: 'border-l-4 border-l-destructive',
  },
  medium: {
    badge: 'MEDIUM',
    border: 'border-l-4 border-l-accent',
  },
  low: {
    badge: 'LOW',
    border: 'border-l-4 border-l-muted',
  },
};

const getStatusIcon = (status: ItemStatus) => {
  switch (status) {
    case 'not_started':
      return <Square className="h-4 w-4" />;
    case 'in_progress':
      return <Play className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return null;
  }
};

export function CurriculumCard({ curriculum, onClick }: CurriculumCardProps) {
  const config = priorityConfig[curriculum.priority];
  
  // Format end date
  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const handleCardClick = () => {
    onClick(curriculum.id);
  };
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <Card
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
        config.border
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: Priority Badge + Days Remaining */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">
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
                onClick={handleLinkClick}
                className="hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                {curriculum.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              curriculum.title
            )}
          </h3>
          
          {/* Metadata */}
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
            {curriculum.completedItems}/{curriculum.totalItems} items completed ({Math.round(curriculum.progress)}%)
          </p>
        </div>
        
        {/* Goal Date */}
        {curriculum.endDate && (
          <div className="text-sm flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Goal: </span>
            <span className="font-medium">{formatDate(curriculum.endDate)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Extended card with current task (for Ongoing status only)
interface CurriculumCardWithTaskProps extends CurriculumCardProps {
  curriculumDetail?: CurriculumDetail;
}

export function CurriculumCardWithTask({ 
  curriculum, 
  curriculumDetail,
  onClick 
}: CurriculumCardWithTaskProps) {
  const currentTask = curriculumDetail ? getCurrentOrNextTask(curriculumDetail) : null;
  
  return (
    <Card
      role="article"
      tabIndex={0}
      onClick={() => onClick(curriculum.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(curriculum.id);
        }
      }}
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
        priorityConfig[curriculum.priority].border
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: Priority Badge + Days Remaining */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">
              {priorityConfig[curriculum.priority].badge}
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
          
          {/* Metadata */}
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
            {curriculum.completedItems}/{curriculum.totalItems} items completed ({Math.round(curriculum.progress)}%)
          </p>
        </div>
        
        {/* Goal Date */}
        {curriculum.endDate && (
          <div className="text-sm flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Goal: </span>
            <span className="font-medium">
              {typeof curriculum.endDate === 'string' 
                ? new Date(curriculum.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : curriculum.endDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
              }
            </span>
          </div>
        )}
        
        {/* Current Task (Ongoing only) */}
        {currentTask && (
          <div className="pt-2 border-t space-y-2">
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
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm">
                All tasks completed
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
