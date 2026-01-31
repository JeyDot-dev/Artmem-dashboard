import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, ChevronUp, GripVertical, Video, BookOpen, Dumbbell, FileText, Circle } from 'lucide-react';
import { SectionWithItems, Item, ItemType } from '../../../../../shared/types';
import { DragHandle } from './DragHandle';
import { SortableItem } from './SortableItem';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEditMode } from './EditModeProvider';
import { cn } from '@/lib/utils';
import { springConfig, defaultShadow, dragSourceOpacity, overlaySpringConfig, dragShadow } from '@/lib/animations';

interface SortableSectionProps {
  section: SectionWithItems;
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

export function SortableSection({ section }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const { collapsedSections, collapseSection, expandSection, reorderItems } = useEditMode();
  const isCollapsed = collapsedSections.has(section.id);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  // Auto-collapse when dragging starts
  useEffect(() => {
    if (isDragging && !isCollapsed) {
      collapseSection(section.id);
    }
  }, [isDragging, isCollapsed, collapseSection, section.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleItemDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = section.items.find((i) => i.id === active.id);
    if (item) {
      setActiveItem(item);
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveItem(null);
    document.body.style.cursor = '';

    if (!over || active.id === over.id) return;

    const oldIndex = section.items.findIndex((item) => item.id === active.id);
    const newIndex = section.items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderItems(section.id, oldIndex, newIndex);
    }
  };

  const toggleCollapse = () => {
    if (isCollapsed) {
      expandSection(section.id);
    } else {
      collapseSection(section.id);
    }
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
      className="rounded-lg border bg-card"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <DragHandle attributes={attributes} listeners={listeners} />

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{section.title}</h3>
          {section.description && (
            <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-muted-foreground">
              Progress: {section.items.filter((i) => i.status === 'completed').length}/{section.items.length} ({section.progress}%)
            </span>
            <Progress value={section.progress} className="flex-1 max-w-xs" />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="gap-2"
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Tasks
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Tasks
            </>
          )}
        </Button>
      </div>

      {/* Section Items */}
      {!isCollapsed && section.items.length > 0 && (
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleItemDragStart}
            onDragEnd={handleItemDragEnd}
          >
            <SortableContext
              items={section.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {section.items.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05, rotate: 1 }}
                  transition={overlaySpringConfig}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border bg-card shadow-2xl',
                    activeItem.status === 'completed' && 'bg-secondary/50 border-accent/20',
                    activeItem.status === 'in_progress' && 'bg-primary/5 border-primary/20',
                    activeItem.status === 'not_started' && 'border-border'
                  )}
                  style={{ boxShadow: dragShadow }}
                >
                  <div className="text-muted-foreground cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-md border-2',
                      activeItem.status === 'completed' && 'bg-accent border-accent text-accent-foreground',
                      activeItem.status === 'in_progress' && 'bg-primary border-primary text-primary-foreground',
                      activeItem.status === 'not_started' && 'border-muted'
                    )}
                  >
                    <span className="text-lg font-bold">{statusIcons[activeItem.status]}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    {itemTypeIcons[activeItem.type]}
                  </div>

                  <div className="flex-1">
                    <p className={cn('font-medium', activeItem.status === 'completed' && 'line-through text-muted-foreground')}>
                      {activeItem.title}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {!isCollapsed && section.items.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No items in this section
        </div>
      )}
    </motion.div>
  );
}
