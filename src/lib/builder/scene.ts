import { BUILDER_SCHEMA_VERSION } from '@/lib/builder/constants';
import {
  buildBuilderContentGroupNodeId,
  getBuilderSectionContentGroups,
  getBuilderSectionDefinition,
} from '@/lib/builder/registry';
import type {
  BuilderEditableTargetKind,
  BuilderPageDocument,
  BuilderPageKey,
  BuilderPersistedSceneNode,
  BuilderSectionContentGroupNode,
  BuilderSectionKey,
  BuilderSectionNode,
} from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export const builderSceneNodeKinds = [
  'page',
  'section',
  'container',
  'content-group',
  'grid',
  'cell',
  'stack',
  'repeater',
  'text',
  'button',
  'image',
  'nav',
  'form-shell',
  'embed',
  'global-slot',
] as const;

export type BuilderSceneNodeKind = (typeof builderSceneNodeKinds)[number];
export type BuilderSceneAdapterMode = 'semantic-section-compat-v1';
export type BuilderSceneSourceKind =
  | 'page-root'
  | 'section-node'
  | 'section-frame'
  | 'content-group'
  | 'declared-surface'
  | 'dataset-binding';

export interface BuilderSceneNode {
  nodeId: string;
  nodeKind: BuilderSceneNodeKind;
  label: string;
  parentNodeId: string | null;
  childNodeIds: string[];
  pageKey: BuilderPageKey;
  sectionKey?: BuilderSectionKey;
  sourceKind: BuilderSceneSourceKind;
  declaredTargetKind?: BuilderEditableTargetKind;
  surfaceId?: string;
  datasetId?: string;
  geometry?: Pick<BuilderSectionContentGroupNode, 'bounds' | 'overrides' | 'constraints'>;
  hidden?: boolean;
  locked?: boolean;
  notes: string[];
}

export interface BuilderSceneDocument {
  version: 1;
  schemaVersion: number;
  adapterMode: BuilderSceneAdapterMode;
  pageKey: BuilderPageKey;
  locale: Locale;
  sourceDocumentVersion: number;
  rootNodeId: string;
  nodeOrder: string[];
  nodes: Record<string, BuilderSceneNode>;
}

export interface BuilderSceneSummary {
  nodeCount: number;
  sectionCount: number;
  surfaceCount: number;
  datasetNodeCount: number;
  sectionNodeIds: string[];
}

