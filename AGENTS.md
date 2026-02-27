# AGENTS.md - AI Coding Assistant Guidelines

This document provides context and guidelines for AI coding assistants working on the Artmem Dashboard codebase.

---

## Project Overview

**Artmem Dashboard** is a local-first web application for tracking learning curriculum progress with AI-optimized exports.

| Aspect | Details |
|--------|---------|
| Type | Full-stack web application |
| Frontend | React 19 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (sql.js - in-memory) |
| ORM | Drizzle ORM |
| UI Framework | shadcn/ui + Tailwind CSS |
| State Management | TanStack Query v5 |

---

## Project Structure

```
artmem-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Shared components (ImportDropzone, DropParticles)
│   │   │   │   └── DropParticles.tsx  # V5: Neon particle burst (replaces confetti)
│   │   │   ├── curriculum/    # Curriculum-related components
│   │   │   │   ├── CurriculumDetail.tsx
│   │   │   │   ├── CurriculumForm.tsx
│   │   │   │   ├── CurrentTaskWidget.tsx
│   │   │   │   ├── ItemForm.tsx
│   │   │   │   ├── SectionForm.tsx
│   │   │   │   └── edit-mode/          # V4: Edit mode components
│   │   │   │       ├── EditModeProvider.tsx
│   │   │   │       ├── EditModeFooter.tsx
│   │   │   │       ├── SortableSection.tsx
│   │   │   │       ├── SortableItem.tsx
│   │   │   │       └── DragHandle.tsx
│   │   │   ├── dashboard/     # Dashboard components (V2/V3)
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── CurriculumCard.tsx
│   │   │   │   ├── StatusSection.tsx
│   │   │   │   ├── DaysRemaining.tsx
│   │   │   │   ├── DashboardSearchBar.tsx  # V3.1: Search filter input
│   │   │   │   ├── Toolbox.tsx         # V3: Tool launcher widget
│   │   │   │   └── PixivWidget.tsx     # V3: Pixiv inspiration widget
│   │   │   ├── layout/        # Header, Sidebar
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── config/
│   │   │   └── toolbox.ts     # V3: Hardcoded tool configurations
│   │   ├── lib/
│   │   │   ├── api.ts         # API client functions
│   │   │   ├── utils.ts       # Utility functions (cn, etc.)
│   │   │   └── animations.ts  # V5: Animation constants (springs, variants, shadows)
│   │   ├── styles/
│   │   │   └── globals.css    # Global styles, CSS variables
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Entry point
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts       # Database connection, sql.js setup
│   │   │   └── schema.ts      # Drizzle schema definitions
│   │   ├── lib/
│   │   │   └── pixiv.ts       # V3: Pixiv API client wrapper
│   │   ├── routes/
│   │   │   ├── curriculums.ts # Curriculum CRUD endpoints
│   │   │   ├── sections.ts    # Section CRUD endpoints
│   │   │   ├── items.ts       # Item CRUD endpoints
│   │   │   ├── export.ts      # JSON/Tora export endpoints
│   │   │   └── pixiv.ts       # V3: Pixiv API proxy routes
│   │   └── index.ts           # Server entry point
│   ├── .env                   # Environment variables (gitignored)
│   └── package.json
│
├── shared/                    # Shared between client/server
│   ├── types.ts               # TypeScript types, Zod schemas
│   └── package.json
│
├── docs/                      # Documentation
│   ├── PRD.md                 # Product Requirements Document
│   ├── TECH.md                # Technical Stack & Architecture
│   ├── DESIGN-SYSTEM.md       # V5: Design system & visual spec
│   └── V2-FEATURES.md         # V2 Feature Specification
│
├── AGENTS.md                  # This file
├── README.md                  # Setup and usage guide
├── package.json               # Root workspace config
└── pnpm-workspace.yaml        # pnpm workspace definition
```

---

## Code Conventions

### UI/UX Guidelines

**Design Philosophy**: ZZZ-inspired "Digital Doujin" - urban, neon-on-void-black, fidget/analog. Every interaction must produce satisfying physical feedback. See [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) for the full visual specification.

