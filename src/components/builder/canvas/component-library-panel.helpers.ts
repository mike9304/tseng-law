import { z } from 'zod';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderCanvasNodeKind,
  type BuilderDataBinding,
} from '@/lib/builder/canvas/types';
import {
  resolveComponentLibraryRootKind,
  resolveRepeaterTemplateGroupInsertionContext,
  type ComponentLibraryInsertionContext,
} from './component-library-repeater-template.helpers';
import {
  remapComponentLibraryDataBinding,
  type ComponentLibraryFieldOverrideMap,
  type ComponentLibraryDroppedField,
  type ComponentLibraryRemappedField,
} from './component-library-field-remap.helpers';
export {
  deleteComponentLibraryEntryVersion,
  duplicateComponentLibraryEntry,
  renameComponentLibraryEntry,
  renameComponentLibraryEntryVersion,
  restoreComponentLibraryEntryVersion,
  toggleComponentLibraryEntryPinned,
  updateComponentLibraryEntryPayload,
} from './component-library-entry-management';

export interface ComponentLibraryEntryVersion {
  readonly nodeJson: string;
  readonly savedAt: string;
  readonly label?: string;
}

export interface ComponentLibraryEntry {
  readonly id: string;
  readonly name: string;
  readonly nodeJson: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly pinned?: boolean;
  readonly versions?: readonly ComponentLibraryEntryVersion[];
}

export type ComponentLibrarySortMode = 'recent' | 'name';
export type ComponentLibraryViewMode = 'list' | 'grid';

export interface ComponentLibraryInsertResult {
  readonly nodes: BuilderCanvasNode[];
  readonly rootNodeId: string | null;
  readonly selectionNodeIds: readonly string[];
  readonly fieldRemapSummary: ComponentLibraryFieldRemapSummary | null;
}

export interface ComponentLibraryInsertOptions {
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
  readonly fieldOverrides?: ComponentLibraryFieldOverrideMap;
  readonly baseZIndex?: number;
  readonly rectOffset?: {
    readonly x: number;
    readonly y: number;
  };
}

export interface ComponentLibraryFieldRemapSummary {
  readonly targetId: BuilderDataBinding['targetId'];
  readonly remappedFields: readonly ComponentLibraryRemappedField[];
  readonly droppedFields: readonly ComponentLibraryDroppedField[];
}

export type ComponentLibraryEntryRootKind = BuilderCanvasNodeKind | 'repeaterTemplateGroup' | 'unknown';

export interface ComponentLibraryEntrySummary {
  readonly rootKind: ComponentLibraryEntryRootKind;
  readonly nodeCount: number;
  readonly isValid: boolean;
}

export interface ParsedComponentLibraryNodes {
  readonly nodes: BuilderCanvasNode[];
  readonly rootNodeId: string | null;
}

const DEFAULT_COMPONENT_LIBRARY_INSERT_OFFSET = { x: 32, y: 32 } as const;

