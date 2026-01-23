import { Router } from 'express';
import { eq } from 'drizzle-orm';
import archiver from 'archiver';
import { format } from 'date-fns';
import { db, scheduleSave } from '../db/index.js';
import { curriculums, sections, items } from '../db/schema.js';
import { curriculumJSONSchema, CurriculumJSON } from '../../../shared/types.js';

const router = Router();

// POST /api/import - Import curriculum from JSON
router.post('/import', async (req, res) => {
  try {
    const result = curriculumJSONSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const data = result.data;
    const now = new Date();

    // Create curriculum
    const newCurriculum = await db
      .insert(curriculums)
      .values({
        title: data.title,
        author: data.author || null,
        platform: data.platform || null,
        platformUrl: data.platformUrl || null,
        description: data.description || null,
        priority: data.priority || 'medium',
        status: data.status || 'planned',
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    // Create sections and items
    for (let i = 0; i < data.sections.length; i++) {
      const sectionData = data.sections[i];
      const newSection = await db
        .insert(sections)
        .values({
          curriculumId: newCurriculum.id,
          title: sectionData.title,
          description: sectionData.description || null,
          sortOrder: i,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
        .get();

      for (let j = 0; j < sectionData.items.length; j++) {
        const itemData = sectionData.items[j];
        await db.insert(items).values({
          sectionId: newSection.id,
          title: itemData.title,
          description: itemData.description || null,
          type: itemData.type || 'other',
          status: itemData.status || 'not_started',
          sortOrder: j,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    scheduleSave();
    res.status(201).json({ message: 'Curriculum imported successfully', id: newCurriculum.id });
  } catch (error) {
    console.error('Failed to import curriculum:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/export/json - Export full database as JSON
router.get('/export/json', async (req, res) => {
  try {
    const allCurriculums = await db.select().from(curriculums);

    const exportData: CurriculumJSON[] = await Promise.all(
      allCurriculums.map(async (curriculum) => {
        const curriculumSections = await db
          .select()
          .from(sections)
          .where(eq(sections.curriculumId, curriculum.id))
          .orderBy(sections.sortOrder);

        const sectionsWithItems = await Promise.all(
          curriculumSections.map(async (section) => {
            const sectionItems = await db
              .select()
              .from(items)
              .where(eq(items.sectionId, section.id))
              .orderBy(items.sortOrder);

            return {
              title: section.title,
              description: section.description || undefined,
              items: sectionItems.map((item) => ({
                title: item.title,
                description: item.description || undefined,
                type: item.type as any,
                status: item.status as any,
              })),
            };
          })
        );

        return {
          title: curriculum.title,
          author: curriculum.author || undefined,
          platform: curriculum.platform || undefined,
          platformUrl: curriculum.platformUrl || undefined,
          description: curriculum.description || undefined,
          priority: curriculum.priority as any,
          status: curriculum.status as any,
          sections: sectionsWithItems,
        };
      })
    );

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tora-export-${format(new Date(), 'yyyy-MM-dd')}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Failed to export JSON:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/export/tora - Generate Tora-chan Memory Pack
router.get('/export/tora', async (req, res) => {
  try {
    const allCurriculums = await db.select().from(curriculums);

    // Generate Markdown
    let markdown = `# Tora-chan Art Study Progress Report\n\n`;
    markdown += `Generated: ${format(new Date(), 'yyyy-MM-dd')}\n\n`;

    // Ongoing curriculums - full detail
    const ongoingCurriculums = allCurriculums.filter((c) => c.status === 'ongoing');
    if (ongoingCurriculums.length > 0) {
      markdown += `## Active Studies (Ongoing)\n\n`;

      for (const curriculum of ongoingCurriculums) {
        markdown += `### ${curriculum.title}\n`;
        if (curriculum.author) markdown += `**Author:** ${curriculum.author}`;
        if (curriculum.platform) {
          markdown += ` | **Platform:** ${curriculum.platformUrl ? `[${curriculum.platform}](${curriculum.platformUrl})` : curriculum.platform}`;
        }
        if (curriculum.priority) markdown += ` | **Priority:** ${curriculum.priority}`;
        markdown += `\n`;

        const curriculumSections = await db
          .select()
          .from(sections)
          .where(eq(sections.curriculumId, curriculum.id))
          .orderBy(sections.sortOrder);

        let totalItems = 0;
        let completedItems = 0;

        for (const section of curriculumSections) {
          markdown += `\n#### ${section.title}\n`;
          if (section.description) markdown += `${section.description}\n`;

          const sectionItems = await db
            .select()
            .from(items)
            .where(eq(items.sectionId, section.id))
            .orderBy(items.sortOrder);

          totalItems += sectionItems.length;
          completedItems += sectionItems.filter((i) => i.status === 'completed').length;

          for (const item of sectionItems) {
            const icon = item.status === 'completed' ? '✓' : item.status === 'in_progress' ? '▶' : ' ';
            const statusLabel = item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : 'Not Started';
            markdown += `- [${icon}] ${item.title} (${item.type}) — ${statusLabel}\n`;
          }
        }

        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        markdown = markdown.replace(`### ${curriculum.title}\n`, `### ${curriculum.title}\n**Progress:** ${completedItems}/${totalItems} items (${progress}%)\n\n`);
        markdown += `\n---\n\n`;
      }
    }

    // Standby curriculums - minimal detail
    const standbyCurriculums = allCurriculums.filter((c) => c.status === 'standby');
    if (standbyCurriculums.length > 0) {
      markdown += `## On Hold (Standby)\n\n`;

      for (const curriculum of standbyCurriculums) {
        markdown += `### ${curriculum.title}\n`;
        if (curriculum.description) markdown += `${curriculum.description}\n\n`;
        else markdown += `Currently on hold.\n\n`;

        const curriculumSections = await db
          .select()
          .from(sections)
          .where(eq(sections.curriculumId, curriculum.id))
          .orderBy(sections.sortOrder);

        if (curriculumSections.length > 0) {
          markdown += `**Sections:** ${curriculumSections.map((s) => s.title).join(', ')}\n\n`;
        }
        markdown += `---\n\n`;
      }
    }

    // Planned curriculums - minimal detail
    const plannedCurriculums = allCurriculums.filter((c) => c.status === 'planned');
    if (plannedCurriculums.length > 0) {
      markdown += `## Planned\n\n`;

      for (const curriculum of plannedCurriculums) {
        markdown += `### ${curriculum.title}\n`;
        if (curriculum.description) markdown += `${curriculum.description}\n\n`;
        else markdown += `Not yet started.\n\n`;
      }
    }

    // Generate full JSON export
    const exportData: CurriculumJSON[] = await Promise.all(
      allCurriculums.map(async (curriculum) => {
        const curriculumSections = await db
          .select()
          .from(sections)
          .where(eq(sections.curriculumId, curriculum.id))
          .orderBy(sections.sortOrder);

        const sectionsWithItems = await Promise.all(
          curriculumSections.map(async (section) => {
            const sectionItems = await db
              .select()
              .from(items)
              .where(eq(items.sectionId, section.id))
              .orderBy(items.sortOrder);

            return {
              title: section.title,
              description: section.description || undefined,
              items: sectionItems.map((item) => ({
                title: item.title,
                description: item.description || undefined,
                type: item.type as any,
                status: item.status as any,
              })),
            };
          })
        );

        return {
          title: curriculum.title,
          author: curriculum.author || undefined,
          platform: curriculum.platform || undefined,
          platformUrl: curriculum.platformUrl || undefined,
          description: curriculum.description || undefined,
          priority: curriculum.priority as any,
          status: curriculum.status as any,
          sections: sectionsWithItems,
        };
      })
    );

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const timestamp = format(new Date(), 'yyyy-MM-dd');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="tora-memory-pack-${timestamp}.zip"`);

    archive.pipe(res);
    archive.append(markdown, { name: `tora-progress-${timestamp}.md` });
    archive.append(JSON.stringify(exportData, null, 2), { name: `tora-full-backup-${timestamp}.json` });
    await archive.finalize();
  } catch (error) {
    console.error('Failed to export Tora pack:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
