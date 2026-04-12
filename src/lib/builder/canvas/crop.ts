/**
 * Phase 3 P3-09 — Image crop + focal point.
 *
 * Crop is stored as a normalized rect (0~1 range) relative to the
 * original image dimensions. The renderer applies CSS clip-path or
 * object-position + overflow:hidden.
 *
 * Focal point is stored as { x: 0~1, y: 0~1 } and maps to
 * CSS object-position so the important part stays visible when
 * the container is resized.
 */

export interface CropRect {
  x: number; // 0~1
  y: number;
  width: number;
  height: number;
}

export interface FocalPoint {
  x: number; // 0~1
  y: number;
}

export const DEFAULT_CROP: CropRect = { x: 0, y: 0, width: 1, height: 1 };
export const DEFAULT_FOCAL: FocalPoint = { x: 0.5, y: 0.5 };

export const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '2:3', value: 2 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
] as const;

export function cropToClipPath(crop: CropRect): string {
  const left = `${(crop.x * 100).toFixed(1)}%`;
  const top = `${(crop.y * 100).toFixed(1)}%`;
  const right = `${((1 - crop.x - crop.width) * 100).toFixed(1)}%`;
  const bottom = `${((1 - crop.y - crop.height) * 100).toFixed(1)}%`;
  return `inset(${top} ${right} ${bottom} ${left})`;
}

export function focalToObjectPosition(focal: FocalPoint): string {
  return `${(focal.x * 100).toFixed(0)}% ${(focal.y * 100).toFixed(0)}%`;
}

export function constrainCropToAspect(
  crop: CropRect,
  aspectRatio: number | null,
): CropRect {
  if (!aspectRatio) return crop;
  const currentAspect = crop.width / crop.height;
  if (Math.abs(currentAspect - aspectRatio) < 0.01) return crop;

  if (currentAspect > aspectRatio) {
    const newWidth = crop.height * aspectRatio;
    return { ...crop, width: Math.min(1, newWidth) };
  }
  const newHeight = crop.width / aspectRatio;
  return { ...crop, height: Math.min(1, newHeight) };
}
