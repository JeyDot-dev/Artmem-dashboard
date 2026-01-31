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
| `@dnd-kit/core` | V4: Core drag-and-drop primitives |
| `@dnd-kit/sortable` | V4: Sortable list utilities |
| `framer-motion` | V4: Physics-based layout animations |
| `canvas-confetti` | V4: Particle burst effects on drop |

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

### Component Conventions

- Functional components only
- Named exports
- Props interface: `{ComponentName}Props`
- Use `cn()` for conditional classes
- Tailwind CSS for styling

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
1. Use a third-party tool like `pixiv-auth` or browser DevTools
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

#### Pixiv API Client Setup

```typescript
// server/src/lib/pixiv.ts
import PixivApi from 'pixiv-api-client';

const pixiv = new PixivApi();

export async function initPixivClient(): Promise<void> {
  const refreshToken = process.env.PIXIV_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('PIXIV_REFRESH_TOKEN not configured');
  }
  await pixiv.refreshAccessToken(refreshToken);
}

export async function getDailyRanking(limit = 15): Promise<PixivIllustration[]> {
  const response = await pixiv.illustRanking({ mode: 'day' });
  return response.illusts.slice(0, limit);
}

export async function bookmarkIllust(illustId: number): Promise<void> {
  await pixiv.bookmarkIllust(illustId);
}

export async function unbookmarkIllust(illustId: number): Promise<void> {
  await pixiv.unbookmarkIllust(illustId);
}
```

#### Type Definitions

```typescript
// shared/types.ts additions

export interface PixivIllustration {
  id: number;
  title: string;
  type: string;
  imageUrls: {
    squareMedium: string;
    medium: string;
    large: string;
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
```

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

```typescript
// client/src/components/dashboard/PixivWidget.tsx
interface PixivWidgetState {
  illustrations: PixivIllustration[];  // Cached from query
  currentIndex: number;                 // Currently displayed image
  previousIndices: number[];            // History to avoid repeats
}

// On each dashboard mount, pick a different random image
function getNextRandomIndex(
  total: number, 
  previousIndices: number[]
): number {
  const available = Array.from({ length: total }, (_, i) => i)
    .filter(i => !previousIndices.includes(i));
  
  // If all shown, reset history
  if (available.length === 0) {
    return Math.floor(Math.random() * total);
  }
  
  return available[Math.floor(Math.random() * available.length)];
}
```

#### Bookmark State Management

The bookmark button reflects the current bookmark state from the cached data:

```typescript
// PixivIllustration includes isBookmarked field from API
interface PixivIllustration {
  id: number;
  // ... other fields
  isBookmarked: boolean;  // Current bookmark state
}

// Optimistic update on bookmark toggle
const bookmarkMutation = useMutation({
  mutationFn: (illustId: number) => api.togglePixivBookmark(illustId, !isBookmarked),
  onMutate: async (illustId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['pixiv', 'daily-ranking'] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['pixiv', 'daily-ranking']);
    
    // Optimistically update the cache
    queryClient.setQueryData(['pixiv', 'daily-ranking'], (old: PixivIllustration[]) =>
      old.map(illust =>
        illust.id === illustId
          ? { ...illust, isBookmarked: !illust.isBookmarked }
          : illust
      )
    );
    
    return { previous };
  },
  onError: (err, illustId, context) => {
    // Rollback on error
    queryClient.setQueryData(['pixiv', 'daily-ranking'], context?.previous);
  },
});
```

**Bookmark Button States:**
| State | Icon | Visual |
|-------|------|--------|
| Not Bookmarked | `Heart` (outline) | `text-muted-foreground` |
| Bookmarked | `Heart` (filled) | `text-destructive fill-destructive` |
| Loading | `Loader2` (spinning) | `animate-spin` |

### Dashboard Search Filter (Client-Side Feature)

A client-side filter component for the dashboard that filters curriculums by searching across multiple fields.

#### Component Location

```
client/src/components/dashboard/
├── Dashboard.tsx           # Updated - receives searchQuery prop, applies filter
├── DashboardSearchBar.tsx  # NEW - search input component
└── ...
```

#### Filter Logic Implementation

