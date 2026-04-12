/**
 * Phase 3 P3-16 — Stretch to width/height.
 * Phase 3 P3-17 — Container Flex/Grid layout mode.
 *
 * These extend the positioning model beyond pure absolute XY.
 * A node can opt into stretch or a container can use flex/grid
 * for its children instead of absolute positioning.
 */

// ─── Stretch ──────────────────────────────────────────────────────

export type StretchMode = 'none' | 'width' | 'height' | 'both';

export interface StretchConfig {
  mode: StretchMode;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
}

export const DEFAULT_STRETCH: StretchConfig = { mode: 'none' };

export function stretchToCSS(
  stretch: StretchConfig,
  parentWidth: number,
  parentHeight: number,
): Partial<{ width: string; height: string; left: string; top: string }> {
  const css: Partial<{ width: string; height: string; left: string; top: string }> = {};
  if (stretch.mode === 'width' || stretch.mode === 'both') {
    const ml = stretch.marginLeft || 0;
    const mr = stretch.marginRight || 0;
    css.width = `${parentWidth - ml - mr}px`;
    css.left = `${ml}px`;
  }
  if (stretch.mode === 'height' || stretch.mode === 'both') {
    const mt = stretch.marginTop || 0;
    const mb = stretch.marginBottom || 0;
    css.height = `${parentHeight - mt - mb}px`;
    css.top = `${mt}px`;
  }
  return css;
}

// ─── Flex/Grid Layout ─────────────────────────────────────────────

export type ContainerLayoutMode = 'absolute' | 'flex' | 'grid';

export interface FlexConfig {
  direction: 'row' | 'column';
  wrap: boolean;
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap: number;
}

export interface GridConfig {
  columns: number;
  rows: number;
  columnGap: number;
  rowGap: number;
  templateColumns?: string;
  templateRows?: string;
}

export const DEFAULT_FLEX: FlexConfig = {
  direction: 'row',
  wrap: true,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 16,
};

export const DEFAULT_GRID: GridConfig = {
  columns: 3,
  rows: 2,
  columnGap: 16,
  rowGap: 16,
};

export function flexToCSS(config: FlexConfig): Record<string, string> {
  return {
    display: 'flex',
    flexDirection: config.direction,
    flexWrap: config.wrap ? 'wrap' : 'nowrap',
    justifyContent: config.justifyContent,
    alignItems: config.alignItems,
    gap: `${config.gap}px`,
  };
}

export function gridToCSS(config: GridConfig): Record<string, string> {
  return {
    display: 'grid',
    gridTemplateColumns: config.templateColumns || `repeat(${config.columns}, 1fr)`,
    gridTemplateRows: config.templateRows || `repeat(${config.rows}, auto)`,
    columnGap: `${config.columnGap}px`,
    rowGap: `${config.rowGap}px`,
  };
}
