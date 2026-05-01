/**
 * Saved-section insert utility.
 *
 * Given a `SavedSection` snapshot, produce a connected set of nodes
 * with fresh ids and remapped `parentId` references, ready to be passed
 * to the canvas store's `addNodes` action.
 */

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { SavedSection } from '@/lib/builder/site/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';

export interface SavedSectionInsertResult {
  rootNodeId: string;
  nodes: BuilderCanvasNode[];
}

let insertIdCounter = 0;
function newSectionNodeId(kind: string): string {
  insertIdCounter += 1;
  return `${kind}-${Date.now()}-${insertIdCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Clone a SavedSection's node tree with fresh ids. The root rect is
 * optionally translated by `dropOffset` so the inserted section appears
 * at the user's drop location. Descendant rects are kept as-is because
 * they are stored in parent-local coordinates.
 */
export function insertSavedSection(
  section: SavedSection,
  dropOffset?: { x: number; y: number },
): SavedSectionInsertResult {
  return insertSectionSnapshot(section.nodes, section.rootNodeId, dropOffset);
}

export function insertSectionSnapshot(
  nodes: BuilderCanvasNode[],
  rootNodeId: string,
  dropOffset?: { x: number; y: number },
): SavedSectionInsertResult {
  const normalizedNodes = normalizeSavedSectionSnapshot(nodes, rootNodeId);
  if (normalizedNodes.length === 0) {
    return { rootNodeId: '', nodes: [] };
  }

  const idMap = new Map<string, string>();
  for (const node of normalizedNodes) {
    idMap.set(node.id, newSectionNodeId(String(node.kind)));
  }

  const newRootId = idMap.get(rootNodeId);
  if (!newRootId) {
    return { rootNodeId: '', nodes: [] };
  }

  // Default offset = a small cascade so sequential inserts don't fully overlap.
  const cascade = (insertIdCounter % 6) * 8;
  const offsetX = dropOffset?.x ?? cascade;
  const offsetY = dropOffset?.y ?? cascade;

  const cloned: BuilderCanvasNode[] = normalizedNodes.map((node) => {
    const nextId = idMap.get(node.id)!;
    const isRoot = node.id === rootNodeId;
    const remappedParent = node.parentId && idMap.has(node.parentId)
      ? idMap.get(node.parentId)!
      : undefined;
    const clonedNode = structuredClone(node) as BuilderCanvasNode;
    const rect = isRoot
      ? {
          ...clonedNode.rect,
          x: offsetX,
          y: offsetY,
        }
      : clonedNode.rect;
    return {
      ...clonedNode,
      id: nextId,
      parentId: isRoot ? undefined : remappedParent,
      rect,
    } as BuilderCanvasNode;
  });

  return {
    rootNodeId: newRootId,
    nodes: cloned,
  };
}
