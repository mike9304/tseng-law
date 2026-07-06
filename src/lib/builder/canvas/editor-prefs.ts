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

export interface ComponentLibraryPreferenceVersion {
  nodeJson: string;
  savedAt: string;
  label?: string;
}

export interface ComponentLibraryPreferenceEntry {
  id: string;
  name: string;
  nodeJson: string;
  createdAt: string;
  updatedAt?: string;
  pinned?: boolean;
  versions?: readonly ComponentLibraryPreferenceVersion[];
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
  componentLibrary: ComponentLibraryPreferenceEntry[];
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function booleanOr(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function finiteNumberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeReferenceGuide(value: unknown): ReferenceGuide | null {
  if (!isRecord(value)) return null;
  const axis = value.axis === 'horizontal' || value.axis === 'vertical' ? value.axis : null;
  const position = finiteNumberOr(value.position, Number.NaN);
  if (!axis || !Number.isFinite(position)) return null;
  return {
    id: stringOr(value.id, makeGuideId()),
    axis,
    position,
    label: typeof value.label === 'string' ? value.label : undefined,
    color: typeof value.color === 'string' ? value.color : undefined,
  };
}

function normalizeComponentLibraryVersion(value: unknown): ComponentLibraryPreferenceVersion | null {
  if (!isRecord(value)) return null;
  if (typeof value.nodeJson !== 'string' || value.nodeJson.trim().length === 0) return null;
  if (typeof value.savedAt !== 'string' || value.savedAt.trim().length === 0) return null;
  const label = typeof value.label === 'string' ? value.label.trim().slice(0, 80) : '';
  return {
    nodeJson: value.nodeJson.trim(),
    savedAt: value.savedAt.trim(),
    ...(label ? { label } : {}),
  };
}

function normalizeComponentLibraryEntry(value: unknown): ComponentLibraryPreferenceEntry | null {
  if (
    !isRecord(value)
    || typeof value.id !== 'string'
    || typeof value.name !== 'string'
    || typeof value.nodeJson !== 'string'
    || typeof value.createdAt !== 'string'
  ) {
    return null;
  }
  const versions = Array.isArray(value.versions)
    ? value.versions
      .map(normalizeComponentLibraryVersion)
      .filter((version): version is ComponentLibraryPreferenceVersion => Boolean(version))
    : [];
  return {
    id: value.id,
    name: value.name,
    nodeJson: value.nodeJson,
    createdAt: value.createdAt,
    ...(typeof value.updatedAt === 'string' ? { updatedAt: value.updatedAt } : {}),
    ...(value.pinned === true ? { pinned: true } : {}),
    ...(versions.length > 0 ? { versions } : {}),
  };
}

export function normalizeEditorPreferences(value: unknown): EditorPreferences {
  const source = isRecord(value) ? value : {};
  const rulers = isRecord(source.rulers) ? source.rulers : {};
  const outline = isRecord(source.outline) ? source.outline : {};
  const pixelGrid = isRecord(source.pixelGrid) ? source.pixelGrid : {};
  const alignDistribute = isRecord(source.alignDistribute) ? source.alignDistribute : {};
  const theme = source.theme === 'light' || source.theme === 'dark' || source.theme === 'auto'
    ? source.theme
    : DEFAULT_EDITOR_PREFS.theme;

  return {
    theme,
    rulers: {
      enabled: booleanOr(rulers.enabled, DEFAULT_EDITOR_PREFS.rulers.enabled),
      unit: rulers.unit === 'px' || rulers.unit === 'percent'
        ? rulers.unit
        : DEFAULT_EDITOR_PREFS.rulers.unit,
    },
    outline: {
      enabled: booleanOr(outline.enabled, DEFAULT_EDITOR_PREFS.outline.enabled),
      hideContent: booleanOr(outline.hideContent, DEFAULT_EDITOR_PREFS.outline.hideContent),
    },
    pixelGrid: {
      enabled: booleanOr(pixelGrid.enabled, DEFAULT_EDITOR_PREFS.pixelGrid.enabled),
      size: clamp(Math.round(finiteNumberOr(pixelGrid.size, DEFAULT_EDITOR_PREFS.pixelGrid.size)), 4, 80),
      color: stringOr(pixelGrid.color, DEFAULT_EDITOR_PREFS.pixelGrid.color),
      opacity: clamp(Math.round(finiteNumberOr(pixelGrid.opacity, DEFAULT_EDITOR_PREFS.pixelGrid.opacity)), 0, 100),
    },
    referenceGuides: Array.isArray(source.referenceGuides)
      ? source.referenceGuides.map(normalizeReferenceGuide).filter((guide): guide is ReferenceGuide => Boolean(guide))
      : DEFAULT_EDITOR_PREFS.referenceGuides,
    alignDistribute: {
      showMatrix: booleanOr(alignDistribute.showMatrix, DEFAULT_EDITOR_PREFS.alignDistribute.showMatrix),
      guideTolerancePx: clamp(
        Math.round(finiteNumberOr(alignDistribute.guideTolerancePx, DEFAULT_EDITOR_PREFS.alignDistribute.guideTolerancePx)),
        1,
        32,
      ),
    },
    customKeybindings: Array.isArray(source.customKeybindings)
      ? source.customKeybindings.filter((item): item is CustomKeybinding => (
        isRecord(item)
        && typeof item.action === 'string'
        && typeof item.combo === 'string'
      ))
      : DEFAULT_EDITOR_PREFS.customKeybindings,
    comments: Array.isArray(source.comments)
      ? source.comments.filter((item): item is ElementComment => (
        isRecord(item)
        && typeof item.id === 'string'
        && typeof item.nodeId === 'string'
        && typeof item.author === 'string'
        && typeof item.body === 'string'
        && typeof item.createdAt === 'string'
        && (item.resolvedAt == null || typeof item.resolvedAt === 'string')
      ))
      : DEFAULT_EDITOR_PREFS.comments,
    componentLibrary: Array.isArray(source.componentLibrary)
      ? source.componentLibrary
        .map(normalizeComponentLibraryEntry)
        .filter((entry): entry is ComponentLibraryPreferenceEntry => Boolean(entry))
      : DEFAULT_EDITOR_PREFS.componentLibrary,
  };
}

export function loadEditorPreferences(): EditorPreferences {
  if (typeof window === 'undefined') return DEFAULT_EDITOR_PREFS;
  try {
    const raw = window.localStorage.getItem(BUILDER_EDITOR_PREFS_KEY);
    if (!raw) return DEFAULT_EDITOR_PREFS;
    return normalizeEditorPreferences(JSON.parse(raw));
  } catch {
    return DEFAULT_EDITOR_PREFS;
  }
}

export function saveEditorPreferences(prefs: EditorPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BUILDER_EDITOR_PREFS_KEY, JSON.stringify(normalizeEditorPreferences(prefs)));
  } catch {
    /* ignore */
  }
}

