import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db, scheduleSave } from '../db/index.js';
import { curriculums, sections, items } from '../db/schema.js';
import { createCurriculumSchema, updateCurriculumSchema } from '../../../shared/types.js';

const router = Router();

// GET /api/curriculums - List all curriculums with progress
router.get('/curriculums', async (req, res) => {
  try {
    const allCurriculums = await db.select().from(curriculums).orderBy(curriculums.updatedAt);

    const curriculumsWithProgress = await Promise.all(
      allCurriculums.map(async (curriculum) => {
        const stats = await db
          .select({
            total: sql<number>`COUNT(${items.id})`,
            completed: sql<number>`SUM(CASE WHEN ${items.status} = 'completed' THEN 1 ELSE 0 END)`,
          })
          .from(sections)
          .leftJoin(items, eq(items.sectionId, sections.id))
          .where(eq(sections.curriculumId, curriculum.id))
          .get();

        const totalItems = stats?.total || 0;
        const completedItems = stats?.completed || 0;
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return {
          ...curriculum,
          totalItems,
          completedItems,
          progress,
        };
      })
    );

    res.json(curriculumsWithProgress);
  } catch (error) {
    console.error('Failed to fetch curriculums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/curriculums/:id - Get single curriculum with sections and items
router.get('/curriculums/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }

    const curriculum = await db.select().from(curriculums).where(eq(curriculums.id, id)).get();

    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    const allSections = await db
      .select()
      .from(sections)
      .where(eq(sections.curriculumId, id))
      .orderBy(sections.sortOrder);

    const sectionsWithItems = await Promise.all(
      allSections.map(async (section) => {
        const sectionItems = await db
          .select()
          .from(items)
          .where(eq(items.sectionId, section.id))
          .orderBy(items.sortOrder);

        const completedCount = sectionItems.filter((item) => item.status === 'completed').length;
        const progress = sectionItems.length > 0 ? Math.round((completedCount / sectionItems.length) * 100) : 0;

        return {
          ...section,
          items: sectionItems,
          progress,
        };
      })
    );

    res.json({
      ...curriculum,
      sections: sectionsWithItems,
    });
  } catch (error) {
    console.error('Failed to fetch curriculum:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/curriculums - Create new curriculum
router.post('/curriculums', async (req, res) => {
  try {
    const result = createCurriculumSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const now = new Date();
    const newCurriculum = await db
      .insert(curriculums)
      .values({
        ...result.data,
        platformUrl: result.data.platformUrl || null,
        author: result.data.author || null,
        platform: result.data.platform || null,
        description: result.data.description || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    scheduleSave();
    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error('Failed to create curriculum:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/curriculums/:id - Update curriculum
router.patch('/curriculums/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }

    const result = updateCurriculumSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const updated = await db
      .update(curriculums)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(curriculums.id, id))
      .returning()
      .get();

    if (!updated) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    scheduleSave();
    res.json(updated);
  } catch (error) {
    console.error('Failed to update curriculum:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/curriculums/:id - Delete curriculum
router.delete('/curriculums/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }

    await db.delete(curriculums).where(eq(curriculums.id, id));
    scheduleSave();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete curriculum:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
