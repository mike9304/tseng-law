'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import { buildBuilderPageHref, buildBuilderPageSceneHref } from '@/lib/builder/hrefs';
import type {
  BuilderEditorMode,
  BuilderSitePageSummary,
  BuilderSiteSummary,
  BuilderWorkspaceSummary,
} from '@/lib/builder/site';
import {
  evaluateBuilderSceneReorderDrop,
  filterBuilderSceneVisibleNodeIds,
  flattenBuilderSceneNodeIds,
  getBuilderSceneAncestorNodeIds,
  reorderBuilderSceneNode,
  type BuilderSceneDropEvaluation,
  type BuilderSceneDropPlacement,
  type BuilderSceneDocument,
  type BuilderSceneNode,
  type BuilderSceneSummary,
} from '@/lib/builder/scene';
import type { BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export default function BuilderSceneWorkspaceShell({
  locale,
  pageKey,
  requestedMode,
  workspace,
  site,
  pages,
  scene,
  summary,
  snapshot,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  requestedMode: BuilderEditorMode;
  workspace: BuilderWorkspaceSummary;
  site: BuilderSiteSummary;
  pages: BuilderSitePageSummary[];
  scene: BuilderSceneDocument;
  summary: BuilderSceneSummary;
  snapshot: {
    source: 'draft' | 'published' | 'default';
    revision: number;
    savedAt: string | null;
  };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [sceneState, setSceneState] = useState(scene);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([scene.rootNodeId]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropState, setDropState] = useState<BuilderSceneDropEvaluation | null>(null);

  useEffect(() => {
    setSceneState(scene);
    setSelectedNodeIds([scene.rootNodeId]);
    setHoveredNodeId(null);
    setDraggedNodeId(null);
    setDropState(null);
  }, [scene]);

  const orderedNodeIds = flattenBuilderSceneNodeIds(sceneState);
  const visibleNodeIds = filterBuilderSceneVisibleNodeIds(sceneState, deferredSearchQuery, selectedNodeIds);
  const selectedNodes = selectedNodeIds
    .map((nodeId) => sceneState.nodes[nodeId])
    .filter((node): node is BuilderSceneNode => Boolean(node));
  const primaryNode = selectedNodes[selectedNodes.length - 1] ?? null;
  const breadcrumbNodeIds = primaryNode
    ? [...getBuilderSceneAncestorNodeIds(sceneState, primaryNode.nodeId), primaryNode.nodeId]
    : [];
  const visibleNodeCount = orderedNodeIds.filter((nodeId) => visibleNodeIds.has(nodeId)).length;

  useEffect(() => {
    if (!primaryNode) {
      return;
    }

    const escapedNodeId =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(primaryNode.nodeId)
        : primaryNode.nodeId.replace(/"/g, '\\"');
    const canvasTarget = document.querySelector<HTMLElement>(
      `[data-builder-scene-canvas-node-id="${escapedNodeId}"]`
    );

    canvasTarget?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }, [primaryNode]);

  const selectNode = (nodeId: string, additive = false) => {
    if (!sceneState.nodes[nodeId]) {
      return;
    }

    setSelectedNodeIds((currentNodeIds) => {
      if (!additive) {
        return [nodeId];
      }

      if (currentNodeIds.includes(nodeId)) {
        return currentNodeIds.filter((currentNodeId) => currentNodeId !== nodeId);
      }

      return [...currentNodeIds, nodeId];
    });
  };

  const updateDropState = (
    event: React.DragEvent<HTMLElement>,
    targetNodeId: string,
    fallbackPlacement: BuilderSceneDropPlacement = 'after'
  ) => {
    if (!draggedNodeId) {
      setDropState(null);
      return;
    }

    const placement = resolveDropPlacement(event, fallbackPlacement);
    const evaluation = evaluateBuilderSceneReorderDrop(sceneState, draggedNodeId, targetNodeId, placement);
    setDropState(evaluation);
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, targetNodeId: string) => {
    if (!draggedNodeId) {
      return;
    }

    const placement = resolveDropPlacement(event, 'after');
    const evaluation = evaluateBuilderSceneReorderDrop(sceneState, draggedNodeId, targetNodeId, placement);
    setDropState(evaluation);
    event.preventDefault();

    if (evaluation.valid) {
      setSceneState((currentScene) =>
        reorderBuilderSceneNode(currentScene, draggedNodeId, targetNodeId, placement)
      );
      setSelectedNodeIds([draggedNodeId]);
    }
  };

  const clearDragSession = () => {
    setDraggedNodeId(null);
    setDropState(null);
  };

  return (
    <BuilderWorkspaceFrame
      title="Scene layers foundation"
      description="Searchable layers, generic selection, breadcrumbs, and inspector shell built on the compatibility scene graph."
      activeRail="layers"
      stageUrl={buildBuilderPageSceneHref(locale, pageKey)}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Page entry points', href: `/${locale}/builder` },
        { key: 'layers', label: 'Layers', description: 'Hierarchy and selection', active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media', href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Scene layers</span>
          <span className="builder-stage-pill">Workspace {workspace.name}</span>
          <span className="builder-stage-pill">Site {site.name}</span>
          <span className="builder-stage-pill">
            {requestedMode === 'edit' ? 'Edit-capable page' : 'Preview-only page'}
          </span>
          <span className="builder-stage-pill">{getSelectionLabel(selectedNodes.length)}</span>
        </>
      }
      rightMeta={
        <>
          <strong>{pageKey}</strong>
          <span>
            {scene.adapterMode} · schema v{scene.schemaVersion}
          </span>
        </>
      }
      leftSidebar={
        <div className="builder-scene-sidebar">
          <section className="builder-preview-inspector-card builder-dashboard-sidebar">
            <h2>Page routes</h2>
            <p>Scene graph views exist only for real builder-owned static pages.</p>
            <div className="builder-dashboard-nav-list">
              {pages.map((page) => (
                <Link
                  key={page.pageKey}
                  href={buildBuilderPageSceneHref(locale, page.pageKey)}
                  className={`builder-dashboard-nav-card${page.pageKey === pageKey ? ' is-active' : ''}`}
                >
                  <strong>{page.title}</strong>
                  <span>{page.editable ? 'Edit-capable document' : 'Preview-only document'}</span>
                  <small>{page.sectionCount} sections</small>
                </Link>
              ))}
            </div>
          </section>

          <section className="builder-preview-inspector-card">
            <div className="builder-scene-search-head">
              <div>
                <h2>Layers</h2>
                <p>Search and inspect the compatibility scene hierarchy without pretending live edit parity.</p>
              </div>
              <span className="builder-stage-pill">{visibleNodeCount} visible</span>
            </div>
            <label className="builder-scene-search">
              <span className="builder-scene-search__label">Search layers</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by label, kind, section, surface, or dataset"
              />
            </label>
            <div className="builder-scene-layer-tree" role="tree" aria-label="Scene layers tree">
              <SceneLayersTreeNode
                nodeId={sceneState.rootNodeId}
                scene={sceneState}
                visibleNodeIds={visibleNodeIds}
                selectedNodeIds={selectedNodeIds}
                hoveredNodeId={hoveredNodeId}
                draggedNodeId={draggedNodeId}
                dropState={dropState}
                onHoverNodeIdChange={setHoveredNodeId}
                onSelectNode={selectNode}
                onDragStart={setDraggedNodeId}
                onDragEnd={clearDragSession}
                onDragOverTarget={updateDropState}
                onDropTarget={handleDrop}
                depth={0}
              />
            </div>
          </section>
        </div>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Selection</h2>
            {primaryNode ? (
              <>
                <div className="builder-scene-selection-summary">
                  <span className="builder-stage-pill builder-stage-pill--accent">{primaryNode.nodeKind}</span>
                  <strong>{primaryNode.label}</strong>
                  <span className="builder-stage-pill">{primaryNode.nodeId}</span>
                </div>
                {breadcrumbNodeIds.length > 0 ? (
                  <div className="builder-scene-breadcrumbs" aria-label="Scene breadcrumbs">
                    {breadcrumbNodeIds.map((nodeId, index) => {
                      const node = sceneState.nodes[nodeId];
                      if (!node) {
                        return null;
                      }

                      return (
                        <button
                          key={nodeId}
                          type="button"
                          className={`builder-scene-breadcrumb${
                            primaryNode.nodeId === nodeId ? ' is-active' : ''
                          }`}
                          onClick={() => selectNode(nodeId)}
                        >
                          {node.label}
                          {index < breadcrumbNodeIds.length - 1 ? <span>/</span> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                {selectedNodes.length > 1 ? (
                  <ul className="builder-preview-inspector-notes builder-scene-selection-batch">
                    {selectedNodes.map((node) => (
                      <li key={node.nodeId}>
                        {node.label} · {node.nodeKind}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>No node selected. Choose a node from the layers tree or scene canvas.</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>Inspector shell</h2>
            {primaryNode ? (
              <dl className="builder-preview-inspector-list">
                <div>
                  <dt>Source kind</dt>
                  <dd>{primaryNode.sourceKind}</dd>
                </div>
                <div>
                  <dt>Parent</dt>
                  <dd>{primaryNode.parentNodeId ?? 'None'}</dd>
                </div>
                <div>
                  <dt>Children</dt>
                  <dd>{primaryNode.childNodeIds.length}</dd>
                </div>
                <div>
                  <dt>Section</dt>
                  <dd>{primaryNode.sectionKey ?? 'Not section-bound'}</dd>
                </div>
                <div>
                  <dt>Surface</dt>
                  <dd>{primaryNode.surfaceId ?? 'Not surface-bound'}</dd>
                </div>
                <div>
                  <dt>Dataset</dt>
                  <dd>{primaryNode.datasetId ?? 'Not dataset-bound'}</dd>
                </div>
                <div>
                  <dt>State</dt>
                  <dd>{formatNodeState(primaryNode)}</dd>
                </div>
              </dl>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>The generic inspector shell is live, but no node is selected.</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>Scene summary</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                  <dt>Root</dt>
                <dd>{sceneState.rootNodeId}</dd>
              </div>
              <div>
                <dt>Nodes</dt>
                <dd>{summary.nodeCount}</dd>
              </div>
              <div>
                <dt>Sections</dt>
                <dd>{summary.sectionCount}</dd>
              </div>
              <div>
                <dt>Declared surfaces</dt>
                <dd>{summary.surfaceCount}</dd>
              </div>
              <div>
                <dt>Dataset nodes</dt>
                <dd>{summary.datasetNodeCount}</dd>
              </div>
              <div>
                <dt>Snapshot source</dt>
                <dd>{snapshot.source}</dd>
              </div>
            </dl>
          </section>

          <section className="builder-preview-inspector-card">
            <h2>Foundation scope</h2>
            <ul className="builder-preview-inspector-notes">
              <li>Layers/search/selection/breadcrumbs are now real on the compatibility scene route.</li>
              <li>
                Drag reorder now exists as a local proof surface on the compatibility scene route, but persistence,
                resize, snapping geometry, and property editing parity are still absent.
              </li>
              <li>The current source is still the semantic-section document, not the final persisted scene runtime.</li>
            </ul>
          </section>

          <section className="builder-preview-inspector-card">
            <h2>Drag session</h2>
            {draggedNodeId ? (
              <ul className="builder-preview-inspector-notes">
                <li>Dragging: {draggedNodeId}</li>
                {dropState ? (
                  <li>
                    {dropState.valid
                      ? `Drop ${dropState.placement} ${dropState.targetNodeId}`
                      : `Rejected: ${dropState.reason}`}
                  </li>
                ) : (
                  <li>Move over a sibling node to see a valid or rejected drop target.</li>
                )}
              </ul>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>No drag session active. Drag from layers rows or scene cards.</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>Back links</h2>
            <ul className="builder-preview-inspector-notes">
              <li>
                <Link href={buildBuilderPageHref(locale, pageKey, requestedMode)} className="builder-link-inline">
                  Return to page workspace
                </Link>
              </li>
              <li>
                <Link href={buildBuilderPageHref(locale, pageKey, 'preview')} className="builder-link-inline">
                  Open page preview
                </Link>
              </li>
            </ul>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-canvas-copy builder-scene-shell">
        <div className="builder-dashboard-mode-row">
          <span className="builder-stage-pill builder-stage-pill--accent">Scene graph</span>
          <span className="builder-stage-pill">Source {snapshot.source}</span>
          <span className="builder-stage-pill">Revision v{snapshot.revision}</span>
          <span className="builder-stage-pill">{snapshot.savedAt ?? 'Not persisted yet'}</span>
          <span className="builder-stage-pill">{getSelectionLabel(selectedNodes.length)}</span>
        </div>

        <section className="builder-preview-inspector-card">
          <div className="builder-scene-canvas-head">
            <div>
              <h2>Scene canvas</h2>
              <p>
                This is still a compatibility scene, but the selection shell is now live. Selecting in layers or here
                keeps the inspector and breadcrumbs synchronized.
              </p>
            </div>
            {primaryNode ? (
              <div className="builder-scene-focus-meta">
                <span className="builder-stage-pill builder-stage-pill--accent">{primaryNode.nodeKind}</span>
                <strong>{primaryNode.label}</strong>
              </div>
            ) : null}
          </div>

          <div className="builder-scene-tree builder-scene-tree--canvas">
            <SceneCanvasNode
              nodeId={sceneState.rootNodeId}
              scene={sceneState}
              visibleNodeIds={visibleNodeIds}
              selectedNodeIds={selectedNodeIds}
              hoveredNodeId={hoveredNodeId}
              draggedNodeId={draggedNodeId}
              dropState={dropState}
              onHoverNodeIdChange={setHoveredNodeId}
              onSelectNode={selectNode}
              onDragStart={setDraggedNodeId}
              onDragEnd={clearDragSession}
              onDragOverTarget={updateDropState}
              onDropTarget={handleDrop}
              depth={0}
            />
          </div>
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}

function SceneLayersTreeNode({
  nodeId,
  scene,
  visibleNodeIds,
  selectedNodeIds,
  hoveredNodeId,
  draggedNodeId,
  dropState,
  onHoverNodeIdChange,
  onSelectNode,
  onDragStart,
  onDragEnd,
  onDragOverTarget,
  onDropTarget,
  depth,
}: {
  nodeId: string;
  scene: BuilderSceneDocument;
  visibleNodeIds: Set<string>;
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
  draggedNodeId: string | null;
  dropState: BuilderSceneDropEvaluation | null;
  onHoverNodeIdChange: (nodeId: string | null) => void;
  onSelectNode: (nodeId: string, additive?: boolean) => void;
  onDragStart: (nodeId: string) => void;
  onDragEnd: () => void;
  onDragOverTarget: (
    event: React.DragEvent<HTMLElement>,
    targetNodeId: string,
    fallbackPlacement?: BuilderSceneDropPlacement
  ) => void;
  onDropTarget: (event: React.DragEvent<HTMLElement>, targetNodeId: string) => void;
  depth: number;
}) {
  const node = scene.nodes[nodeId];

  if (!node || !visibleNodeIds.has(nodeId)) {
    return null;
  }

  const isSelected = selectedNodeIds.includes(nodeId);
  const isHovered = hoveredNodeId === nodeId;
  const dragUi = getNodeDragUiState(nodeId, draggedNodeId, dropState);

  return (
    <div className="builder-scene-layer-node" role="treeitem" aria-selected={isSelected}>
      <button
        type="button"
        draggable={node.nodeId !== scene.rootNodeId}
        className={`builder-scene-layer-row${isSelected ? ' is-selected' : ''}${isHovered ? ' is-hovered' : ''}${
          dragUi.isDragging ? ' is-dragging' : ''
        }${dragUi.guideClassName ? ` ${dragUi.guideClassName}` : ''}${dragUi.isRejected ? ' is-drop-rejected' : ''}`}
        style={{ ['--builder-scene-depth' as string]: depth }}
        onClick={(event) => onSelectNode(nodeId, event.metaKey || event.ctrlKey || event.shiftKey)}
        onMouseEnter={() => onHoverNodeIdChange(nodeId)}
        onMouseLeave={() => onHoverNodeIdChange(null)}
        onDragStart={(event) => {
          if (node.nodeId === scene.rootNodeId) {
            event.preventDefault();
            return;
          }

          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', node.nodeId);
          onDragStart(node.nodeId);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(event) => onDragOverTarget(event, nodeId)}
        onDrop={(event) => onDropTarget(event, nodeId)}
      >
        <span className="builder-scene-layer-row__copy">
          <strong>{node.label}</strong>
          <small>{node.nodeKind}</small>
        </span>
        <span className="builder-scene-layer-row__meta">
          {node.hidden ? <span className="builder-stage-pill">hidden</span> : null}
          {node.locked ? <span className="builder-stage-pill builder-stage-pill--locked">locked</span> : null}
          {node.surfaceId ? <span className="builder-stage-pill">surface</span> : null}
          {node.datasetId ? <span className="builder-stage-pill">dataset</span> : null}
        </span>
      </button>
      {node.childNodeIds.length > 0 ? (
        <div role="group" className="builder-scene-layer-children">
          {node.childNodeIds.map((childNodeId) => (
            <SceneLayersTreeNode
              key={childNodeId}
              nodeId={childNodeId}
              scene={scene}
              visibleNodeIds={visibleNodeIds}
              selectedNodeIds={selectedNodeIds}
              hoveredNodeId={hoveredNodeId}
              draggedNodeId={draggedNodeId}
              dropState={dropState}
              onHoverNodeIdChange={onHoverNodeIdChange}
              onSelectNode={onSelectNode}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOverTarget={onDragOverTarget}
              onDropTarget={onDropTarget}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SceneCanvasNode({
  nodeId,
  scene,
  visibleNodeIds,
  selectedNodeIds,
  hoveredNodeId,
  draggedNodeId,
  dropState,
  onHoverNodeIdChange,
  onSelectNode,
  onDragStart,
  onDragEnd,
  onDragOverTarget,
  onDropTarget,
  depth,
}: {
  nodeId: string;
  scene: BuilderSceneDocument;
  visibleNodeIds: Set<string>;
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
  draggedNodeId: string | null;
  dropState: BuilderSceneDropEvaluation | null;
  onHoverNodeIdChange: (nodeId: string | null) => void;
  onSelectNode: (nodeId: string, additive?: boolean) => void;
  onDragStart: (nodeId: string) => void;
  onDragEnd: () => void;
  onDragOverTarget: (
    event: React.DragEvent<HTMLElement>,
    targetNodeId: string,
    fallbackPlacement?: BuilderSceneDropPlacement
  ) => void;
  onDropTarget: (event: React.DragEvent<HTMLElement>, targetNodeId: string) => void;
  depth: number;
}) {
  const node = scene.nodes[nodeId];

  if (!node || !visibleNodeIds.has(nodeId)) {
    return null;
  }

  const isSelected = selectedNodeIds.includes(nodeId);
  const isHovered = hoveredNodeId === nodeId;
  const dragUi = getNodeDragUiState(nodeId, draggedNodeId, dropState);

  return (
    <div className="builder-scene-node" style={{ ['--builder-scene-depth' as string]: depth }}>
      <button
        type="button"
        data-builder-scene-canvas-node-id={node.nodeId}
        draggable={node.nodeId !== scene.rootNodeId}
        className={`builder-scene-node__row${isSelected ? ' is-selected' : ''}${isHovered ? ' is-hovered' : ''}${
          dragUi.isDragging ? ' is-dragging' : ''
        }${dragUi.guideClassName ? ` ${dragUi.guideClassName}` : ''}${dragUi.isRejected ? ' is-drop-rejected' : ''}`}
        onClick={(event) => onSelectNode(nodeId, event.metaKey || event.ctrlKey || event.shiftKey)}
        onMouseEnter={() => onHoverNodeIdChange(nodeId)}
        onMouseLeave={() => onHoverNodeIdChange(null)}
        onDragStart={(event) => {
          if (node.nodeId === scene.rootNodeId) {
            event.preventDefault();
            return;
          }

          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', node.nodeId);
          onDragStart(node.nodeId);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(event) => onDragOverTarget(event, nodeId)}
        onDrop={(event) => onDropTarget(event, nodeId)}
      >
        <span className="builder-stage-pill builder-stage-pill--accent">{node.nodeKind}</span>
        <strong>{node.label}</strong>
        <span className="builder-stage-pill">{node.nodeId}</span>
        {node.sectionKey ? <span className="builder-stage-pill">section {node.sectionKey}</span> : null}
        {node.surfaceId ? <span className="builder-stage-pill">surface {node.surfaceId}</span> : null}
        {node.datasetId ? <span className="builder-stage-pill">dataset {node.datasetId}</span> : null}
        {node.hidden ? <span className="builder-stage-pill">hidden</span> : null}
        {node.locked ? <span className="builder-stage-pill builder-stage-pill--locked">locked</span> : null}
      </button>
      {node.notes.length > 0 ? (
        <ul className="builder-preview-inspector-notes">
          {node.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {node.childNodeIds.length > 0 ? (
        <div className="builder-scene-node__children">
          {node.childNodeIds.map((childNodeId) => (
            <SceneCanvasNode
              key={childNodeId}
              nodeId={childNodeId}
              scene={scene}
              visibleNodeIds={visibleNodeIds}
              selectedNodeIds={selectedNodeIds}
              hoveredNodeId={hoveredNodeId}
              draggedNodeId={draggedNodeId}
              dropState={dropState}
              onHoverNodeIdChange={onHoverNodeIdChange}
              onSelectNode={onSelectNode}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOverTarget={onDragOverTarget}
              onDropTarget={onDropTarget}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatNodeState(node: BuilderSceneNode) {
  if (node.hidden && node.locked) {
    return 'Hidden · locked';
  }

  if (node.hidden) {
    return 'Hidden';
  }

  if (node.locked) {
    return 'Locked';
  }

  return 'Visible · editable state not claimed here';
}

function getSelectionLabel(selectionCount: number) {
  if (selectionCount === 0) {
    return 'No selection';
  }

  if (selectionCount === 1) {
    return '1 node selected';
  }

  return `${selectionCount} nodes selected`;
}

function resolveDropPlacement(
  event: React.DragEvent<HTMLElement>,
  fallbackPlacement: BuilderSceneDropPlacement
): BuilderSceneDropPlacement {
  const bounds = event.currentTarget.getBoundingClientRect();
  const midpoint = bounds.top + bounds.height / 2;
  return event.clientY < midpoint ? 'before' : fallbackPlacement === 'before' ? 'before' : 'after';
}

function getNodeDragUiState(
  nodeId: string,
  draggedNodeId: string | null,
  dropState: BuilderSceneDropEvaluation | null
) {
  const isDragging = draggedNodeId === nodeId;
  const isDropTarget = dropState?.targetNodeId === nodeId;

  return {
    isDragging,
    isRejected: Boolean(isDropTarget && dropState && !dropState.valid),
    guideClassName:
      isDropTarget && dropState?.valid
        ? dropState.placement === 'before'
          ? 'is-drop-before'
          : 'is-drop-after'
        : '',
  };
}
