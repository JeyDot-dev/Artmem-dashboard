import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';

interface DragHandleProps {
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  className?: string;
}

export function DragHandle({ attributes, listeners, className }: DragHandleProps) {
  return (
    <motion.div
      className={cn(
        'cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10',
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-5 w-5" />
    </motion.div>
  );
}
