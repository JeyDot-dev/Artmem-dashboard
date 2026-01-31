// V4: Animation constants for Edit Mode
// Shared spring configuration for consistent physics-based animations

export const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

// Overlay drag spring - snappier for better responsiveness
export const overlaySpringConfig = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
};

// Drag elevation shadow - applied during drag (much more prominent)
export const dragShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25), 0 12px 20px -8px rgb(0 0 0 / 0.15)';

// Default shadow - normal state
export const defaultShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';

// Scale during drag - more noticeable
export const dragScale = 1.05;

// Opacity when element is being dragged from its original position
export const dragSourceOpacity = 0.4;