export function buildBuilderSceneDocument(document: BuilderPageDocument): BuilderSceneDocument {
  const rootNodeId = buildSceneNodeId(document.pageKey, 'page');
  const nodes = new Map<string, BuilderSceneNode>();
  const nodeOrder: string[] = [];

  const registerNode = (node: BuilderSceneNode) => {
    nodes.set(node.nodeId, node);
    nodeOrder.push(node.nodeId);
  };

  registerNode({
    nodeId: rootNodeId,
    nodeKind: 'page',
    label: document.root.name,
    parentNodeId: null,
    childNodeIds: [],
    pageKey: document.pageKey,
    sourceKind: 'page-root',
    notes: [
      'Scene root generated from the current page document.',
      'This is compatibility scene data, not the final canvas runtime.',
    ],
  });

  for (const section of document.root.children) {
    const definition = getBuilderSectionDefinition(section.sectionKey);
    const sectionNodeId = buildSceneNodeId(document.pageKey, section.sectionKey);
    const frameNodeId = `${sectionNodeId}:frame`;
    const sectionChildNodeIds: string[] = [frameNodeId];
    const frameChildNodeIds: string[] = [];
    const contentGroups = resolveSectionContentGroups(document, section);
    const persistedPageSceneNodes = getPersistedPageSceneNodes(document, section.sectionKey);
    const persistedPageSceneNodeMap = new Map(
      persistedPageSceneNodes.map((node) => [node.nodeId, node] as const)
    );
    const groupedSurfaceIds = new Set(contentGroups.flatMap((group) => group.surfaceIds));

    registerNode({
      nodeId: sectionNodeId,
      nodeKind: 'section',
      label: definition.title,
      parentNodeId: rootNodeId,
      childNodeIds: sectionChildNodeIds,
      pageKey: document.pageKey,
      sectionKey: section.sectionKey,
      sourceKind: 'section-node',
      hidden: section.hidden ?? false,
      locked: section.locked ?? false,
      notes: [
        `Derived from semantic section ${section.sectionKey}.`,
        `Source component: ${definition.componentName}.`,
      ],
    });

    registerNode({
      nodeId: frameNodeId,
      nodeKind: 'container',
      label: `${definition.title} frame`,
      parentNodeId: sectionNodeId,
      childNodeIds: frameChildNodeIds,
      pageKey: document.pageKey,
      sectionKey: section.sectionKey,
      sourceKind: 'section-frame',
      hidden: section.hidden ?? false,
      locked: section.locked ?? false,
      notes: [
        'Compatibility container for the current section-frame layout contract.',
        'Will be replaced by true container/grid/stack nodes in the canvas-first core.',
      ],
    });

    for (const group of contentGroups) {
      const groupNodeId = buildBuilderContentGroupNodeId(section.sectionKey, group.groupKey);
      const persistedSceneNode = persistedPageSceneNodeMap.get(groupNodeId);
      frameChildNodeIds.push(groupNodeId);
      registerNode({
        nodeId: groupNodeId,
        nodeKind: 'content-group',
        label: group.label,
        parentNodeId: frameNodeId,
        childNodeIds: [],
        pageKey: document.pageKey,
        sectionKey: section.sectionKey,
        sourceKind: 'content-group',
        geometry: {
          bounds: group.bounds,
          overrides: group.overrides,
          constraints: group.constraints,
        },
        hidden: section.hidden ?? false,
        locked: section.locked ?? false,
        notes: [
          `Persisted content-group node ${group.groupKey}.`,
          persistedSceneNode?.source === 'page-scene'
            ? 'Geometry is now authoritative in page.scene; measured bridge bounds are retained separately for convergence diagnostics.'
            : group.measuredAt
            ? 'Geometry now prefers the persisted page.scene bridge before section-scene fallback.'
            : 'Geometry still falls back to section-scene defaults until the page.scene bridge is measured.',
          group.bounds
            ? `Current desktop geometry ${formatBounds(group.bounds)}.`
            : group.measuredBounds
              ? `Measured desktop bridge bounds ${formatBounds(group.measuredBounds)}.`
              : 'Desktop bounds are still unresolved on the current document.',
        ],
      });
    }

    appendDeclaredSurfaceNodes(
      nodes,
      document.pageKey,
      section,
      definition.textSurfaceIds,
      'text',
      frameNodeId,
      frameChildNodeIds,
      registerNode,
      contentGroups,
      groupedSurfaceIds
    );
    appendDeclaredSurfaceNodes(
      nodes,
      document.pageKey,
      section,
      definition.buttonSurfaceIds,
      'button',
      frameNodeId,
      frameChildNodeIds,
      registerNode,
      contentGroups,
      groupedSurfaceIds
    );
    appendDeclaredSurfaceNodes(
      nodes,
      document.pageKey,
      section,
      definition.imageSurfaceIds,
      'image',
      frameNodeId,
      frameChildNodeIds,
      registerNode,
      contentGroups,
      groupedSurfaceIds
    );

    for (const dataset of document.datasets.filter((candidate) => candidate.sectionKey === section.sectionKey)) {
      const nodeId = `${sectionNodeId}:dataset:${sanitizeSceneToken(dataset.targetId)}`;
      const parentGroup = contentGroups.find((group) =>
        group.datasetTargetIds?.includes(dataset.targetId)
      );
      const parentNodeId = parentGroup
        ? buildBuilderContentGroupNodeId(section.sectionKey, parentGroup.groupKey)
        : frameNodeId;
      if (!parentGroup) {
        frameChildNodeIds.push(nodeId);
      } else {
        const groupNode = nodes.get(parentNodeId);
        if (groupNode) {
          groupNode.childNodeIds = [...groupNode.childNodeIds, nodeId];
        }
      }
      registerNode({
        nodeId,
        nodeKind: 'repeater',
        label: `${dataset.targetId} dataset`,
        parentNodeId,
        childNodeIds: [],
        pageKey: document.pageKey,
        sectionKey: section.sectionKey,
        sourceKind: 'dataset-binding',
        datasetId: dataset.datasetId,
        notes: [
          `Dataset target ${dataset.targetId} bound to ${dataset.collectionId}.`,
          'This node is a binding seam only; it is not yet a fully editable repeater canvas node.',
        ],
      });
    }
  }

  const rootNode = nodes.get(rootNodeId);
  if (rootNode) {
    rootNode.childNodeIds = document.root.children.map((section) =>
      buildSceneNodeId(document.pageKey, section.sectionKey)
    );
  }

  return {
    version: 1,
    schemaVersion: BUILDER_SCHEMA_VERSION,
    adapterMode: 'semantic-section-compat-v1',
    pageKey: document.pageKey,
    locale: document.locale,
    sourceDocumentVersion: document.version,
    rootNodeId,
    nodeOrder,
    nodes: Object.fromEntries(nodes.entries()),
  };
}

