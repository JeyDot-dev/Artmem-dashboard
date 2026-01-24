import { useQuery } from '@tanstack/react-query';
import { StatusSection } from './StatusSection';
import { CurriculumCard, CurriculumCardWithTask } from './CurriculumCard';
import { getDaysRemaining } from '../../lib/utils';
import * as api from '../../lib/api';
import type { CurriculumWithProgress, CurriculumStatus } from '../../../../shared/types';

interface DashboardProps {
  curriculums: CurriculumWithProgress[];
  onSelectCurriculum: (id: number) => void;
}

export function Dashboard({ curriculums, onSelectCurriculum }: DashboardProps) {
  // Group curriculums by status
  const groupedByStatus: Record<CurriculumStatus, CurriculumWithProgress[]> = {
    ongoing: [],
    standby: [],
    planned: [],
  };
  
  curriculums.forEach((curriculum) => {
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
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your learning progress across all curriculums
        </p>
      </div>
      
      {/* Ongoing Section - with current task */}
      {groupedByStatus.ongoing.length > 0 && (
        <StatusSection
          status="ongoing"
          count={groupedByStatus.ongoing.length}
          defaultExpanded={true}
        >
          {groupedByStatus.ongoing.map((curriculum) => (
            <OngoingCard
              key={curriculum.id}
              curriculum={curriculum}
              onClick={onSelectCurriculum}
            />
          ))}
        </StatusSection>
      )}
      
      {/* Standby Section */}
      {groupedByStatus.standby.length > 0 && (
        <StatusSection
          status="standby"
          count={groupedByStatus.standby.length}
          defaultExpanded={false}
        >
          {groupedByStatus.standby.map((curriculum) => (
            <CurriculumCard
              key={curriculum.id}
              curriculum={curriculum}
              onClick={onSelectCurriculum}
            />
          ))}
        </StatusSection>
      )}
      
      {/* Planned Section */}
      {groupedByStatus.planned.length > 0 && (
        <StatusSection
          status="planned"
          count={groupedByStatus.planned.length}
          defaultExpanded={false}
        >
          {groupedByStatus.planned.map((curriculum) => (
            <CurriculumCard
              key={curriculum.id}
              curriculum={curriculum}
              onClick={onSelectCurriculum}
            />
          ))}
        </StatusSection>
      )}
      
      {/* Empty state */}
      {curriculums.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No curriculums yet</p>
          <p className="text-sm">Create your first curriculum to get started!</p>
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