const storedComponentLibrarySnapshotSchema = z.object({
  nodes: z.array(builderCanvasNodeSchema).optional(),
  rootNodeId: z.string().optional(),
  rootNodeIds: z.array(z.string()).optional(),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function makeNodeId(kind: string, index: number): string {
  return `${kind}-lib-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function compareEntries(left: ComponentLibraryEntry, right: ComponentLibraryEntry, sortMode: ComponentLibrarySortMode): number {
  if (left.pinned === true && right.pinned !== true) return -1;
  if (left.pinned !== true && right.pinned === true) return 1;
  if (sortMode === 'name') return left.name.localeCompare(right.name);
  return new Date(right.updatedAt ?? right.createdAt).getTime() - new Date(left.updatedAt ?? left.createdAt).getTime();
}

function makeComponentLibraryFieldRemapSummary(
  targetId: BuilderDataBinding['targetId'] | undefined,
  remappedFields: readonly ComponentLibraryRemappedField[],
  droppedFields: readonly ComponentLibraryDroppedField[],
): ComponentLibraryFieldRemapSummary | null {
  if (!targetId || (remappedFields.length === 0 && droppedFields.length === 0)) return null;
  return {
    targetId,
    remappedFields: [...remappedFields],
    droppedFields: [...droppedFields],
  };
}

function parseStoredComponentLibraryNodes(entry: ComponentLibraryEntry): ParsedComponentLibraryNodes | null {
  try {
    const parsed: unknown = JSON.parse(entry.nodeJson);
    const snapshotResult = storedComponentLibrarySnapshotSchema.safeParse(parsed);
    const singleNodeResult = isRecord(parsed) ? builderCanvasNodeSchema.safeParse(parsed) : null;
    const sourceNodes = snapshotResult.success && snapshotResult.data.nodes
      ? snapshotResult.data.nodes
      : singleNodeResult?.success
        ? [singleNodeResult.data]
        : [];
    if (sourceNodes.length === 0) return null;
    const sourceIds = new Set(sourceNodes.map((node) => node.id));
    const rootNodeId = snapshotResult.success
      ? snapshotResult.data.rootNodeIds?.at(-1)
      ?? snapshotResult.data.rootNodeId
      ?? sourceNodes.find((node) => !node.parentId || !sourceIds.has(node.parentId))?.id
      ?? sourceNodes[0]?.id
      ?? null
      : sourceNodes[0]?.id ?? null;
    return { nodes: sourceNodes, rootNodeId };
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

export function parseComponentLibrarySortMode(value: string): ComponentLibrarySortMode {
  if (value === 'name') return 'name';
  return 'recent';
}

export function filterAndSortComponentLibraryEntries(
  entries: readonly ComponentLibraryEntry[],
  query: string,
  sortMode: ComponentLibrarySortMode,
): ComponentLibraryEntry[] {
  const normalizedQuery = normalizeQuery(query);
  const filtered = normalizedQuery.length === 0
    ? [...entries]
    : entries.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery));
  return filtered.sort((left, right) => compareEntries(left, right, sortMode));
}

export function getComponentLibraryEntrySummary(entry: ComponentLibraryEntry): ComponentLibraryEntrySummary {
  const parsed = parseStoredComponentLibraryNodes(entry);
  if (!parsed) {
    return {
      rootKind: 'unknown',
      nodeCount: 0,
      isValid: false,
    };
  }
  return {
    rootKind: resolveComponentLibraryRootKind(parsed),
    nodeCount: parsed.nodes.length,
    isValid: true,
  };
}

export function resolveComponentLibraryInsertionParentId(
  entry: ComponentLibraryEntry,
  selectedNodeIds: readonly string[],
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): string | null {
  return resolveComponentLibraryInsertionContext(entry, selectedNodeIds, nodesById)?.parentNodeId ?? null;
}

export function resolveComponentLibraryInsertionContext(
  entry: ComponentLibraryEntry,
  selectedNodeIds: readonly string[],
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): ComponentLibraryInsertionContext | null {
  const parsed = parseStoredComponentLibraryNodes(entry);
  if (!parsed) return null;
  return resolveRepeaterTemplateGroupInsertionContext(parsed, selectedNodeIds, nodesById);
}

export function parseComponentLibraryInsertResult(
  entry: ComponentLibraryEntry,
  canvasNodeCount: number,
  options: ComponentLibraryInsertOptions = {},
): ComponentLibraryInsertResult | null {
  const parsed = parseStoredComponentLibraryNodes(entry);
  if (!parsed) return null;
  const sourceNodes = parsed.nodes;
  const rectOffset = options.rectOffset ?? DEFAULT_COMPONENT_LIBRARY_INSERT_OFFSET;
  const baseZIndex = options.baseZIndex ?? canvasNodeCount;

  const indexedSources = sourceNodes.map((node, index) => ({
    node,
    index,
    nextId: makeNodeId(node.kind, index),
  }));
  const idMap = new Map(indexedSources.map(({ node, nextId }) => [node.id, nextId]));
  const sourceIds = new Set(sourceNodes.map((node) => node.id));
  const remappedFields: ComponentLibraryRemappedField[] = [];
  const droppedFields: ComponentLibraryDroppedField[] = [];
  const cloned = indexedSources.map(({ node, index, nextId }) => {
    const remapResult = remapComponentLibraryDataBinding(node.dataBinding, {
      targetIdOverride: options.targetIdOverride,
      fieldOverrides: options.fieldOverrides,
    });
    remappedFields.push(...remapResult.remappedFields);
    droppedFields.push(...remapResult.droppedFields);

    return {
      ...node,
      id: nextId,
      parentId: node.parentId && sourceIds.has(node.parentId) ? idMap.get(node.parentId) : undefined,
      dataBinding: remapResult.dataBinding,
      rect: {
        ...node.rect,
        x: node.rect.x + rectOffset.x,
        y: node.rect.y + rectOffset.y,
      },
      zIndex: baseZIndex + index,
    };
  });

  return {
    nodes: cloned,
    rootNodeId: parsed.rootNodeId ? idMap.get(parsed.rootNodeId) ?? cloned[0]?.id ?? null : null,
    selectionNodeIds: parsed.rootNodeId
      ? [idMap.get(parsed.rootNodeId) ?? cloned[0]?.id ?? ''].filter((nodeId) => nodeId.length > 0)
      : cloned.map((node) => node.id),
    fieldRemapSummary: makeComponentLibraryFieldRemapSummary(
      options.targetIdOverride,
      remappedFields,
      droppedFields,
    ),
  };
}
