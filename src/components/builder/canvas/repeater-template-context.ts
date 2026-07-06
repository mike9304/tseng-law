import type { BuilderCanvasNode, BuilderDataBinding } from '@/lib/builder/canvas/types';

type VisibleChildrenByParentId = ReadonlyMap<string, readonly BuilderCanvasNode[]>;

export function collectRepeaterTemplateBindingNodes(
  childNodes: readonly BuilderCanvasNode[],
  visibleChildrenByParentId: VisibleChildrenByParentId,
): BuilderCanvasNode[] {
  const collected: BuilderCanvasNode[] = [];
  const seen = new Set<string>();

  const visit = (node: BuilderCanvasNode) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    if (node.dataBinding) collected.push(node);
    const children = visibleChildrenByParentId.get(node.id) ?? [];
    children.forEach(visit);
  };

  childNodes.forEach(visit);
  return collected;
}

export function findRepeaterTemplateParentNode(
  node: BuilderCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  visibleChildrenByParentId?: VisibleChildrenByParentId,
): BuilderCanvasNode | undefined {
  const targetId = resolveRepeaterTemplateTargetId(node, visibleChildrenByParentId);
  if (!targetId) return undefined;

  const seen = new Set<string>();
  let parentId = node.parentId;
  while (parentId) {
    if (seen.has(parentId)) return undefined;
    seen.add(parentId);
    const parent = nodesById.get(parentId);
    if (!parent) return undefined;
    if (
      parent.kind === 'container' &&
      parent.content.layoutMode === 'repeater' &&
      parent.dataBinding?.targetId === targetId
    ) {
      return parent;
    }
    parentId = parent.parentId;
  }

  return undefined;
}

export function resolveRepeaterTemplateActiveNodeIds(
  node: BuilderCanvasNode,
  targetId: BuilderDataBinding['targetId'],
  visibleChildrenByParentId: VisibleChildrenByParentId,
): readonly string[] {
  if (node.dataBinding?.targetId === targetId) return [node.id];
  return collectRepeaterTemplateBindingNodes([node], visibleChildrenByParentId)
    .filter((bindingNode) => bindingNode.dataBinding?.targetId === targetId)
    .map((bindingNode) => bindingNode.id);
}

function resolveRepeaterTemplateTargetId(
  node: BuilderCanvasNode,
  visibleChildrenByParentId: VisibleChildrenByParentId | undefined,
): BuilderDataBinding['targetId'] | undefined {
  if (node.dataBinding?.targetId) return node.dataBinding.targetId;
  if (!visibleChildrenByParentId) return undefined;

  const targetIds = new Set<BuilderDataBinding['targetId']>();
  collectRepeaterTemplateBindingNodes([node], visibleChildrenByParentId).forEach((bindingNode) => {
    if (bindingNode.dataBinding?.targetId) targetIds.add(bindingNode.dataBinding.targetId);
  });
  return targetIds.size === 1 ? targetIds.values().next().value : undefined;
}
