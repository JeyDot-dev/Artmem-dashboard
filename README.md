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
├── docs/                    # Documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── TECH.md             # Technical Stack & Architecture
│   └── V2-FEATURES.md      # V2 Feature Specification (Dashboard, Current Task Widget)
├── AGENTS.md               # AI coding assistant guidelines
├── client/                 # React frontend (Vite + React 19)
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── dashboard/  # Dashboard components (V2/V3)
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── DashboardSearchBar.tsx  # V3.1: Search filter
│   │   │   │   ├── DashboardHeaderRow.tsx  # V3: Header container
│   │   │   │   ├── Toolbox.tsx             # V3: Tool launcher widget
│   │   │   │   ├── PixivWidget.tsx         # V3: Pixiv inspiration card
│   │   │   │   └── PixivLightbox.tsx       # V3: Full-screen viewer
│   │   │   ├── curriculum/ # Curriculum detail components
│   │   │   ├── layout/     # Header, Sidebar
│   │   │   └── ui/         # shadcn/ui primitives
│   │   ├── config/         # Configuration files
│   │   │   └── toolbox.ts  # V3: Hardcoded tool configurations
│   │   ├── lib/            # Utilities & API client
│   │   ├── styles/         # Global styles
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend (Express + SQLite)
│   ├── src/
│   │   ├── db/             # Database schema & connection
│   │   ├── lib/            # V3: Library modules
│   │   │   └── pixiv.ts    # V3: Pixiv API client wrapper
│   │   ├── routes/         # API endpoints
│   │   │   └── pixiv.ts    # V3: Pixiv API routes
│   │   ├── types/          # Type declarations
│   │   │   └── pixiv-api-client.d.ts  # V3: Pixiv module types
│   │   └── index.ts        # Server entry point
│   ├── .env.example        # V3: Environment template
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
- **Navigation**: Click site name in header to return to dashboard from any curriculum
- **JSON Import/Export**: Full database backup and curriculum sharing
- **Tora-chan Memory Pack**: AI-optimized Markdown export for maintaining AI assistant context

### V2 Features

See [docs/V2-FEATURES.md](docs/V2-FEATURES.md) for full specification.

- **Dashboard/Home View**: Beautiful at-a-glance overview with curriculum cards organized by status (Ongoing, Standby, Planned, Wishlist)
  - Cards sorted by deadline (nearest first)
  - Visual priority badges and progress bars
  - Current task preview on ongoing curriculums
  - Responsive grid layout
  - **Note**: Wishlist items appear only on the dashboard, not in the sidebar

- **Days Remaining**: Smart countdown display showing days until goal date
  - Color-coded urgency: green (>30 days), yellow (8-30 days), red (≤7 days)
  - Shows "Today!" for due dates and "X days overdue" for missed deadlines
  - Displayed on both dashboard cards and curriculum detail view

- **Current Task Widget**: Compact, minimal widget showing your current or next task
  - Shows first "in progress" item, or next "not started" item
  - Displays task details with section context
  - Entire widget is clickable for quick navigation
  - Uses lucide-react icons (no emojis)
  - Completion indicator when all tasks complete

- **Smooth Scroll + Highlight**: Click widget to smoothly scroll and highlight the item
  - Smooth scroll animation centers the task in view
  - 2-second pulse animation draws attention
  - Seamless navigation from widget to item

### V3 Features ✨ NEW

See [docs/TECH.md](docs/TECH.md) for technical specification.

- **Dashboard Header Row**: A new header section at the top of the dashboard containing:
  
  - **Toolbox Widget**: Quick access launcher for frequently used external tools
    - Hardcoded tool configurations in `client/src/config/toolbox.ts`
    - Click icons to open tools in new tabs
    - Includes: Clip Studio, Pinterest, Pixiv, YouTube, ArtStation, Notion
    - Easily extensible by editing configuration file
  
  - **Pixiv Inspiration Widget**: Daily top-ranked illustration display
    - Fetches Top 15 illustrations from Pixiv daily ranking once per session
    - Shows different random image each time you visit the dashboard
    - Click thumbnail to open immersive full-screen lightbox
    - Bookmark/unbookmark directly from lightbox
    - View on Pixiv with external link button
    - Aggressive caching strategy minimizes API requests

### V3.1 Features ✨ LATEST

- **Dashboard Search Filter**: Real-time search to quickly find curriculums
  - Searches across title, author, and platform fields simultaneously
  - AND logic: all words must appear in the combined searchable text
  - Case-insensitive matching for flexible searching
  - Real-time filtering as you type (no submit button needed)
  - Clear button (X) to reset search instantly
  - Shows "No matching curriculums" message when filter returns no results
  - Search persists while on dashboard view

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
| Database | sql.js | In-memory SQLite database |
| ORM | Drizzle ORM | Type-safe database queries |
| Validation | Zod | Runtime type checking |

## Usage Guide

### Dashboard Navigation (V2)

When you first open the app, you'll see the **Dashboard** with all your curriculums organized by status:

