/**
 * Phase 28 — Editor advanced preferences (W216~W225).
 *
 * Pure types + defaults. Stored client-side via localStorage with the
 * `BUILDER_EDITOR_PREFS_KEY` key. Server doesn't need to know about these.
 */

export const BUILDER_EDITOR_PREFS_KEY = 'tw_builder_editor_prefs_v1';
export const BUILDER_EDITOR_PREFS_EVENT = 'builder:editor-prefs-change';

export type EditorTheme = 'light' | 'dark' | 'auto';

export interface PixelGridConfig {
  enabled: boolean;
  size: number;        // px
  color: string;
  opacity: number;     // 0~100
}

export interface RulerConfig {
  enabled: boolean;
  unit: 'px' | 'percent';
}

export interface OutlineViewConfig {
  enabled: boolean;
  /** When true, hides content fill and shows wireframe boxes. */
  hideContent: boolean;
}

export interface ReferenceGuide {
  id: string;
  axis: 'horizontal' | 'vertical';
  /** Pixel offset from stage origin. */
  position: number;
  label?: string;
  color?: string;
}

export interface ElementComment {
  id: string;
  nodeId: string;
  author: string;
  body: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AlignDistributeConfig {
  /** When true, the toolbar shows the matrix grid (3x3) helper. */
  showMatrix: boolean;
  /** Snap tolerance for guide-based align (px). */
  guideTolerancePx: number;
}

export interface CustomKeybinding {
  action: string;       // e.g. 'duplicate', 'group', 'paste-style'
  combo: string;        // e.g. 'Mod+Shift+D'
}

export interface EditorPreferences {
  theme: EditorTheme;
  rulers: RulerConfig;
  outline: OutlineViewConfig;
  pixelGrid: PixelGridConfig;
  referenceGuides: ReferenceGuide[];
  alignDistribute: AlignDistributeConfig;
  customKeybindings: CustomKeybinding[];
  comments: ElementComment[];
  componentLibrary: Array<{
    id: string;
    name: string;
    nodeJson: string;   // serialized BuilderCanvasNode
    createdAt: string;
  }>;
}

export const DEFAULT_EDITOR_PREFS: EditorPreferences = {
  theme: 'light',
  rulers: { enabled: true, unit: 'px' },
  outline: { enabled: false, hideContent: false },
  pixelGrid: { enabled: false, size: 8, color: '#cbd5e1', opacity: 30 },
  referenceGuides: [],
  alignDistribute: { showMatrix: true, guideTolerancePx: 6 },
  customKeybindings: [],
  comments: [],
  componentLibrary: [],
};

export function loadEditorPreferences(): EditorPreferences {
  if (typeof window === 'undefined') return DEFAULT_EDITOR_PREFS;
  try {
    const raw = window.localStorage.getItem(BUILDER_EDITOR_PREFS_KEY);
    if (!raw) return DEFAULT_EDITOR_PREFS;
    const parsed = JSON.parse(raw) as Partial<EditorPreferences>;
    return { ...DEFAULT_EDITOR_PREFS, ...parsed };
  } catch {
    return DEFAULT_EDITOR_PREFS;
  }
}

export function saveEditorPreferences(prefs: EditorPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BUILDER_EDITOR_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function applyEditorPreferencesToDocument(prefs: EditorPreferences): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.builderEditorTheme = prefs.theme;
  document.documentElement.dataset.builderOutline = prefs.outline.enabled ? 'true' : 'false';
  document.documentElement.dataset.builderPixelGrid = prefs.pixelGrid.enabled ? 'true' : 'false';
  document.documentElement.style.setProperty('--builder-pixel-grid-size', `${prefs.pixelGrid.size}px`);
  document.documentElement.style.setProperty('--builder-pixel-grid-color', prefs.pixelGrid.color);
  document.documentElement.style.setProperty('--builder-pixel-grid-opacity', `${prefs.pixelGrid.opacity / 100}`);
}

export function saveAndBroadcastEditorPreferences(prefs: EditorPreferences): void {
  saveEditorPreferences(prefs);
  applyEditorPreferencesToDocument(prefs);
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(BUILDER_EDITOR_PREFS_EVENT, { detail: prefs }));
  }
}

export function makeGuideId(): string {
  return `gd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeCommentId(): string {
  return `cmt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
