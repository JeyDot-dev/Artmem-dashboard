import { z } from 'zod';

// Enums
export const curriculumStatusSchema = z.enum(['ongoing', 'standby', 'planned', 'wishlist']);
export const curriculumPrioritySchema = z.enum(['high', 'medium', 'low']);
export const itemTypeSchema = z.enum(['video', 'reading', 'exercise', 'homework', 'other']);
export const itemStatusSchema = z.enum(['not_started', 'in_progress', 'completed']);

export type CurriculumStatus = z.infer<typeof curriculumStatusSchema>;
export type CurriculumPriority = z.infer<typeof curriculumPrioritySchema>;
export type ItemType = z.infer<typeof itemTypeSchema>;
export type ItemStatus = z.infer<typeof itemStatusSchema>;

// Database entities
export interface Curriculum {
  id: number;
  title: string;
  author: string | null;
  platform: string | null;
  platformUrl: string | null;
  description: string | null;
  priority: CurriculumPriority;
  status: CurriculumStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: number;
  curriculumId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: number;
  sectionId: number;
  title: string;
  description: string | null;
  type: ItemType;
  status: ItemStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface CurriculumWithProgress extends Curriculum {
  totalItems: number;
  completedItems: number;
  progress: number;
}

export interface CurriculumDetail extends Curriculum {
  sections: SectionWithItems[];
}

export interface SectionWithItems extends Section {
  items: Item[];
  progress: number;
}

// JSON import/export types
export interface CurriculumJSON {
  title: string;
  author?: string;
  platform?: string;
  platformUrl?: string;
  description?: string;
  priority?: CurriculumPriority;
  status?: CurriculumStatus;
  startDate?: string;
  endDate?: string;
  sections: SectionJSON[];
}

export interface SectionJSON {
  title: string;
  description?: string;
  items: ItemJSON[];
}

export interface ItemJSON {
  title: string;
  description?: string;
  type?: ItemType;
  status?: ItemStatus;
}

// Validation schemas
export const createCurriculumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().nullish(),
  platform: z.string().nullish(),
  platformUrl: z.string().url().nullish().or(z.literal('')),
  description: z.string().nullish(),
  priority: curriculumPrioritySchema.default('medium'),
  status: curriculumStatusSchema.default('planned'),
  startDate: z.preprocess((val: unknown) => {
    if (val === null || val === undefined || val === '') return null;
    return val;
  }, z.coerce.date().nullable().optional()),
  endDate: z.preprocess((val: unknown) => {
    if (val === null || val === undefined || val === '') return null;
    return val;
  }, z.coerce.date().nullable().optional()),
});

export const updateCurriculumSchema = createCurriculumSchema.partial();

export const createSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullish(),
});

export const updateSectionSchema = createSectionSchema.partial();

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullish(),
  type: itemTypeSchema.default('other'),
  status: itemStatusSchema.default('not_started'),
});

export const updateItemSchema = createItemSchema.partial();

export const curriculumJSONSchema: z.ZodType<CurriculumJSON> = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  platform: z.string().optional(),
  platformUrl: z.string().optional(),
  description: z.string().optional(),
  priority: curriculumPrioritySchema.optional(),
  status: curriculumStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sections: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      type: itemTypeSchema.optional(),
      status: itemStatusSchema.optional(),
    })),
  })),
});

// V2 Types for Dashboard
export interface TaskPreview {
  id: number;
  title: string;
  type: ItemType;
  status: ItemStatus;
  sectionTitle: string;
}

export interface CurriculumCardData extends CurriculumWithProgress {
  daysRemaining: number | null;
  currentTask: TaskPreview | null;
}

export interface CurrentTaskInfo extends TaskPreview {
  description: string | null;
  sectionId: number;
}

// V3 Types for Pixiv Integration
export interface PixivIllustration {
  id: number;
  title: string;
  type: string;
  imageUrls: {
    squareMedium: string;
    medium: string;
    large: string;
    original: string;
  };
  caption: string;
  user: {
    id: number;
    name: string;
    account: string;
    profileImageUrls: {
      medium: string;
    };
  };
  tags: Array<{ name: string }>;
  width: number;
  height: number;
  isBookmarked: boolean;
}

export interface PixivRankingResponse {
  illustrations: PixivIllustration[];
}

// V3 Types for Toolbox
export interface Tool {
  id: string;
  name: string;
  url: string;
  icon: string; // Icon name from lucide-react
  description?: string;
}