```typescript
// client/src/lib/utils.ts

/**
 * Filters curriculums based on a search query.
 * Search is performed across title, author, and platform fields.
 * Uses AND logic: all words must appear in the combined searchable text.
 * 
 * @param curriculums - Array of curriculums to filter
 * @param query - Search query string
 * @returns Filtered array of curriculums
 */
export function filterCurriculums(
  curriculums: CurriculumWithProgress[],
  query: string
): CurriculumWithProgress[] {
  // Empty or whitespace-only query returns all curriculums
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return curriculums;
  }

  // Split query into individual words
  const searchWords = trimmedQuery.split(/\s+/);

  return curriculums.filter((curriculum) => {
    // Build searchable text from title, author, and platform
    const searchableText = [
      curriculum.title,
      curriculum.author || '',
      curriculum.platform || '',
    ]
      .join(' ')
      .toLowerCase();

    // All words must appear in the searchable text (AND logic)
    return searchWords.every((word) => searchableText.includes(word));
  });
}
```

#### Search Component Implementation

```typescript
// client/src/components/dashboard/DashboardSearchBar.tsx
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

interface DashboardSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function DashboardSearchBar({ value, onChange }: DashboardSearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Filter by title, author, platform..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
```

#### Dashboard Integration

```typescript
// client/src/components/dashboard/Dashboard.tsx

interface DashboardProps {
  curriculums: CurriculumWithProgress[];
  onSelectCurriculum: (id: number) => void;
}

export function Dashboard({ curriculums, onSelectCurriculum }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filter
  const filteredCurriculums = filterCurriculums(curriculums, searchQuery);
  
  // Group filtered curriculums by status
  const groupedByStatus: Record<CurriculumStatus, CurriculumWithProgress[]> = {
    ongoing: [],
    standby: [],
    planned: [],
    wishlist: [],
  };
  
  filteredCurriculums.forEach((curriculum) => {
    groupedByStatus[curriculum.status].push(curriculum);
  });
  
  // ... rest of component
  
  return (
    <div className="space-y-6">
      {/* Header */}
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
      
      {/* Status sections with filtered curriculums */}
      {/* ... */}
      
      {/* No results message */}
      {filteredCurriculums.length === 0 && curriculums.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No matching curriculums</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
```

#### State Management

- Search query is local component state (`useState`)
- Filter is applied client-side, no API calls needed
- State persists while dashboard is mounted (reset when navigating to curriculum detail and back)

#### Performance Considerations

- Filter runs on every keystroke (acceptable for typical curriculum counts)
- For large datasets (100+ curriculums), consider debouncing the input
- `useMemo` can be used to memoize the filtered results if performance becomes an issue

```typescript
// Optional: Memoized filtering for performance
const filteredCurriculums = useMemo(
  () => filterCurriculums(curriculums, searchQuery),
  [curriculums, searchQuery]
);
```

### Curriculum Edit Mode (V4 Feature)

A dedicated editing mode for reordering curriculum sections and items with physics-based drag-and-drop.

#### Component Architecture

```
client/src/components/curriculum/
├── CurriculumDetail.tsx        # Updated - Edit Mode toggle
├── edit-mode/                   # NEW - Edit Mode components
│   ├── EditModeProvider.tsx     # Context for edit mode state
│   ├── EditModeFooter.tsx       # Floating controls bar
│   ├── SortableSection.tsx      # Draggable section wrapper
│   ├── SortableItem.tsx         # Draggable item wrapper
│   └── DragHandle.tsx           # Reusable drag handle component
└── ...
```

#### Core Dependencies Setup

```bash
# Install V4 dependencies
pnpm add @dnd-kit/core @dnd-kit/sortable framer-motion canvas-confetti --filter client
pnpm add -D @types/canvas-confetti --filter client
```

#### Edit Mode State Management

```typescript
// client/src/components/curriculum/edit-mode/EditModeProvider.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { CurriculumDetail, SectionWithItems, Item } from '@shared/types';

interface EditModeState {
  isEditMode: boolean;
  isDirty: boolean;
  localCurriculum: CurriculumDetail | null;
  collapsedSections: Set<number>;
  allExpanded: boolean;
}

interface EditModeContextValue extends EditModeState {
  enterEditMode: (curriculum: CurriculumDetail) => void;
  exitEditMode: () => void;
  reorderSections: (activeId: number, overId: number) => void;
  reorderItems: (sectionId: number, activeId: number, overId: number) => void;
  toggleAllSections: () => void;
  collapseSection: (sectionId: number) => void;
  save: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function EditModeProvider({ children, onSave }: {
  children: React.ReactNode;
  onSave: (data: ReorderRequest) => Promise<void>;
}) {
  const [state, setState] = useState<EditModeState>({
    isEditMode: false,
    isDirty: false,
    localCurriculum: null,
    collapsedSections: new Set(),
    allExpanded: true,
  });

  const enterEditMode = useCallback((curriculum: CurriculumDetail) => {
    // Deep clone to prevent mutations
    setState({
      isEditMode: true,
      isDirty: false,
      localCurriculum: JSON.parse(JSON.stringify(curriculum)),
      collapsedSections: new Set(),
      allExpanded: true,
    });
  }, []);

  const exitEditMode = useCallback(() => {
    if (state.isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to exit?'
      );
      if (!confirmed) return;
    }
    setState({
      isEditMode: false,
      isDirty: false,
      localCurriculum: null,
      collapsedSections: new Set(),
      allExpanded: true,
    });
  }, [state.isDirty]);

  // ... reorderSections, reorderItems, save implementations
  
  return (
    <EditModeContext.Provider value={{ ...state, enterEditMode, exitEditMode, /* ... */ }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) throw new Error('useEditMode must be used within EditModeProvider');
  return context;
}
```

