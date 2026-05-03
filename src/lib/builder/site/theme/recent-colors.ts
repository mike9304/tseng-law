const RECENT_COLORS_KEY = 'builder:recent-colors';
const LEGACY_RECENT_COLORS_KEY = 'builder-color-picker-recent-v1';
const MAX_RECENT_COLORS = 12;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function isSupportedRecentColor(value: string): boolean {
  const trimmed = value.trim();
  return (
    /^#[0-9a-f]{6}$/i.test(trimmed) ||
    /^rgba?\([\d\s.,%+-]+\)$/i.test(trimmed) ||
    /^hsla?\([\d\s.,%+-]+\)$/i.test(trimmed)
  );
}

function parseStoredColors(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((color): color is string => typeof color === 'string' && isSupportedRecentColor(color))
      .map((color) => color.trim().toLowerCase())
      .slice(0, MAX_RECENT_COLORS);
  } catch {
    return [];
  }
}

export function readRecentColors(): string[] {
  if (!canUseStorage()) return [];
  const current = parseStoredColors(window.localStorage.getItem(RECENT_COLORS_KEY));
  if (current.length > 0) return current;

  const legacy = parseStoredColors(window.localStorage.getItem(LEGACY_RECENT_COLORS_KEY));
  if (legacy.length > 0) {
    window.localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(legacy));
    window.localStorage.removeItem(LEGACY_RECENT_COLORS_KEY);
  }
  return legacy;
}

export function writeRecentColors(colors: string[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    RECENT_COLORS_KEY,
    JSON.stringify(colors.filter(isSupportedRecentColor).slice(0, MAX_RECENT_COLORS)),
  );
}

export function pushRecentColor(current: string[], color: string): string[] {
  const normalized = color.trim().toLowerCase();
  if (!isSupportedRecentColor(normalized)) return current;
  return [normalized, ...current.filter((entry) => entry !== normalized)].slice(0, MAX_RECENT_COLORS);
}
