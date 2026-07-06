import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode, BuilderDataBinding } from '@/lib/builder/canvas/types';
import type { ComponentLibraryFieldOverrideMap } from './component-library-field-remap.helpers';
import {
  parseComponentLibraryInsertResult,
  type ComponentLibraryEntry,
  type ComponentLibraryFieldRemapSummary,
} from './component-library-panel.helpers';

export interface ComponentLibraryReplaceSelectionOptions {
  readonly entry: ComponentLibraryEntry;
  readonly selectedNodeIds: readonly string[];
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly childrenMap: Readonly<Record<string, readonly string[]>>;
  readonly canvasNodeCount: number;
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
  readonly fieldOverrides?: ComponentLibraryFieldOverrideMap;
}

export interface ComponentLibraryReplaceSelectionResult {
  readonly nodes: BuilderCanvasNode[];
  readonly rootNodeId: string | null;
  readonly selectionNodeIds: readonly string[];
  readonly fieldRemapSummary: ComponentLibraryFieldRemapSummary | null;
  readonly parentNodeId: string | null;
  readonly removedNodeIds: readonly string[];
}

const ZERO_RECT_OFFSET = { x: 0, y: 0 } as const;

export function prepareComponentLibraryReplaceSelection(
  options: ComponentLibraryReplaceSelectionOptions,
): ComponentLibraryReplaceSelectionResult | null {
  if (options.selectedNodeIds.length !== 1) return null;
  const targetNodeId = options.selectedNodeIds[0];
  const targetNode = targetNodeId ? options.nodesById.get(targetNodeId) ?? null : null;
  if (!targetNode || targetNode.locked) return null;

  const parsed = parseComponentLibraryInsertResult(options.entry, options.canvasNodeCount, {
    baseZIndex: targetNode.zIndex,
    rectOffset: ZERO_RECT_OFFSET,
    targetIdOverride: options.targetIdOverride,
    fieldOverrides: options.fieldOverrides,
  });
  if (!parsed || parsed.nodes.length === 0) return null;

  const rootNodeId = parsed.rootNodeId ?? parsed.nodes[0]?.id ?? null;
  const rootNode = rootNodeId ? parsed.nodes.find((node) => node.id === rootNodeId) ?? null : null;
  if (!rootNode) return null;

  const incomingIds = new Set(parsed.nodes.map((node) => node.id));
  const deltaX = targetNode.rect.x - rootNode.rect.x;
  const deltaY = targetNode.rect.y - rootNode.rect.y;
  const nodes = parsed.nodes.map((node) => {
    const isIncomingRoot = !node.parentId || !incomingIds.has(node.parentId);
    if (!isIncomingRoot) return node;
    return {
      ...node,
      parentId: targetNode.parentId,
      rect: node.id === rootNodeId
        ? { ...targetNode.rect }
        : {
          ...node.rect,
          x: node.rect.x + deltaX,
          y: node.rect.y + deltaY,
        },
    };
  });

  return {
    nodes,
    rootNodeId,
    selectionNodeIds: parsed.selectionNodeIds.length > 0 ? parsed.selectionNodeIds : [rootNodeId],
    fieldRemapSummary: parsed.fieldRemapSummary,
    parentNodeId: targetNode.parentId ?? null,
    removedNodeIds: [
      targetNode.id,
      ...getCanvasNodeDescendantIds(targetNode.id, options.childrenMap),
    ],
  };
}
