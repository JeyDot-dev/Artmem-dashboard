# Artmem Dashboard - Product Requirements Document

## Executive Summary

**Artmem Dashboard** (also known as Tora-chan Art Study Dashboard) is a local-first web application designed for tracking learning curriculum progress. It provides a structured way to organize courses, lessons, and study materials with visual progress tracking and AI-optimized exports for maintaining context with AI study companions.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Users](#2-target-users)
3. [Product Vision](#3-product-vision)
4. [Core Features](#4-core-features)
5. [V2 Features](#5-v2-features)
6. [User Stories](#6-user-stories)
7. [Information Architecture](#7-information-architecture)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Out of Scope](#10-out-of-scope)

---

## 1. Problem Statement

### The Challenge

Learners following multiple online courses, tutorials, and self-study curricula face several challenges:

- **Fragmented Progress Tracking**: Progress is scattered across different platforms (YouTube, Udemy, books, etc.)
- **Lack of Unified View**: No single place to see all learning activities and their status
- **Context Loss with AI Assistants**: When using AI study companions, context about current progress is lost between sessions
- **Goal Visibility**: Difficulty tracking deadlines and remaining time for learning goals

### The Solution

Artmem Dashboard provides a unified, local-first application that:
- Consolidates all learning curricula in one place
- Visualizes progress at item, section, and curriculum levels
- Exports AI-optimized summaries to maintain context with AI assistants
- Tracks goal dates with countdown visibility

---

## 2. Target Users

### Primary Persona: Self-Directed Learner

- **Who**: Students, hobbyists, or professionals following self-paced learning paths
- **Goals**: 
  - Track progress across multiple courses/curricula
  - Stay motivated by visualizing completion
  - Maintain context when discussing progress with AI assistants
- **Pain Points**:
  - Loses track of where they left off
  - Forgets deadlines for completing courses
  - Has to re-explain progress to AI assistants each session

### Secondary Persona: Art Student with AI Companion

- **Who**: Art students using an AI assistant (like "Tora-chan") as a study buddy
- **Goals**:
  - Share structured progress data with AI for personalized guidance
  - Get reminders about what to work on next
  - Have AI understand their complete learning journey
- **Pain Points**:
  - AI context windows don't persist progress information
  - Manual updates are tedious and error-prone

---

## 3. Product Vision

### Mission Statement

> Enable learners to track, visualize, and share their learning journey with both themselves and AI assistants through a beautiful, local-first dashboard.

### Core Principles

1. **Local-First**: Data stays on user's machine; no accounts, no cloud sync required
2. **AI-Ready**: Exports designed for AI consumption (token-optimized markdown)
3. **Visual Progress**: Clear, motivating progress visualization
4. **Minimal Friction**: One-click status updates, drag-and-drop imports
5. **Privacy-Focused**: Single-user, no network exposure

---

## 4. Core Features (V1)

### 4.1 Curriculum Management

| Feature | Description |
|---------|-------------|
| Create Curriculum | Add new learning curriculum with metadata |
| Edit Curriculum | Modify title, author, platform, description, dates |
| Delete Curriculum | Remove curriculum and all associated data |
| Curriculum Status | Track as Ongoing, Standby, Planned, or Wishlist |
| Priority Levels | Mark as High, Medium, or Low priority |
| Platform Links | Store URL to original course/material |

### 4.2 Hierarchical Organization

```
Curriculum
├── Section 1
│   ├── Item 1.1
│   ├── Item 1.2
│   └── Item 1.3
├── Section 2
│   ├── Item 2.1
│   └── Item 2.2
└── Section 3
    └── Item 3.1
```

- **Sections**: Group related items (chapters, modules, units)
- **Items**: Individual learning tasks (videos, readings, exercises, homework)

### 4.3 Progress Tracking

| Level | Calculation |
|-------|-------------|
| Item | Status: Not Started → In Progress → Completed |
| Section | % of items completed |
| Curriculum | % of all items completed |

- **One-Click Status Cycling**: Click item to cycle through statuses
- **Visual Progress Bars**: At section and curriculum levels
- **Real-Time Updates**: Progress recalculates immediately

### 4.4 Item Types

| Type | Icon | Use Case |
|------|------|----------|
| Video | 📹 | Video lessons, tutorials |
| Reading | 📖 | Articles, book chapters |
| Exercise | 🏋️ | Practice assignments |
| Homework | 📝 | Graded assignments |
| Other | ⚪ | Miscellaneous items |

### 4.5 Import/Export

| Feature | Format | Purpose |
|---------|--------|---------|
| Export JSON | `.json` | Full backup of all data |
| Import JSON | `.json` | Restore or share curricula |
| Export Tora-chan | `.md` | AI-optimized progress markdown |

#### Tora-chan Progress Report Format

```markdown
# Tora-chan Art Study Progress

## 📊 Ongoing Curriculums

### Curriculum Title (65%)
- Section 1 (100%): ✓ Item 1, ✓ Item 2
- Section 2 (50%): ✓ Item 1, ▶ Item 2, ☐ Item 3

## ⏸️ Standby Curriculums
- Curriculum A (30% complete)
- Curriculum B (0% complete)

## 📋 Planned Curriculums
- Future Course 1
- Future Course 2
```

### 4.6 User Interface

- **Sidebar**: Collapsible, grouped by curriculum status
- **Main Content**: Curriculum detail view with sections and items
- **Header**: Export buttons, import toggle
- **Theme**: Dark mode with purple/teal accent colors
- **Responsive**: Adapts to different screen sizes

---

## 5. V2 Features

> See [V2-FEATURES.md](./V2-FEATURES.md) for detailed specification.

### 5.1 Dashboard/Home View

Replace the static welcome message with an interactive dashboard showing all curricula as cards.

**Key Features:**
- Cards grouped by status (Ongoing → Standby → Planned → Wishlist)
- Sorted by end goal date within each group
- Visual progress indicators
- Click to navigate to full view
- **Note**: Wishlist items appear only on the dashboard, not in the sidebar

### 5.2 Days Remaining

Display countdown to goal date.

**Locations:**
- Dashboard cards (top-right corner)
- Curriculum detail header

**Visual States:**
- Normal (>30 days): Muted color
- Warning (8-30 days): Accent color
- Urgent (1-7 days): Red/destructive
- Overdue: "X days overdue"

### 5.3 Current Task Widget

Show the current or next task prominently.

**Logic:**
1. First `in_progress` item (if any)
2. Otherwise, first `not_started` item

**Locations:**
- Dashboard cards (Ongoing only): Compact inline
- Curriculum view: Full widget with description

### 5.4 Smooth Scroll with Highlight

Click "Go to Task" to scroll and highlight.

**Behavior:**
1. Smooth scroll to center item in viewport
2. 2-second pulsing highlight animation
3. Automatic fade-out

### 5.5 Dashboard Header Row

A new header row positioned at the top of the dashboard, above the "Ongoing" curriculum section.

**Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐          ┌──────────────────────────────┐   │
│  │    TOOLBOX       │          │    PIXIV INSPIRATION         │   │
│  │  [Tool] [Tool]   │          │    ┌────────────────────┐    │   │
│  │  [Tool] [Tool]   │          │    │   Random Daily     │    │   │
│  └──────────────────┘          │    │   Illustration     │    │   │
│                                │    └────────────────────┘    │   │
│                                └──────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│  📊 Ongoing (3)                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                              │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │                              │
│  └─────────┘ └─────────┘ └─────────┘                              │
└────────────────────────────────────────────────────────────────────┘
```

### 5.6 Toolbox Component

A compact "machine/drawer" aesthetic widget providing quick access to frequently used external tools.

**Features:**
- Displays hardcoded tool icons from configuration file
- Clicking opens tool URL in new browser tab
- Minimal, doujin aesthetic matching app theme
- Easily extensible via `src/config/toolbox.ts`

**Tool Configuration:**
```typescript
interface Tool {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}
```

### 5.7 Pixiv Inspiration Widget

An inspiration widget that displays random top-ranked illustrations from Pixiv.

**Backend Features:**
- Authenticated API access via Pixiv Refresh Token
- Endpoint to fetch Daily Top 15 illustrations
- Endpoint to bookmark/unbookmark illustrations

**Frontend - Dashboard Card:**
- Sized to match existing curriculum cards
- On initial app load: fetches Top 15 and caches in memory
- On dashboard view: displays random image from cache (no new API call)
- Each return to dashboard shows a different random image from cache
- Thumbnail display with subtle hover effect
- Clicking opens immersive lightbox modal

**Frontend - Lightbox Modal:**
- Full-screen overlay with blurred backdrop
- High-resolution image display
- Bookmark button shows current state (filled = bookmarked, outline = not bookmarked)
- Clicking bookmark toggles state and updates both API and local cache
- Click outside or press ESC to close

**Caching Strategy:**
- Query key includes current date (YYYY-MM-DD), automatically fetches fresh data each day
- `staleTime: 12 hours` - data cached for half a day to avoid unnecessary refetches
- Fresh daily ranking fetched automatically when date changes
- Manual refresh button available to force immediate refetch
- Cache persists for 2 days before garbage collection

### 5.8 Dashboard Search Filter

A simple searchbar to filter curriculums displayed on the dashboard.

**Location:**
- Dashboard view, positioned below the header and above the status sections
- Compact, minimal design matching the app aesthetic

**Search Behavior:**
- Searches simultaneously across three fields: `title`, `author`, `platform`
- **AND logic**: All words typed must appear somewhere in the combined searchable text
- Case-insensitive matching
- Real-time filtering as user types (no submit button needed)
- Empty search shows all curriculums

**Search Algorithm:**
```
1. User types: "drawabox beginner"
2. Split into words: ["drawabox", "beginner"]
3. For each curriculum, create searchable text:
   - Combine: `${title} ${author || ''} ${platform || ''}`
   - Lowercase the combined text
4. Filter: Keep curriculum if ALL words appear in the searchable text
5. Display filtered curriculums in their respective status sections
```

**Example:**
| Search Query | Curriculum | Match? |
|--------------|------------|--------|
| `drawabox` | Title: "Drawabox Lessons", Author: "Irshad", Platform: "Drawabox" | ✓ Yes |
| `drawabox irshad` | Title: "Drawabox Lessons", Author: "Irshad", Platform: "Drawabox" | ✓ Yes |
| `drawabox youtube` | Title: "Drawabox Lessons", Author: "Irshad", Platform: "Drawabox" | ✗ No |
| `figure drawing` | Title: "Figure Drawing Fundamentals", Author: "Proko", Platform: "YouTube" | ✓ Yes |

**UI Specifications:**
- Input with search icon (lucide-react `Search` icon)
- Placeholder text: "Filter by title, author, platform..."
- Optional clear button when text is present (`X` icon)
- Subtle border, minimal padding
- Filter persists until cleared (not reset on navigation within dashboard)

**Edge Cases:**
- If all curriculums are filtered out, show a "No matching curriculums" message
- Empty/whitespace-only search treated as no filter
- Handles null `author` and `platform` gracefully (treated as empty string)

---

## 6. User Stories

### Epic: Curriculum Management

| ID | Story | Priority |
|----|-------|----------|
| US-1 | As a user, I want to create a new curriculum so I can track a new learning path | P0 |
| US-2 | As a user, I want to edit curriculum details so I can keep information up to date | P0 |
| US-3 | As a user, I want to delete a curriculum so I can remove completed or abandoned courses | P0 |
| US-4 | As a user, I want to set curriculum status so I can indicate what I'm actively working on | P0 |
| US-5 | As a user, I want to set priority levels so I can focus on important curricula | P1 |

### Epic: Progress Tracking

| ID | Story | Priority |
|----|-------|----------|
| US-6 | As a user, I want to mark items complete so I can track my progress | P0 |
| US-7 | As a user, I want to see progress bars so I can visualize completion | P0 |
| US-8 | As a user, I want to cycle item status with one click for fast updates | P0 |
| US-9 | As a user, I want to see days remaining so I can manage my time | P1 |
| US-10 | As a user, I want to see my current task prominently so I know what to work on | P1 |

### Epic: Data Management

| ID | Story | Priority |
|----|-------|----------|
| US-11 | As a user, I want to export my data as JSON so I can back up my progress | P0 |
| US-12 | As a user, I want to import JSON so I can restore or share curricula | P0 |
| US-13 | As a user, I want to export Tora-chan format so my AI assistant understands my progress | P1 |

### Epic: Dashboard (V2)

| ID | Story | Priority |
|----|-------|----------|
| US-14 | As a user, I want to see all curricula at a glance on the dashboard | P1 |
| US-15 | As a user, I want cards grouped by status so I can focus on active work | P1 |
| US-16 | As a user, I want to click a card to open the full curriculum view | P1 |
| US-17 | As a user, I want to jump to my current task from the curriculum view | P2 |

### Epic: Dashboard Header Row (V3)

| ID | Story | Priority |
|----|-------|----------|
| US-18 | As a user, I want quick access to my frequently used tools from the dashboard | P2 |
| US-19 | As a user, I want to click a tool icon to open it in a new tab | P2 |
| US-20 | As a user, I want to see inspiring artwork on my dashboard to stay motivated | P2 |
| US-21 | As a user, I want to view random top Pixiv illustrations without excessive API calls | P2 |
| US-22 | As a user, I want to expand an illustration to full-screen for better viewing | P2 |
| US-23 | As a user, I want to bookmark/unbookmark illustrations and see the current bookmark state | P2 |
| US-24 | As a user, I want to see a different random illustration each time I return to the dashboard | P2 |

### Epic: Dashboard Search Filter

| ID | Story | Priority |
|----|-------|----------|
| US-25 | As a user, I want to filter dashboard curriculums by typing keywords so I can quickly find specific courses | P1 |
| US-26 | As a user, I want the search to check title, author, and platform simultaneously so I don't need to remember exact field values | P1 |
| US-27 | As a user, I want to type multiple words to narrow down results (AND logic) so I can be more specific | P1 |
| US-28 | As a user, I want to see a clear indication when no curriculums match my search | P2 |

---

## 7. Information Architecture

### Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                        CURRICULUM                            │
├─────────────────────────────────────────────────────────────┤
│ id: number (PK)                                              │
│ title: string                                                │
│ author: string | null                                        │
│ platform: string | null                                      │
│ platformUrl: string | null                                   │
│ description: string | null                                   │
│ priority: 'high' | 'medium' | 'low'                         │
│ status: 'ongoing' | 'standby' | 'planned' | 'wishlist'     │
│ startDate: Date | null                                       │
│ endDate: Date | null                                         │
│ createdAt: Date                                              │
│ updatedAt: Date                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ 1:N
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                         SECTION                              │
├─────────────────────────────────────────────────────────────┤
│ id: number (PK)                                              │
│ curriculumId: number (FK)                                    │
│ title: string                                                │
│ description: string | null                                   │
│ sortOrder: number                                            │
│ createdAt: Date                                              │
│ updatedAt: Date                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ 1:N
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                          ITEM                                │
├─────────────────────────────────────────────────────────────┤
│ id: number (PK)                                              │
│ sectionId: number (FK)                                       │
│ title: string                                                │
│ description: string | null                                   │
│ type: 'video' | 'reading' | 'exercise' | 'homework' | 'other'│
│ status: 'not_started' | 'in_progress' | 'completed'         │
│ sortOrder: number                                            │
│ createdAt: Date                                              │
│ updatedAt: Date                                              │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         APP                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐     ┌──────────────────────────────────────┐  │
│  │         │     │                                       │  │
│  │ Sidebar │ ──► │  Dashboard (no selection)            │  │
│  │         │     │        OR                             │  │
│  │  • List │     │  Curriculum Detail (with selection)  │  │
│  │  • +New │     │        OR                             │  │
│  │         │     │  Import Dropzone                      │  │
│  └─────────┘     └──────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Non-Functional Requirements

### Performance

| Requirement | Target |
|-------------|--------|
| Initial load time | < 2 seconds |
| Status toggle response | < 100ms |
| Dashboard render (50 curricula) | < 500ms |
| Database operations | < 200ms |

### Security

| Requirement | Implementation |
|-------------|----------------|
| Local-only access | No network exposure |
| No authentication | Single-user app |
| Data privacy | All data stored locally |
| No telemetry | No analytics or tracking |

### Compatibility

| Platform | Support |
|----------|---------|
| Browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| OS | Windows, macOS, Linux |
| Screen sizes | Desktop (1024px+), Tablet (768px+) |

### Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Full keyboard support |
| Screen readers | ARIA labels, semantic HTML |
| Color contrast | WCAG AA compliance |
| Focus indicators | Visible focus states |

---

## 9. Success Metrics

### Adoption Metrics

| Metric | Target |
|--------|--------|
| Curricula created per user | 3+ |
| Items tracked per curriculum | 10+ average |
| Weekly active usage | 3+ sessions |

### Engagement Metrics

| Metric | Target |
|--------|--------|
| Status updates per session | 5+ |
| Export frequency | 1+ per week |
| Progress completion rate | 60%+ items marked complete |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Error rate | < 1% of operations |
| Data loss incidents | 0 |
| Performance SLA compliance | 99% |

---

## 10. Out of Scope

The following features are explicitly **not planned**:

| Feature | Reason |
|---------|--------|
| Cloud sync | Local-first philosophy |
| Multi-user / collaboration | Single-user design |
| Mobile native apps | Web-only for simplicity |
| Calendar integration | External dependencies |
| Notifications / reminders | Requires background process |
| Gamification / achievements | Scope creep |
| Course content hosting | Linking only, not storage |
| Payment / subscriptions | Free, open-source tool |
| Social features | Privacy-focused design |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Curriculum | A complete learning course or study plan |
| Section | A grouping of related items within a curriculum |
| Item | An individual task or learning unit |
| Status (Curriculum) | Ongoing, Standby, Planned, or Wishlist |
| Status (Item) | Not Started, In Progress, or Completed |
| Tora-chan | AI study companion persona |
| Memory Pack | AI-optimized export format |

---

## Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Core curriculum management, progress tracking |
| 2.0 | Completed | Dashboard view, days remaining, current task widget |
| 3.0 | Completed | Dashboard header row, Toolbox widget, Pixiv inspiration widget |
| 3.1 | Completed | Dashboard search filter (title, author, platform) |

---

## Appendix C: Related Documents

- [V2-FEATURES.md](./V2-FEATURES.md) - Detailed V2 feature specification
- [README.md](../README.md) - Setup and usage guide
- [AGENTS.md](../AGENTS.md) - AI coding assistant guidelines
