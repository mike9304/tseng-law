import { createCanvasNodeTemplate } from '@/lib/builder/canvas/store';
import {
  builderCanvasNodeKinds,
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderCanvasNodeKind,
} from '@/lib/builder/canvas/types';
import { insertSectionSnapshot, type SavedSectionInsertResult } from '@/lib/builder/sections/insertSection';
import type { StagePoint } from './canvasDropTarget';

export {
  resolveCanvasDropTargetContext,
  type CanvasDropTargetContext,
  type StagePoint,
} from './canvasDropTarget';

export const BUILDER_NODE_KIND_DRAG_MIME = 'application/x-builder-node-kind';
export const BUILDER_APP_WIDGET_DRAG_MIME = 'application/x-builder-app-widget';
export const BUILDER_WIDGET_PRESET_DRAG_MIME = 'application/x-builder-widget-preset';
export const BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME = 'application/x-builder-built-in-section-template';
export const BUILDER_SAVED_SECTION_DRAG_MIME = 'application/x-builder-saved-section-id';

export interface CatalogWidgetPresetDragSource {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly content: Record<string, unknown>;
  readonly style?: Record<string, unknown>;
}

export interface CatalogWidgetPresetDropData {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly content: Record<string, unknown>;
  readonly style: Record<string, unknown> | null;
  readonly anchorName: string | null;
}

export interface CatalogAppWidgetDropData {
  readonly appId: string;
  readonly widgetId: string;
  readonly defaultContent: Record<string, unknown> | null;
  readonly defaultSize: { readonly width: number; readonly height: number } | null;
}

export interface BuiltInSectionTemplateDragSource {
  readonly id: string;
  readonly nodes: readonly BuilderCanvasNode[];
  readonly rootNodeId: string;
}

export interface BuiltInSectionTemplateDropData {
  readonly templateId: string;
  readonly nodes: BuilderCanvasNode[];
  readonly rootNodeId: string;
}

const BUILDER_CANVAS_NODE_KIND_SET = new Set<string>(builderCanvasNodeKinds);

export function isBuilderCatalogNodeKind(value: string): value is BuilderCanvasNodeKind {
  return BUILDER_CANVAS_NODE_KIND_SET.has(value);
}

export function encodeCatalogWidgetPresetDragData(preset: CatalogWidgetPresetDragSource): string {
  return JSON.stringify({
    anchorName: preset.id === 'layout-sticky-anchor' ? 'services' : null,
    content: preset.content,
    height: preset.height,
    id: preset.id,
    style: preset.style ?? null,
    width: preset.width,
  });
}

export function encodeBuiltInSectionTemplateDragData(template: BuiltInSectionTemplateDragSource): string {
  return JSON.stringify({
    nodes: template.nodes,
    rootNodeId: template.rootNodeId,
    templateId: template.id,
  });
}

export function parseBuiltInSectionTemplateDragData(raw: string): BuiltInSectionTemplateDropData | null {
  const parsed = parseJsonObject(raw);
  if (!parsed) return null;
  const templateId = readTrimmedString(parsed.templateId);
  const rootNodeId = readTrimmedString(parsed.rootNodeId);
  const nodesResult = builderCanvasNodeSchema.array().safeParse(parsed.nodes);
  if (!templateId || !rootNodeId || !nodesResult.success) return null;

  return {
    nodes: nodesResult.data,
    rootNodeId,
    templateId,
  };
}

export function parseCatalogWidgetPresetDragData(raw: string): CatalogWidgetPresetDropData | null {
  const parsed = parseJsonObject(raw);
  if (!parsed) return null;
  const id = readTrimmedString(parsed.id);
  const width = readPositiveNumber(parsed.width);
  const height = readPositiveNumber(parsed.height);
  const content = readRecord(parsed.content);
  if (!id || width === null || height === null || !content) return null;

  return {
    anchorName: readOptionalTrimmedString(parsed.anchorName),
    content,
    height,
    id,
    style: readOptionalRecord(parsed.style),
    width,
  };
}

export function parseCatalogAppWidgetDragData(raw: string): CatalogAppWidgetDropData | null {
  const parsed = parseJsonObject(raw);
  if (!parsed) return null;
  const appId = readTrimmedString(parsed.appId);
  const widgetId = readTrimmedString(parsed.widgetId);
  if (!appId || !widgetId) return null;

  const defaultSizeRecord = readRecord(parsed.defaultSize);
  const width = defaultSizeRecord ? readPositiveNumber(defaultSizeRecord.width) : null;
  const height = defaultSizeRecord ? readPositiveNumber(defaultSizeRecord.height) : null;

  return {
    appId,
    defaultContent: readOptionalRecord(parsed.defaultContent),
    defaultSize: width === null || height === null ? null : { width, height },
    widgetId,
  };
}

export function createCatalogDropNode({
  appWidget,
  kind,
  nodeCount,
  parentId,
  position,
  preset,
}: {
  readonly appWidget: CatalogAppWidgetDropData | null;
  readonly kind: BuilderCanvasNodeKind;
  readonly nodeCount: number;
  readonly parentId: string | null;
  readonly position: StagePoint;
  readonly preset: CatalogWidgetPresetDropData | null;
}): BuilderCanvasNode {
  const seed = createCanvasNodeTemplate(kind, position.x, position.y, nodeCount);
  const defaultSize = appWidget?.defaultSize ?? null;
  const rect = {
    ...seed.rect,
    ...(defaultSize ? { height: defaultSize.height, width: defaultSize.width } : {}),
    ...(preset ? { height: preset.height, width: preset.width } : {}),
  };
  const content: BuilderCanvasNode['content'] = {
    ...seed.content,
    ...(appWidget?.defaultContent ?? {}),
    ...(preset?.content ?? {}),
  };
  const style: BuilderCanvasNode['style'] = preset?.style
    ? { ...seed.style, ...preset.style }
    : seed.style;

  return builderCanvasNodeSchema.parse({
    ...seed,
    ...(appWidget ? { appWidget: { appId: appWidget.appId, widgetId: appWidget.widgetId } } : {}),
    ...(parentId ? { parentId } : {}),
    ...(preset?.anchorName ? { anchorName: preset.anchorName } : {}),
    content,
    rect,
    style,
  });
}

export function createBuiltInSectionDropSnapshot(
  template: BuiltInSectionTemplateDropData,
  position: StagePoint,
): SavedSectionInsertResult {
  return insertSectionSnapshot(template.nodes, template.rootNodeId, position);
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return readRecord(parsed);
  } catch {
    return null;
  }
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function readOptionalRecord(value: unknown): Record<string, unknown> | null {
  return value === null || value === undefined ? null : readRecord(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readOptionalTrimmedString(value: unknown): string | null {
  return value === null || value === undefined ? null : readTrimmedString(value);
}

function readPositiveNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}
