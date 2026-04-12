/**
 * Phase 2 P2-13 — Zoom + Pan state.
 *
 * The canvas container applies CSS transform: scale(zoom) translate(panX, panY).
 * All pointer event coordinates must be adjusted by 1/zoom to map
 * screen coords back to canvas coords.
 *
 * Zoom range: 25% ~ 400%, step 10%.
 * Pan: Space+drag or middle mouse button.
 */

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4.0;
export const ZOOM_STEP = 0.1;
export const DEFAULT_ZOOM = 1.0;

export interface ZoomState {
  zoom: number;
  panX: number;
  panY: number;
}

export function createDefaultZoomState(): ZoomState {
  return { zoom: DEFAULT_ZOOM, panX: 0, panY: 0 };
}

export function zoomIn(state: ZoomState): ZoomState {
  const next = Math.min(MAX_ZOOM, Math.round((state.zoom + ZOOM_STEP) * 100) / 100);
  return { ...state, zoom: next };
}

export function zoomOut(state: ZoomState): ZoomState {
  const next = Math.max(MIN_ZOOM, Math.round((state.zoom - ZOOM_STEP) * 100) / 100);
  return { ...state, zoom: next };
}

export function zoomTo(state: ZoomState, target: number): ZoomState {
  const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));
  return { ...state, zoom: Math.round(clamped * 100) / 100 };
}

export function zoomToFit(
  state: ZoomState,
  canvasWidth: number,
  canvasHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): ZoomState {
  const scaleX = viewportWidth / canvasWidth;
  const scaleY = viewportHeight / canvasHeight;
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(scaleX, scaleY) * 0.9));
  const panX = (viewportWidth - canvasWidth * zoom) / 2;
  const panY = (viewportHeight - canvasHeight * zoom) / 2;
  return { zoom: Math.round(zoom * 100) / 100, panX: Math.round(panX), panY: Math.round(panY) };
}

export function pan(state: ZoomState, dx: number, dy: number): ZoomState {
  return { ...state, panX: state.panX + dx, panY: state.panY + dy };
}

export function resetZoom(): ZoomState {
  return createDefaultZoomState();
}

/** Convert screen coordinates to canvas coordinates */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  state: ZoomState,
): { x: number; y: number } {
  return {
    x: (screenX - state.panX) / state.zoom,
    y: (screenY - state.panY) / state.zoom,
  };
}

/** Zoom percent display string */
export function zoomLabel(state: ZoomState): string {
  return `${Math.round(state.zoom * 100)}%`;
}