#### Drag-and-Drop Implementation with DragOverlay

**CRITICAL**: Always use `DragOverlay` for clear visual feedback during drag operations.

```typescript
// client/src/components/curriculum/edit-mode/EditModeView.tsx
import { useState } from 'react';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

export function EditModeView({ curriculum }: EditModeViewProps) {
  const { localCurriculum, reorderSections } = useEditMode();
  const [activeSection, setActiveSection] = useState<SectionWithItems | null>(null);

  const handleSectionDragStart = (event: DragStartEvent) => {
    const section = localCurriculum?.sections.find(s => s.id === event.active.id);
    if (section) {
      setActiveSection(section);
      document.body.style.cursor = 'grabbing'; // Global cursor feedback
    }
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    setActiveSection(null);
    document.body.style.cursor = ''; // Reset cursor
    // ... reorder logic
  };

  return (
    <DndContext 
      onDragStart={handleSectionDragStart}
      onDragEnd={handleSectionDragEnd}
    >
      <SortableContext items={sectionIds}>
        {sections.map(section => <SortableSection key={section.id} section={section} />)}
      </SortableContext>

      {/* DragOverlay shows clear visual feedback of what's being dragged */}
      <DragOverlay dropAnimation={null}>
        {activeSection ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            style={{ boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
          >
            <SectionPreview section={activeSection} />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// client/src/components/curriculum/edit-mode/SortableSection.tsx
export function SortableSection({ section }: SortableSectionProps) {
  const { isDragging, /* ... */ } = useSortable({ id: section.id });

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        opacity: isDragging ? 0.4 : 1, // Fade source element during drag
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <DragHandle attributes={attributes} listeners={listeners} />
      {/* ... content */}
    </motion.div>
  );
}

// client/src/components/curriculum/edit-mode/DragHandle.tsx
export function DragHandle({ attributes, listeners }: DragHandleProps) {
  return (
    <motion.div
      className="cursor-grab active:cursor-grabbing hover:text-primary hover:bg-primary/10 p-1 rounded"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5" />
    </motion.div>
  );
}
```

**Visual Feedback Improvements:**
- **DragOverlay**: Clear visual representation of dragged item
- **Source Opacity**: Original element fades to `0.4` during drag
- **Global Cursor**: `cursor: grabbing` on `document.body` during drag
- **Drag Handle Hover**: Scale, color change, and background on hover
- **Prominent Shadow**: Large shadow on DragOverlay for depth
- **Slight Rotation**: `rotate: 2deg` makes drag feel more dynamic

#### Confetti Effect (Enhanced)

```typescript
// client/src/lib/confetti.ts
import confetti from 'canvas-confetti';

/**
 * Fires a two-burst confetti effect centered on a given element.
 * Much more satisfying than a single burst.
 */
export function fireDropConfetti(
  element: HTMLElement,
  options: { particleCount?: number; spread?: number } = {}
) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  const { particleCount = 50, spread = 70 } = options;

  // First burst (angle 60°)
  confetti({
    particleCount: Math.floor(particleCount / 2),
    angle: 60,
    spread,
    origin: { x, y },
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    ticks: 120,
    gravity: 1.3,
    scalar: 1.2,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true,
  });

  // Second burst (angle 120°) - slightly delayed for fuller effect
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(particleCount / 2),
      angle: 120,
      spread,
      origin: { x, y },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      ticks: 120,
      gravity: 1.3,
      scalar: 1.2,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });
  }, 50);
}

// Usage: Fire confetti on item drop (not sections)
useEffect(() => {
  if (previousIsDragging.current && !isDragging && dragHandleRef.current) {
    fireDropConfetti(dragHandleRef.current, { particleCount: 40, spread: 60 });
  }
  previousIsDragging.current = isDragging;
}, [isDragging]);
```