export function summarizeBuilderSceneDocument(scene: BuilderSceneDocument): BuilderSceneSummary {
  const nodes = Object.values(scene.nodes);
  const sectionNodeIds = nodes.filter((node) => node.nodeKind === 'section').map((node) => node.nodeId);

  return {
    nodeCount: nodes.length,
    sectionCount: sectionNodeIds.length,
    surfaceCount: nodes.filter(
      (node) => node.nodeKind === 'text' || node.nodeKind === 'button' || node.nodeKind === 'image'
    ).length,
    datasetNodeCount: nodes.filter((node) => node.nodeKind === 'repeater').length,
    sectionNodeIds,
  };
}

export function flattenBuilderSceneNodeIds(scene: BuilderSceneDocument) {
  const orderedNodeIds: string[] = [];

  const visit = (nodeId: string) => {
    const node = scene.nodes[nodeId];
    if (!node) {
      return;
    }

    orderedNodeIds.push(nodeId);

    for (const childNodeId of node.childNodeIds) {
      visit(childNodeId);
    }
  };

  visit(scene.rootNodeId);

  return orderedNodeIds;
}

export function getBuilderSceneAncestorNodeIds(scene: BuilderSceneDocument, nodeId: string) {
  const ancestorNodeIds: string[] = [];
  let currentNode = scene.nodes[nodeId];

  while (currentNode?.parentNodeId) {
    ancestorNodeIds.unshift(currentNode.parentNodeId);
    currentNode = scene.nodes[currentNode.parentNodeId];
  }

  return ancestorNodeIds;
}

export function getBuilderSceneSearchText(node: BuilderSceneNode) {
  return [
    node.label,
    node.nodeKind,
    node.nodeId,
    node.sectionKey,
    node.surfaceId,
    node.datasetId,
    ...node.notes,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function filterBuilderSceneVisibleNodeIds(
  scene: BuilderSceneDocument,
  rawQuery: string,
  selectedNodeIds: string[] = []
) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return new Set(flattenBuilderSceneNodeIds(scene));
  }

  const visibleNodeIds = new Set<string>();

  const markVisiblePath = (nodeId: string) => {
    visibleNodeIds.add(nodeId);

    for (const ancestorNodeId of getBuilderSceneAncestorNodeIds(scene, nodeId)) {
      visibleNodeIds.add(ancestorNodeId);
    }
  };

  for (const node of Object.values(scene.nodes)) {
    if (getBuilderSceneSearchText(node).includes(query)) {
      markVisiblePath(node.nodeId);
    }
  }

  for (const selectedNodeId of selectedNodeIds) {
    if (scene.nodes[selectedNodeId]) {
      markVisiblePath(selectedNodeId);
    }
  }

  return visibleNodeIds;
}

export type BuilderSceneDropPlacement = 'before' | 'after';

export type BuilderSceneDropEvaluation =
  | {
      valid: true;
      parentNodeId: string;
      draggedNodeId: string;
      targetNodeId: string;
      placement: BuilderSceneDropPlacement;
    }
  | {
      valid: false;
      reason: string;
      draggedNodeId: string;
      targetNodeId: string;
      placement: BuilderSceneDropPlacement;
    };

