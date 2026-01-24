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
| Curriculum Status | Track as Ongoing, Standby, or Planned |
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
| Export Tora-chan | `.zip` (MD + JSON) | AI-optimized memory pack |

#### Tora-chan Memory Pack Format

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
- Cards grouped by status (Ongoing → Standby → Planned)
- Sorted by end goal date within each group
- Visual progress indicators
- Click to navigate to full view

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
│ status: 'ongoing' | 'standby' | 'planned'                   │
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
| Status (Curriculum) | Ongoing, Standby, or Planned |
| Status (Item) | Not Started, In Progress, or Completed |
| Tora-chan | AI study companion persona |
| Memory Pack | AI-optimized export format |

---

## Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Core curriculum management, progress tracking |
| 2.0 | Planned | Dashboard view, days remaining, current task widget |

---

## Appendix C: Related Documents

- [V2-FEATURES.md](./V2-FEATURES.md) - Detailed V2 feature specification
- [README.md](../README.md) - Setup and usage guide
- [AGENTS.md](../AGENTS.md) - AI coding assistant guidelines
