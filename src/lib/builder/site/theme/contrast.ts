export type WcagLevel = 'fail' | 'AA' | 'AAA';

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  const short = trimmed.match(/^#([0-9a-f]{3})$/i);
  if (short) {
    return `#${short[1]!.split('').map((char) => char + char).join('')}`.toLowerCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();
  return null;
}

export function hexToRgb(value: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHexColor(value);
  if (!normalized) return null;
  const int = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function linearize(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return (
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b)
  );
}

export function contrastRatio(foreground: string, background: string): number | null {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  if (fg == null || bg == null) return null;
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number | null, largeText = false): WcagLevel {
  if (ratio == null) return 'fail';
  if (ratio >= 7) return 'AAA';
  if (ratio >= (largeText ? 3 : 4.5)) return 'AA';
  return 'fail';
}