- **📊 Ongoing**: Currently active curriculums (expanded by default)
  - Shows current/next task preview
  - Sorted by nearest deadline first
- **⏸️ Standby**: Paused curriculums  
- **📋 Planned**: Future curriculums
- **⭐ Wishlist**: Courses you're interested in but not ready to commit to
  - Appears only on dashboard, not in sidebar
  - Perfect for tracking potential future learning paths

**Features:**
- Click any card to open the full curriculum view
- External links open in new tabs
- Cards show priority, days remaining, progress, and goal date

### Searching the Dashboard (V3.1)

Use the **Search Bar** at the top of the dashboard to quickly find curriculums:

1. Type keywords in the search field (searches across title, author, and platform)
2. Results filter in real-time as you type
3. Use multiple words to narrow results (AND logic: all words must match)
4. Click the **X** button or clear the text to show all curriculums again

**Example searches:**
- `drawabox` - Finds any curriculum with "drawabox" in title, author, or platform
- `proko anatomy` - Finds curriculums containing both "proko" AND "anatomy"
- Search is case-insensitive: `UDEMY` matches `udemy`

### Creating a Curriculum

1. Click the **+** button in the sidebar
2. Fill in curriculum details (title, author, platform, etc.)
3. Set priority (High/Medium/Low) and status (Ongoing/Standby/Planned/Wishlist)
4. Optionally set a goal end date to enable days remaining countdown
5. Click **Create**

**Status Options:**
- **Ongoing**: Currently studying
- **Standby**: Temporarily paused
- **Planned**: Scheduled to start soon
- **Wishlist**: Interested but not committed (dashboard-only)

### Adding Sections and Items

1. Select a curriculum from the sidebar (or click a card from the dashboard)
2. Click **Add Section** to create a new section
3. Within each section, click **+ Item** to add study items
4. Set item type (Video/Reading/Exercise/Homework/Other)

### Using the Current Task Widget (V2)

When viewing a curriculum, you'll see the **Current Task Widget** prominently displayed:

- Shows your active "in progress" task, or the next "not started" task
- Displays task details and which section it belongs to
- Click **Go to Task** to smoothly scroll to the item with a highlight animation
- Celebrates with a 🎉 when all tasks are complete

### Tracking Progress

- Click on any item's status icon to cycle through:
  - ☐ Not Started → ▶ In Progress → ✓ Completed
- Progress bars automatically update at section and curriculum levels
- Current task widget updates in real-time

### Exporting for Tora-chan

1. Click **Export to Tora-chan** in the header
2. Download the ZIP file containing:
   - `ToraCoursesDashboard.md` - Token-optimized Markdown summary
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

**Curriculum Management:**
- `GET /api/curriculums` - List all curriculums
- `GET /api/curriculums/:id` - Get curriculum detail
- `POST /api/curriculums` - Create curriculum
- `PATCH /api/curriculums/:id` - Update curriculum
- `DELETE /api/curriculums/:id` - Delete curriculum

**Sections & Items:**
- Similar CRUD endpoints for sections and items

**Import/Export:**
- `POST /api/import` - Import curriculum from JSON
- `GET /api/export/json` - Export full database
- `GET /api/export/tora` - Generate Tora-chan Memory Pack

**Pixiv Integration (V3):**
- `GET /api/pixiv/daily-ranking` - Get top 15 daily illustrations
- `POST /api/pixiv/bookmark/:illustId` - Bookmark illustration
- `DELETE /api/pixiv/bookmark/:illustId` - Remove bookmark
- `GET /api/pixiv/image?url=<pixiv_image_url>` - Proxy Pixiv images with proper headers

### Environment Variables

**Server** (`server/.env`):
```env
PORT=3001

# V3 Feature: Pixiv API Integration (Optional)
# Required for Pixiv Inspiration Widget to work
# See "Pixiv Integration Setup" section below for instructions
PIXIV_REFRESH_TOKEN=your_pixiv_refresh_token_here
```

**Client** (`client/.env`):
```env
VITE_API_URL=/api
```

### Pixiv Integration Setup (V3 - Optional)

The Pixiv Inspiration Widget requires a Pixiv refresh token. If not configured, the widget will display an error message but the rest of the app will work normally.

**Steps to obtain a Pixiv Refresh Token:**

1. Install a Pixiv authentication tool (recommended: [pixiv-auth](https://github.com/alphasp/pixiv-auth))
   ```bash
   npx pixiv-auth login
   ```

2. Complete the OAuth flow in your browser

3. Copy the `refresh_token` from the output

4. Create `server/.env` file (use `server/.env.example` as template):
   ```bash
   cp server/.env.example server/.env
   ```

5. Add your refresh token to `server/.env`:
   ```env
   PIXIV_REFRESH_TOKEN=your_actual_refresh_token_here
   ```

6. Restart the server for changes to take effect

**Note:** The `.env` file is gitignored and will never be committed. Keep your refresh token private.

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
