/**
 * Phase 3 P3-10 — Image filters.
 *
 * Brightness/contrast/saturation/blur mapped directly to CSS filter.
 * All values stored as numbers; the renderer builds the filter string.
 */

export interface ImageFilters {
  brightness: number; // 0~200, default 100
  contrast: number;   // 0~200, default 100
  saturation: number; // 0~200, default 100
  blur: number;       // 0~20px, default 0
  grayscale: number;  // 0~100, default 0
  sepia: number;      // 0~100, default 0
}

export const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

export function isDefaultFilters(f: ImageFilters): boolean {
  return (
    f.brightness === 100 &&
    f.contrast === 100 &&
    f.saturation === 100 &&
    f.blur === 0 &&
    f.grayscale === 0 &&
    f.sepia === 0
  );
}

export function filtersToCSS(f: ImageFilters): string {
  const parts: string[] = [];
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturation !== 100) parts.push(`saturate(${f.saturation}%)`);
  if (f.blur > 0) parts.push(`blur(${f.blur}px)`);
  if (f.grayscale > 0) parts.push(`grayscale(${f.grayscale}%)`);
  if (f.sepia > 0) parts.push(`sepia(${f.sepia}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export const FILTER_PRESETS: Array<{ label: string; filters: Partial<ImageFilters> }> = [
  { label: 'Original', filters: {} },
  { label: 'B&W', filters: { grayscale: 100 } },
  { label: 'Vintage', filters: { sepia: 60, contrast: 110 } },
  { label: 'Bright', filters: { brightness: 130, contrast: 105 } },
  { label: 'High Contrast', filters: { contrast: 150 } },
  { label: 'Soft', filters: { brightness: 110, contrast: 90, blur: 1 } },
];
