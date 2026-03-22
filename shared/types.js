import { z } from 'zod';
// Enums
export const curriculumStatusSchema = z.enum(['ongoing', 'standby', 'planned', 'wishlist', 'completed', 'dropped']);
export const curriculumPrioritySchema = z.enum(['high', 'medium', 'low']);
export const itemTypeSchema = z.enum(['video', 'reading', 'exercise', 'homework', 'other']);
export const itemStatusSchema = z.enum(['not_started', 'in_progress', 'completed']);
// Validation schemas
export const createCurriculumSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().nullish(),
    platform: z.string().nullish(),
    platformUrl: z.string().url().nullish().or(z.literal('')),
    description: z.string().nullish(),
    note: z.string().nullish(),
    seriesName: z.string().nullish(),
    seriesOrder: z.number().int().positive().nullish(),
    isSeriesFinale: z.boolean().nullish(),
    priority: curriculumPrioritySchema.default('medium'),
    status: curriculumStatusSchema.default('planned'),
    startDate: z.preprocess((val) => {
        if (val === null || val === undefined || val === '')
            return null;
        return val;
    }, z.coerce.date().nullable().optional()),
    endDate: z.preprocess((val) => {
        if (val === null || val === undefined || val === '')
            return null;
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
export const curriculumJSONSchema = z.object({
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
