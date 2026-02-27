/**
 * Credentix Design Tokens
 * Centralized design token system for the Credentix design system.
 */

// ─── Colors (Dark-First Luxury) ─────────────────────────────────────────────

export const colors = {
  // Surfaces
  surface: {
    obsidian: '#0A0C10',
    graphite: '#14171F',
    slate: '#1C2028',
    platinum: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.1)',
  },
  // Accents
  accent: {
    electricCyan: '#00E5FF',
    digitalViolet: '#8B5CF6',
    emeraldPulse: '#10B981',
    mutedRed: '#F87171',
    indigo: '#6366F1',
  },
  // Data states
  dataState: {
    profit: '#00E5FF',
    loss: '#F87171',
    neutral: '#64748B',
  },
  // Light mode surfaces
  light: {
    background: '#F8FAFC',
    paper: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Gradients ───────────────────────────────────────────────────────────────

export const gradients = {
  hero: 'linear-gradient(135deg, #00E5FF 0%, #8B5CF6 50%, #6366F1 100%)',
  heroSubtle: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.15) 100%)',
  cardHover: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(139,92,246,0.08) 100%)',
  profit: 'linear-gradient(135deg, #00E5FF, #10B981)',
  loss: 'linear-gradient(135deg, #F87171, #EF4444)',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    heading: '"Plus Jakarta Sans", "Geist", system-ui, -apple-system, sans-serif',
    body: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },
  letterSpacing: {
    heading: '-0.03em',
    label: '0.05em',
    body: '0',
  },
  scale: {
    hero: { fontSize: 48, lineHeight: 1.1, fontWeight: 800 },
    h1: { fontSize: 40, lineHeight: 1.2, fontWeight: 800 },
    h2: { fontSize: 32, lineHeight: 1.25, fontWeight: 800 },
    h3: { fontSize: 24, lineHeight: 1.3, fontWeight: 700 },
    h4: { fontSize: 20, lineHeight: 1.4, fontWeight: 700 },
    h5: { fontSize: 18, lineHeight: 1.4, fontWeight: 600 },
    h6: { fontSize: 16, lineHeight: 1.5, fontWeight: 600 },
    body1: { fontSize: 16, lineHeight: 1.6, fontWeight: 400 },
    body2: { fontSize: 14, lineHeight: 1.6, fontWeight: 400 },
    caption: { fontSize: 12, lineHeight: 1.5, fontWeight: 500 },
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Motion ──────────────────────────────────────────────────────────────────

export const motion = {
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
  duration: {
    micro: 0.15,
    standard: 0.25,
    page: 0.4,
    dataReveal: 0.6,
  },
  spring: {
    stiffness: 300,
    damping: 25,
  },
} as const;

// ─── Elevation / Shadows ─────────────────────────────────────────────────────

export const elevation = {
  card: '0 4px 24px rgba(0,0,0,0.2)',
  cardHover: '0 8px 32px rgba(0,0,0,0.25), 0 0 40px rgba(0,229,255,0.08)',
  glow: '0 0 24px rgba(0,229,255,0.15)',
  glowViolet: '0 0 24px rgba(139,92,246,0.15)',
  nav: '0 1px 0 rgba(255,255,255,0.06)',
} as const;

// ─── Border Radius ──────────────────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ─── Layout ─────────────────────────────────────────────────────────────────

export const layout = {
  navRail: {
    expanded: 256,
    collapsed: 72,
  },
  contentMaxWidth: 1200,
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },
} as const;
