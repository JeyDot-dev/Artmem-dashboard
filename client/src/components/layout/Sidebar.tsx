import { Menu, Plus, ChevronRight } from 'lucide-react';
import { CurriculumWithProgress, CurriculumStatus } from '../../../../shared/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  curriculums: CurriculumWithProgress[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const statusGroups: { status: CurriculumStatus; label: string }[] = [
  { status: 'ongoing', label: 'Ongoing' },
  { status: 'standby', label: 'Standby' },
  { status: 'planned', label: 'Planned' },
];

export function Sidebar({ curriculums, selectedId, onSelect, onAddNew, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        {!collapsed && (
          <button
            onClick={onAddNew}
            className="p-2 hover:bg-secondary rounded-md transition-colors text-primary"
            aria-label="Add curriculum"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {statusGroups.map(({ status, label }) => {
          const items = curriculums.filter((c) => c.status === status);
          if (items.length === 0 && collapsed) return null;

          return (
            <div key={status} className="mb-4">
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {label}
                </div>
              )}
              <div className="space-y-1">
                {items.map((curriculum) => (
                  <button
                    key={curriculum.id}
                    onClick={() => onSelect(curriculum.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                      selectedId === curriculum.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-foreground'
                    )}
                  >
                    {collapsed ? (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-left truncate">{curriculum.title}</div>
                          {curriculum.platform && (
                            <div className="text-xs opacity-70 truncate mt-0.5">
                              {curriculum.platform}
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-xs font-medium flex-shrink-0",
                          selectedId === curriculum.id
                            ? "text-primary-foreground"
                            : "text-foreground opacity-70"
                        )}>{curriculum.progress}%</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
