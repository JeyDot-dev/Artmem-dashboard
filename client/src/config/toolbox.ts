import { Users, Bone, Timer, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export const tools: Tool[] = [
  {
    id: 'find-tutor',
    name: 'Find Tutor',
    url: 'https://www.wyzant.com/match/tutor/85927027/contact',
    icon: Users,
    description: 'Connect with a tutor',
  },
  {
    id: 'skeleton-reference',
    name: 'Skeleton Reference',
    url: 'https://sketchfab.com/3d-models/human-skeleton-highresolution-model-657a31ed9704423c8c4e752fb2506a74',
    icon: Bone,
    description: '3D skeleton model',
  },
  {
    id: 'gesture-timer',
    name: 'Gesture Timer',
    url: 'https://www.proko.com/timer',
    icon: Timer,
    description: 'Timed gesture drawing',
  },
  {
    id: 'value-study',
    name: 'Value Study',
    url: 'https://www.proko.com/values',
    icon: Zap,
    description: 'Study light & shadow',
  },
];
