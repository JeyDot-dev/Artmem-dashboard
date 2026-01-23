import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db, scheduleSave } from '../db/index.js';
import { items } from '../db/schema.js';
import { createItemSchema, updateItemSchema, ItemStatus } from '../../../shared/types.js';

const router = Router();

// POST /api/sections/:id/items - Create item
router.post('/sections/:id/items', async (req, res) => {
  try {
    const sectionId = parseInt(req.params.id);
    if (isNaN(sectionId)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const result = createItemSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    // Get max sort order for this section
    const maxOrder = await db
      .select({ max: items.sortOrder })
      .from(items)
      .where(eq(items.sectionId, sectionId))
      .get();

    const sortOrder = (maxOrder?.max ?? -1) + 1;
    const now = new Date();

    const newItem = await db
      .insert(items)
      .values({
        sectionId,
        ...result.data,
        description: result.data.description || null,
        sortOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    scheduleSave();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Failed to create item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/items/:id - Update item
router.patch('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const result = updateItemSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const updated = await db
      .update(items)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(items.id, id))
      .returning()
      .get();

    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }

    scheduleSave();
    res.json(updated);
  } catch (error) {
    console.error('Failed to update item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/items/:id/status - Cycle item status
router.patch('/items/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await db.select().from(items).where(eq(items.id, id)).get();
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Cycle: not_started -> in_progress -> completed -> not_started
    const statusCycle: Record<ItemStatus, ItemStatus> = {
      not_started: 'in_progress',
      in_progress: 'completed',
      completed: 'not_started',
    };

    const newStatus = statusCycle[item.status as ItemStatus];

    const updated = await db
      .update(items)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(items.id, id))
      .returning()
      .get();

    scheduleSave();
    res.json(updated);
  } catch (error) {
    console.error('Failed to update item status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    await db.delete(items).where(eq(items.id, id));
    scheduleSave();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/items/reorder - Reorder items
router.patch('/items/reorder', async (req, res) => {
  try {
    const { itemIds } = req.body;
    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ error: 'itemIds must be an array' });
    }

    await Promise.all(
      itemIds.map((id, index) =>
        db.update(items).set({ sortOrder: index }).where(eq(items.id, id))
      )
    );

    scheduleSave();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to reorder items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
