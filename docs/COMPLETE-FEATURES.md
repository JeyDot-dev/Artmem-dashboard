# Artmem Dashboard - Complete Feature Documentation

**Version:** 2.0  
**Last Updated:** January 24, 2026  
**Purpose:** External AI feature brainstorming reference

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Core Concepts & Data Model](#2-core-concepts--data-model)
3. [Curriculum Management Features](#3-curriculum-management-features)
4. [Hierarchical Organization Features](#4-hierarchical-organization-features)
5. [Progress Tracking System](#5-progress-tracking-system)
6. [Dashboard & Navigation](#6-dashboard--navigation)
7. [Import/Export System](#7-importexport-system)
8. [UI/UX Features](#8-uiux-features)
9. [Date & Time Tracking](#9-date--time-tracking)
10. [Item Types & Categorization](#10-item-types--categorization)
11. [Status Management System](#11-status-management-system)
12. [Search & Discovery Features](#12-search--discovery-features)
13. [Visual Progress Indicators](#13-visual-progress-indicators)
14. [Interactive Elements](#14-interactive-elements)
15. [Task Focus Features](#15-task-focus-features)
16. [Data Persistence & Storage](#16-data-persistence--storage)
17. [Technical Characteristics](#17-technical-characteristics)

---

## 1. Application Overview

### What It Is

Artmem Dashboard (also called "Tora-chan Art Study Dashboard") is a **local-first web application** designed for tracking learning curriculum progress. It's specifically optimized for self-directed learners who want to:
- Consolidate multiple learning resources (courses, books, tutorials) in one place
- Visualize progress across all learning activities
- Share structured progress data with AI assistants for personalized guidance
- Stay motivated with countdown timers and progress tracking

### Core Use Case

The app is designed for someone studying multiple courses simultaneously (e.g., art student taking several online courses, reading books, and completing exercises) who wants a unified place to:
1. Track what they've completed
2. See what they're currently working on
3. Know what to do next
4. Export their progress for AI study companions

### Design Philosophy

- **Local-first**: All data stays on the user's machine; no cloud accounts or sync required
- **Privacy-focused**: Single-user application with no network exposure
- **AI-ready**: Exports are optimized for AI consumption (token-efficient markdown format)
- **Minimal UI**: Clean, "doujin" aesthetic - functional and understated
- **Zero friction**: One-click status updates, drag-and-drop imports

---

## 2. Core Concepts & Data Model

### Three-Level Hierarchy

The application organizes learning content in a three-tier structure:

```
CURRICULUM (e.g., "Figure Drawing Course")
├── SECTION 1 (e.g., "Basic Anatomy")
│   ├── Item 1.1 (e.g., "Watch: Skeleton Structure")
│   ├── Item 1.2 (e.g., "Read: Bone Proportions")
│   └── Item 1.3 (e.g., "Exercise: Skull Drawing")
├── SECTION 2 (e.g., "Gesture Drawing")
│   ├── Item 2.1 (e.g., "Watch: 30-Second Gestures")
│   └── Item 2.2 (e.g., "Homework: 100 Gesture Studies")
└── SECTION 3 (e.g., "Full Body Studies")
    └── Item 3.1 (e.g., "Watch: Body Proportions")
```

### Entity Definitions

#### Curriculum
A complete learning course, book, tutorial series, or study plan.

**Attributes:**
- `id`: Unique identifier
- `title`: Curriculum name (e.g., "Figure Drawing for Artists")
- `author`: Creator/instructor name (optional)
- `platform`: Source platform (e.g., "YouTube", "Udemy", "Book", "New Masters Academy")
- `platformUrl`: Direct link to course/resource (optional)
- `description`: Notes about the curriculum (optional)
- `priority`: High, Medium, or Low
- `status`: Ongoing, Standby, or Planned
- `startDate`: When user began (optional)
- `endDate`: Goal completion date (optional)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last modification timestamp

#### Section
A grouping of related items within a curriculum (chapter, module, unit, week).

**Attributes:**
- `id`: Unique identifier
- `curriculumId`: Parent curriculum reference
- `title`: Section name (e.g., "Week 3: Hands and Feet")
- `description`: Notes about the section (optional)
- `sortOrder`: Display order within curriculum
- `createdAt`: Record creation timestamp
- `updatedAt`: Last modification timestamp

#### Item
An individual learning task or activity.

**Attributes:**
- `id`: Unique identifier
- `sectionId`: Parent section reference
- `title`: Task name (e.g., "Watch: Hand Bone Structure")
- `description`: Notes about the task (optional)
- `type`: Video, Reading, Exercise, Homework, or Other
- `status`: Not Started, In Progress, or Completed
- `sortOrder`: Display order within section
- `createdAt`: Record creation timestamp
- `updatedAt`: Last modification timestamp

---

## 3. Curriculum Management Features

### 3.1 Create Curriculum

**Feature:** Users can create new curricula from scratch.

**Details:**
- Opens a form dialog
- Required field: Title only
- Optional fields: Author, Platform, Platform URL, Description, Priority, Status, Start Date, End Date
- Defaults: Priority = Medium, Status = Planned
- Form has full validation (title required, valid URL format if provided)
- Automatically sets creation timestamp

**User Workflow:**
1. Click "Add Curriculum" button in sidebar
2. Fill in curriculum details
3. Click "Create"
4. New curriculum appears in sidebar under appropriate status group

### 3.2 Edit Curriculum

**Feature:** Users can modify existing curriculum metadata.

**Details:**
- Opens pre-filled form dialog with current values
- Can change any attribute except ID and timestamps
- Updates `updatedAt` timestamp automatically
- Changes immediately reflected in UI

**User Workflow:**
1. View a curriculum in detail view
2. Click "Edit" button in header
3. Modify fields
4. Click "Update"
5. Changes reflected immediately

### 3.3 Delete Curriculum

**Feature:** Users can permanently remove curricula.

**Details:**
- Deletes curriculum and ALL associated sections and items (cascade delete)
- No confirmation dialog (assumes user intent)
- Immediately removes from database
- Returns to dashboard view if currently viewing deleted curriculum

**User Workflow:**
1. View a curriculum in detail view
2. Click "Delete" button in header
3. Curriculum and all contents are removed
4. Dashboard view shown

### 3.4 Curriculum Priority Levels

**Feature:** Three priority levels for organizing importance.

**Levels:**
- **High**: Urgent or most important curricula
- **Medium**: Standard priority (default)
- **Low**: Nice-to-have or low urgency

**Visual Representation:**
- High: Red/destructive color with lightning bolt icon
- Medium: Accent color
- Low: Muted/subtle color
- Displayed as badge on curriculum cards and detail view

### 3.5 Curriculum Status Types

**Feature:** Three status categories for organizing workflow.

**Statuses:**
- **Ongoing**: Currently active, being worked on
- **Standby**: Paused, on hold temporarily
- **Planned**: Future, not yet started

**Behavior:**
- Determines sidebar grouping
- Affects dashboard card grouping
- Ongoing curricula show current task widget on dashboard
- Status can be changed at any time

### 3.6 Platform Linking

**Feature:** Store and access original course URLs.

**Details:**
- Platform field stores source name (e.g., "Udemy", "YouTube")
- Platform URL field stores full link to course
- If URL provided, title becomes clickable link in UI
- Links open in new tab
- Clicking link doesn't navigate away from dashboard card

---

## 4. Hierarchical Organization Features

### 4.1 Create Section

**Feature:** Add sections to organize curriculum content.

**Details:**
- Creates section within a specific curriculum
- Required field: Title only
- Optional field: Description
- Auto-assigned sort order (appends to end)
- New sections appear at bottom of curriculum view

**User Workflow:**
1. View a curriculum in detail view
2. Click "Add Section" button
3. Enter section title and optional description
4. Click "Create"
5. New section appears at bottom with empty item list

### 4.2 Edit Section

**Feature:** Modify existing section details.

**Details:**
- Can change title and description
- Cannot change parent curriculum (move not supported)
- Updates `updatedAt` timestamp

**User Workflow:**
1. View a section in curriculum detail view
2. Click "Edit" button on section header
3. Modify fields
4. Click "Update"

### 4.3 Delete Section

**Feature:** Remove sections from curriculum.

**Details:**
- Deletes section and ALL items within it (cascade delete)
- Updates curriculum progress calculations immediately
- No confirmation dialog

**User Workflow:**
1. View a section in curriculum detail view
2. Click "Delete" button on section header
3. Section and all items removed immediately

### 4.4 Create Item

**Feature:** Add individual learning tasks to sections.

**Details:**
- Creates item within a specific section
- Required field: Title only
- Optional fields: Description, Type, Status
- Defaults: Type = Other, Status = Not Started
- Auto-assigned sort order (appends to end)
- Immediately affects progress calculations

**User Workflow:**
1. View a curriculum with sections
2. Click "Add Item" button on specific section
3. Enter item details
4. Click "Create"
5. New item appears at bottom of section

### 4.5 Edit Item

**Feature:** Modify existing item details.

**Details:**
- Can change title, description, type, status
- Cannot change parent section (move not supported)
- Status can also be changed via quick toggle (see Status Cycling)

**User Workflow:**
1. View an item in curriculum detail view
2. Click "Edit" button on item row
3. Modify fields
4. Click "Update"

### 4.6 Delete Item

**Feature:** Remove items from sections.

**Details:**
- Deletes single item
- Updates section and curriculum progress immediately
- No confirmation dialog

**User Workflow:**
1. View an item in curriculum detail view
2. Click "Delete" button on item row
3. Item removed immediately

### 4.7 Sort Order Preservation

**Feature:** Items and sections maintain their creation order.

**Details:**
- Each entity has `sortOrder` field
- Order persists across sessions
- New items/sections appended to end
- No manual reordering UI (order determined by creation sequence)

---

## 5. Progress Tracking System

### 5.1 Item-Level Progress

**Feature:** Each item has three status states.

**Statuses:**
- **Not Started**: Default state, not yet begun
- **In Progress**: Currently working on this item
- **Completed**: Finished

**Visual Indicators:**
- Not Started: Empty square icon, muted text
- In Progress: Play icon, primary color
- Completed: Check icon, accent/success color

### 5.2 Section-Level Progress

**Feature:** Automatic progress calculation for sections.

**Calculation:**
```
Section Progress = (Completed Items / Total Items in Section) × 100
```

**Display:**
- Progress bar showing percentage
- Text: "X/Y items" (e.g., "3/10 items")
- Real-time updates when item status changes

### 5.3 Curriculum-Level Progress

**Feature:** Automatic progress calculation across all sections.

**Calculation:**
```
Curriculum Progress = (Total Completed Items / Total Items Across All Sections) × 100
```

**Display:**
- Large progress bar in curriculum detail header
- Text: "X/Y items completed" (e.g., "45/120 items completed")
- Dashboard cards show progress bar and percentage
- Real-time updates when any item status changes

### 5.4 Real-Time Progress Updates

**Feature:** All progress indicators update immediately when statuses change.

**Details:**
- No page refresh needed
- Uses optimistic UI updates
- Server confirms and persists changes
- Recalculates all affected progress levels (item → section → curriculum)

---

## 6. Dashboard & Navigation

### 6.1 Dashboard View (Landing Page)

**Feature:** Overview of all curricula at a glance.

**Details:**
- Default view when no curriculum selected
- Shows all curricula as cards in grid layout
- Replaces old "welcome message" placeholder
- Responsive grid: 1-4 columns depending on screen size

**What's Displayed:**
- All curricula grouped by status
- Current task for Ongoing curricula
- Progress, priority, and days remaining for each
- Clickable cards for navigation

### 6.2 Status-Grouped Dashboard Sections

**Feature:** Curricula organized into collapsible status groups.

**Groups (in order):**
1. **Ongoing** (shown first, expanded by default)
2. **Standby**
3. **Planned**

**Each Group Shows:**
- Icon representing status (trending up, pause, clipboard)
- Count of curricula in group (e.g., "Ongoing (3)")
- Collapsible/expandable section
- Curricula sorted by end date within group (nearest deadline first)

### 6.3 Curriculum Cards

**Feature:** Compact visual representation of each curriculum.

**Card Contents:**
- **Header:** Priority badge (if high priority) + Days remaining countdown
- **Title:** Curriculum name (clickable link if platform URL exists)
- **Metadata:** Author • Platform
- **Progress Bar:** Visual progress indicator
- **Progress Text:** "X/Y items completed (Z%)"
- **Goal Date:** End date display with target icon
- **Current Task:** (Ongoing only) Current/next task preview

**Card Interactions:**
- Click anywhere on card → Navigate to full curriculum view
- Click platform link → Open external URL in new tab (doesn't navigate card)
- Hover → Subtle elevation effect

**Sorting:**
- Within each status group, cards sorted by end date (ascending)
- Curricula without end dates appear at bottom of their group

### 6.4 Sidebar Navigation

**Feature:** Persistent sidebar for quick curriculum access.

**Contents:**
- "Add Curriculum" button at top
- All curricula listed by status groups (same as dashboard)
- Clicking curriculum name → Navigate to detail view
- Currently selected curriculum highlighted

**Behavior:**
- Collapsible on mobile/small screens
- Always visible on desktop
- Groups match dashboard organization

### 6.5 Header Bar

**Feature:** Top navigation bar with global actions.

**Contents:**
- Application title: "Artmem Dashboard"
- Export buttons:
  - "Export JSON" - Full database backup
  - "Export Tora Pack" - AI-optimized memory pack
- Import toggle button - Shows/hides import interface

### 6.6 Curriculum Detail View

**Feature:** Full view of a single curriculum with all sections and items.

**Layout:**
```
┌─────────────────────────────────────────┐
│ HEADER CARD                              │
│ - Title, author, platform, description   │
│ - Priority badge, days remaining         │
│ - Progress bar and stats                 │
│ - Edit, Delete buttons                   │
├─────────────────────────────────────────┤
│ CURRENT TASK WIDGET                      │
│ - Shows current/next task                │
│ - Clickable to scroll to item            │
├─────────────────────────────────────────┤
│ SECTION 1                                │
│ ├─ Item 1.1 [status icon] [type badge]  │
│ ├─ Item 1.2 [status icon] [type badge]  │
│ └─ Item 1.3 [status icon] [type badge]  │
├─────────────────────────────────────────┤
│ SECTION 2                                │
│ └─ Item 2.1 [status icon] [type badge]  │
└─────────────────────────────────────────┘
```

**Navigation:**
- Click curriculum in sidebar/dashboard → Show detail view
- Click "Back" or select different curriculum → Switch view
- Click import toggle → Show import interface (replaces detail view)

---

## 7. Import/Export System

### 7.1 Export to JSON

**Feature:** Full database backup as JSON file.

**Details:**
- Downloads single JSON file with ALL curricula
- Includes all metadata, sections, items, and timestamps
- Human-readable format (pretty-printed)
- Filename format: `tora-export-YYYY-MM-DD.json`
- Compatible with import function

**Data Included:**
- All curriculum metadata (title, author, platform, dates, priority, status, description)
- All sections with descriptions
- All items with descriptions, types, and statuses
- Complete hierarchical structure preserved

**Use Cases:**
- Regular backups
- Transferring data to another machine
- Sharing curricula with others
- Archiving completed courses

### 7.2 Export Tora-chan Memory Pack

**Feature:** AI-optimized export in ZIP format with markdown + JSON.

**Details:**
- Downloads ZIP file containing two files:
  1. `ToraCoursesDashboard.md` - Human/AI-readable summary
  2. `tora-full-backup-YYYY-MM-DD.json` - Complete backup
- Filename format: `tora-memory-pack-YYYY-MM-DD.zip`
- Markdown optimized for AI token efficiency

**Markdown Structure:**
```markdown
# Tora-chan Art Study Progress Report

Generated: YYYY-MM-DD

## Active Studies (Ongoing)

### Curriculum Title
**Progress:** 45/120 items (38%)
**Author:** Jane Doe | **Platform:** [Udemy](URL) | **Priority:** high

#### Section 1 Title
Section description (if any)
- [✓] Item 1 Title (video) — Completed
- [▶] Item 2 Title (exercise) — In Progress
- [ ] Item 3 Title (reading) — Not Started

#### Section 2 Title
...

---

## On Hold (Standby)

### Curriculum Title
Description or "Currently on hold."
**Sections:** Section 1, Section 2, Section 3

---

## Planned

### Curriculum Title
Description or "Not yet started."
```

**Use Cases:**
- Sharing progress with AI study companions (like "Tora-chan")
- AI can read markdown for quick context
- AI can parse JSON for detailed analysis
- Token-efficient format for large curricula

### 7.3 Import from JSON (File Upload)

**Feature:** Drag-and-drop or click-to-select file import.

**Details:**
- Accepts `.json` files
- Drag-and-drop area with visual feedback
- Validates JSON structure before import
- Creates new curriculum with all sections and items
- Shows error message if JSON invalid

**What Gets Imported:**
- Single curriculum object or array of curricula
- All sections and items hierarchically
- All metadata (author, platform, dates, etc.)
- Status and priority settings
- Item types and statuses

**Behavior:**
- Imports create NEW curricula (doesn't merge with existing)
- Auto-generates new IDs
- Sets current timestamp for createdAt/updatedAt
- Navigates to newly imported curriculum after success

### 7.4 Import from JSON (Paste Text)

**Feature:** Paste JSON directly into text area.

**Details:**
- Alternative to file upload
- Large text area for pasting JSON data
- Same validation as file import
- "Import" button to process
- Clears text area after successful import

**Use Cases:**
- Quick import from clipboard
- No need to save file first
- Useful for copying from documentation or messages

### 7.5 Import Interface Toggle

**Feature:** Show/hide import interface.

**Details:**
- Button in header: "Import"
- Toggles between import view and main content
- Import view replaces curriculum detail/dashboard
- Clicking curriculum or toggling import button returns to normal view

---

## 8. UI/UX Features

### 8.1 Minimal "Doujin" Aesthetic

**Feature:** Clean, understated design philosophy.

**Characteristics:**
- No excessive whitespace or padding
- Compact components
- Minimal decoration
- Functional over flashy
- Consistent spacing and sizing

### 8.2 Icon System (Lucide React)

**Feature:** Consistent iconography throughout app (NEVER emojis).

**Icon Usage:**
- Status icons: Play (in-progress), Square (not-started), CheckCircle2 (completed)
- Status group icons: TrendingUp (ongoing), Pause (standby), ClipboardList (planned)
- Priority icon: Zap (lightning bolt)
- Date icon: Target (crosshair)
- Upload: Upload icon for import
- External link: ExternalLink icon
- Standard sizes: `h-4 w-4` (standard), `h-3.5 w-3.5` (compact)

**Why No Emojis:**
- Maintains professional appearance
- Consistent across platforms/fonts
- Scalable and themeable
- Better accessibility

### 8.3 Color Scheme & Theming

**Feature:** CSS custom properties for consistent theming.

**Color Variables:**
- `--primary`: Primary actions, links, progress
- `--secondary`: Secondary backgrounds
- `--accent`: Success states, completed items
- `--destructive`: Delete buttons, urgent warnings, high priority
- `--muted`: Disabled states, placeholders
- `--background`: Main background
- `--foreground`: Main text
- `--border`: Border colors

**Application:**
- Dark mode friendly (default theme is dark)
- All colors use CSS variables
- Consistent across all components

### 8.4 Responsive Grid Layout

**Feature:** Adaptive dashboard grid for different screen sizes.

**Breakpoints:**
- Mobile (< 640px): 1 column
- Tablet (640-1024px): 2 columns
- Desktop (1024-1280px): 3 columns
- Large Desktop (> 1280px): 4 columns

**Behavior:**
- Cards maintain consistent size
- Grid auto-adjusts to viewport
- Sidebar collapses on mobile

### 8.5 Interactive Hover States

**Feature:** Subtle visual feedback on interactive elements.

**Effects:**
- Cards: Slight border color change, subtle shadow elevation
- Items: Background color change on hover
- Buttons: Background color change
- Focus states: Ring outline for keyboard navigation

**Style Pattern:**
- `hover:border-primary/50 hover:bg-primary/5` - For borders and backgrounds
- `focus-visible:ring-2 focus-visible:ring-primary` - For accessibility

### 8.6 Form Dialog System

**Feature:** Modal dialogs for create/edit operations.

**Characteristics:**
- Overlay darkens background
- Centered modal with form fields
- "Cancel" and "Create/Update" buttons
- ESC key closes dialog
- Click outside closes dialog
- Form validation feedback

**Used For:**
- Create/edit curriculum
- Create/edit section
- Create/edit item

### 8.7 Accessibility Features

**Feature:** Keyboard navigation and screen reader support.

**Implementations:**
- All interactive elements have `tabIndex`
- Focus indicators visible
- ARIA labels on icons
- Semantic HTML (button, nav, article elements)
- Proper heading hierarchy
- Alt text on visual indicators

---

## 9. Date & Time Tracking

### 9.1 Start Date

**Feature:** Track when user began a curriculum.

**Details:**
- Optional field
- Date picker in form
- Displayed in curriculum detail header
- Used for historical tracking only (no behavior changes)

### 9.2 End Date (Goal Date)

**Feature:** Set target completion date for motivation.

**Details:**
- Optional field
- Date picker in form
- Displayed in curriculum detail header with target icon
- Used for days remaining calculation
- Affects sorting in dashboard (earliest deadline first)

### 9.3 Days Remaining Countdown

**Feature:** Live countdown to goal date.

**Display Locations:**
- Dashboard card (top-right corner)
- Curriculum detail header (next to goal date)

**Calculation:**
- Compares end date to current date (date only, ignores time)
- Updates daily automatically

**States & Colors:**
- `> 30 days`: "X days" in muted color (low urgency)
- `8-30 days`: "X days" in accent color (moderate urgency)
- `1-7 days`: "X days" in red/destructive color (urgent)
- `0 days`: "Today!" in bold red (due today)
- `< 0 days`: "X days overdue" in red (past deadline)
- `null` (no end date): Not displayed

**Purpose:**
- Visual motivation
- Deadline awareness
- Prioritization aid

### 9.4 Creation & Update Timestamps

**Feature:** Automatic tracking of record creation and modification.

**Details:**
- `createdAt`: Set once when entity created
- `updatedAt`: Updated every time entity modified
- Both stored as ISO date strings in database
- Not displayed in UI (internal metadata)
- Included in JSON exports

---

## 10. Item Types & Categorization

### 10.1 Five Item Types

**Feature:** Categorize learning tasks by activity type.

**Types:**

1. **Video** - Video lessons, tutorials, recorded lectures
   - Icon: Film or Play icon (lucide-react)
   - Use case: YouTube tutorials, Udemy videos, course recordings

2. **Reading** - Articles, book chapters, documentation
   - Icon: Book icon
   - Use case: Textbook chapters, blog posts, PDF readings

3. **Exercise** - Practice assignments, drills
   - Icon: Dumbbell or Activity icon
   - Use case: Drawing exercises, coding challenges, practice problems

4. **Homework** - Graded assignments, projects
   - Icon: FileText or Clipboard icon
   - Use case: Course assignments, projects, submissions

5. **Other** - Miscellaneous tasks (default)
   - Icon: Circle or Dot icon
   - Use case: Anything not fitting above categories

### 10.2 Type Display

**Feature:** Visual badges showing item type.

**Details:**
- Small badge on each item row
- Shows icon + type name
- Color-coded per type
- Helps scan and identify task types quickly

---

## 11. Status Management System

### 11.1 Item Status Cycling

**Feature:** One-click status toggle through all states.

**Cycle Pattern:**
```
Not Started → In Progress → Completed → Not Started → ...
```

**Interaction:**
- Click status icon on any item
- Immediately cycles to next status
- No confirmation needed
- Updates progress calculations instantly

**API Implementation:**
- Special endpoint: `PATCH /api/items/:id/status`
- Server handles cycle logic
- Returns updated item

**Use Cases:**
- Quick status updates while studying
- No need to open edit form
- Minimal friction for progress tracking

### 11.2 Curriculum Status Management

**Feature:** Change curriculum status between Ongoing, Standby, Planned.

**Details:**
- Changed via edit curriculum form
- Affects sidebar grouping
- Affects dashboard grouping
- Ongoing curricula show current task on dashboard
- Can move between statuses freely

---

## 12. Search & Discovery Features

### 12.1 Current Task Widget

**Feature:** Prominently display what to work on next.

**Display Locations:**

1. **Curriculum Detail View (Full Widget):**
   - Large widget below header card
   - Shows task title, type icon, section name, description
   - Entire widget is clickable
   - Label: "CURRENT FOCUS" (if in-progress) or "UP NEXT" (if not-started)

2. **Dashboard Cards (Compact Inline):**
   - Shown ONLY on Ongoing curricula
   - Compact inline display: icon + title + description (truncated)
   - Not clickable from dashboard (navigate to detail first)

**Task Selection Logic:**
1. First looks for any item with status "In Progress"
2. If none found, finds first "Not Started" item
3. If all items completed, shows "All tasks complete"

**Purpose:**
- Quick answer to "What should I work on?"
- Reduces cognitive load
- Maintains focus on current priority

### 12.2 Smooth Scroll to Task

**Feature:** Click current task widget to jump to item in list.

**Behavior:**
1. User clicks "CURRENT FOCUS" or "UP NEXT" widget (in curriculum detail view)
2. Page smoothly scrolls to target item
3. Target item receives highlight animation for 2 seconds
4. Highlight fades out

**Animation:**
- Pulsing glow effect using CSS keyframes
- Subtle shadow expansion
- Background color flash
- 2-second duration with smooth easing

**Implementation Details:**
- Items have `data-item-id` attribute
- `scrollIntoView` with smooth behavior
- Temporary CSS class `item-highlight` added
- Class removed after animation completes

---

## 13. Visual Progress Indicators

### 13.1 Progress Bars

**Feature:** Visual bars showing completion percentage.

**Locations:**
- Curriculum detail header (main progress bar)
- Each section (mini progress bar)
- Dashboard cards (compact progress bar)

**Appearance:**
- Filled portion: Primary/accent color
- Unfilled portion: Muted/gray color
- Rounded ends
- Smooth width transitions on updates

### 13.2 Progress Text

**Feature:** Textual completion stats.

**Formats:**
- Curriculum: "45/120 items completed (38%)"
- Section: "3/10 items"
- Dashboard card: "X/Y items completed"

**Purpose:**
- Exact numbers for users who prefer text
- Accessible for screen readers

### 13.3 Status Icon Indicators

**Feature:** Quick visual status identification.

**Icons:**
- Not Started: Empty square (Square icon)
- In Progress: Play triangle (Play icon)
- Completed: Checkmark (CheckCircle2 icon)

**Colors:**
- Not Started: Muted/gray
- In Progress: Primary/blue
- Completed: Accent/green

**Usage:**
- Every item row
- Current task widget
- Status summaries

---

## 14. Interactive Elements

### 14.1 Clickable Cards

**Feature:** Entire curriculum cards are interactive.

**Behavior:**
- Click anywhere on card → Navigate to curriculum detail view
- Exception: Clicking platform URL link opens external link only
- Hover state indicates interactivity
- Keyboard accessible (Enter key works)

**Purpose:**
- Larger click target
- More intuitive than requiring button click
- Faster navigation

### 14.2 Clickable Item Status

**Feature:** Item status icons are buttons for cycling.

**Behavior:**
- Click status icon → Cycle to next status
- Visual feedback on hover
- Immediate update
- No confirmation needed

### 14.3 Collapsible Sections

**Feature:** Expand/collapse dashboard status groups.

**Behavior:**
- Click section header to toggle
- Smooth expand/collapse animation
- State persists during session
- Default: Ongoing expanded, others collapsed

### 14.4 External Link Handling

**Feature:** Platform URLs open in new tabs.

**Behavior:**
- Curriculum cards with platform URL show external link icon
- Clicking link opens new browser tab
- Event propagation stopped (doesn't navigate card)
- User stays in dashboard

---

## 15. Task Focus Features

### 15.1 Current Task Detection

**Feature:** Automatic identification of what user should work on.

**Algorithm:**
```
FOR each section in curriculum (in order):
  FOR each item in section (in order):
    IF item.status === "in_progress":
      RETURN item  // Priority 1: Current work

FOR each section in curriculum (in order):
  FOR each item in section (in order):
    IF item.status === "not_started":
      RETURN item  // Priority 2: Next task

RETURN null  // All items completed
```

**Use Cases:**
- Resuming after break
- Multiple items in progress (picks first)
- Sequential learning paths

### 15.2 Current Task Visibility

**Feature:** Current task shown in multiple places.

**Locations:**
1. Dashboard card (if Ongoing status)
2. Curriculum detail widget (prominent widget)
3. Implicit in item list (status icons)

**Benefits:**
- Never forget what you're working on
- Quick at-a-glance check
- Reduces decision fatigue

### 15.3 Task Description Preview

**Feature:** Show item descriptions in context.

**Details:**
- Current task widget shows full description (if provided)
- Dashboard cards show truncated description
- Helps remember task details without clicking

---

## 16. Data Persistence & Storage

### 16.1 SQLite Database (sql.js)

**Feature:** In-memory SQL database with file persistence.

**Details:**
- Database runs entirely in memory (fast)
- Periodically saved to file: `server/data/tora.db`
- Auto-save on all mutations
- Debounced writes (batches rapid changes)
- No external database server needed

### 16.2 Local-Only Storage

**Feature:** All data stored on user's machine.

**Details:**
- No cloud sync
- No user accounts
- No remote servers
- Complete data privacy
- Works offline always

### 16.3 Schema Versioning (Drizzle ORM)

**Feature:** Database schema managed with migrations.

**Details:**
- Schema defined in TypeScript
- Drizzle ORM handles SQL generation
- Can push schema changes with `pnpm db:push`
- Type-safe queries

---

## 17. Technical Characteristics

### 17.1 Technology Stack

**Frontend:**
- React 19 (functional components only)
- Vite (build tool)
- TypeScript (strict mode)
- TanStack Query v5 (server state)
- shadcn/ui components
- Tailwind CSS (utility-first styling)

**Backend:**
- Node.js + Express
- TypeScript
- Drizzle ORM
- sql.js (SQLite in-memory)
- Zod (validation)

### 17.2 API Architecture

**Pattern:** RESTful JSON API

**Endpoints:**

**Curriculums:**
- `GET /api/curriculums` - List all with progress
- `GET /api/curriculums/:id` - Get detail with sections/items
- `POST /api/curriculums` - Create
- `PATCH /api/curriculums/:id` - Update
- `DELETE /api/curriculums/:id` - Delete

**Sections:**
- `POST /api/curriculums/:id/sections` - Create section
- `PATCH /api/sections/:id` - Update section
- `DELETE /api/sections/:id` - Delete section

**Items:**
- `POST /api/sections/:id/items` - Create item
- `PATCH /api/items/:id` - Update item
- `PATCH /api/items/:id/status` - Cycle status (special endpoint)
- `DELETE /api/items/:id` - Delete item

**Import/Export:**
- `POST /api/import` - Import curriculum JSON
- `GET /api/export/json` - Download full JSON backup
- `GET /api/export/tora` - Download Tora-chan memory pack (ZIP)

### 17.3 State Management

**Server State (TanStack Query):**
- All curricula list: `['curriculums']` query key
- Single curriculum detail: `['curriculum', id]` query key
- Automatic caching
- Optimistic updates
- Automatic refetching on mutations

**Local UI State:**
- Form data: `useState` in components
- Selected curriculum: `useState` in App.tsx
- Import toggle: `useState` in App.tsx

### 17.4 Validation

**Runtime Validation (Zod):**
- All API requests validated
- Schema definitions in `shared/types.ts`
- Type inference for TypeScript
- Error messages for invalid data

**Type Safety:**
- Strict TypeScript mode
- Shared types between client/server
- Compile-time type checking

### 17.5 Performance Characteristics

**Responsive Operations:**
- Status toggle: < 100ms
- Dashboard render: < 500ms (50 curricula)
- Database operations: < 200ms
- Initial load: < 2 seconds

**Optimizations:**
- In-memory database (fast queries)
- TanStack Query caching (reduces network calls)
- Optimistic UI updates (feels instant)
- Debounced database saves (reduces I/O)

### 17.6 Single-User Design

**Feature:** Application designed for one user per instance.

**Characteristics:**
- No authentication system
- No user accounts
- No multi-user conflict resolution
- Single data file
- Localhost only (no network exposure)

### 17.7 Desktop-First Focus

**Feature:** Optimized for desktop learning workflows.

**Characteristics:**
- Responsive but desktop-primary
- Sidebar always visible on large screens
- Multi-column dashboard on desktop
- No mobile app equivalent

---

## Summary Statistics

Based on this documentation, the application currently has:

- **3 main entity types** (Curriculum, Section, Item)
- **3 curriculum statuses** (Ongoing, Standby, Planned)
- **3 item statuses** (Not Started, In Progress, Completed)
- **3 priority levels** (High, Medium, Low)
- **5 item types** (Video, Reading, Exercise, Homework, Other)
- **2 export formats** (JSON, Tora-chan Memory Pack)
- **2 import methods** (File upload, Paste text)
- **13 API endpoint groups** (CRUD for 3 entities + import/export + special status cycling)
- **2 main views** (Dashboard overview, Curriculum detail)
- **4 progress levels** (Item status, Section %, Curriculum %, Overall completion)
- **Infinite curricula** (no practical limit on data)

---

## Feature Categories Summary

| Category | Feature Count | Description |
|----------|---------------|-------------|
| **CRUD Operations** | 12 | Create, edit, delete for 3 entity types + special status cycle |
| **Progress Tracking** | 4 | Item, section, curriculum, and real-time updates |
| **Navigation** | 6 | Dashboard, sidebar, detail view, cards, scroll-to-task, import toggle |
| **Import/Export** | 5 | 2 export formats + 2 import methods + validation |
| **Date/Time** | 4 | Start date, end date, days remaining, timestamps |
| **Categorization** | 11 | 3 statuses + 3 priorities + 5 item types |
| **Visual Indicators** | 8 | Progress bars, status icons, type badges, priority badges, hover states, highlights, colors, responsive grid |
| **Interactive Elements** | 6 | Clickable cards/status/widgets, collapsible sections, forms, drag-drop |
| **Task Focus** | 3 | Current task detection, widget display, scroll-to-task |
| **Data Management** | 3 | SQLite persistence, local-only, schema versioning |

---

**End of Document**

This comprehensive feature list captures every detail of the Artmem Dashboard application as it exists today. Use this as a reference for brainstorming new features, understanding capabilities, and identifying potential enhancement opportunities.