#### Icons
- **Always use lucide-react icons** - NEVER use emojis or emoticons
- Dashboard section icons: `TrendingUp` (Ongoing), `Pause` (Standby), `ClipboardList` (Planned), `Star` (Wishlist)
- Task status icons: `Play` (in-progress), `Square` (not-started), `CheckCircle2` (completed)
- Priority badge icon: `Zap` (lightning bolt)
- Goal date icon: `Target` (crosshair)
- Keep icon sizes consistent: `h-4 w-4` for standard UI, `h-3.5 w-3.5` for compact elements
- Icons should be semantic and intuitive
- **V5**: Active-state icons may use `filter: drop-shadow(0 0 4px <color>)` for a neon glow effect

```tsx
// Good - Using lucide-react
import { TrendingUp, Play, CheckCircle2 } from 'lucide-react';
<Play className="h-4 w-4" />

// Bad - Using emojis
<span>📹</span>
<span>🎉</span>
```

#### Component Sizing
- Keep widgets and components **compact and minimal**
- Avoid excessive padding/whitespace
- Components should be "barely larger than needed"
- Use `p-3` for compact padding, `p-4` for standard, `p-6` for spacious

#### Interactive Elements
- Make entire interactive areas clickable when possible (not just buttons)
- **V5**: All clickable elements must have `whileTap={{ scale: 0.95 }}` (framer-motion)
- **V5**: Cards use `whileHover={{ y: -2 }}` + subtle neon border glow on hover
- **V5**: 3D perspective tilt on dashboard curriculum cards (cursor-tracked)
- Use hover states: `hover:border-primary/20 hover:bg-primary/5`
- Always include focus states: `focus-visible:ring-2 focus-visible:ring-primary`

#### Color & Status (V5 Palette)
- Primary: `#facc15` (electric yellow - ZZZ signature)
- Accent: `#22d3ee` (neon cyan)
- Accent Pink: `#f472b6` (hot pink)
- Destructive: `#ef4444` (neon red)
- Success: `#34d399` (neon green)
- Background: `#0a0a0f` (void black)
- Status color mapping:
  - In Progress: `text-primary` + breathing glow animation
  - Not Started: `text-muted-foreground` (no glow)
  - Completed: `text-success` (was `text-accent`)
  - High Priority: `text-destructive`

#### Typography (V5)
- Body font: **Space Grotesk** (geometric, tech-forward)
- Monospace font: **JetBrains Mono** (numbers, stats, dates - HUD feel)
- All numeric data MUST use `font-mono`: progress %, item counts, days remaining, dates
- Labels in uppercase: `uppercase tracking-wide`
- Truncate long text: `truncate`, `line-clamp-2`

```tsx
// Good - monospace numbers
<span className="font-mono">87%</span>
<span className="font-mono">12/18 items</span>

// Bad - proportional numbers
<span>87%</span>
```

### TypeScript

- **Strict mode** enabled
- Use explicit types for function parameters and returns
- Prefer interfaces over type aliases for object shapes
- Use Zod schemas for runtime validation (defined in `shared/types.ts`)

```typescript
// Good
function getCurriculum(id: number): Promise<CurriculumDetail> { ... }

// Avoid
function getCurriculum(id) { ... }
```

### React Components

- **Functional components** only (no class components)
- Use **named exports** for components
- Props interfaces named `{ComponentName}Props`
- Place component file in appropriate subdirectory

```typescript
// Good
interface CurriculumCardProps {
  curriculum: CurriculumWithProgress;
  onClick: (id: number) => void;
}

export function CurriculumCard({ curriculum, onClick }: CurriculumCardProps) {
  // ...
}
```

### Styling

- Use **Tailwind CSS** utility classes
- Use **cn()** utility from `lib/utils.ts` for conditional classes
- Follow shadcn/ui patterns for component styling
- CSS variables defined in `globals.css` for theming

```tsx
// Good
<div className={cn(
  'p-4 rounded-lg border',
  isActive && 'bg-primary/10 border-primary',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

### State Management

- **TanStack Query** for server state (API data)
- **useState** for local UI state
- Query keys follow pattern: `['resource']` or `['resource', id]`

```typescript
// Queries
const { data: curriculums } = useQuery({
  queryKey: ['curriculums'],
  queryFn: api.getCurriculums,
});