export function evaluateBuilderSceneReorderDrop(
  scene: BuilderSceneDocument,
  draggedNodeId: string,
  targetNodeId: string,
  placement: BuilderSceneDropPlacement
): BuilderSceneDropEvaluation {
  const draggedNode = scene.nodes[draggedNodeId];
  const targetNode = scene.nodes[targetNodeId];

  if (!draggedNode || !targetNode) {
    return {
      valid: false,
      reason: 'Unknown drag or drop node.',
      draggedNodeId,
      targetNodeId,
      placement,
    };
  }

  if (draggedNodeId === scene.rootNodeId) {
    return {
      valid: false,
      reason: 'The page root cannot be moved.',
      draggedNodeId,
      targetNodeId,
      placement,
    };
  }

  if (draggedNodeId === targetNodeId) {
    return {
      valid: false,
      reason: 'Dropping onto the same node does not change order.',
      draggedNodeId,
      targetNodeId,
      placement,
    };
  }

  if (!draggedNode.parentNodeId || !targetNode.parentNodeId) {
    return {
      valid: false,
      reason: 'Only nodes with a parent may be reordered.',
      draggedNodeId,
      targetNodeId,
      placement,
    };
  }

  if (draggedNode.parentNodeId !== targetNode.parentNodeId) {
    return {
      valid: false,
      reason: 'This proof surface only supports reorder within the same parent.',
      draggedNodeId,
      targetNodeId,
      placement,
    };
  }

  return {
    valid: true,
    parentNodeId: draggedNode.parentNodeId,
    draggedNodeId,
    targetNodeId,
    placement,
  };
}

export function reorderBuilderSceneNode(
  scene: BuilderSceneDocument,
  draggedNodeId: string,
  targetNodeId: string,
  placement: BuilderSceneDropPlacement
) {
  const evaluation = evaluateBuilderSceneReorderDrop(scene, draggedNodeId, targetNodeId, placement);

  if (!evaluation.valid) {
    return scene;
  }

  const parentNode = scene.nodes[evaluation.parentNodeId];

  if (!parentNode) {
    return scene;
  }

  const siblingNodeIds = [...parentNode.childNodeIds];
  const draggedIndex = siblingNodeIds.indexOf(draggedNodeId);
  const targetIndex = siblingNodeIds.indexOf(targetNodeId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return scene;
  }

  siblingNodeIds.splice(draggedIndex, 1);

  const insertionBaseIndex = siblingNodeIds.indexOf(targetNodeId);
  const insertionIndex =
    evaluation.placement === 'before' ? insertionBaseIndex : insertionBaseIndex + 1;

  siblingNodeIds.splice(insertionIndex, 0, draggedNodeId);

  return {
    ...scene,
    nodes: {
      ...scene.nodes,
      [parentNode.nodeId]: {
        ...parentNode,
        childNodeIds: siblingNodeIds,
      },
    },
  };
}

function appendDeclaredSurfaceNodes(
  nodes: Map<string, BuilderSceneNode>,
  pageKey: BuilderPageKey,
  section: BuilderSectionNode,
  surfaceIds: readonly string[] | undefined,
  targetKind: BuilderEditableTargetKind,
  parentNodeId: string,
  frameChildNodeIds: string[],
  registerNode: (node: BuilderSceneNode) => void,
  contentGroups: BuilderSectionContentGroupNode[],
  groupedSurfaceIds: Set<string>
) {
  for (const surfaceId of surfaceIds ?? []) {
    const nodeId = `${buildSceneNodeId(pageKey, section.sectionKey)}:${targetKind}:${sanitizeSceneToken(surfaceId)}`;
    const parentGroup = contentGroups.find((group) => group.surfaceIds.includes(surfaceId));
    const resolvedParentNodeId = parentGroup
      ? buildBuilderContentGroupNodeId(section.sectionKey, parentGroup.groupKey)
      : parentNodeId;
    if (!groupedSurfaceIds.has(surfaceId)) {
      frameChildNodeIds.push(nodeId);
    } else {
      const groupNode = nodes.get(resolvedParentNodeId);
      if (groupNode) {
        groupNode.childNodeIds = [...groupNode.childNodeIds, nodeId];
      }
    }
    registerNode({
      nodeId,
      nodeKind: targetKind,
      label: formatSurfaceLabel(surfaceId, targetKind),
      parentNodeId: resolvedParentNodeId,
      childNodeIds: [],
      pageKey,
      sectionKey: section.sectionKey,
      sourceKind: 'declared-surface',
      declaredTargetKind: targetKind,
      surfaceId,
      hidden: section.hidden ?? false,
      locked: section.locked ?? false,
      notes: [
        `Declared ${targetKind} surface ${surfaceId}.`,
        'Current runtime may still edit this through compatibility surfaces rather than true canvas nodes.',
      ],
    });
  }
}

