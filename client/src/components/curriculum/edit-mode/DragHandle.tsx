import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { tactileSpring } from '@/lib/animations';

interface DragHandleProps {
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  className?: string;
}

export function DragHandle({ attributes, listeners, className }: DragHandleProps) {
  return (
    <motion.div
      className={cn(
        'cursor-grab active:cursor-grabbing p-1 rounded',
        className
      )}
      /* Idle breathing pulse on the icon opacity */
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{
        scale: 1.15,
        opacity: 1,
        color: 'var(--color-primary, #facc15)',
      }}
      whileTap={{ scale: 0.9 }}
      style={{
        transition: undefined,
      }}
      /* Stop breathing on hover by overriding transition inline */
      {...({} as object)}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      role="button"
      tabIndex={0}
    >
      <motion.div
        className="text-muted-foreground"
        whileHover={{
          filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))',
          color: '#facc15',
        }}
        transition={tactileSpring}
      >
        <GripVertical className="h-5 w-5" />
      </motion.div>
    </motion.div>
  );
}
