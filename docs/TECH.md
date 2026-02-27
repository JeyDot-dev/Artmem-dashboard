# Artmem Dashboard - Technical Stack & Architecture

## Overview

This document outlines the technical architecture, stack choices, and implementation details for the Artmem Dashboard application.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Layer](#5-database-layer)
6. [External Integrations](#6-external-integrations)
7. [Configuration Management](#7-configuration-management)
8. [Development Workflow](#8-development-workflow)

---

## 1. Technology Stack

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | React | 19 | UI component library |
| Build Tool | Vite | Latest | Fast development & bundling |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| Backend Runtime | Node.js | 20+ | Server-side JavaScript |
| Backend Framework | Express | 4.x | HTTP server & routing |
| Database | SQLite (sql.js) | Latest | In-memory SQL database |
| ORM | Drizzle ORM | Latest | Type-safe database queries |

### Frontend Dependencies

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state management, caching |
| `tailwindcss` | Utility-first CSS framework |
| `lucide-react` | Icon library (NO emojis!) |
| `shadcn/ui` | Accessible UI component primitives |
| `zod` | Runtime type validation |
| `clsx` / `tailwind-merge` | Conditional className utilities |
| `@dnd-kit/core` | Core drag-and-drop primitives (edit mode) |
| `@dnd-kit/sortable` | Sortable list utilities (edit mode) |
| `framer-motion` | Physics-based animations, particle system |
| `@fontsource/space-grotesk` | Space Grotesk body font |
| `@fontsource/jetbrains-mono` | JetBrains Mono for numeric HUD data |

### Backend Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server framework |
| `cors` | Cross-origin resource sharing |
| `drizzle-orm` | Database ORM |
| `sql.js` | In-browser SQLite implementation |
| `zod` | Request validation |
| `pixiv-api-client` | Pixiv API wrapper (V3 feature) |
| `dotenv` | Environment variable management |

---

## 2. Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Dashboard  │  │  Curriculum  │  │   Toolbox    │              │
│  │   + Cards    │  │    Detail    │  │   + Pixiv    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                           │                                          │
│                    TanStack Query                                    │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │ HTTP (REST API)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVER (Express)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Curriculum  │  │   Export/    │  │    Pixiv     │              │
│  │    Routes    │  │   Import     │  │    Routes    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                           │                   │                      │
│                    Drizzle ORM          Pixiv API Client             │
│                           │                   │                      │
│                           ▼                   ▼                      │
│                    ┌──────────┐        ┌──────────────┐             │
│                    │  SQLite  │        │  Pixiv API   │             │
│                    │ (sql.js) │        │  (External)  │             │
│                    └──────────┘        └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Local-First**: All data stored locally, no cloud dependencies
2. **Type-Safe**: TypeScript throughout, Zod for runtime validation
3. **Minimal Dependencies**: Lean stack, avoid unnecessary packages
4. **DRY Principle**: Shared types between client/server
5. **Functional React**: No class components, hooks-based architecture
6. **Fidget/Analog UX** (V5): Every interaction produces satisfying physical feedback. See [`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)

---

## 3. Frontend Architecture

### Directory Structure

```
client/src/
├── components/
│   ├── common/          # Shared components (ImportDropzone)
│   ├── curriculum/      # Curriculum-related (Detail, Forms, Widgets)
│   ├── dashboard/       # Dashboard (Cards, StatusSection, Header Row)
│   │   ├── Dashboard.tsx
│   │   ├── CurriculumCard.tsx
│   │   ├── StatusSection.tsx
│   │   ├── DaysRemaining.tsx
│   │   ├── Toolbox.tsx          # V3: Tool launcher widget
│   │   └── PixivWidget.tsx      # V3: Pixiv inspiration widget
│   ├── layout/          # App layout (Header, Sidebar)
│   └── ui/              # shadcn/ui primitives
├── config/
│   └── toolbox.ts       # V3: Hardcoded tool configurations
├── lib/
│   ├── api.ts           # API client functions
│   └── utils.ts         # Utility functions (cn, getDaysRemaining, etc.)
├── styles/
│   └── globals.css      # Global styles, CSS variables
├── App.tsx              # Main application orchestrator
└── main.tsx             # Entry point
```

### State Management Pattern

```typescript
// Server state: TanStack Query
const { data: curriculums } = useQuery({
  queryKey: ['curriculums'],
  queryFn: api.getCurriculums,
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: api.createCurriculum,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['curriculums'] });
  },
});

// Local UI state: useState
const [selectedId, setSelectedId] = useState<number | null>(null);
```

### Design System (V5)

The V5 design system is fully documented in [`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md). Key points:

**Color Palette:**

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#facc15` | Electric yellow - ZZZ signature, interactive elements |
| `accent` | `#22d3ee` | Neon cyan - secondary highlights |
| `accent-pink` | `#f472b6` | Hot pink - tertiary accents |
| `success` | `#34d399` | Neon green - completed states |
| `background` | `#0a0a0f` | Void black |
| `card` | `#111118` | Elevated surface |

**Typography:**
- Body: Space Grotesk (geometric, tech-forward)
- Numbers/stats/dates: JetBrains Mono (`font-mono` class) - HUD/terminal aesthetic

**Animation library** (`client/src/lib/animations.ts`):
- `tactileSpring` - snappy (stiffness 500, damping 30)
- `bounceSpring` - overshoot (stiffness 400, damping 15)
- `gentleSpring` - smooth layout (stiffness 200, damping 25)

### Component Conventions

- Functional components only
- Named exports
- Props interface: `{ComponentName}Props`
- Use `cn()` for conditional classes
- Tailwind CSS for styling
- **V5**: All interactive elements use framer-motion `whileTap={{ scale: 0.95 }}`

---

## 4. Backend Architecture

### Directory Structure

```
server/src/
├── db/
│   ├── index.ts         # Database connection (sql.js)
│   └── schema.ts        # Drizzle schema definitions
├── routes/
│   ├── curriculums.ts   # Curriculum CRUD
│   ├── sections.ts      # Section CRUD
│   ├── items.ts         # Item CRUD + status cycling
│   ├── export.ts        # JSON/Tora export, import
│   └── pixiv.ts         # V3: Pixiv API proxy routes
└── index.ts             # Express app entry point
```

### Route Pattern

```typescript
// server/src/routes/example.ts
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schema
const createSchema = z.object({
  title: z.string().min(1),
  // ...
});

// POST with validation
router.post('/api/resource', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  // ... handle request
});

export default router;
```

### Error Handling

```typescript
// Global error handler in index.ts
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 5. Database Layer

### Schema (Drizzle ORM)

```typescript
// server/src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const curriculums = sqliteTable('curriculums', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author'),
  platform: text('platform'),
  platformUrl: text('platform_url'),
  description: text('description'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('planned'),  // 'ongoing' | 'standby' | 'planned' | 'wishlist'
  startDate: text('start_date'),
  endDate: text('end_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const sections = sqliteTable('sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  curriculumId: integer('curriculum_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sectionId: integer('section_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull().default('other'),
  status: text('status').notNull().default('not_started'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

### Database Commands

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Apply schema changes to database |
| `pnpm db:studio` | Open Drizzle Studio GUI |

---

## 6. External Integrations

### Pixiv API Integration (V3 Feature)

#### Authentication

Pixiv uses OAuth2 with refresh tokens. The app requires a **Pixiv Refresh Token** stored in environment variables.

**Obtaining a Refresh Token:**
1. Use [gppt](https://github.com/eggplants/get-pixivpy-token) (`gppt login`) or browser DevTools
2. Complete Pixiv OAuth flow
3. Extract the refresh token from the response
4. Store in `.env` file

#### Environment Configuration

```bash
# server/.env (DO NOT COMMIT)
PIXIV_REFRESH_TOKEN=your_refresh_token_here
```

**Security Note:** The `.env` file is already in `.gitignore`. Never commit credentials.

#### Backend Routes

```typescript
// server/src/routes/pixiv.ts

// GET /api/pixiv/daily-ranking
// Fetches top 15 illustrations from Pixiv daily ranking
// Response: { illustrations: PixivIllustration[] }

// POST /api/pixiv/bookmark/:illustId
// Bookmarks an illustration to user's Pixiv account
// Response: { success: true }

// DELETE /api/pixiv/bookmark/:illustId
// Removes bookmark from an illustration
// Response: { success: true }
```

#### Pixiv API Client

Implementation in `server/src/lib/pixiv.ts` using `pixiv-api-client`. Exports: `initPixivClient()`, `getDailyRanking(limit)`, `bookmarkIllust(id)`, `unbookmarkIllust(id)`.

#### Type Definitions

Pixiv types (`PixivIllustration`, `PixivRankingResponse`) are defined in `shared/types.ts`. Key fields: `id`, `title`, `imageUrls` (squareMedium/medium/large), `user`, `isBookmarked`.

#### Image Proxy

Pixiv images require a `Referer` header. The backend proxies images:

```typescript
// GET /api/pixiv/image?url=<encoded_pixiv_image_url>
// Proxies the image with proper headers
```

#### Frontend Caching Strategy

To minimize API requests, the Pixiv data is fetched once and cached for the session:

```typescript
// client/src/components/dashboard/PixivWidget.tsx
// Pixiv query configuration
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const pixivQueryConfig = {
  queryKey: ['pixiv', 'daily-ranking', today], // Date in key ensures daily refresh
  queryFn: api.getPixivDailyRanking,
  staleTime: 1000 * 60 * 60 * 12, // 12 hours - data is fresh for half a day
  gcTime: 1000 * 60 * 60 * 24 * 2, // Keep cache for 2 days
  refetchOnMount: true,      // Refetch when component mounts (if stale)
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchOnReconnect: true,  // Refetch if connection was lost
};
```

**Caching Behavior:**
1. **Daily Refresh**: Query key includes current date, automatically fetches fresh data each day
2. **Same-Day Caching**: Data cached for 12 hours to avoid unnecessary refetches within the same day
3. **Dashboard Navigation**: Use cached data from current day, pick random image
4. **Image Rotation**: Track `previousIndices` to avoid showing same image twice consecutively
5. **Manual Refresh**: Refresh button available to force immediate refetch

#### Bookmark State Management

Bookmarks use **optimistic updates**: the UI toggles `isBookmarked` immediately in the TanStack Query cache, with rollback on API error.

| State | Icon | Visual |
|-------|------|--------|
| Not Bookmarked | `Heart` (outline) | `text-muted-foreground` |
| Bookmarked | `Heart` (filled) | `text-destructive fill-destructive` |
| Loading | `Loader2` (spinning) | `animate-spin` |

### Dashboard Search Filter

Client-side search filter for the dashboard (`DashboardSearchBar.tsx`).

**Behavior:**
- Searches across `title`, `author`, `platform` fields simultaneously
- AND logic: all words must appear in the combined searchable text
- Case-insensitive, real-time filtering (no debounce needed at typical scale)
- Filter logic lives in `filterCurriculums()` in `client/src/lib/utils.ts`
- Search state is local to the Dashboard component (`useState`)

### Curriculum Edit Mode

A dedicated editing mode for reordering curriculum sections and items with physics-based drag-and-drop.

#### Component Architecture

```
client/src/components/curriculum/edit-mode/
├── EditModeProvider.tsx     # Context for edit mode state (useEditMode hook)
├── EditModeView.tsx         # Main view with section DragOverlay
├── EditModeFooter.tsx       # Floating control bar (Toggle/Exit/Save)
├── SortableSection.tsx      # Draggable section wrapper with item DragOverlay
├── SortableItem.tsx         # Draggable item wrapper + DropParticles
└── DragHandle.tsx           # Reusable drag handle with neon hover/breathing
```

#### Key Architecture Decisions

- **Optimistic local state**: Curriculum data cloned on entering edit mode; all reordering updates local state only. `isDirty` flag tracks unsaved changes. Batch API call (`PATCH /api/curriculums/:id/reorder`) only on explicit "Save".
- **DragOverlay pattern**: Always use `DragOverlay` (not direct transforms) for visual feedback during drag. Source element fades; overlay follows cursor with scale/rotation.
- **DropParticles**: Neon particle burst on drop (replaces removed `canvas-confetti`). Pure framer-motion, no canvas. Respects `prefers-reduced-motion`. See `DESIGN-SYSTEM.md` Section 7.
- **Animation constants**: All spring configs and motion values imported from `client/src/lib/animations.ts` — never hardcoded inline.

#### Reorder API

```typescript
// PATCH /api/curriculums/:id/reorder
interface ReorderRequest {
  sections: Array<{
    id: number;
    sortOrder: number;
    items: Array<{ id: number; sortOrder: number }>;
  }>;
}
// Response: { success: boolean, curriculum: CurriculumDetail }
```

---

## 7. Configuration Management

### Toolbox Configuration

Tool definitions live in `client/src/config/toolbox.ts`. Each tool has `id`, `name`, `url`, `icon` (LucideIcon), and optional `description`. Add new tools by editing this file.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `PIXIV_REFRESH_TOKEN` | Yes (V3) | Pixiv OAuth refresh token |

### Environment File Template

```bash
# server/.env.example
PORT=3001
PIXIV_REFRESH_TOKEN=your_token_here
```

---

## 8. Development Workflow

### Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development servers (client + server) |
| `pnpm build` | Build for production |
| `pnpm db:push` | Apply database schema changes |
| `pnpm db:studio` | Open Drizzle Studio |

### Port Configuration

| Service | Default Port | Config Location |
|---------|--------------|-----------------|
| Frontend (Vite) | 5173 | `client/vite.config.ts` |
| Backend (Express) | 3001 | `server/.env` or `server/src/index.ts` |

### Adding New Features

1. **Types First**: Define types in `shared/types.ts`
2. **Backend Route**: Add route in `server/src/routes/`
3. **API Client**: Add function in `client/src/lib/api.ts`
4. **Component**: Create component in appropriate directory
5. **Documentation**: Update `PRD.md` and `TECH.md` if architecture changed

---

## Appendix: API Endpoint Reference

### Curriculum Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/curriculums` | List all curriculums |
| GET | `/api/curriculums/:id` | Get curriculum with sections/items |
| POST | `/api/curriculums` | Create curriculum |
| PATCH | `/api/curriculums/:id` | Update curriculum |
| DELETE | `/api/curriculums/:id` | Delete curriculum |
| PATCH | `/api/curriculums/:id/reorder` | V4: Batch reorder sections and items |

### Section Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/curriculums/:id/sections` | Create section |
| PATCH | `/api/sections/:id` | Update section |
| DELETE | `/api/sections/:id` | Delete section |

### Item Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sections/:id/items` | Create item |
| PATCH | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| PATCH | `/api/items/:id/cycle` | Cycle item status |

### Export/Import Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/json` | Export all data as JSON |
| GET | `/api/export/tora` | Export Tora-chan progress markdown |
| POST | `/api/import` | Import curriculum data |

### Pixiv Endpoints (V3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pixiv/daily-ranking` | Get top 15 daily illustrations |
| POST | `/api/pixiv/bookmark/:illustId` | Bookmark illustration |
| DELETE | `/api/pixiv/bookmark/:illustId` | Remove bookmark |
| GET | `/api/pixiv/image` | Proxy Pixiv image |

---

## Related Documents

- [PRD.md](./PRD.md) - Product requirements and user stories
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) - V5 design system: colors, typography, animations, component patterns
- [V2-FEATURES.md](./V2-FEATURES.md) - V2 feature specification
- [AGENTS.md](../AGENTS.md) - AI coding assistant guidelines
- [README.md](../README.md) - Setup and usage guide
