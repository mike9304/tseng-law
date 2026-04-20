/**
 * Phase 3 P3-14 — Google Fonts integration.
 *
 * Curated list of 30 fonts suitable for Korean + Chinese + English
 * legal sites. The editor loads these on demand via Google Fonts CSS.
 * Published pages use next/font or link preload.
 */

export interface FontOption {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
  weights: number[];
  cjk: boolean;
}

export const FONT_CATALOG: FontOption[] = [
  // System
  { family: 'system-ui', category: 'sans-serif', weights: [400, 500, 600, 700], cjk: true },
  // Sans-serif (CJK support)
  { family: 'Noto Sans KR', category: 'sans-serif', weights: [300, 400, 500, 700], cjk: true },
  { family: 'Noto Sans TC', category: 'sans-serif', weights: [300, 400, 500, 700], cjk: true },
  { family: 'Noto Sans', category: 'sans-serif', weights: [300, 400, 500, 700], cjk: false },
  { family: 'Pretendard', category: 'sans-serif', weights: [300, 400, 500, 600, 700], cjk: true },
  { family: 'Inter', category: 'sans-serif', weights: [300, 400, 500, 600, 700], cjk: false },
  { family: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700], cjk: false },
  { family: 'Open Sans', category: 'sans-serif', weights: [300, 400, 600, 700], cjk: false },
  { family: 'Lato', category: 'sans-serif', weights: [300, 400, 700], cjk: false },
  { family: 'Poppins', category: 'sans-serif', weights: [300, 400, 500, 600, 700], cjk: false },
  { family: 'Montserrat', category: 'sans-serif', weights: [300, 400, 500, 600, 700], cjk: false },
  { family: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700], cjk: false },
  // Serif
  { family: 'Noto Serif KR', category: 'serif', weights: [400, 500, 700], cjk: true },
  { family: 'Noto Serif TC', category: 'serif', weights: [400, 500, 700], cjk: true },
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700], cjk: false },
  { family: 'Merriweather', category: 'serif', weights: [300, 400, 700], cjk: false },
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700], cjk: false },
  { family: 'PT Serif', category: 'serif', weights: [400, 700], cjk: false },
  { family: 'Source Serif 4', category: 'serif', weights: [300, 400, 600, 700], cjk: false },
  // Display
  { family: 'Oswald', category: 'display', weights: [300, 400, 500, 600, 700], cjk: false },
  { family: 'Raleway', category: 'display', weights: [300, 400, 500, 600, 700], cjk: false },
  { family: 'Bebas Neue', category: 'display', weights: [400], cjk: false },
  // Monospace
  { family: 'JetBrains Mono', category: 'monospace', weights: [400, 500, 700], cjk: false },
  { family: 'Fira Code', category: 'monospace', weights: [400, 500, 700], cjk: false },
];

export function getFontFamilies(): string[] {
  return FONT_CATALOG.map((f) => f.family);
}

export function getCJKFonts(): FontOption[] {
  return FONT_CATALOG.filter((f) => f.cjk);
}

export function buildGoogleFontsUrl(families: string[]): string {
  const filtered = [...new Set(families
    .map((family) => family.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') || family.trim())
    .filter((family) => family.length > 0 && family !== 'system-ui'))];
  if (filtered.length === 0) return '';
  const params = filtered
    .map((family) => {
      const font = FONT_CATALOG.find((f) => f.family === family);
      const weights = font?.weights.join(';') || '400;700';
      return `family=${encodeURIComponent(family)}:wght@${weights}`;
    })
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export function fontFamilyCSS(family: string): string {
  const font = FONT_CATALOG.find((f) => f.family === family);
  if (!font) return family;
  if (family === 'system-ui') return 'system-ui, -apple-system, sans-serif';
  return `'${family}', ${font.category}`;
}
