import type {
  BuilderCanvasNode,
  BuilderDataBinding,
} from '@/lib/builder/canvas/types';
import type {
  ComponentLibraryEntryRootKind,
  ParsedComponentLibraryNodes,
} from './component-library-panel.helpers';

export interface ComponentLibraryInsertionContext {
  readonly parentNodeId: string;
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
}

function getParsedRootNode(parsed: ParsedComponentLibraryNodes): BuilderCanvasNode | undefined {
  if (!parsed.rootNodeId) return parsed.nodes[0];
  return parsed.nodes.find((node) => node.id === parsed.rootNodeId) ?? parsed.nodes[0];
}

function isDescendantOfRoot(
  node: BuilderCanvasNode,
  rootNodeId: string,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): boolean {
  let parentId = node.parentId;
  while (parentId) {
    if (parentId === rootNodeId) return true;
    parentId = nodesById.get(parentId)?.parentId;
  }
  return false;
}

function getDescendantBindingTargetIds(
  parsed: ParsedComponentLibraryNodes,
  rootNode: BuilderCanvasNode,
): ReadonlySet<BuilderDataBinding['targetId']> {
  const nodesById = new Map(parsed.nodes.map((node) => [node.id, node]));
  const targetIds = new Set<BuilderDataBinding['targetId']>();
  for (const node of parsed.nodes) {
    if (!node.dataBinding?.targetId) continue;
    if (!isDescendantOfRoot(node, rootNode.id, nodesById)) continue;
    targetIds.add(node.dataBinding.targetId);
  }
  return targetIds;
}

function resolveSavedRepeaterTemplateTargetId(
  parsed: ParsedComponentLibraryNodes,
): BuilderDataBinding['targetId'] | null {
  const rootNode = getParsedRootNode(parsed);
  if (!rootNode || rootNode.kind !== 'container') return null;
  const targetIds = getDescendantBindingTargetIds(parsed, rootNode);
  if (targetIds.size !== 1) return null;
  return targetIds.values().next().value ?? null;
}

export function resolveComponentLibraryRootKind(
  parsed: ParsedComponentLibraryNodes,
): ComponentLibraryEntryRootKind {
  const rootNode = getParsedRootNode(parsed);
  if (!rootNode) return 'unknown';
  if (rootNode.kind !== 'container') return rootNode.kind;

  const descendantTargetIds = getDescendantBindingTargetIds(parsed, rootNode);

  return descendantTargetIds.size === 1 ? 'repeaterTemplateGroup' : rootNode.kind;
}

export function resolveRepeaterTemplateGroupInsertionContext(
  parsed: ParsedComponentLibraryNodes,
  selectedNodeIds: readonly string[],
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): ComponentLibraryInsertionContext | null {
  const savedTargetId = resolveSavedRepeaterTemplateTargetId(parsed);
  if (!savedTargetId) return null;

  for (const selectedNodeId of selectedNodeIds) {
    let currentNode = nodesById.get(selectedNodeId);
    while (currentNode) {
      if (
        currentNode.kind === 'container'
        && currentNode.content.layoutMode === 'repeater'
        && currentNode.dataBinding?.targetId
      ) {
        return currentNode.dataBinding.targetId === savedTargetId
          ? { parentNodeId: currentNode.id }
          : {
            parentNodeId: currentNode.id,
            targetIdOverride: currentNode.dataBinding.targetId,
          };
      }
      currentNode = currentNode.parentId ? nodesById.get(currentNode.parentId) : undefined;
    }
  }

  return null;
}
