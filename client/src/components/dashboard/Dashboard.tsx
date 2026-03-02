import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatusSection } from './StatusSection';
import { CurriculumCard, CurriculumCardWithTask } from './CurriculumCard';
import { SeriesGroup } from './SeriesGroup';
import { DashboardHeaderRow } from './DashboardHeaderRow';
import { DashboardSearchBar } from './DashboardSearchBar';
import { getDaysRemaining, filterCurriculums } from '../../lib/utils';
import * as api from '../../lib/api';
import type { CurriculumWithProgress, CurriculumStatus } from '../../../../shared/types';

interface DashboardProps {
  curriculums: CurriculumWithProgress[];
  onSelectCurriculum: (id: number) => void;
}

type DashboardEntry =
  | { type: 'standalone'; curriculum: CurriculumWithProgress }
  | { type: 'series'; seriesName: string; curriculums: CurriculumWithProgress[] };

function groupBySeriesForDashboard(curriculums: CurriculumWithProgress[]): DashboardEntry[] {
  const entries: DashboardEntry[] = [];
  const seriesMap = new Map<string, { type: 'series'; seriesName: string; curriculums: CurriculumWithProgress[] }>();

  curriculums.forEach((curriculum) => {
    if (!curriculum.seriesName) {
      entries.push({ type: 'standalone', curriculum });
      return;
    }

    const existingSeries = seriesMap.get(curriculum.seriesName);
    if (existingSeries) {
      existingSeries.curriculums.push(curriculum);
      return;
    }

    const newSeriesEntry = {
      type: 'series' as const,
      seriesName: curriculum.seriesName,
      curriculums: [curriculum],
    };

    seriesMap.set(curriculum.seriesName, newSeriesEntry);
    entries.push(newSeriesEntry);
  });

  const normalizedEntries: DashboardEntry[] = [];

  for (const entry of entries) {
    if (entry.type === 'standalone') {
      normalizedEntries.push(entry);
      continue;
    }

    const sortedCurriculums = [...entry.curriculums].sort((a, b) => {
      const orderA = a.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    // A "series" with one item should render as a normal card.
    if (sortedCurriculums.length <= 1) {
      normalizedEntries.push({ type: 'standalone', curriculum: sortedCurriculums[0] });
      continue;
    }

    normalizedEntries.push({
      ...entry,
      curriculums: sortedCurriculums,
    });
  }

  return normalizedEntries;
}

export function Dashboard({ curriculums, onSelectCurriculum }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply search filter
  const filteredCurriculums = filterCurriculums(curriculums, searchQuery);
  
  // Group filtered curriculums by status
  const groupedByStatus: Record<CurriculumStatus, CurriculumWithProgress[]> = {
    ongoing: [],
    standby: [],
    planned: [],
    wishlist: [],
    completed: [],
  };
  
  filteredCurriculums.forEach((curriculum) => {
    groupedByStatus[curriculum.status].push(curriculum);
  });
  
  // Sort each group by end date (ascending - nearest deadline first)
  // Curriculums without end date appear at the bottom
  Object.keys(groupedByStatus).forEach((status) => {
    groupedByStatus[status as CurriculumStatus].sort((a, b) => {
      const daysA = getDaysRemaining(a.endDate);
      const daysB = getDaysRemaining(b.endDate);
      
      // If both have no date, maintain order
      if (daysA === null && daysB === null) return 0;
      // If only A has no date, push to bottom
      if (daysA === null) return 1;
      // If only B has no date, push to bottom
      if (daysB === null) return -1;
      // Both have dates, sort by days remaining
      return daysA - daysB;
    });
  });

  const groupedDashboardEntries: Record<CurriculumStatus, DashboardEntry[]> = {
    ongoing: groupBySeriesForDashboard(groupedByStatus.ongoing),
    standby: groupBySeriesForDashboard(groupedByStatus.standby),
    planned: groupBySeriesForDashboard(groupedByStatus.planned),
    wishlist: groupBySeriesForDashboard(groupedByStatus.wishlist),
    completed: groupBySeriesForDashboard(groupedByStatus.completed),
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your learning progress across all curriculums
        </p>
      </div>
      
      {/* Search Bar */}
      <DashboardSearchBar value={searchQuery} onChange={setSearchQuery} />
      
      {/* Dashboard Header Row - Toolbox + Pixiv Widget */}
      <DashboardHeaderRow />
      
      {/* Ongoing Section - with current task */}
      {groupedByStatus.ongoing.length > 0 && (
        <StatusSection
          status="ongoing"
          count={groupedByStatus.ongoing.length}
          defaultExpanded={true}
        >
          {groupedDashboardEntries.ongoing.map((entry) =>
            entry.type === 'series' ? (
              <SeriesGroup
                key={`series-ongoing-${entry.seriesName}`}
                seriesName={entry.seriesName}
                curriculums={entry.curriculums}
                renderCard={(curriculum) => (
                  <OngoingCard curriculum={curriculum} onClick={onSelectCurriculum} />
                )}
              />
            ) : (
              <OngoingCard
                key={entry.curriculum.id}
                curriculum={entry.curriculum}
                onClick={onSelectCurriculum}
              />
            )
          )}
        </StatusSection>
      )}
      
      {/* Standby Section */}
      {groupedByStatus.standby.length > 0 && (
        <StatusSection
          status="standby"
          count={groupedByStatus.standby.length}
          defaultExpanded={false}
        >
          {groupedDashboardEntries.standby.map((entry) =>
            entry.type === 'series' ? (
              <SeriesGroup
                key={`series-standby-${entry.seriesName}`}
                seriesName={entry.seriesName}
                curriculums={entry.curriculums}
                renderCard={(curriculum) => (
                  <CurriculumCard curriculum={curriculum} onClick={onSelectCurriculum} />
                )}
              />
            ) : (
              <CurriculumCard
                key={entry.curriculum.id}
                curriculum={entry.curriculum}
                onClick={onSelectCurriculum}
              />
            )
          )}
        </StatusSection>
      )}
      
      {/* Planned Section */}
      {groupedByStatus.planned.length > 0 && (
        <StatusSection
          status="planned"
          count={groupedByStatus.planned.length}
          defaultExpanded={false}
        >
          {groupedDashboardEntries.planned.map((entry) =>
            entry.type === 'series' ? (
              <SeriesGroup
                key={`series-planned-${entry.seriesName}`}
                seriesName={entry.seriesName}
                curriculums={entry.curriculums}
                renderCard={(curriculum) => (
                  <CurriculumCard curriculum={curriculum} onClick={onSelectCurriculum} />
                )}
              />
            ) : (
              <CurriculumCard
                key={entry.curriculum.id}
                curriculum={entry.curriculum}
                onClick={onSelectCurriculum}
              />
            )
          )}
        </StatusSection>
      )}
      
      {/* Wishlist Section */}
      {groupedByStatus.wishlist.length > 0 && (
        <StatusSection
          status="wishlist"
          count={groupedByStatus.wishlist.length}
          defaultExpanded={false}
        >
          {groupedDashboardEntries.wishlist.map((entry) =>
            entry.type === 'series' ? (
              <SeriesGroup
                key={`series-wishlist-${entry.seriesName}`}
                seriesName={entry.seriesName}
                curriculums={entry.curriculums}
                renderCard={(curriculum) => (
                  <CurriculumCard curriculum={curriculum} onClick={onSelectCurriculum} />
                )}
              />
            ) : (
              <CurriculumCard
                key={entry.curriculum.id}
                curriculum={entry.curriculum}
                onClick={onSelectCurriculum}
              />
            )
          )}
        </StatusSection>
      )}

      {/* Completed Section */}
      {groupedByStatus.completed.length > 0 && (
        <StatusSection
          status="completed"
          count={groupedByStatus.completed.length}
          defaultExpanded={false}
        >
          {groupedDashboardEntries.completed.map((entry) =>
            entry.type === 'series' ? (
              <SeriesGroup
                key={`series-completed-${entry.seriesName}`}
                seriesName={entry.seriesName}
                curriculums={entry.curriculums}
                renderCard={(curriculum) => (
                  <CurriculumCard curriculum={curriculum} onClick={onSelectCurriculum} compact />
                )}
              />
            ) : (
              <CurriculumCard
                key={entry.curriculum.id}
                curriculum={entry.curriculum}
                onClick={onSelectCurriculum}
                compact
              />
            )
          )}
        </StatusSection>
      )}
      
      {/* Empty state - no curriculums at all */}
      {curriculums.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No curriculums yet</p>
          <p className="text-sm">Create your first curriculum to get started!</p>
        </div>
      )}
      
      {/* No search results */}
      {filteredCurriculums.length === 0 && curriculums.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No matching curriculums</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}

// Wrapper component for ongoing cards that fetches curriculum detail for current task
function OngoingCard({ 
  curriculum, 
  onClick 
}: { 
  curriculum: CurriculumWithProgress; 
  onClick: (id: number) => void;
}) {
  // Fetch curriculum detail to get current task
  const { data: curriculumDetail } = useQuery({
    queryKey: ['curriculum', curriculum.id],
    queryFn: () => api.getCurriculum(curriculum.id),
    staleTime: 30000, // Cache for 30 seconds
  });
  
  return (
    <CurriculumCardWithTask
      curriculum={curriculum}
      curriculumDetail={curriculumDetail}
      onClick={onClick}
    />
  );
}
