import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db, scheduleSave } from '../db/index.js';
import { sections } from '../db/schema.js';
import { createSectionSchema, updateSectionSchema } from '../../../shared/types.js';

const router = Router();

// POST /api/curriculums/:id/sections - Create section
router.post('/curriculums/:id/sections', async (req, res) => {
  try {
    const curriculumId = parseInt(req.params.id);
    if (isNaN(curriculumId)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }

    const result = createSectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    // Get max sort order for this curriculum
    const maxOrder = await db
      .select({ max: sections.sortOrder })
      .from(sections)
      .where(eq(sections.curriculumId, curriculumId))
      .get();

    const sortOrder = (maxOrder?.max ?? -1) + 1;
    const now = new Date();

    const newSection = await db
      .insert(sections)
      .values({
        curriculumId,
        ...result.data,
        description: result.data.description || null,
        sortOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    scheduleSave();
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Failed to create section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/sections/:id - Update section
router.patch('/sections/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const result = updateSectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const updated = await db
      .update(sections)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(sections.id, id))
      .returning()
      .get();

    if (!updated) {
      return res.status(404).json({ error: 'Section not found' });
    }

    scheduleSave();
    res.json(updated);
  } catch (error) {
    console.error('Failed to update section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sections/:id - Delete section
router.delete('/sections/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    await db.delete(sections).where(eq(sections.id, id));
    scheduleSave();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/sections/reorder - Reorder sections
router.patch('/sections/reorder', async (req, res) => {
  try {
    const { sectionIds } = req.body;
    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ error: 'sectionIds must be an array' });
    }

    await Promise.all(
      sectionIds.map((id, index) =>
        db.update(sections).set({ sortOrder: index }).where(eq(sections.id, id))
      )
    );

    scheduleSave();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to reorder sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
