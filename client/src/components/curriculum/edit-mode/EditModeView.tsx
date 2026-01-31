import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { CurriculumDetail, SectionWithItems } from '../../../../../shared/types';
import { SortableSection } from './SortableSection';
import { useEditMode } from './EditModeProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GripVertical } from 'lucide-react';
import { overlaySpringConfig, dragShadow } from '@/lib/animations';

interface EditModeViewProps {
  curriculum: CurriculumDetail;
}

export function EditModeView({ curriculum }: EditModeViewProps) {
  const { localCurriculum, reorderSections } = useEditMode();
  const [activeSection, setActiveSection] = useState<SectionWithItems | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleSectionDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const section = localCurriculum?.sections.find((s) => s.id === active.id);
    if (section) {
      setActiveSection(section);
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveSection(null);
    document.body.style.cursor = '';

    if (!over || active.id === over.id || !localCurriculum) return;

    const oldIndex = localCurriculum.sections.findIndex((section) => section.id === active.id);
    const newIndex = localCurriculum.sections.findIndex((section) => section.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  };

  if (!localCurriculum) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm font-medium text-primary">
          Edit Mode Active - Drag sections and items to reorder them
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Changes will only be saved when you click the Save button
        </p>
      </div>

      {localCurriculum.sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No sections yet. Exit edit mode and add sections to start organizing your curriculum.
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleSectionDragStart}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={localCurriculum.sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {localCurriculum.sections.map((section) => (
                <SortableSection key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {activeSection ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05, rotate: 2 }}
                transition={overlaySpringConfig}
                className="rounded-lg border bg-card shadow-2xl"
                style={{ boxShadow: dragShadow }}
              >
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="text-muted-foreground cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{activeSection.title}</h3>
                    {activeSection.description && (
                      <p className="text-sm text-muted-foreground mt-1">{activeSection.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Progress: {activeSection.items.filter((i) => i.status === 'completed').length}/{activeSection.items.length} ({activeSection.progress}%)
                      </span>
                      <Progress value={activeSection.progress} className="flex-1 max-w-xs" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-secondary/30">
                  <p className="text-sm text-muted-foreground text-center">
                    {activeSection.items.length} items
                  </p>
                </div>
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
