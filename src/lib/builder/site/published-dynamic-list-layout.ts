import { resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export function resolveDynamicListPublishedContentHeight({
  childrenMap,
  nodes,
  nodesById,
  recordCount,
  targetId,
}: {
  readonly childrenMap: Record<string, string[]>;
  readonly nodes: readonly BuilderCanvasNode[];
  readonly nodesById: Map<string, BuilderCanvasNode>;
  readonly recordCount: number;
  readonly targetId: string;
}): number {
  if (recordCount < 1) return 0;
  return nodes.reduce((maxHeight, node) => {
    if (
      node.kind !== 'container'
      || node.content.layoutMode !== 'repeater'
      || node.dataBinding?.targetId !== targetId
    ) {
      return maxHeight;
    }
    const absoluteRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
    const templateHeight = resolveRepeaterTemplateHeight(node.id, childrenMap, nodesById);
    const templateWidth = resolveRepeaterTemplateWidth(node.id, childrenMap, nodesById);
    const padding = typeof node.content.padding === 'number' ? node.content.padding : 0;
    const gap = node.content.flexConfig?.gap ?? 0;
    const contentWidth = Math.max(1, node.rect.width - (padding * 2));
    const itemBasis = Math.max(220, templateWidth);
    const direction = node.content.flexConfig?.direction ?? 'row';
    const itemsPerRow = direction === 'column'
      ? 1
      : Math.max(1, Math.floor((contentWidth + gap) / (itemBasis + gap)));
    const rowCount = direction === 'column'
      ? recordCount
      : Math.max(1, Math.ceil(recordCount / itemsPerRow));
    const expandedHeight = (padding * 2)
      + (rowCount * Math.max(1, templateHeight))
      + (Math.max(0, rowCount - 1) * gap);

    return Math.max(maxHeight, absoluteRect.y + Math.max(node.rect.height, expandedHeight));
  }, 0);
}

function resolveRepeaterTemplateHeight(
  nodeId: string,
  childrenMap: Record<string, string[]>,
  nodesById: Map<string, BuilderCanvasNode>,
): number {
  return (childrenMap[nodeId] ?? []).reduce((height, childId) => {
    const child = nodesById.get(childId);
    if (!child || child.visible === false) return height;
    return Math.max(height, child.rect.y + child.rect.height);
  }, 0);
}

function resolveRepeaterTemplateWidth(
  nodeId: string,
  childrenMap: Record<string, string[]>,
  nodesById: Map<string, BuilderCanvasNode>,
): number {
  return (childrenMap[nodeId] ?? []).reduce((width, childId) => {
    const child = nodesById.get(childId);
    if (!child || child.visible === false) return width;
    return Math.max(width, child.rect.x + child.rect.width);
  }, 0);
}
