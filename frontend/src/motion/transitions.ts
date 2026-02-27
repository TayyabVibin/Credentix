/**
 * Credentix Motion System
 * Standardized easing and duration tokens for consistent animations.
 */

export const transitions = {
  micro: { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  standard: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  page: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  dataReveal: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  spring: { type: 'spring' as const, stiffness: 300, damping: 25 },
};