function resolveSectionContentGroups(
  document: BuilderPageDocument,
  section: BuilderSectionNode
): BuilderSectionContentGroupNode[] {
  const pageSceneGroups = getPersistedPageSceneContentGroups(document, section.sectionKey);

  if (pageSceneGroups?.length) {
    return pageSceneGroups;
  }

  if (section.props?.scene?.groups?.length) {
    return section.props.scene.groups;
  }

  return getBuilderSectionContentGroups(section.sectionKey).map((group) => ({
    version: 1 as const,
    nodeId: buildBuilderContentGroupNodeId(section.sectionKey, group.groupKey),
    groupKey: group.groupKey,
    label: group.label,
    surfaceIds: [...(group.surfaceIds ?? [])],
    datasetTargetIds: group.datasetTargetIds ? [...group.datasetTargetIds] : undefined,
    bounds: undefined,
    overrides: undefined,
    measuredBounds: undefined,
    measuredOverrides: undefined,
    constraints: {
      movement: 'section-flow' as const,
      resize: 'bounds-box' as const,
    },
    measuredAt: undefined,
  }));
}

function getPersistedPageSceneContentGroups(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey
): BuilderSectionContentGroupNode[] {
  return getPersistedPageSceneNodes(document, sectionKey)
    .map((node) => ({
      version: 1 as const,
      nodeId: node.nodeId,
      groupKey: node.groupKey,
      label: node.label,
      surfaceIds: [...node.surfaceIds],
      datasetTargetIds: node.datasetTargetIds ? [...node.datasetTargetIds] : undefined,
      bounds: node.bounds ? { ...node.bounds } : node.measuredBounds ? { ...node.measuredBounds } : undefined,
      overrides: node.overrides
        ? Object.fromEntries(
            Object.entries(node.overrides).map(([viewport, bounds]) => [
              viewport,
              bounds ? { ...bounds } : bounds,
            ])
          )
        : node.measuredOverrides
          ? Object.fromEntries(
              Object.entries(node.measuredOverrides).map(([viewport, bounds]) => [
                viewport,
                bounds ? { ...bounds } : bounds,
              ])
            )
        : undefined,
      measuredBounds: node.measuredBounds ? { ...node.measuredBounds } : undefined,
      measuredOverrides: node.measuredOverrides
        ? Object.fromEntries(
            Object.entries(node.measuredOverrides).map(([viewport, bounds]) => [
              viewport,
              bounds ? { ...bounds } : bounds,
            ])
          )
        : undefined,
      constraints: {
        movement: node.constraints.movement,
        resize: node.constraints.resize,
      },
      measuredAt: node.measuredAt,
    }));
}

function getPersistedPageSceneNodes(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey
): BuilderPersistedSceneNode[] {
  const sceneNodes = document.scene?.nodes ?? [];

  return sceneNodes.filter(
    (node): node is BuilderPersistedSceneNode =>
      node.nodeKind === 'content-group' && node.sectionKey === sectionKey
  );
}

function buildSceneNodeId(pageKey: BuilderPageKey, token: string) {
  return `scene:${pageKey}:${sanitizeSceneToken(token)}`;
}

function sanitizeSceneToken(value: string) {
  return value.replace(/[^a-z0-9-_:.]+/gi, '-');
}

function formatSurfaceLabel(surfaceId: string, targetKind: BuilderEditableTargetKind) {
  const readable = surfaceId
    .split(/[-_.]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return readable ? `${readable} ${targetKind}` : targetKind;
}

function formatBounds(bounds: NonNullable<BuilderSectionContentGroupNode['bounds']>) {
  return `${bounds.width}×${bounds.height} at ${bounds.x}, ${bounds.y}`;
}
