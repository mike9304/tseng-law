/**
 * Phase 3 P3-15 — Global color palette.
 * Phase 3 P3-12 — Gradient builder.
 * Phase 3 P3-13 — Hover state model.
 *
 * Consolidated design token utilities.
 */

// ─── Color Palette ────────────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  muted: string;
}

export const DEFAULT_PALETTE: ColorPalette = {
  primary: '#123b63',
  secondary: '#1e5a96',
  accent: '#e8a838',
  text: '#1f2937',
  background: '#ffffff',
  muted: '#f3f4f6',
};

export const PRESET_PALETTES: Array<{ name: string; palette: ColorPalette }> = [
  {
    name: '호정 클래식',
    palette: DEFAULT_PALETTE,
  },
  {
    name: '모던 다크',
    palette: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#f59e0b',
      text: '#f8fafc',
      background: '#0f172a',
      muted: '#1e293b',
    },
  },
  {
    name: '내추럴',
    palette: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#d97706',
      text: '#1c1917',
      background: '#faf9f6',
      muted: '#f5f0eb',
    },
  },
  {
    name: '프로페셔널',
    palette: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#dc2626',
      text: '#0f172a',
      background: '#ffffff',
      muted: '#f1f5f9',
    },
  },
];

// ─── Gradient ─────────────────────────────────────────────────────

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number; // 0~360, only for linear
  stops: Array<{ color: string; position: number }>; // position 0~100
}

export const DEFAULT_GRADIENT: GradientConfig = {
  type: 'linear',
  angle: 180,
  stops: [
    { color: '#123b63', position: 0 },
    { color: '#1e5a96', position: 100 },
  ],
};

export function gradientToCSS(g: GradientConfig): string {
  const stopsStr = g.stops
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
  if (g.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`;
  }
  return `linear-gradient(${g.angle}deg, ${stopsStr})`;
}

// ─── Hover State ──────────────────────────────────────────────────

export interface HoverStyle {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  shadow?: string;
  scale?: number; // e.g. 1.05
  opacity?: number; // 0~100
  transition?: number; // ms
}

export const DEFAULT_HOVER: HoverStyle = {
  transition: 200,
};

export function hoverToCSS(hover: HoverStyle): Record<string, string> {
  const css: Record<string, string> = {};
  if (hover.backgroundColor) css.backgroundColor = hover.backgroundColor;
  if (hover.color) css.color = hover.color;
  if (hover.borderColor) css.borderColor = hover.borderColor;
  if (hover.shadow) css.boxShadow = hover.shadow;
  if (hover.scale) css.transform = `scale(${hover.scale})`;
  if (hover.opacity !== undefined) css.opacity = String(hover.opacity / 100);
  css.transition = `all ${hover.transition || 200}ms ease`;
  return css;
}