// Mutations
const mutation = useMutation({
  mutationFn: api.createCurriculum,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['curriculums'] });
  },
});
```

### API Patterns

- RESTful endpoints
- Express router pattern
- Zod validation on request bodies
- Consistent error handling

```typescript
// server/src/routes/curriculums.ts
router.post('/', async (req, res) => {
  const parsed = createCurriculumSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  // ... create curriculum
});
```

---

## Key Files Reference

### Types (`shared/types.ts`)

Contains all shared TypeScript types and Zod validation schemas:

- `Curriculum`, `Section`, `Item` - Base entity types
- `CurriculumWithProgress` - Curriculum + computed progress
- `CurriculumDetail` - Full curriculum with nested sections/items
- `createCurriculumSchema`, etc. - Zod validation schemas

### API Client (`client/src/lib/api.ts`)

All API calls to the backend:

- `getCurriculums()`, `getCurriculum(id)`
- `createCurriculum(data)`, `updateCurriculum(id, data)`, `deleteCurriculum(id)`
- `createSection(curriculumId, data)`, etc.
- `cycleItemStatus(id)` - Special endpoint for status cycling
- `exportJSON()`, `exportToraMemoryPack()`

### Database Schema (`server/src/db/schema.ts`)

Drizzle ORM schema definitions:

- `curriculums` table
- `sections` table (FK to curriculums)
- `items` table (FK to sections)

### App Component (`client/src/App.tsx`)

Main application orchestrator:

- Manages selected curriculum state
- Handles all mutations
- Renders Sidebar, Header, and main content area
- Form dialogs for create/edit operations

### Sidebar Component (`client/src/components/layout/Sidebar.tsx`)

Navigation sidebar with curriculum list:

- Groups curriculums by status: **Ongoing, Standby, Planned only**
- **Important**: Wishlist items are excluded from the sidebar
- Wishlist curriculums appear only on the Dashboard view
- Collapsible sidebar with mini-mode
- Shows curriculum title, platform, and progress percentage

```typescript
// Sidebar status groups - Wishlist intentionally excluded
const statusGroups: { status: CurriculumStatus; label: string }[] = [
  { status: 'ongoing', label: 'Ongoing' },
  { status: 'standby', label: 'Standby' },
  { status: 'planned', label: 'Planned' },
  // wishlist is NOT included here - appears only on Dashboard
];
```

---

## Common Tasks

### Adding a New Component

1. Create file in appropriate `components/` subdirectory
2. Define props interface
3. Export as named export
4. Import and use in parent component

### Adding a New API Endpoint

1. Add route handler in `server/src/routes/`
2. Add Zod schema in `shared/types.ts` if needed
3. Add API function in `client/src/lib/api.ts`
4. Use with TanStack Query in component

### Adding a New Field to an Entity

1. Update Drizzle schema in `server/src/db/schema.ts`
2. Run `pnpm db:push` to update database
3. Update types in `shared/types.ts`
4. Update Zod schemas if needed
5. Update relevant components

### Modifying Styles/Theme

- Global CSS variables: `client/src/styles/globals.css`
- Tailwind config: `client/tailwind.config.js`
- Component styles: Use Tailwind classes directly

---

## Design Patterns

### Progress Calculation

Progress is calculated at multiple levels:

```typescript
// Item level: status field (not_started | in_progress | completed)

// Section level: % of completed items
const sectionProgress = items.filter(i => i.status === 'completed').length / items.length * 100;

// Curriculum level: % of all items completed
const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
const completedItems = sections.reduce((sum, s) => 
  sum + s.items.filter(i => i.status === 'completed').length, 0);
const progress = completedItems / totalItems * 100;
```

### Status Cycling

Items cycle through statuses on click:

```
not_started → in_progress → completed → not_started
```

Implemented via `PATCH /api/items/:id/cycle` endpoint.

### Form Handling

Forms use controlled components with local state:

```tsx
const [formData, setFormData] = useState<Partial<Curriculum>>({});

<input
  value={formData.title || ''}
  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
