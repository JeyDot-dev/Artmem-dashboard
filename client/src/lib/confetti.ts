// V4: Confetti effect helper for Edit Mode
import confetti from 'canvas-confetti';

/**
 * Fires a confetti burst centered on a given HTML element.
 * Used to celebrate successful drag-and-drop operations.
 * 
 * @param element - The HTML element to center the confetti on (typically the drag handle)
 * @param options - Optional customization for particle count and spread
 */
export function fireDropConfetti(
  element: HTMLElement,
  options: { particleCount?: number; spread?: number } = {}
) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  const { particleCount = 50, spread = 70 } = options;

  // Fire two bursts for more satisfying effect
  const fireConfetti = (angle: number, spread: number) => {
    confetti({
      particleCount: Math.floor(particleCount / 2),
      angle,
      spread,
      origin: { x, y },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'], // Vibrant colors
      ticks: 120,
      gravity: 1.3,
      scalar: 1.2,
      shapes: ['circle', 'square'],
      drift: 0,
      disableForReducedMotion: true, // Accessibility: respect user preferences
    });
  };

  // Fire two bursts with different angles for fuller effect
  fireConfetti(60, spread);
  setTimeout(() => fireConfetti(120, spread), 50);
}
