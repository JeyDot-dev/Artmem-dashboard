import { Video, BookOpen, Dumbbell, FileText, Circle, CheckCircle2, Play, Square } from 'lucide-react';
import { getCurrentOrNextTask } from '../../lib/utils';
import { cn } from '@/lib/utils';
import type { CurriculumDetail, ItemType } from '../../../../shared/types';

interface CurrentTaskWidgetProps {
  curriculum: CurriculumDetail;
  onTaskClick: (itemId: number) => void;
}

const itemTypeIcons: Record<ItemType, React.ReactNode> = {
  video: <Video className="h-3.5 w-3.5" />,
  reading: <BookOpen className="h-3.5 w-3.5" />,
  exercise: <Dumbbell className="h-3.5 w-3.5" />,
  homework: <FileText className="h-3.5 w-3.5" />,
  other: <Circle className="h-3.5 w-3.5" />,
};

export function CurrentTaskWidget({ curriculum, onTaskClick }: CurrentTaskWidgetProps) {
  const currentTask = getCurrentOrNextTask(curriculum);
  
  // All tasks completed state
  if (!currentTask) {
    return (
      <div className="p-3 rounded-lg border border-accent/50 bg-accent/5">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="font-medium">All tasks complete</span>
        </div>
      </div>
    );
  }
  
  const isInProgress = currentTask.status === 'in_progress';
  
  return (
    <button
      onClick={() => onTaskClick(currentTask.id)}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all',
        'hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
      )}
    >
      <div className="flex items-start gap-2">
        {/* Status Icon */}
        <div className="mt-0.5 flex-shrink-0">
          {isInProgress ? (
            <Play className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Square className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Label */}
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {isInProgress ? 'Current Focus' : 'Up Next'}
          </div>
          
          {/* Task Info */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-muted-foreground flex-shrink-0">
              {itemTypeIcons[currentTask.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{currentTask.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {currentTask.sectionTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
