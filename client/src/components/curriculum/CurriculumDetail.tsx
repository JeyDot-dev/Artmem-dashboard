import { Edit, Trash2, Plus, Video, BookOpen, Dumbbell, FileText, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { CurriculumDetail, ItemType } from '../../../../shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn, scrollToItem } from '@/lib/utils';
import { DaysRemaining } from '../dashboard/DaysRemaining';
import { CurrentTaskWidget } from './CurrentTaskWidget';

interface CurriculumDetailViewProps {
  curriculum: CurriculumDetail;
  onEdit: () => void;
  onDelete: () => void;
  onAddSection: () => void;
  onEditSection: (sectionId: number) => void;
  onDeleteSection: (sectionId: number) => void;
  onAddItem: (sectionId: number) => void;
  onEditItem: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
  onCycleItemStatus: (itemId: number) => void;
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

const priorityColors = {
  high: 'text-destructive',
  medium: 'text-accent',
  low: 'text-muted-foreground',
};

export function CurriculumDetailView({
  curriculum,
  onEdit,
  onDelete,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onCycleItemStatus,
}: CurriculumDetailViewProps) {
  const totalItems = curriculum.sections.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = curriculum.sections.reduce(
    (sum, s) => sum + s.items.filter((i) => i.status === 'completed').length,
    0
  );
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">
                  {curriculum.platformUrl ? (
                    <a
                      href={curriculum.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {curriculum.title}
                    </a>
                  ) : (
                    curriculum.title
                  )}
                </CardTitle>
                <span className={cn('text-sm font-medium', priorityColors[curriculum.priority])}>
                  {curriculum.priority.toUpperCase()}
                </span>
                <span className="text-sm px-2 py-1 rounded-md bg-secondary">
                  {curriculum.status}
                </span>
              </div>
              {curriculum.author && (
                <p className="text-sm text-muted-foreground">
                  by {curriculum.author}
                  {curriculum.platform && (
                    <>
                      {' • '}
                      {curriculum.platformUrl ? (
                        <a
                          href={curriculum.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {curriculum.platform}
                        </a>
                      ) : (
                        curriculum.platform
                      )}
                    </>
                  )}
                </p>
              )}
              {curriculum.description && (
                <CardDescription className="mt-2">{curriculum.description}</CardDescription>
              )}
              {curriculum.endDate && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Goal: {format(typeof curriculum.endDate === 'string' ? new Date(curriculum.endDate) : curriculum.endDate, 'MMM d, yyyy')}
                  </span>
                  <DaysRemaining endDate={curriculum.endDate} />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">
                {completedItems}/{totalItems} items ({progress}%)
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
      </Card>

      {/* Current Task Widget */}
      <CurrentTaskWidget 
        curriculum={curriculum} 
        onTaskClick={(itemId) => scrollToItem(itemId)} 
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sections</h2>
        <Button onClick={onAddSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {curriculum.sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No sections yet. Add your first section to start organizing your curriculum.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {curriculum.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    {section.description && (
                      <CardDescription className="mt-1">{section.description}</CardDescription>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-muted-foreground">
                        Progress: {section.items.filter((i) => i.status === 'completed').length}/
                        {section.items.length} ({section.progress}%)
                      </span>
                      <Progress value={section.progress} className="flex-1 max-w-xs" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onAddItem(section.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Item
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditSection(section.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {section.items.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        data-item-id={item.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border transition-colors group',
                          item.status === 'completed' && 'bg-secondary/50 border-accent/20',
                          item.status === 'in_progress' && 'bg-primary/5 border-primary/20',
                          item.status === 'not_started' && 'border-border hover:bg-secondary/30'
                        )}
                      >
                        <button
                          onClick={() => onCycleItemStatus(item.id)}
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-md border-2 transition-all hover:scale-110',
                            item.status === 'completed' && 'bg-accent border-accent text-accent-foreground',
                            item.status === 'in_progress' && 'bg-primary border-primary text-primary-foreground',
                            item.status === 'not_started' && 'border-muted'
                          )}
                        >
                          <span className="text-lg font-bold">{statusIcons[item.status]}</span>
                        </button>

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

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => onEditItem(item.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
