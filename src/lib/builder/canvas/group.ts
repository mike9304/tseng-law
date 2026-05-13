/**
 * Phase 2 P2-11 — Group/ungroup logic.
 *
 * Groups are implemented as a special 'container' node whose children
 * array holds the grouped nodes. The grouped nodes' rects become
 * relative to the container's rect.
 *
 * Ungroup reverses: children become top-level nodes with absolute
 * rects recalculated from the container's position.
 */

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

let groupCounter = 0;
function newGroupId(): string {
  groupCounter += 1;
  return `group-${Date.now()}-${groupCounter}`;
}

export interface GroupResult {
  groupNode: BuilderCanvasNode;
  removedNodeIds: string[];
}

export function groupNodes(nodes: BuilderCanvasNode[]): GroupResult | null {
  if (nodes.length < 2) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.rect.x);
    minY = Math.min(minY, node.rect.y);
    maxX = Math.max(maxX, node.rect.x + node.rect.width);
    maxY = Math.max(maxY, node.rect.y + node.rect.height);
    maxZ = Math.max(maxZ, node.zIndex);
  }

  const children: BuilderCanvasNode[] = nodes.map((n) => ({
    ...structuredClone(n),
    rect: {
      x: n.rect.x - minX,
      y: n.rect.y - minY,
      width: n.rect.width,
      height: n.rect.height,
    },
  }));

  const groupNode = {
    id: newGroupId(),
    kind: 'container' as const,
    rect: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
    style: createDefaultCanvasNodeStyle(),
    zIndex: maxZ,
    rotation: 0,
    locked: false,
    visible: true,
    content: { label: 'Group', background: 'transparent', borderColor: 'transparent', borderStyle: 'solid' as const, borderWidth: 0, borderRadius: 0, padding: 0 },
    children,
  } satisfies Record<string, unknown> as unknown as BuilderCanvasNode;

  return {
    groupNode,
    removedNodeIds: nodes.map((n) => n.id),
  };
}

export interface UngroupResult {
  restoredNodes: BuilderCanvasNode[];
  removedGroupId: string;
}

export function ungroupNode(groupNode: BuilderCanvasNode): UngroupResult | null {
  const children = (groupNode as unknown as { children?: BuilderCanvasNode[] }).children;
  if (!children || children.length === 0) return null;

  const restoredNodes: BuilderCanvasNode[] = children.map((child) => ({
    ...structuredClone(child),
    rect: {
      x: child.rect.x + groupNode.rect.x,
      y: child.rect.y + groupNode.rect.y,
      width: child.rect.width,
      height: child.rect.height,
    },
  }));

  return {
    restoredNodes,
    removedGroupId: groupNode.id,
  };
}
