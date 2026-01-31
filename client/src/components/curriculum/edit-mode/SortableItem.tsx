import { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Video, BookOpen, Dumbbell, FileText, Circle } from 'lucide-react';
import { Item, ItemType } from '../../../../../shared/types';
import { DragHandle } from './DragHandle';
import { cn } from '@/lib/utils';
import { springConfig, defaultShadow, dragSourceOpacity } from '@/lib/animations';
import { fireDropConfetti } from '@/lib/confetti';

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

const statusIcons = {
  not_started: '☐',
  in_progress: '▶',
  completed: '✓',
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

  // Fire confetti when drop completes
  useEffect(() => {
    if (previousIsDragging.current && !isDragging && dragHandleRef.current) {
      fireDropConfetti(dragHandleRef.current, { particleCount: 40, spread: 60 });
    }
    previousIsDragging.current = isDragging;
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={false}
      animate={{
        opacity: isDragging ? dragSourceOpacity : 1,
        boxShadow: defaultShadow,
      }}
      transition={springConfig}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card',
        item.status === 'completed' && 'bg-secondary/50 border-accent/20',
        item.status === 'in_progress' && 'bg-primary/5 border-primary/20',
        item.status === 'not_started' && 'border-border'
      )}
    >
      <div ref={dragHandleRef}>
        <DragHandle attributes={attributes} listeners={listeners} />
      </div>

      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md border-2',
          item.status === 'completed' && 'bg-accent border-accent text-accent-foreground',
          item.status === 'in_progress' && 'bg-primary border-primary text-primary-foreground',
          item.status === 'not_started' && 'border-muted'
        )}
      >
        <span className="text-lg font-bold">{statusIcons[item.status]}</span>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        {itemTypeIcons[item.type]}
      </div>

      <div className="flex-1">
        <p className={cn('font-medium', item.status === 'completed' && 'line-through text-muted-foreground')}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}
