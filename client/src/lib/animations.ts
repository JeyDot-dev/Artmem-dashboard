// V5: Animation constants — single source of truth for all spring/variant values.
// Never hardcode spring values inline in components; always import from here.

// ─── Spring Configurations ────────────────────────────────────────────────────

/** Snappy — button taps, immediate feedback (stiff, well-damped) */
export const tactileSpring = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
};

/** Bouncy — drop placement, dialog open (overshoot then settle) */
export const bounceSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
};

/** Gentle — layout shifts, sidebar, page transitions */
export const gentleSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};

/** Overlay — drag overlay responsiveness */
export const overlaySpring = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
};

// ─── Legacy alias (used in EditModeView.tsx / SortableSection.tsx) ───────────
/** @deprecated Use overlaySpring */
export const overlaySpringConfig = overlaySpring;
/** @deprecated Use tactileSpring */
export const springConfig = tactileSpring;

// ─── Animation Variants ───────────────────────────────────────────────────────

/** Fade in/out — for AnimatePresence wrappers */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Slide up — for modals, footers */
export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

/** Drop bounce — applied to an item after it is placed */
export const dropBounceVariants = {
  idle: { scale: 1 },
  bounce: {
    scale: [1, 1.06, 0.98, 1.01, 1] as number[],
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// ─── Motion Values ────────────────────────────────────────────────────────────

/** whileTap scale for all interactive elements */
export const tapScale = { scale: 0.95 };
/** whileHover scale for subtle lift */
export const hoverScale = { scale: 1.02 };

/** Source element opacity while being dragged (0.3 = slightly more dramatic than 0.4) */
export const dragSourceOpacity = 0.3;
/** DragOverlay scale while in flight */
export const dragScale = 1.05;
/** DragOverlay rotation in degrees */
export const dragRotate = 2;

// ─── Shadow Values ────────────────────────────────────────────────────────────

export const defaultShadow = 'none';
export const hoverShadow = '0 4px 20px -4px rgba(250, 204, 21, 0.15)';
export const dragShadow =
  '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(250, 204, 21, 0.1)';

// ─── Page Transition Props ────────────────────────────────────────────────────

export const pageTransitionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: gentleSpring,
};
