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
│   │   │   ├── common/        # Shared components (ImportDropzone)
│   │   │   ├── curriculum/    # Curriculum-related components
│   │   │   ├── dashboard/     # Dashboard components (V2)
│   │   │   ├── layout/        # Header, Sidebar
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── lib/
│   │   │   ├── api.ts         # API client functions
│   │   │   └── utils.ts       # Utility functions (cn, etc.)
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
│   │   ├── routes/
│   │   │   ├── curriculums.ts # Curriculum CRUD endpoints
│   │   │   ├── sections.ts    # Section CRUD endpoints
│   │   │   ├── items.ts       # Item CRUD endpoints
│   │   │   └── export.ts      # JSON/Tora export endpoints
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── shared/                    # Shared between client/server
│   ├── types.ts               # TypeScript types, Zod schemas
│   └── package.json
│
├── docs/                      # Documentation
│   ├── PRD.md                 # Product Requirements Document
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

**Design Philosophy**: Minimal, doujin aesthetic - clean, functional, understated.

#### Icons
- **Always use lucide-react icons** - NEVER use emojis or emoticons
- Dashboard section icons: `TrendingUp` (Ongoing), `Pause` (Standby), `ClipboardList` (Planned)
- Task status icons: `Play` (in-progress), `Square` (not-started), `CheckCircle2` (completed)
- Priority badge icon: `Zap` (lightning bolt)
- Goal date icon: `Target` (crosshair)
- Keep icon sizes consistent: `h-4 w-4` for standard UI, `h-3.5 w-3.5` for compact elements
- Icons should be semantic and intuitive

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
- Use subtle hover states: `hover:border-primary/50 hover:bg-primary/5`
- Avoid unnecessary action buttons - prefer clickable cards/areas
- Always include focus states for accessibility: `focus-visible:ring-2 focus-visible:ring-primary`

#### Color & Status
- Use CSS variables for theming consistency
- Status indicators should use semantic colors:
  - In Progress: `text-primary`
  - Not Started: `text-muted-foreground`
  - Completed: `text-accent`
  - High Priority: `text-destructive`

#### Typography
- Use text size hierarchy: `text-xs`, `text-sm`, `text-base`
- Labels in uppercase: `uppercase tracking-wide`
- Truncate long text: `truncate`, `line-clamp-2`

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

## V2 Implementation Notes

When implementing V2 features, refer to `docs/V2-FEATURES.md` for detailed specifications.

### Key V2 Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Dashboard` | `components/dashboard/Dashboard.tsx` | Main dashboard container |
| `CurriculumCard` | `components/dashboard/CurriculumCard.tsx` | Curriculum card for dashboard |
| `StatusSection` | `components/dashboard/StatusSection.tsx` | Collapsible status group |
| `DaysRemaining` | `components/dashboard/DaysRemaining.tsx` | Days countdown badge |
| `CurrentTaskWidget` | `components/curriculum/CurrentTaskWidget.tsx` | Current/next task display |

### V2 Helper Functions

Add to `client/src/lib/utils.ts`:

```typescript
// Days remaining calculation
function getDaysRemaining(endDate: Date | string | null): number | null

// Get current or next task with description
function getCurrentOrNextTask(curriculum: CurriculumDetail): CurrentTaskInfo | null

// Scroll to item with highlight
function scrollToItem(itemId: number): void
```

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
- **No secrets**: No API keys or credentials needed

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
| POST | `/api/curriculums/:id/sections` | Create section |
| POST | `/api/sections/:id/items` | Create item |
| PATCH | `/api/items/:id/cycle` | Cycle item status |
| GET | `/api/export/json` | Export all data |
| GET | `/api/export/tora` | Export Tora-chan format |
| POST | `/api/import` | Import curriculum JSON |

### Color Scheme

| Variable | Usage |
|----------|-------|
| `--primary` | Primary actions, links |
| `--secondary` | Secondary backgrounds |
| `--accent` | Success states, progress |
| `--destructive` | Delete, errors, urgent |
| `--muted` | Disabled, placeholder |

---

## Contact & Resources

- **Documentation**: `docs/` directory
- **README**: Setup and usage instructions
- **PRD**: `docs/PRD.md` - Product requirements
- **V2 Spec**: `docs/V2-FEATURES.md` - V2 feature details
