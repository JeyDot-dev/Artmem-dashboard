# Artmem Dashboard V2 - Feature Specification

## Overview

V2 introduces a comprehensive **Dashboard/Home View** that provides an at-a-glance overview of all curriculums, enhanced curriculum details with **days remaining countdown**, and a new **Current Task Widget** for quick navigation to active tasks.

---

## Table of Contents

1. [Dashboard/Home View](#1-dashboardhome-view)
2. [Curriculum Cards](#2-curriculum-cards)
3. [Days Remaining Feature](#3-days-remaining-feature)
4. [Current Task Widget](#4-current-task-widget)
5. [Smooth Scroll with Highlight](#5-smooth-scroll-with-highlight)
6. [Data Models & Types](#6-data-models--types)
7. [Component Hierarchy](#7-component-hierarchy)
8. [Implementation Notes](#8-implementation-notes)

---

## 1. Dashboard/Home View

### Description

The Dashboard is the new default landing page when no curriculum is selected. It displays all curriculums as organized cards, providing a quick overview of progress across all learning activities.

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                          HEADER                                   │
├──────────┬───────────────────────────────────────────────────────┤
│          │  DASHBOARD                                             │
│          │  ─────────────────────────────────────────────────────│
│          │                                                        │
│ SIDEBAR  │  📊 Ongoing (3)                                        │
│          │  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│          │  │ Card 1  │ │ Card 2  │ │ Card 3  │                  │
│          │  │ + Task  │ │ + Task  │ │ + Task  │                  │
│          │  └─────────┘ └─────────┘ └─────────┘                  │
│          │                                                        │
│          │  ⏸️ Standby (2)                                        │
│          │  ┌─────────┐ ┌─────────┐                              │
│          │  │ Card 4  │ │ Card 5  │                              │
│          │  └─────────┘ └─────────┘                              │
│          │                                                        │
│          │  📋 Planned (1)                                        │
│          │  ┌─────────┐                                          │
│          │  │ Card 6  │                                          │
│          │  └─────────┘                                          │
└──────────┴───────────────────────────────────────────────────────┘
```

### Features

- **Grouped by Status**: Cards are organized into collapsible sections:
  - **Ongoing** - Currently active curriculums (shown first, expanded by default)
  - **Standby** - Paused curriculums
  - **Planned** - Future curriculums

- **Sorted by End Goal Date**: Within each status group, cards are sorted by `endDate` (ascending - nearest deadline first). Curriculums without an end date appear at the bottom of their group.

- **Quick Access**: Clicking any card navigates to the full curriculum view

### When to Show

- Display Dashboard when `selectedCurriculumId` is `null`
- Replace the current "Welcome" placeholder card

---

## 2. Curriculum Cards

### Card Design

Each curriculum card is a compact representation of the `CurriculumDetail` component, optimized for grid display.

```
┌───────────────────────────────────────┐
│ ⚡ HIGH                    12 days    │  ← Priority badge + Days remaining
├───────────────────────────────────────┤
│ Curriculum Title                      │  ← Clickable title (link if URL exists)
│ by Author • Platform                  │  ← Metadata
├───────────────────────────────────────┤
│ ████████████░░░░░░░░░  65%           │  ← Progress bar
│ 13/20 items completed                 │  ← Progress text
├───────────────────────────────────────┤
│ 🎯 Goal: Mar 15, 2026                │  ← End date
├───────────────────────────────────────┤
│ ▶ Chapter 5 - Anatomy Basics          │  ← Current/Next task (Ongoing only)
│   Figure Drawing Fundamentals         │  ← Task description
└───────────────────────────────────────┘
```

### Card Information

| Element | Description | Source |
|---------|-------------|--------|
| Priority Badge | Color-coded priority (High/Medium/Low) | `curriculum.priority` |
| Days Remaining | Countdown to goal date | Calculated from `curriculum.endDate` |
| Title | Curriculum name (clickable link if `platformUrl` exists) | `curriculum.title`, `curriculum.platformUrl` |
| Author & Platform | Creator and learning platform | `curriculum.author`, `curriculum.platform` |
| Progress Bar | Visual progress indicator | Calculated from items |
| Progress Text | "X/Y items completed" | `completedItems` / `totalItems` |
| Goal Date | Formatted end date | `curriculum.endDate` |
| Current Task | **Ongoing cards only** - Shows current `in_progress` item or next `not_started` item | Derived from items |

### Card Styling

```typescript
// Priority colors (matching existing theme)
const priorityColors = {
  high: 'border-l-4 border-l-destructive',
  medium: 'border-l-4 border-l-accent', 
  low: 'border-l-4 border-l-muted',
};

// Status section icons (lucide-react)
const statusIcons = {
  ongoing: TrendingUp,
  standby: Pause,
  planned: ClipboardList,
};
```

### Card Interactions

- **Click Card**: Navigate to curriculum view (`setSelectedCurriculumId(card.id)`)
- **Hover**: Subtle elevation/shadow effect
- **Click Platform Link**: Open external URL in new tab (stop propagation to prevent card navigation)

---

## 3. Days Remaining Feature

### Description

Display a countdown showing how many days remain until the curriculum's goal date (`endDate`).

### Display Locations

1. **Dashboard Cards**: Top-right corner of each card
2. **CurriculumDetail Header**: Next to the goal date

### Calculation Logic

```typescript
function getDaysRemaining(endDate: Date | string | null): number | null {
  if (!endDate) return null;
  
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const today = new Date();
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
```

### Display Format

| Days | Display | Style |
|------|---------|-------|
| > 30 | "X days" | `text-muted-foreground` |
| 8-30 | "X days" | `text-accent` (yellow/orange) |
| 1-7 | "X days" | `text-destructive` (red) |
| 0 | "Today!" | `text-destructive font-bold` |
| < 0 | "X days overdue" | `text-destructive` |
| null | Not displayed | - |

### UI Examples

```
┌─────────────────────────────────────┐
│                           45 days   │  ← Normal (muted)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                           12 days   │  ← Warning (accent)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                            3 days   │  ← Urgent (destructive)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                           Today!    │  ← Due today
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                      5 days overdue │  ← Past due
└─────────────────────────────────────┘
```

---

## 4. Current Task Widget

### Description

A new component displayed in two locations:
1. **Dashboard Cards** (Ongoing status only): Compact inline display
2. **Curriculum View**: Dedicated widget below `CurriculumDetail` header card

### Task Selection Logic

```typescript
function getCurrentOrNextTask(curriculum: CurriculumDetail): Item | null {
  // Flatten all items from all sections, preserving section order
  const allItems: Array<Item & { sectionId: number; sectionTitle: string }> = [];
  
  for (const section of curriculum.sections) {
    for (const item of section.items) {
      allItems.push({
        ...item,
        sectionId: section.id,
        sectionTitle: section.title,
      });
    }
  }
  
  // Priority 1: Find first item with status 'in_progress'
  const inProgressItem = allItems.find(item => item.status === 'in_progress');
  if (inProgressItem) return inProgressItem;
  
  // Priority 2: Find first item with status 'not_started'
  const nextItem = allItems.find(item => item.status === 'not_started');
  return nextItem || null;
}
```

### Dashboard Card Display (Compact)

For **Ongoing** curriculum cards only:

```
├───────────────────────────────────────┤
│ ▶ Chapter 5 - Anatomy Basics          │  ← In-progress task
│   Figure Drawing Fundamentals         │  ← Task description (if available)
└───────────────────────────────────────┘

├───────────────────────────────────────┤
│ ☐ Watch: Perspective Fundamentals     │  ← Next task (not started)
│   Camera and perspective techniques   │  ← Task description (if available)
└───────────────────────────────────────┘

├───────────────────────────────────────┤
│ ✓ All tasks completed                 │  ← No remaining tasks
└───────────────────────────────────────┘
```

### Curriculum View Widget (Full)

Displayed between the `CurriculumDetail` header card and the sections list:

```
┌─────────────────────────────────────────────────────────┐
│  ▶ CURRENT FOCUS                                        │
│  [Video] Chapter 5: Anatomy Basics                      │
│         Figure Drawing Fundamentals                     │
└─────────────────────────────────────────────────────────┘
  ↑ Entire widget is clickable with subtle hover effect
```

**Alternative (Next Task):**

```
┌─────────────────────────────────────────────────────────┐
│  ☐ UP NEXT                                              │
│  [Book] Chapter 6: Hand Studies                         │
│         Figure Drawing Fundamentals                     │
└─────────────────────────────────────────────────────────┘
```

**All Complete State:**

```
┌─────────────────────────────────────────────────────────┐
│  ✓ All tasks complete                                   │
└─────────────────────────────────────────────────────────┘
```

### Widget Props

```typescript
interface CurrentTaskWidgetProps {
  curriculum: CurriculumDetail;
  onTaskClick: (itemId: number) => void;
}
```

### Design Guidelines

**IMPORTANT**: This widget follows the "minimal, doujin" aesthetic:
- **Icons**: Always use lucide-react icons, NEVER emojis
- **Size**: Compact - barely larger than a single task line (p-3 padding)
- **Interaction**: Entire widget is clickable (no separate button)
- **Hover**: Subtle border and background color change
- **Typography**: Small, clean, with truncation for long text

---

## 5. Smooth Scroll with Highlight

### Description

When clicking the "Go to Task" button in the Current Task Widget, the page should:
1. Smoothly scroll to the target item
2. Temporarily highlight the item to draw attention

### Implementation

#### Step 1: Add Data Attributes to Items

```tsx
// In CurriculumDetailView, each item div:
<div
  key={item.id}
  data-item-id={item.id}
  className={cn(
    'flex items-center gap-3 p-3 rounded-lg border transition-colors group',
    // ... existing classes
  )}
>
```

#### Step 2: Scroll Function

```typescript
function scrollToItem(itemId: number): void {
  const element = document.querySelector(`[data-item-id="${itemId}"]`);
  
  if (element) {
    // Smooth scroll to element
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    
    // Add highlight class
    element.classList.add('item-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
      element.classList.remove('item-highlight');
    }, 2000);
  }
}
```

#### Step 3: Highlight CSS Animation

```css
/* In globals.css */
@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7);
    background-color: hsl(var(--primary) / 0.1);
  }
  50% {
    box-shadow: 0 0 0 8px hsl(var(--primary) / 0);
    background-color: hsl(var(--primary) / 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
    background-color: transparent;
  }
}

.item-highlight {
  animation: highlight-pulse 2s ease-out;
}
```

### UX Flow

1. User clicks "Go to Task" button in Current Task Widget
2. Page smoothly scrolls to center the target item in viewport
3. Item pulses with a subtle glow effect (2 seconds)
4. Highlight fades out naturally

---

## 6. Data Models & Types

### New/Updated Types

```typescript
// shared/types.ts additions

// Extended curriculum type for dashboard cards
export interface CurriculumCardData extends CurriculumWithProgress {
  daysRemaining: number | null;
  currentTask: TaskPreview | null;
}

// Compact task info for cards
export interface TaskPreview {
  id: number;
  title: string;
  type: ItemType;
  status: ItemStatus;
  sectionTitle: string;
}

// Full task info for widget
export interface CurrentTaskInfo extends TaskPreview {
  description: string | null;
  sectionId: number;
}
```

### API Considerations

The existing endpoints return sufficient data. All new calculations can be done client-side:

| Data | Source | Calculation |
|------|--------|-------------|
| Days remaining | `curriculum.endDate` | Client-side date diff |
| Current/Next task | `curriculum.sections[].items[]` | Client-side traversal |
| Card sorting | `curriculum.status`, `curriculum.endDate` | Client-side sort |

---

## 7. Component Hierarchy

### New Components

```
client/src/components/
├── dashboard/
│   ├── Dashboard.tsx           # Main dashboard container
│   ├── CurriculumCard.tsx      # Individual curriculum card
│   ├── StatusSection.tsx       # Collapsible status group
│   └── DaysRemaining.tsx       # Days countdown badge
├── curriculum/
│   ├── CurrentTaskWidget.tsx   # Current/Next task widget
│   └── CurriculumDetail.tsx    # (Updated) Add data-item-id, days remaining
└── ...
```

### Component Tree

```
App.tsx
├── Header
├── Sidebar
└── Main Content
    ├── [No selection] → Dashboard
    │   ├── StatusSection (ongoing)
    │   │   └── CurriculumCard (multiple)
    │   │       ├── DaysRemaining
    │   │       └── TaskPreview (inline)
    │   ├── StatusSection (standby)
    │   │   └── CurriculumCard (multiple)
    │   └── StatusSection (planned)
    │       └── CurriculumCard (multiple)
    │
    └── [Curriculum selected] → CurriculumDetailView
        ├── Header Card
        │   └── DaysRemaining
        ├── CurrentTaskWidget (NEW)
        └── Sections List
            └── Items (with data-item-id)
```

---

## 8. Implementation Notes

### UI/UX Standards

**Design Philosophy**: Minimal, doujin aesthetic - clean, functional, understated.

#### Icon Usage
- **ALWAYS use lucide-react icons** - NEVER use emojis or emoticons
- Status section icons: `TrendingUp` (Ongoing), `Pause` (Standby), `ClipboardList` (Planned)
- Task status icons: `Play` (in-progress), `Square` (not-started), `CheckCircle2` (completed)
- Priority badge icon: `Zap` (lightning bolt)
- Goal date icon: `Target` (crosshair)
- Consistent sizing: `h-4 w-4` for standard UI, `h-3.5 w-3.5` for compact

#### Component Design
- Keep components **compact and minimal**
- Avoid excessive padding/whitespace
- Make entire interactive areas clickable (avoid unnecessary buttons)
- Use subtle hover states: `hover:border-primary/50 hover:bg-primary/5`
- Always include focus states for accessibility

### Priority Order

1. **Phase 1**: Dashboard layout with basic cards
2. **Phase 2**: Days remaining feature (both locations)
3. **Phase 3**: Current Task Widget (compact, no emojis, fully clickable)
4. **Phase 4**: Smooth scroll with highlight

### State Management

No new global state required. All features can use:
- Existing `curriculums` query for dashboard data
- Existing `selectedCurriculum` query for detail view
- Local component state for UI interactions

### Responsive Design

```typescript
// Card grid responsive breakpoints
const gridClasses = 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
```

### Accessibility

- Cards should be keyboard navigable (`tabIndex={0}`)
- Use `role="article"` for cards
- Ensure proper focus management after scroll
- Days remaining should use `aria-label` for screen readers

### Performance

- Dashboard cards are lightweight - no deep curriculum detail needed
- Lazy load curriculum detail only when selected
- Debounce scroll-to-item if rapidly clicking

---

## Visual Summary

### Before (V1)

```
┌────────────────────────────────────────────────────────┐
│ No curriculum selected → Static welcome message        │
│ Curriculum selected → Full detail view                 │
└────────────────────────────────────────────────────────┘
```

### After (V2)

```
┌────────────────────────────────────────────────────────┐
│ No curriculum selected → Dashboard with cards          │
│   • Cards grouped by status                            │
│   • Sorted by end date                                 │
│   • Shows progress, days remaining, current task       │
│   • Click to navigate                                  │
├────────────────────────────────────────────────────────┤
│ Curriculum selected → Enhanced detail view             │
│   • Days remaining in header                           │
│   • Current Task Widget below header                   │
│   • Click task → smooth scroll + highlight             │
└────────────────────────────────────────────────────────┘
```

---

## Appendix: File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `shared/types.ts` | Update | Add `CurriculumCardData`, `TaskPreview`, `CurrentTaskInfo` types |
| `client/src/App.tsx` | Update | Replace welcome card with `Dashboard` component, add scroll handler |
| `client/src/components/dashboard/Dashboard.tsx` | New | Dashboard container component |
| `client/src/components/dashboard/CurriculumCard.tsx` | New | Curriculum card component |
| `client/src/components/dashboard/StatusSection.tsx` | New | Collapsible status group |
| `client/src/components/dashboard/DaysRemaining.tsx` | New | Days countdown badge |
| `client/src/components/curriculum/CurrentTaskWidget.tsx` | New | Current/Next task widget |
| `client/src/components/curriculum/CurriculumDetail.tsx` | Update | Add `data-item-id`, days remaining, scroll support |
| `client/src/styles/globals.css` | Update | Add highlight animation |
| `client/src/lib/utils.ts` | Update | Add `getDaysRemaining`, `getCurrentOrNextTask`, `scrollToItem` helpers |
