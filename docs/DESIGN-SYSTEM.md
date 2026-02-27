# Artmem Dashboard - Design System (V5)

## ZZZ-Inspired Fidget/Analog UX

This document is the **authoritative visual and interaction design specification** for the Artmem Dashboard. All future UI work must reference this document before writing any component, animation, or styling code.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Animation Primitives](#5-animation-primitives)
6. [Component Patterns](#6-component-patterns)
7. [Particle System](#7-particle-system)
8. [Accessibility](#8-accessibility)
9. [Sound Design (Future V6)](#9-sound-design-future-v6)
10. [Implementation Plan](#10-implementation-plan)

---

## 1. Design Philosophy

### Theme: "Digital Doujin"

The visual language is inspired by **Zenless Zone Zero (ZZZ)** - urban, high-energy, neon-on-void-black. The aesthetic is neither corporate nor pastel: it is sharp, electric, and intentional. Think: arcade cabinet glass, CRT scanlines, neon signs in the rain, hand-drawn doujin pages lit by a screen.

### UX Feel: Fidget / Analog

Every interaction must feel like touching a **physical object**. This is the single most important principle:

- **Buttons** should feel like clicking a mechanical key - they push down, spring back
- **Cards** should feel like paper you can nudge - they tilt with your cursor
- **Drag and drop** should feel like picking up and placing a heavy-ish tile
- **Progress bars** should feel like mercury rising - they overshoot and settle
- **Status cycles** should feel like flipping a switch - crisp, immediate, satisfying

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Nothing static** | Even idle elements should breathe subtly. Motion signals responsiveness. |
| **Every input has output** | Every click, hover, and drag produces visible feedback. Silence is a bug. |
| **Physics over timing** | Use spring physics, not cubic-bezier curves. Springs feel alive; easing curves feel scripted. |
| **Neon, not garish** | Glow effects should be present but not overwhelming. Treat them like studio lighting: selective and purposeful. |
| **Micro before macro** | Perfect the 50ms interactions before the 500ms transitions. |

---

## 2. Color System

### Palette Overview

The palette shifts from the legacy purple/teal to ZZZ-signature electric yellow with neon cyan and hot pink as secondaries.

```
-- Core --
Background:           #0a0a0f   (void black with subtle blue undertone)
Card:                 #111118   (elevated surface)
Card Hover:           #16161f   (interactive surface)
Foreground:           #e8e6f0   (soft white - unchanged)
Border:               #1e1e2a   (subtle boundary)
Border Active:        #2a2a3a   (elevated/focused boundary)

-- Primary: Electric Yellow --
primary:              #facc15   (ZZZ signature yellow)
primary-foreground:   #0a0a0f
primary-glow:         rgba(250, 204, 21, 0.2)   (box-shadow glow)

-- Accent Cyan --
accent:               #22d3ee   (neon cyan)
accent-foreground:    #0a0a0f

-- Accent Pink --
accent-pink:          #f472b6   (hot pink / magenta)

-- Status --
destructive:          #ef4444   (neon red - errors, delete, urgent)
success:              #34d399   (neon green - completed states)
warning:              #fb923c   (neon orange - standby/caution)

-- Muted --
muted:                #3f3f50   (unchanged)
muted-foreground:     #71717a   (slightly lightened)
```

### Tailwind Config

```js
// client/tailwind.config.js
theme: {
  extend: {
    colors: {
      background: '#0a0a0f',
      foreground: '#e8e6f0',
      card: {
        DEFAULT: '#111118',
        foreground: '#e8e6f0',
      },
      primary: {
        DEFAULT: '#facc15',
        foreground: '#0a0a0f',
      },
      secondary: {
        DEFAULT: '#1e1e2a',
        foreground: '#e8e6f0',
      },
      accent: {
        DEFAULT: '#22d3ee',
        foreground: '#0a0a0f',
      },
      muted: {
        DEFAULT: '#3f3f50',
        foreground: '#71717a',
      },
      destructive: {
        DEFAULT: '#ef4444',
        foreground: '#0a0a0f',
      },
      success: {
        DEFAULT: '#34d399',
        foreground: '#0a0a0f',
      },
      'accent-pink': '#f472b6',
      border: '#1e1e2a',
      ring: '#facc15',
    },
    fontFamily: {
      sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
    },
  },
}
```

### Status Color Mapping

Update all status-based color references:

| Status | Border | Background | Text | Glow |
|--------|--------|------------|------|------|
| `ongoing` | `border-l-primary` | `bg-primary/5` | `text-primary` | `shadow-primary/10` |
| `standby` | `border-l-warning` | `bg-warning/5` | `text-warning` | `shadow-warning/10` |
| `planned` | `border-l-accent` | `bg-accent/5` | `text-accent` | `shadow-accent/10` |
| `wishlist` | `border-l-accent-pink` | `bg-accent-pink/5` | `text-accent-pink` | `shadow-accent-pink/10` |
| `completed` | `border-l-success` | `bg-success/5` | `text-success` | `shadow-success/10` |

### Priority Color Mapping

| Priority | Border | Badge Text |
|----------|--------|-----------|
| `high` | `border-l-4 border-l-destructive` | `text-destructive` |
| `medium` | `border-l-4 border-l-primary` | `text-primary` |
| `low` | `border-l-4 border-l-muted` | `text-muted-foreground` |

### Glow Usage Rules

Glows are **selective**. They should appear only on:
- Focused/active interactive elements
- The currently selected sidebar item
- In-progress status badges (breathing glow)
- DragOverlay during drag operations
- Primary action buttons on hover

Standard glow class pattern:
```css
/* Neon glow utility class */
.neon-glow-primary {
  box-shadow: 0 0 8px rgba(250, 204, 21, 0.3), 0 0 20px rgba(250, 204, 21, 0.1);
}
.neon-glow-accent {
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.3), 0 0 20px rgba(34, 211, 238, 0.1);
}
```

---

## 3. Typography

### Font Stack

```css
/* Heading / Body: Space Grotesk - geometric, clean, techno-forward */
font-family: "Space Grotesk", system-ui, -apple-system, sans-serif;

/* Numbers, stats, dates, progress %: JetBrains Mono - HUD/terminal feel */
font-family: "JetBrains Mono", "Fira Code", monospace;
```

**Loading strategy**: Use Google Fonts with `display=swap` or `@fontsource` packages. Recommended:
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Or via npm:
```bash
pnpm add @fontsource/space-grotesk @fontsource/jetbrains-mono --filter client
```
```ts
// main.tsx
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
```

### Type Scale

| Use | Class | Notes |
|-----|-------|-------|
| App title | `text-2xl font-bold tracking-tight` | Header branding |
| Page heading | `text-3xl font-bold` | Dashboard "H1" |
| Section heading | `text-xl font-semibold` | Card titles |
| Card title | `text-lg font-semibold` | Curriculum names |
| Body | `text-sm` | General content |
| Caption / meta | `text-xs text-muted-foreground` | Author, platform, dates |
| Labels | `text-xs font-semibold uppercase tracking-wide` | Status labels, priority badges |
| Stats / numbers | `font-mono text-sm` | Progress %, counts, day numbers |

### Monospace Numbers Rule

All **numeric data** should use `font-mono`:
- Progress percentages: `<span className="font-mono">87%</span>`
- Item counts: `<span className="font-mono">12/18</span>`
- Days remaining: `<span className="font-mono">14 days</span>`
- Dates: `<span className="font-mono">Mar 15, 2026</span>`

This creates a HUD / heads-up display aesthetic consistent with ZZZ's UI.

---

## 4. Spacing & Layout

No changes to spacing scale. Continue using `p-3` (compact), `p-4` (standard), `p-6` (spacious). The key addition is consistent border radius:

- `rounded-sm` (0.375rem) - small UI elements, badges
- `rounded-md` (0.5rem) - buttons, inputs
- `rounded-lg` (0.75rem) - cards, panels
- `rounded-xl` (1rem) - overlays, modals

---

## 5. Animation Primitives

All animation constants live in `client/src/lib/animations.ts`. Never hardcode spring values inline - always import from this file for consistency.

### Spring Configurations

```ts
// client/src/lib/animations.ts

// Snappy - for button taps, immediate feedback (stiff, well-damped)
export const tactileSpring = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
};

// Bouncy - for drop placement, dialog open (overshoot then settle)
export const bounceSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,   // low damping = overshoot
};

// Gentle - for layout shifts, sidebar, page transitions
export const gentleSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

// Overlay spring - drag overlay responsiveness
export const overlaySpring = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
};
```

### Standard Animation Variants

Define reusable variants for common patterns:

```ts
// Fade in/out (for AnimatePresence)
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Slide up (for modals, footers)
export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

// Scale tap (for interactive elements)
export const tapScale = { scale: 0.95 };
export const hoverScale = { scale: 1.02 };

// Drag source (fades when being dragged)
export const dragSourceOpacity = 0.3;   // was 0.4, slightly more dramatic
export const dragScale = 1.05;          // DragOverlay scale
export const dragRotate = 2;            // DragOverlay rotation in degrees

// Shadows
export const defaultShadow = 'none';
export const hoverShadow = '0 4px 20px -4px rgba(250, 204, 21, 0.15)';
export const dragShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(250, 204, 21, 0.1)';

// Drop bounce sequence (applied to item after drop)
export const dropBounceVariants = {
  idle: { scale: 1 },
  bounce: {
    scale: [1, 1.06, 0.98, 1.01, 1],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};
```

### Micro-Interaction Rules

These rules apply to ALL interactive elements in the app, no exceptions:

#### Buttons
```tsx
// All buttons must have whileTap
<motion.button whileTap={{ scale: 0.95 }} transition={tactileSpring}>
```
For shadcn `<Button>`, wrap with a `motion.div` or convert the button to use framer-motion directly via `motion(Button)`.

#### Clickable Cards
```tsx
// Cards have hover lift + tap press
<motion.div
  whileHover={{ y: -2, boxShadow: hoverShadow }}
  whileTap={{ scale: 0.98 }}
  transition={tactileSpring}
>
```

#### 3D Tilt on Cards (Advanced)
For dashboard curriculum cards, implement cursor-tracked 3D perspective tilt:

```tsx
// Track mouse position relative to card
const [tilt, setTilt] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
  const y = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
  setTilt({ x: x * 8, y: y * 8 });  // max 8deg rotation
};

const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

<motion.div
  style={{ perspective: 800 }}
  animate={{ rotateX: -tilt.x, rotateY: tilt.y }}
  transition={gentleSpring}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  {cardContent}
</motion.div>
```

#### Status Cycle (Item Status Button)
When cycling item status, fire a ring-pulse animation:

```tsx
// Pulsing ring emanates from the status button
<AnimatePresence>
  {isPulsing && (
    <motion.div
      className="absolute inset-0 rounded-md border-2 border-primary"
      initial={{ opacity: 0.8, scale: 1 }}
      animate={{ opacity: 0, scale: 1.6 }}
      exit={{}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
  )}
</AnimatePresence>
```

### Drag-and-Drop Animation Protocol

This is the most choreographed interaction in the app. Follow this sequence exactly:

```
1. HOVER over drag handle
   → Handle scale: 1 → 1.1 (tactileSpring)
   → Handle color: muted → primary
   → Handle background: transparent → primary/10

2. MOUSEDOWN on drag handle
   → Handle scale: 1.1 → 0.95 (tactileSpring, whileTap)

3. DRAG START (8px activation distance)
   → Source element opacity: 1 → dragSourceOpacity (0.3)
   → Source element: stays in position (layout placeholder)
   → DragOverlay appears: scale 1 → dragScale (1.05), rotate 0 → 2deg
   → DragOverlay shadow: elevated (dragShadow)
   → document.body cursor: 'grabbing'
   → Section auto-collapses if dragging a section

4. DURING DRAG
   → DragOverlay follows cursor with slight lag (natural inertia)
   → Source placeholder maintains space in layout
   → Other items animate into new positions via `layout` prop

5. DROP
   → DragOverlay disappears (dropAnimation: null = instant)
   → Source element snaps to new position (layout animation)
   → Drop bounce: scale 1 → 1.06 → 0.98 → 1.01 → 1 (bounceSpring, 400ms)
   → DropParticles component fires (see Section 7)
   → Neon glow pulse on the dropped item's border (500ms, then fade)
   → document.body cursor: reset to ''

6. CANCEL (Escape or invalid drop)
   → Source element returns to original position (layout animation)
   → DragOverlay disappears
   → No particles, no glow
```

### Page Transitions

Wrap the main content area in `AnimatePresence` with mode `"wait"`:

```tsx
// App.tsx
<AnimatePresence mode="wait">
  {showImport ? (
    <motion.div key="import" {...pageTransitionProps}>
      <ImportDropzone />
    </motion.div>
  ) : selectedCurriculum ? (
    <motion.div key={`curriculum-${selectedCurriculum.id}`} {...pageTransitionProps}>
      <CurriculumDetailView />
    </motion.div>
  ) : (
    <motion.div key="dashboard" {...pageTransitionProps}>
      <Dashboard />
    </motion.div>
  )}
</AnimatePresence>
```

Page transition props:
```ts
const pageTransitionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: gentleSpring,
};
```

### Footer / Dialog Animations

Floating footer (EditModeFooter):
```ts
initial: { y: 100, opacity: 0 }
animate: { y: 0, opacity: 1 }
exit: { y: 100, opacity: 0 }
transition: { type: 'spring', stiffness: 300, damping: 30 }
```

Dialog open:
```ts
initial: { scale: 0.95, opacity: 0 }
animate: { scale: 1, opacity: 1 }
exit: { scale: 0.95, opacity: 0 }
transition: tactileSpring
```

---

## 6. Component Patterns

### Cards (CurriculumCard)

```tsx
// Required pattern for all curriculum cards
<motion.div
  whileHover={{ y: -2, boxShadow: hoverShadow }}
  whileTap={{ scale: 0.98 }}
  transition={tactileSpring}
  onMouseMove={handleMouseMove}  // 3D tilt
  onMouseLeave={handleMouseLeave}
  style={{ perspective: 800 }}
  className="rounded-lg border bg-card cursor-pointer border-primary/0 hover:border-primary/20 transition-colors"
>
```

On hover the card should also transition its border:
`border-border` → `border-primary/20` with a subtle glow (`shadow-[0_0_12px_rgba(250,204,21,0.08)]`)

### Progress Bars

The progress indicator is a key visual element. It should feel like a power meter:

```css
/* Progress fill gradient */
background: linear-gradient(
  to right,
  theme('colors.primary.DEFAULT'),
  theme('colors.accent.DEFAULT'),
  theme('colors.success.DEFAULT')
);

/* Shimmer scan-line effect on fill */
@keyframes progress-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.progress-shimmer {
  background-size: 200% 100%;
  animation: progress-shimmer 2s linear infinite;
}
```

For the momentum/overshoot behavior, use a framer-motion `useSpring` on the value:
```tsx
const springValue = useSpring(progress, { stiffness: 100, damping: 20 });
// Feed springValue into the progress bar width
```

Subtle glow beneath the bar matching fill end color:
```css
.progress-glow::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: theme('colors.success.DEFAULT');
  filter: blur(4px);
  opacity: 0.4;
}
```

### Status Indicators

| Status | Visual Treatment |
|--------|-----------------|
| `not_started` | Dim border, muted icon, no glow |
| `in_progress` | Primary border, primary icon, **breathing glow** pulse animation |
| `completed` | Success border, success icon, strikethrough text, subtle success glow |

Breathing glow for in-progress:
```css
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 4px rgba(250, 204, 21, 0.4); }
  50% { box-shadow: 0 0 12px rgba(250, 204, 21, 0.7), 0 0 20px rgba(250, 204, 21, 0.2); }
}

.status-in-progress {
  animation: breathe 2s ease-in-out infinite;
}
```

### Sidebar

Active item styling:
```tsx
// Active state
className="relative bg-primary/10 text-primary border-l-2 border-primary"
// The left border acts as the neon accent line

// Active glow
style={{ boxShadow: 'inset 0 0 20px rgba(250, 204, 21, 0.05)' }}
```

Hover effect (slide-in highlight):
```tsx
// Use a motion.span as an absolutely positioned background
<motion.span
  className="absolute inset-0 bg-secondary/60 rounded-md"
  initial={{ scaleX: 0, originX: 0 }}
  animate={{ scaleX: 1 }}
  transition={tactileSpring}
/>
```

Progress indicator in sidebar: use monospace font for the `%` value.

### Drag Handles

```tsx
// DragHandle.tsx - Idle state has a subtle breathing effect
<motion.div
  animate={{ opacity: [0.5, 0.8, 0.5] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
  className="text-muted-foreground"
>
  <GripVertical />
</motion.div>
```

On hover, the breathing stops and the handle glows:
```tsx
<motion.div
  whileHover={{
    scale: 1.15,
    color: 'var(--primary)',  // yellow
    filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))',
  }}
  whileTap={{ scale: 0.9 }}
  transition={tactileSpring}
>
```

### EditModeFooter

Add a neon top border to the footer:
```tsx
className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/30 bg-background/95 backdrop-blur shadow-[0_-4px_20px_rgba(250,204,21,0.08)]"
```

Save button (when `isDirty`) should pulse:
```tsx
<motion.div
  animate={isDirty ? { boxShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 12px rgba(250,204,21,0.4)', '0 0 0px rgba(250,204,21,0)'] } : {}}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  <Button>Save</Button>
</motion.div>
```

### DragOverlay Styling (Neon Treatment)

```tsx
// Section overlay
<motion.div
  initial={{ scale: 1 }}
  animate={{ scale: 1.04, rotate: 1.5 }}
  transition={overlaySpring}
  className="rounded-lg border border-primary/40 bg-card"
  style={{
    boxShadow: dragShadow,
    outline: '1px solid rgba(250, 204, 21, 0.2)',
  }}
>

// Item overlay
<motion.div
  initial={{ scale: 1 }}
  animate={{ scale: 1.05, rotate: 1 }}
  transition={overlaySpring}
  className="rounded-lg border border-primary/30 bg-card"
  style={{ boxShadow: dragShadow }}
>
```

### Header

Brand treatment:
```tsx
<button className="flex items-center gap-2 group">
  <img src="/tora.svg" className="h-10 w-10 transition-transform group-hover:rotate-12 duration-300" />
  <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-accent-pink bg-clip-text text-transparent">
    Tora-chan Art Study Dashboard
  </span>
</button>
```

Export buttons: use outline variant with `hover:border-primary/50 hover:text-primary hover:bg-primary/5` instead of default outline styles.

---

## 7. Particle System

### Replacing canvas-confetti

`canvas-confetti` is removed from the project. It produces colorful party confetti that is visually inconsistent with the "Digital Doujin" aesthetic and barely visible against the dark background.

**Replacement**: A custom framer-motion `DropParticles` component that emits small neon dots consistent with the color palette.

### DropParticles Component Spec

**Location**: `client/src/components/common/DropParticles.tsx`

**Interface**:
```tsx
interface DropParticlesProps {
  originRef: React.RefObject<HTMLElement>;  // Element to emit from
  count?: number;                            // Default: 8
  colors?: string[];                         // Default: [primary, accent, accent-pink]
  onComplete?: () => void;                   // Called when all particles finish
}
```

**Behavior**:
- 6-8 particles (circles, 3-5px diameter)
- Scatter radially outward from the origin element's center
- Each particle has: random direction (0-360°), random distance (25-55px), random duration (280-520ms)
- Particles: start at full opacity and scale, fade to 0 opacity and scale 0
- Easing: `easeOut` (fast start, slow end - like a burst)
- Colors sampled from: `['#facc15', '#22d3ee', '#f472b6']` (primary, accent, accent-pink)
- Zero canvas, zero external dependencies - pure React + framer-motion
- `prefers-reduced-motion`: If set, skip the animation entirely

**Implementation skeleton**:
```tsx
// client/src/components/common/DropParticles.tsx
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_COLORS = ['#facc15', '#22d3ee', '#f472b6'];

interface Particle {
  id: number;
  x: number;       // final X offset from origin
  y: number;       // final Y offset from origin
  color: string;
  size: number;    // diameter in px
  duration: number;
}

function generateParticles(count: number, colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * 360 * Math.PI) / 180;
    const distance = 25 + Math.random() * 30;  // 25-55px
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 2,              // 3-5px
      duration: 280 + Math.random() * 240,      // 280-520ms
    };
  });
}

export function DropParticles({
  originRef,
  count = 8,
  colors = DEFAULT_COLORS,
  onComplete,
}: DropParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const completedRef = useRef(0);

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (originRef.current) {
      const rect = originRef.current.getBoundingClientRect();
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setParticles(generateParticles(count, colors));
    setVisible(true);
    completedRef.current = 0;
  }, []);  // Run once on mount

  const handleParticleComplete = () => {
    completedRef.current++;
    if (completedRef.current >= particles.length) {
      setVisible(false);
      onComplete?.();
    }
  };

  if (!visible || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,  // neon glow on particle
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: p.duration / 1000,
              ease: 'easeOut',
            }}
            onAnimationComplete={handleParticleComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### Usage Pattern

In `SortableItem.tsx`, replace the confetti call with a state-driven DropParticles mount:

```tsx
// SortableItem.tsx
const [showParticles, setShowParticles] = useState(false);
const dragHandleRef = useRef<HTMLDivElement>(null);

// Fire particles on drop
useEffect(() => {
  if (previousIsDragging.current && !isDragging) {
    setShowParticles(true);
  }
  previousIsDragging.current = isDragging;
}, [isDragging]);

return (
  <>
    {showParticles && (
      <DropParticles
        originRef={dragHandleRef}
        count={8}
        onComplete={() => setShowParticles(false)}
      />
    )}
    <motion.div ref={setNodeRef} /* ... */>
      <div ref={dragHandleRef}>
        <DragHandle />
      </div>
      {/* ... rest of item */}
    </motion.div>
  </>
);
```

---

## 8. Accessibility

All animation enhancements must respect user preferences:

### Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For framer-motion, use the `useReducedMotion` hook:
```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
```

### Drag Handle Accessibility
```tsx
<DragHandle
  aria-label="Drag to reorder"
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    // Support Space/Enter to initiate keyboard drag
    if (e.key === ' ' || e.key === 'Enter') {
      // Announce reorder capability to screen reader
    }
  }}
/>
```

---

## 9. Sound Design (Future V6)

This section documents the **intent** for audio feedback as a future enhancement. Not required in V5.

### Planned Sound Events

| Interaction | Sound | Description |
|-------------|-------|-------------|
| Button click | `ui-click.wav` | Soft mechanical click (~50ms) |
| Card select | `ui-select.wav` | Subtle tap (~100ms) |
| Drag pickup | `drag-pickup.wav` | Slight "lift" tone (~150ms) |
| Drop success | `drop-success.wav` | Satisfying "thunk" (~200ms) |
| Status cycle | `status-cycle.wav` | Switch flip (~80ms) |
| Save | `save-success.wav` | Short positive chime (~300ms) |

### Implementation Approach (When Built)
- All sounds ≤300ms, low volume (max 30% gain)
- User-controlled toggle in header
- Preference stored in localStorage
- Web Audio API for low-latency playback
- `prefers-reduced-motion` also silences sound (they go together)

---

## 10. Implementation Plan

> **Status: All phases completed.** This section is retained as a reference for what was changed and where.

---

### Phase 1: Foundation

**Goal**: New color palette, typography, and animation constants.

#### 1a. Update `client/tailwind.config.js`

Replace the `theme.extend.colors` block with the V5 palette from Section 2. Add `fontFamily` block. No other changes.

#### 1b. Update `client/src/styles/globals.css`

Add:
- Font import (`@import` or `<link>` in index.html)
- CSS custom property for `--font-mono`
- Glow utility classes (`.neon-glow-primary`, `.neon-glow-accent`)
- `@keyframes breathe` (for in-progress status animation)
- `@keyframes progress-shimmer` (for progress bar scan-line)
- `@media (prefers-reduced-motion: reduce)` block
- Keep existing `@keyframes highlight-pulse` and `.item-highlight`

#### 1c. Update `client/src/lib/animations.ts`

Replace the entire file with the new constants from Section 5:
- `tactileSpring`, `bounceSpring`, `gentleSpring`, `overlaySpring`
- `fadeVariants`, `slideUpVariants`
- `tapScale`, `hoverScale`
- `dragSourceOpacity`, `dragScale`, `dragRotate`
- `defaultShadow`, `hoverShadow`, `dragShadow`
- `dropBounceVariants`

---

### Phase 2: Particle System

**Goal**: Remove `canvas-confetti` and replace with `DropParticles`.

#### 2a. Remove `canvas-confetti`

```bash
pnpm remove canvas-confetti @types/canvas-confetti --filter client
```

#### 2b. Delete `client/src/lib/confetti.ts`

#### 2c. Create `client/src/components/common/DropParticles.tsx`

Implement per the spec in Section 7.

#### 2d. Update `client/src/components/curriculum/edit-mode/SortableItem.tsx`

- Remove: `import { fireDropConfetti } from '@/lib/confetti'`
- Remove: the `dragHandleRef` that was passed to confetti (keep the ref for DropParticles)
- Add: `import { DropParticles } from '@/components/common/DropParticles'`
- Add: `const [showParticles, setShowParticles] = useState(false)`
- Replace: confetti `useEffect` trigger with `setShowParticles(true)` trigger
- Add: `<DropParticles>` conditional render

---

### Phase 3: Core Component Updates

**Goal**: New palette, typography rules, and micro-interactions on main components.

#### 3a. `client/src/components/ui/progress.tsx`

- Update fill to use gradient background
- Add the shimmer animation class
- Add subtle glow beneath the track

#### 3b. `client/src/components/ui/button.tsx`

- Wrap internal element with `motion.div` or use `motion(Button)` pattern
- Add `whileTap={{ scale: 0.95 }}` to all variants
- Primary variant: add `hover:shadow-[0_0_12px_rgba(250,204,21,0.3)]`

#### 3c. `client/src/components/layout/Header.tsx`

- Update brand gradient: `from-primary via-accent to-accent-pink`
- Add `group-hover:rotate-12` on logo
- Update export button hover states

#### 3d. `client/src/components/layout/Sidebar.tsx`

- Active item: `bg-primary/10 text-primary border-l-2 border-primary`
- Active glow: `shadow-[inset_0_0_20px_rgba(250,204,21,0.05)]`
- Progress %: add `font-mono` class
- Smooth sidebar width transition (already has `transition-all duration-300`)

#### 3e. `client/src/components/dashboard/CurriculumCard.tsx`

- Wrap card with framer-motion for 3D tilt + hover lift + tap press
- Add `font-mono` to progress % and item counts
- Update priority border colors to new palette
- Update hover states to neon yellow

#### 3f. `client/src/components/dashboard/StatusSection.tsx`

- Update section header icon colors to status-appropriate neon
- Add animated collapse (if not already using `layout` prop)

---

### Phase 4: Edit Mode Polish

**Goal**: Apply the full drag-and-drop visual choreography and neon treatment to edit mode.

#### 4a. `client/src/components/curriculum/edit-mode/DragHandle.tsx`

- Add idle breathing animation (opacity pulse, see Section 6)
- Update hover: scale, neon yellow glow via `filter: drop-shadow`
- Keep existing `whileTap` scale

#### 4b. `client/src/components/curriculum/edit-mode/SortableItem.tsx`

Already updated in Phase 2. Add:
- `dropBounceVariants` animation when `isDragging` transitions false→false (item just placed)
- Neon glow pulse on the dropped item's border for 500ms

#### 4c. `client/src/components/curriculum/edit-mode/SortableSection.tsx`

- Update DragOverlay styling with neon border treatment
- Apply `dragShadow` with yellow glow component
- Ensure auto-collapse works (already implemented)

#### 4d. `client/src/components/curriculum/edit-mode/EditModeView.tsx`

- Update section DragOverlay to use new neon styling
- Confirm `dragShadow` import is from updated `animations.ts`

#### 4e. `client/src/components/curriculum/edit-mode/EditModeFooter.tsx`

- Add neon top border: `border-t border-primary/30`
- Add glow: `shadow-[0_-4px_20px_rgba(250,204,21,0.08)]`
- Add pulsing glow to Save button when `isDirty`

---

### Phase 5: Page Transitions & Status Cycle

**Goal**: View-level transitions and status button ring-pulse effect.

#### 5a. `client/src/App.tsx`

- Wrap main content `<main>` children with `<AnimatePresence mode="wait">`
- Add unique `key` prop to each view (dashboard, curriculum detail, import)
- Apply `pageTransitionProps` (from Section 5) to each motion wrapper

#### 5b. `client/src/components/curriculum/CurriculumDetail.tsx`

- Status cycle button (in the item row): add `AnimatePresence` for ring-pulse
- Add brief pulsing ring that expands outward on click
- Apply monospace font to progress counts and percentages

---

---

## Appendix: File Inventory

| File | Status | Notes |
|------|-----------|-------|
| `client/tailwind.config.js` | Modified | New color palette + fonts |
| `client/src/styles/globals.css` | Modified | Keyframes, glow utilities, font |
| `client/src/lib/animations.ts` | Replaced | All new spring/variant constants |
| `client/src/lib/confetti.ts` | **Deleted** | Replaced by DropParticles |
| `client/src/components/common/DropParticles.tsx` | **New** | Particle system |
| `client/src/components/ui/progress.tsx` | Modified | Gradient + shimmer + glow |
| `client/src/components/ui/button.tsx` | Modified | whileTap + glow on primary |
| `client/src/components/layout/Header.tsx` | Modified | New gradient + hover |
| `client/src/components/layout/Sidebar.tsx` | Modified | Neon active state + font-mono |
| `client/src/components/dashboard/CurriculumCard.tsx` | Modified | 3D tilt + neon hover |
| `client/src/components/dashboard/StatusSection.tsx` | Modified | Status color mapping |
| `client/src/components/curriculum/edit-mode/DragHandle.tsx` | Modified | Breathing + neon glow |
| `client/src/components/curriculum/edit-mode/SortableItem.tsx` | Modified | DropParticles + bounce |
| `client/src/components/curriculum/edit-mode/SortableSection.tsx` | Modified | Neon overlay |
| `client/src/components/curriculum/edit-mode/EditModeView.tsx` | Modified | Neon overlay |
| `client/src/components/curriculum/edit-mode/EditModeFooter.tsx` | Modified | Neon border + pulsing save |
| `client/src/App.tsx` | Modified | AnimatePresence page transitions |
| `client/src/components/curriculum/CurriculumDetail.tsx` | Modified | Ring-pulse + font-mono |
| `client/package.json` | Modified | Remove canvas-confetti, add fonts |

---

## Related Documents

- [AGENTS.md](../AGENTS.md) - Coding conventions and V5 implementation notes
- [TECH.md](./TECH.md) - Technical stack and architecture
- [PRD.md](./PRD.md) - Product requirements