export function applyEditorPreferencesToDocument(prefs: EditorPreferences): void {
  if (typeof document === 'undefined') return;
  const normalized = normalizeEditorPreferences(prefs);
  document.documentElement.dataset.builderEditorTheme = normalized.theme;
  document.documentElement.dataset.builderOutline = normalized.outline.enabled ? 'true' : 'false';
  document.documentElement.dataset.builderOutlineHideContent = (
    normalized.outline.enabled && normalized.outline.hideContent
  ) ? 'true' : 'false';
  document.documentElement.dataset.builderPixelGrid = normalized.pixelGrid.enabled ? 'true' : 'false';
  document.documentElement.style.setProperty('--builder-pixel-grid-size', `${normalized.pixelGrid.size}px`);
  document.documentElement.style.setProperty('--builder-pixel-grid-color', normalized.pixelGrid.color);
  document.documentElement.style.setProperty('--builder-pixel-grid-opacity', `${normalized.pixelGrid.opacity / 100}`);
}

export function saveAndBroadcastEditorPreferences(prefs: EditorPreferences): void {
  const normalized = normalizeEditorPreferences(prefs);
  saveEditorPreferences(normalized);
  applyEditorPreferencesToDocument(normalized);
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(BUILDER_EDITOR_PREFS_EVENT, { detail: normalized }));
  }
}

export function makeGuideId(): string {
  return `gd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Phase 29 W217 — guide creation/reposition helpers.
 *
 * Guides live in editor preferences (not the canvas document), mirroring how
 * grid/rulers prefs are stored, so they are intentionally NOT part of the
 * document undo history. These pure functions encapsulate the immutable
 * preference updates the editor guide hook performs, and are unit-tested in
 * isolation (see __tests__/reference-guides.test.ts).
 */
export const REFERENCE_GUIDE_COLOR = '#e11d48';

export function boundGuidePosition(
  axis: ReferenceGuide['axis'],
  position: number,
  stageWidth: number,
  stageHeight: number,
): number {
  const max = axis === 'vertical' ? stageWidth : stageHeight;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  if (!Number.isFinite(position)) return 0;
  return Math.max(0, Math.min(safeMax, Math.round(position)));
}

export function describeGuideLabel(axis: ReferenceGuide['axis'], position: number): string {
  return `${axis === 'vertical' ? 'X' : 'Y'} ${Math.round(position)}px`;
}

export function createReferenceGuideEntry(
  axis: ReferenceGuide['axis'],
  position: number,
  stageWidth: number,
  stageHeight: number,
): ReferenceGuide {
  const bounded = boundGuidePosition(axis, position, stageWidth, stageHeight);
  return {
    id: makeGuideId(),
    axis,
    position: bounded,
    label: describeGuideLabel(axis, bounded),
    color: REFERENCE_GUIDE_COLOR,
  };
}

export function addReferenceGuideToPrefs(
  prefs: EditorPreferences,
  guide: ReferenceGuide,
): EditorPreferences {
  return { ...prefs, referenceGuides: [...prefs.referenceGuides, guide] };
}

export function removeReferenceGuideFromPrefs(
  prefs: EditorPreferences,
  guideId: string,
): EditorPreferences {
  return {
    ...prefs,
    referenceGuides: prefs.referenceGuides.filter((guide) => guide.id !== guideId),
  };
}

export function repositionReferenceGuideInPrefs(
  prefs: EditorPreferences,
  guideId: string,
  position: number,
  stageWidth: number,
  stageHeight: number,
): EditorPreferences {
  return {
    ...prefs,
    referenceGuides: prefs.referenceGuides.map((guide) => {
      if (guide.id !== guideId) return guide;
      const bounded = boundGuidePosition(guide.axis, position, stageWidth, stageHeight);
      return { ...guide, position: bounded, label: describeGuideLabel(guide.axis, bounded) };
    }),
  };
}

export function makeCommentId(): string {
  return `cmt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