/>
```

---

## Feature Reference

### V2: Dashboard & Current Task

> Full spec: `docs/V2-FEATURES.md`

| Component | Location | Purpose |
|-----------|----------|---------|
| `Dashboard` | `components/dashboard/Dashboard.tsx` | Main dashboard container |
| `CurriculumCard` | `components/dashboard/CurriculumCard.tsx` | Curriculum card for dashboard |
| `StatusSection` | `components/dashboard/StatusSection.tsx` | Collapsible status group |
| `DaysRemaining` | `components/dashboard/DaysRemaining.tsx` | Days countdown badge |
| `CurrentTaskWidget` | `components/curriculum/CurrentTaskWidget.tsx` | Current/next task display |

Helper functions in `client/src/lib/utils.ts`: `getDaysRemaining()`, `getCurrentOrNextTask()`, `scrollToItem()`, `filterCurriculums()`.

### V3: Toolbox & Pixiv Integration

> Technical details: `docs/TECH.md` Section 6

| Component | Location | Purpose |
|-----------|----------|---------|
| `Toolbox` | `components/dashboard/Toolbox.tsx` | Tool launcher widget |
| `PixivWidget` | `components/dashboard/PixivWidget.tsx` | Pixiv inspiration card |
| `PixivLightbox` | `components/dashboard/PixivLightbox.tsx` | Full-screen image viewer |

Key files: `client/src/config/toolbox.ts` (tool config), `server/src/lib/pixiv.ts` (API client), `server/src/routes/pixiv.ts` (proxy routes).

**Pixiv caching**: Query key includes date (YYYY-MM-DD) for daily refresh, 12h staleTime, optimistic bookmark updates. See `docs/TECH.md` for details.

### V3.1: Dashboard Search Filter

`DashboardSearchBar.tsx` with `filterCurriculums()` in `utils.ts`. Searches across title/author/platform with AND logic, case-insensitive, real-time.

---

### V4: Curriculum Edit Mode

> Technical details: `docs/TECH.md` — Curriculum Edit Mode section

| Component | Location | Purpose |
|-----------|----------|---------|
| `EditModeProvider` | `edit-mode/EditModeProvider.tsx` | Edit mode state context (`useEditMode` hook) |
| `EditModeView` | `edit-mode/EditModeView.tsx` | Main view with section DragOverlay |
| `EditModeFooter` | `edit-mode/EditModeFooter.tsx` | Floating control bar |
| `SortableSection` | `edit-mode/SortableSection.tsx` | Draggable section with item DragOverlay |
| `SortableItem` | `edit-mode/SortableItem.tsx` | Draggable item + DropParticles |
| `DragHandle` | `edit-mode/DragHandle.tsx` | Reusable drag handle with neon hover |

**Key patterns:**
- **Optimistic local state**: Clone data on enter, update locally, batch save via `PATCH /api/curriculums/:id/reorder`
- **Always use `DragOverlay`** for drag visual feedback (not direct transforms)
- **`DropParticles`** on drop (replaces removed `canvas-confetti`). See `docs/DESIGN-SYSTEM.md` Section 7.
- **Animation constants** imported from `client/src/lib/animations.ts` — never hardcode springs inline
- **Unsaved changes warning**: `window.confirm()` on exit when `isDirty`
- **Accessibility**: Drag handles have `aria-label="Drag to reorder"`, keyboard support

---

### V5: Design System Overhaul

> **Authoritative spec: [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)**. All visual and interaction decisions must reference it first.

V5 is a pure UX/visual upgrade — no new features.

**Quick reference:**
- **Colors**: `#facc15` (primary yellow), `#22d3ee` (accent cyan), `#f472b6` (accent pink), `#0a0a0f` (background)
- **Fonts**: Space Grotesk (body), JetBrains Mono (`font-mono` for all numeric data)
- **Animations**: All springs in `client/src/lib/animations.ts` — `tactileSpring`, `bounceSpring`, `gentleSpring`, `overlaySpring`
- **Particles**: `DropParticles` (neon dots via framer-motion, replaces removed `canvas-confetti`)
- **Interactions**: `whileTap={{ scale: 0.95 }}` on every interactive element, 3D tilt on cards, breathing glow on in-progress items
- **Transitions**: `AnimatePresence mode="wait"` on main content area

---

## Testing Notes

Currently no automated tests. When adding tests:

- Use Vitest for unit tests
- Use Playwright or Cypress for E2E
- Focus on critical paths: CRUD operations, progress calculation

---

## Performance Considerations

- Dashboard should lazy-load curriculum details
- Use React.memo for card components if needed
- TanStack Query handles caching automatically
- Database operations are synchronous (sql.js limitation)

