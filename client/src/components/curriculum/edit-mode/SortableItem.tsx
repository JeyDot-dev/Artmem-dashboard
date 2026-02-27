import { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Video, BookOpen, Dumbbell, FileText, Circle, CheckCircle2, Play, Square } from 'lucide-react';
import { Item, ItemType } from '../../../../../shared/types';
import { DragHandle } from './DragHandle';
import { DropParticles } from '@/components/common/DropParticles';
import { cn } from '@/lib/utils';
import { tactileSpring, defaultShadow, dragSourceOpacity } from '@/lib/animations';

interface SortableItemProps {
  item: Item;
}

const itemTypeIcons: Record<ItemType, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  exercise: <Dumbbell className="h-4 w-4" />,
  homework: <FileText className="h-4 w-4" />,
  other: <Circle className="h-4 w-4" />,
};

const statusIconMap = {
  not_started: <Square className="h-4 w-4" />,
  in_progress: <Play className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
};

export function SortableItem({ item }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const dragHandleRef = useRef<HTMLDivElement>(null);
  const previousIsDragging = useRef(isDragging);
  const [showParticles, setShowParticles] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (previousIsDragging.current && !isDragging) {
      setShowParticles(true);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 450);
    }
    previousIsDragging.current = isDragging;
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      {showParticles && (
        <DropParticles
          originRef={dragHandleRef}
          count={8}
          onComplete={() => setShowParticles(false)}
        />
      )}
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={false}
        animate={bouncing
          ? { scale: [1, 1.06, 0.98, 1.01, 1] as number[] }
          : { opacity: isDragging ? dragSourceOpacity : 1, boxShadow: defaultShadow, scale: 1 }
        }
        transition={bouncing
          ? { duration: 0.4, ease: 'easeOut' as const }
          : tactileSpring
        }
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border bg-card',
          item.status === 'completed' && 'border-success/20',
          item.status === 'in_progress' && 'bg-primary/5 border-primary/20',
          item.status === 'not_started' && 'border-border'
        )}
      >
        <div ref={dragHandleRef}>
          <DragHandle attributes={attributes} listeners={listeners} />
        </div>

        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md border-2 shrink-0',
            item.status === 'completed' && 'bg-success/10 border-success text-success',
            item.status === 'in_progress' && 'bg-primary/10 border-primary text-primary status-in-progress',
            item.status === 'not_started' && 'border-muted text-muted-foreground'
          )}
        >
          {statusIconMap[item.status]}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          {itemTypeIcons[item.type]}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium truncate',
            item.status === 'completed' && 'line-through text-muted-foreground'
          )}>
            {item.title}
          </p>
          {item.description && (
            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