**Confetti Improvements:**
- **Two bursts**: More particles, fuller visual effect
- **Vibrant colors**: Fixed color palette instead of theme-dependent HSL
- **Customizable**: Options for particle count and spread
- **Items only**: Sections don't fire confetti (too frequent, less meaningful)

#### Floating Footer Component

```typescript
// client/src/components/curriculum/edit-mode/EditModeFooter.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from './EditModeProvider';

export function EditModeFooter() {
  const { isEditMode, isDirty, allExpanded, toggleAllSections, exitEditMode, save } = useEditMode();

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container flex items-center justify-between gap-4 py-3 px-4">
            {/* Toggle Tasks */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllSections}
              className="gap-2"
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              {/* Exit Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={exitEditMode}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Exit
              </Button>

              {/* Save Button */}
              <Button
                size="sm"
                onClick={save}
                disabled={!isDirty}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

#### API Endpoint Implementation

```typescript
// server/src/routes/curriculums.ts (addition)

// Batch reorder sections and items
router.patch('/:id/reorder', async (req, res) => {
  const curriculumId = parseInt(req.params.id);
  
  const reorderSchema = z.object({
    sections: z.array(z.object({
      id: z.number(),
      sortOrder: z.number(),
      items: z.array(z.object({
        id: z.number(),
        sortOrder: z.number(),
      })),
    })),
  });

  const parsed = reorderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const now = new Date();
    
    // Update sections sortOrder
    for (const section of parsed.data.sections) {
      await db
        .update(sections)
        .set({ sortOrder: section.sortOrder, updatedAt: now })
        .where(
          and(
            eq(sections.id, section.id),
            eq(sections.curriculumId, curriculumId)
          )
        );
      
      // Update items sortOrder within this section
      for (const item of section.items) {
        await db
          .update(items)
          .set({ sortOrder: item.sortOrder, updatedAt: now })
          .where(
            and(
              eq(items.id, item.id),
              eq(items.sectionId, section.id)
            )
          );
      }
    }

    // Fetch and return updated curriculum
    const curriculum = await getCurriculumWithSectionsAndItems(curriculumId);
    res.json({ success: true, curriculum });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Failed to reorder' });
  }
});
```

#### Frontend API Client

```typescript
// client/src/lib/api.ts (addition)

export interface ReorderRequest {
  sections: Array<{
    id: number;
    sortOrder: number;
    items: Array<{
      id: number;
      sortOrder: number;
    }>;
  }>;
}

export async function reorderCurriculum(
  curriculumId: number,
  data: ReorderRequest
): Promise<CurriculumDetail> {
  const response = await fetch(`${API_BASE}/curriculums/${curriculumId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reorder curriculum');
  }
  
  const result = await response.json();
  return result.curriculum;
}
```

#### Type Definitions

```typescript
// shared/types.ts (additions)

// V4: Reorder request type
export interface ReorderRequest {
  sections: Array<{
    id: number;
    sortOrder: number;
    items: Array<{
      id: number;
      sortOrder: number;
    }>;
  }>;
}

// V4: Edit mode state
export interface EditModeState {
  isEditMode: boolean;
  isDirty: boolean;
  localCurriculum: CurriculumDetail | null;
  collapsedSections: Set<number>;
  allExpanded: boolean;
}
```

#### Animation Constants

```typescript
// client/src/lib/animations.ts

// Shared spring configuration for consistent physics
export const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

// Drag elevation shadow
export const dragShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';

// Default shadow
export const defaultShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';

// Scale during drag
export const dragScale = 1.02;
```

---

## 7. Configuration Management

### Toolbox Configuration (V3 Feature)

```typescript
// client/src/config/toolbox.ts
import { type LucideIcon, Palette, BookOpen, Pencil, Monitor } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export const tools: Tool[] = [
  {
    id: 'clip-studio',
    name: 'Clip Studio',
    url: 'https://www.clipstudio.net/',
    icon: Pencil,
    description: 'Digital painting software',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    url: 'https://pinterest.com/',
    icon: Palette,
    description: 'Visual inspiration',
  },
  // Add more tools as needed...
];
```

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
- [V2-FEATURES.md](./V2-FEATURES.md) - V2 feature specification
- [AGENTS.md](../AGENTS.md) - AI coding assistant guidelines
- [README.md](../README.md) - Setup and usage guide