---

## Security Notes

- **Local-only**: Do not expose server to network
- **No authentication**: Single-user design
- **Input validation**: Always use Zod schemas
- **Secrets Management (V3)**: 
  - Pixiv refresh token stored in `server/.env`
  - `.env` is already in `.gitignore` - NEVER commit
  - Create `.env.example` for documentation (without real values)

---

## Troubleshooting

### Database Issues

```bash
# Reset database
rm server/data/tora.db*
pnpm db:push
```

### Type Errors

```bash
# Rebuild shared types
cd shared && pnpm build

# Restart TypeScript server in IDE
```

### Port Conflicts

- Frontend: Default 5173, change in `client/vite.config.ts`
- Backend: Default 3001, change in `server/.env`

---

## Quick Reference

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev servers (client + server) |
| `pnpm build` | Build for production |
| `pnpm db:push` | Apply schema changes |
| `pnpm db:studio` | Open Drizzle Studio |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/curriculums` | List all curriculums |
| GET | `/api/curriculums/:id` | Get curriculum detail |
| POST | `/api/curriculums` | Create curriculum |
| PATCH | `/api/curriculums/:id` | Update curriculum |
| DELETE | `/api/curriculums/:id` | Delete curriculum |
| PATCH | `/api/curriculums/:id/reorder` | V4: Batch reorder sections/items |
| POST | `/api/curriculums/:id/sections` | Create section |
| POST | `/api/sections/:id/items` | Create item |
| PATCH | `/api/items/:id/cycle` | Cycle item status |
| GET | `/api/export/json` | Export all data |
| GET | `/api/export/tora` | Export Tora-chan format |
| POST | `/api/import` | Import curriculum JSON |

### Pixiv API Endpoints (V3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pixiv/daily-ranking` | Get top 15 daily illustrations |
| POST | `/api/pixiv/bookmark/:illustId` | Bookmark illustration |
| DELETE | `/api/pixiv/bookmark/:illustId` | Remove bookmark |
| GET | `/api/pixiv/image` | Proxy Pixiv image with headers |

### Color Scheme

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#facc15` | Electric yellow — interactive elements, active states |
| `--accent` | `#22d3ee` | Neon cyan — secondary highlights, planned status |
| `--accent-pink` | `#f472b6` | Hot pink — tertiary accents, wishlist status |
| `--success` | `#34d399` | Neon green — completed states |
| `--destructive` | `#ef4444` | Neon red — delete, errors, urgent |
| `--muted` | `#3f3f50` | Disabled, placeholder |

---

## Documentation Maintenance Protocol

### CRITICAL RULE: Post-Implementation Review

**Every time you finish a coding task, you MUST:**

1. **Review Documentation**: Check `docs/PRD.md`, `docs/TECH.md`, and `AGENTS.md`
2. **Assess Changes**: Determine if the implementation:
   - Added new features not documented in PRD
   - Changed architecture or introduced new patterns
   - Added new dependencies or integrations
   - Modified API endpoints or data models
3. **Update Immediately**: If any documentation is stale or missing:
   - Update `PRD.md` with new features, user stories, or requirements
   - Update `TECH.md` with architecture changes, new integrations, or API changes
   - Update `AGENTS.md` if new coding patterns or conventions were established

### Documentation Files

| File | Purpose | When to Update |
|------|---------|----------------|
| `docs/PRD.md` | Product requirements, features, user stories | New features, changed functionality |
| `docs/TECH.md` | Technical stack, architecture, integrations | New packages, API changes, architecture decisions |
| `AGENTS.md` | Coding conventions, patterns, project structure | New patterns, component conventions |

### Source of Truth

These three files serve as the **single source of truth** for the project:
- Before implementing: Read them to understand current state
- During implementation: Follow established patterns
- After implementation: Update them to reflect new reality

---

## Related Documents

| File | Purpose |
|------|---------|
| `docs/DESIGN-SYSTEM.md` | V5 design system — colors, typography, animations, component patterns |
| `docs/PRD.md` | Product requirements, features, user stories |
| `docs/TECH.md` | Technical stack, architecture, integrations |
| `docs/V2-FEATURES.md` | V2 feature specification (historical) |
| `README.md` | Setup, usage guide, and quick start |
