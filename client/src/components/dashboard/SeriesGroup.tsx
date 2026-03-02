import type { ReactNode } from 'react';
import type { CurriculumWithProgress } from '../../../../shared/types';
import { cn } from '../../lib/utils';

interface SeriesGroupProps {
  seriesName: string;
  curriculums: CurriculumWithProgress[];
  renderCard: (curriculum: CurriculumWithProgress) => ReactNode;
}

export function SeriesGroup({ seriesName, curriculums, renderCard }: SeriesGroupProps) {
  const itemCount = curriculums.length;

  return (
    <div
      className={cn(
        'rounded-xl border border-primary/10 bg-primary/[0.02] p-3 shadow-[0_0_15px_-5px_rgba(250,204,21,0.08)]',
        itemCount >= 2 && 'sm:col-span-2',
        itemCount >= 3 && 'lg:col-span-3',
        itemCount >= 4 && 'xl:col-span-4'
      )}
    >
      <p className="text-xs text-primary/60 font-mono uppercase tracking-wide mb-3">
        {seriesName}
      </p>
      <div
        className={cn(
          'grid gap-4 grid-cols-1',
          itemCount >= 2 && 'sm:grid-cols-2',
          itemCount >= 3 && 'lg:grid-cols-3',
          itemCount >= 4 && 'xl:grid-cols-4'
        )}
      >
        {curriculums.map((curriculum) => (
          <div key={curriculum.id} className="min-w-0">
            {renderCard(curriculum)}
          </div>
        ))}
      </div>
    </div>
  );
}
