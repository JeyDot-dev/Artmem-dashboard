# Tora-chan Art Study Dashboard

A local-first web application for tracking art curriculum progress with AI-optimized memory pack exports.

## Prerequisites

Before running this application, you need to install:

1. **Node.js** (v18 or higher): https://nodejs.org/
2. **pnpm** (fast, disk-efficient package manager): 
   ```bash
   npm install -g pnpm
   ```

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Initialize Database

```bash
pnpm db:push
```

This will create the SQLite database with the required schema.

### 3. Start Development Server

```bash
pnpm dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both client and server in development mode |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm db:push` | Push database schema changes |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |

## Project Structure

```
tora-art-dashboard/
├── docs/                    # Memory Bank documentation
│   ├── PRD.md              # Product Requirements
│   └── TECH.md             # Technical Specification
├── AGENTS.md               # AI coding rules
├── client/                 # React frontend (Vite + React 19)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── lib/           # Utilities & API client
│   │   ├── styles/        # Global styles
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend (Express + SQLite)
│   ├── src/
│   │   ├── db/            # Database schema & connection
│   │   ├── routes/        # API endpoints
│   │   └── index.ts       # Server entry point
│   └── package.json
├── shared/                 # Shared types between client/server
│   └── types.ts
└── package.json           # Root workspace config
```

## Features

### Core Functionality

- **Curriculum Management**: Create, read, update, and delete curriculums via web UI
- **Progress Tracking**: Visual progress bars and item status (not started → in progress → completed)
- **Section & Item Organization**: Hierarchical structure with drag-and-drop reordering
- **JSON Import/Export**: Full database backup and curriculum sharing
- **Tora-chan Memory Pack**: AI-optimized Markdown export for maintaining AI assistant context

### UI Highlights

- Dark mode aesthetic with soft purple/teal color scheme
- Collapsible sidebar with status grouping
- Real-time progress calculation
- One-click status cycling for items
- Drag-and-drop JSON import

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | Modern React with latest features |
| UI | shadcn/ui + Tailwind CSS | Beautiful, accessible components |
| State | TanStack Query v5 | Server state management |
| Backend | Node.js + Express | REST API server |
| Database | SQLite (better-sqlite3) | Local, zero-config storage |
| ORM | Drizzle ORM | Type-safe database queries |
| Validation | Zod | Runtime type checking |

## Usage Guide

### Creating a Curriculum

1. Click the **+** button in the sidebar
2. Fill in curriculum details (title, author, platform, etc.)
3. Set priority (High/Medium/Low) and status (Ongoing/Standby/Planned)
4. Click **Create**

### Adding Sections and Items

1. Select a curriculum from the sidebar
2. Click **Add Section** to create a new section
3. Within each section, click **+ Item** to add study items
4. Set item type (Video/Reading/Exercise/Homework/Other)

### Tracking Progress

- Click on any item's status icon to cycle through:
  - ☐ Not Started → ▶ In Progress → ✓ Completed
- Progress bars automatically update at section and curriculum levels

### Exporting for Tora-chan

1. Click **Export to Tora-chan** in the header
2. Download the ZIP file containing:
   - `tora-progress-YYYY-MM-DD.md` - Token-optimized Markdown summary
   - `tora-full-backup-YYYY-MM-DD.json` - Full JSON backup

The Markdown file is optimized for AI consumption:
- **Ongoing** curriculums: Full detail with item-level progress
- **Standby/Planned** curriculums: Summary only (saves tokens)

### Import/Export JSON

- **Export JSON**: Download full database as JSON for backup
- **Import JSON**: Drag and drop JSON file or click to select

## Development Notes

### Database Location

SQLite database is stored at `server/data/tora.db`

### API Endpoints

- `GET /api/curriculums` - List all curriculums
- `GET /api/curriculums/:id` - Get curriculum detail
- `POST /api/curriculums` - Create curriculum
- `PATCH /api/curriculums/:id` - Update curriculum
- `DELETE /api/curriculums/:id` - Delete curriculum
- Similar endpoints for sections and items
- `/api/import` - Import curriculum from JSON
- `/api/export/json` - Export full database
- `/api/export/tora` - Generate Tora-chan Memory Pack

### Environment Variables

**Server** (`server/.env`):
```env
PORT=3001
DATABASE_URL=./data/tora.db
```

**Client** (`client/.env`):
```env
VITE_API_URL=/api
```

## Security Note

This is a **local-only, single-user application** with no authentication. Do not expose the server to the network or internet.

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:
- Change `PORT` in `server/.env`
- Change `server.port` in `client/vite.config.ts`

### Database Locked

If you see "database is locked" errors:
- Make sure only one server instance is running
- Delete `server/data/tora.db-wal` and `tora.db-shm` files if they exist

### Build Errors

If you encounter TypeScript or build errors:
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
pnpm install
```

## License

MIT

## Credits

Designed for tracking art study progress with Tora-chan, an AI study companion.
