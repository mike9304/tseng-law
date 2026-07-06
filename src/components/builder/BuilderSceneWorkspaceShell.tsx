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
import { getBuilderWorkspaceCopy } from '@/lib/builder/workspace-copy';
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
  const copy = getBuilderWorkspaceCopy(locale);
  const sceneCopy = getSceneWorkspaceCopy(locale);
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
      locale={locale}
      title={sceneCopy.routeTitle}
      description={sceneCopy.routeDescription}
      activeRail="layers"
      stageUrl={buildBuilderPageSceneHref(locale, pageKey)}
      railItems={[
        { key: 'pages', label: copy.pagesLabel, description: copy.pagesDescription, href: `/${locale}/builder` },
        { key: 'layers', label: copy.sceneLayersLabel, description: copy.sceneSidebarDescription, active: true },
        { key: 'assets', label: copy.assetsLabel, description: copy.assetsDescription, href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{sceneCopy.sceneLayersPill}</span>
          <span className="builder-stage-pill">
            {sceneCopy.workspaceLabel} {workspace.name}
          </span>
          <span className="builder-stage-pill">
            {sceneCopy.siteLabel} {site.name}
          </span>
          <span className="builder-stage-pill">
            {sceneCopy.pageModeLabel[requestedMode]}
          </span>
          <span className="builder-stage-pill">{getSelectionLabel(sceneCopy, selectedNodes.length)}</span>
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
            <h2>{copy.sceneSidebarTitle}</h2>
            <p>{copy.sceneSidebarDescription}</p>
            <div className="builder-dashboard-nav-list">
              {pages.map((page) => (
                <Link
                  key={page.pageKey}
                  href={buildBuilderPageSceneHref(locale, page.pageKey)}
                  className={`builder-dashboard-nav-card${page.pageKey === pageKey ? ' is-active' : ''}`}
                >
                  <strong>{page.title}</strong>
                  <span>{page.editable ? sceneCopy.editableDocumentLabel : sceneCopy.previewOnlyDocumentLabel}</span>
                  <small>
                    {page.sectionCount} {sceneCopy.sectionsLabel}
                  </small>
                </Link>
              ))}
            </div>
          </section>

          <section className="builder-preview-inspector-card">
            <div className="builder-scene-search-head">
              <div>
                <h2>{copy.sceneLayersLabel}</h2>
                <p>{copy.sceneSidebarDescription}</p>
              </div>
              <span className="builder-stage-pill">
                {visibleNodeCount} {sceneCopy.visibleLabel}
              </span>
            </div>
            <label className="builder-scene-search">
              <span className="builder-scene-search__label">{copy.sceneLayersLabel}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  sceneCopy.searchPlaceholder
                }
              />
            </label>
            <div className="builder-scene-layer-tree" role="tree" aria-label={sceneCopy.layersTreeAriaLabel}>
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
                copy={sceneCopy}
              />
            </div>
          </section>
        </div>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.selectionTitle}</h2>
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
                <li>{sceneCopy.noNodeSelectedLabel}</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.inspectorTitle}</h2>
            {primaryNode ? (
              <dl className="builder-preview-inspector-list">
                <div>
                  <dt>{sceneCopy.sourceKindLabel}</dt>
                  <dd>{primaryNode.sourceKind}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.parentLabel}</dt>
                  <dd>{primaryNode.parentNodeId ?? sceneCopy.noneLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.childrenLabel}</dt>
                  <dd>{primaryNode.childNodeIds.length}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.sectionLabel}</dt>
                  <dd>{primaryNode.sectionKey ?? sceneCopy.notSectionBoundLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.surfaceLabel}</dt>
                  <dd>{primaryNode.surfaceId ?? sceneCopy.notSurfaceBoundLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.datasetLabel}</dt>
                  <dd>{primaryNode.datasetId ?? sceneCopy.notDatasetBoundLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.datasetTargetLabel}</dt>
                  <dd>{primaryNode.datasetTargetId ?? sceneCopy.notRepeaterTargetLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.collectionLabel}</dt>
                  <dd>{primaryNode.datasetCollectionId ?? sceneCopy.notCollectionBoundLabel}</dd>
                </div>
                <div>
                  <dt>{sceneCopy.repeaterPreviewLabel}</dt>
                  <dd>
                    {primaryNode.repeaterItems?.length
                      ? sceneCopy.recordsLabel(primaryNode.repeaterItems.length)
                      : sceneCopy.noPreviewRecordsLabel}
                  </dd>
                </div>
                <div>
                  <dt>{sceneCopy.stateLabel}</dt>
                  <dd>{formatNodeState(locale, primaryNode)}</dd>
                </div>
              </dl>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>{sceneCopy.noInspectorSelectionLabel}</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.sceneSummaryTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{sceneCopy.rootLabel}</dt>
                <dd>{sceneState.rootNodeId}</dd>
              </div>
              <div>
                <dt>{sceneCopy.nodesLabel}</dt>
                <dd>{summary.nodeCount}</dd>
              </div>
              <div>
                <dt>{sceneCopy.sectionsLabel}</dt>
                <dd>{summary.sectionCount}</dd>
              </div>
              <div>
                <dt>{sceneCopy.declaredSurfacesLabel}</dt>
                <dd>{summary.surfaceCount}</dd>
              </div>
              <div>
                <dt>{sceneCopy.datasetNodesLabel}</dt>
                <dd>{summary.datasetNodeCount}</dd>
              </div>
              <div>
                <dt>{sceneCopy.snapshotSourceLabel}</dt>
                <dd>{snapshot.source}</dd>
              </div>
            </dl>
          </section>

          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.foundationScopeTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {sceneCopy.foundationScopeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.dragSessionTitle}</h2>
            {draggedNodeId ? (
              <ul className="builder-preview-inspector-notes">
                <li>
                  {sceneCopy.draggingLabel}: {draggedNodeId}
                </li>
                {dropState ? (
                  <li>
                    {dropState.valid
                      ? sceneCopy.dropLabel(dropState.placement, dropState.targetNodeId)
                      : sceneCopy.rejectedLabel(dropState.reason)}
                  </li>
                ) : (
                  <li>{sceneCopy.dragHintLabel}</li>
                )}
              </ul>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>{sceneCopy.noDragSessionLabel}</li>
              </ul>
            )}
          </section>

          <section className="builder-preview-inspector-card">
            <h2>{sceneCopy.backLinksTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              <li>
                <Link href={buildBuilderPageHref(locale, pageKey, requestedMode)} className="builder-link-inline">
                  {sceneCopy.returnToPageWorkspaceLabel}
                </Link>
              </li>
              <li>
                <Link href={buildBuilderPageHref(locale, pageKey, 'preview')} className="builder-link-inline">
                  {sceneCopy.openPagePreviewLabel}
                </Link>
              </li>
            </ul>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-canvas-copy builder-scene-shell">
        <div className="builder-dashboard-mode-row">
          <span className="builder-stage-pill builder-stage-pill--accent">{sceneCopy.sceneGraphLabel}</span>
          <span className="builder-stage-pill">
            {sceneCopy.sourceLabel} {snapshot.source}
          </span>
          <span className="builder-stage-pill">
            {sceneCopy.revisionLabel} v{snapshot.revision}
          </span>
          <span className="builder-stage-pill">{snapshot.savedAt ?? sceneCopy.notPersistedLabel}</span>
          <span className="builder-stage-pill">{getSelectionLabel(sceneCopy, selectedNodes.length)}</span>
        </div>

        <section className="builder-preview-inspector-card">
          <div className="builder-scene-canvas-head">
            <div>
              <h2>{sceneCopy.sceneCanvasTitle}</h2>
              <p>{sceneCopy.sceneCanvasDescription}</p>
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
              copy={sceneCopy}
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
  copy,
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
  copy: ReturnType<typeof getSceneWorkspaceCopy>;
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
          {node.hidden ? <span className="builder-stage-pill">{copy.hiddenLabel}</span> : null}
          {node.locked ? <span className="builder-stage-pill builder-stage-pill--locked">{copy.lockedLabel}</span> : null}
          {node.surfaceId ? <span className="builder-stage-pill">{copy.surfaceBadgeLabel}</span> : null}
          {node.datasetId ? <span className="builder-stage-pill">{copy.datasetBadgeLabel}</span> : null}
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
              copy={copy}
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
  copy,
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
  copy: ReturnType<typeof getSceneWorkspaceCopy>;
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
        {node.sectionKey ? <span className="builder-stage-pill">{copy.sectionPrefix} {node.sectionKey}</span> : null}
        {node.surfaceId ? <span className="builder-stage-pill">{copy.surfacePrefix} {node.surfaceId}</span> : null}
        {node.datasetId ? <span className="builder-stage-pill">{copy.datasetPrefix} {node.datasetId}</span> : null}
        {node.hidden ? <span className="builder-stage-pill">{copy.hiddenLabel}</span> : null}
        {node.locked ? <span className="builder-stage-pill builder-stage-pill--locked">{copy.lockedLabel}</span> : null}
      </button>
      {node.notes.length > 0 ? (
        <ul className="builder-preview-inspector-notes">
          {node.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {node.repeaterItems?.length ? (
        <div className="builder-dashboard-page-list">
          {node.repeaterItems.slice(0, 6).map((item) => (
            <article key={item.itemId} className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
                <span className="builder-stage-pill">{copy.repeaterItemLabel}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{item.itemId}</span>
                <span>{item.href}</span>
              </div>
            </article>
          ))}
        </div>
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
              copy={copy}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatNodeState(locale: Locale, node: BuilderSceneNode) {
  if (node.hidden && node.locked) {
    return locale === 'ko' ? '숨김 · 잠김' : locale === 'zh-hant' ? '隱藏 · 鎖定' : 'Hidden · locked';
  }

  if (node.hidden) {
    return locale === 'ko' ? '숨김' : locale === 'zh-hant' ? '隱藏' : 'Hidden';
  }

  if (node.locked) {
    return locale === 'ko' ? '잠김' : locale === 'zh-hant' ? '鎖定' : 'Locked';
  }

  return locale === 'ko'
    ? '표시됨 · 편집 상태는 여기서 선언되지 않음'
    : locale === 'zh-hant'
      ? '可見 · 此處未宣告可編輯狀態'
      : 'Visible · editable state not claimed here';
}

function getSceneWorkspaceCopy(locale: Locale) {
  return {
    routeTitle: locale === 'ko' ? '페이지 경로 장면' : locale === 'zh-hant' ? '頁面路由場景' : 'Page routes scene',
    routeDescription:
      locale === 'ko'
        ? '검색 가능한 레이어, 일반 선택, 브레드크럼, 검사기 셸은 호환 scene graph 위에 구축됩니다.'
        : locale === 'zh-hant'
          ? '可搜尋圖層、一般選取、麵包屑與檢視面板都建立在相容的 scene graph 上。'
          : 'Searchable layers, generic selection, breadcrumbs, and inspector shell built on the compatibility scene graph.',
    sceneLayersPill: locale === 'ko' ? 'Scene 레이어' : locale === 'zh-hant' ? 'Scene 圖層' : 'Scene layers',
    workspaceLabel: locale === 'ko' ? '작업공간' : locale === 'zh-hant' ? '工作區' : 'Workspace',
    siteLabel: locale === 'ko' ? '사이트' : locale === 'zh-hant' ? '網站' : 'Site',
    pageModeLabel:
      locale === 'ko'
        ? { edit: '편집 가능 페이지', preview: '미리보기 전용 페이지', 'publish-review': '게시 검토 페이지' }
        : locale === 'zh-hant'
          ? { edit: '可編輯頁面', preview: '僅供預覽頁面', 'publish-review': '發佈審查頁面' }
          : { edit: 'Edit-capable page', preview: 'Preview-only page', 'publish-review': 'Publish-review page' },
    editableDocumentLabel:
      locale === 'ko' ? '편집 가능 문서' : locale === 'zh-hant' ? '可編輯文件' : 'Edit-capable document',
    previewOnlyDocumentLabel:
      locale === 'ko' ? '미리보기 전용 문서' : locale === 'zh-hant' ? '僅供預覽文件' : 'Preview-only document',
    sectionsLabel: locale === 'ko' ? '섹션' : locale === 'zh-hant' ? '區段' : 'sections',
    visibleLabel: locale === 'ko' ? '표시됨' : locale === 'zh-hant' ? '可見' : 'visible',
    searchPlaceholder:
      locale === 'ko'
        ? '레이블, 종류, 섹션, 표면 또는 데이터셋으로 검색'
        : locale === 'zh-hant'
          ? '依標籤、類型、區段、表面或資料集搜尋'
          : 'Search by label, kind, section, surface, or dataset',
    layersTreeAriaLabel:
      locale === 'ko' ? 'Scene 레이어 트리' : locale === 'zh-hant' ? 'Scene 圖層樹' : 'Scene layers tree',
    selectionTitle: locale === 'ko' ? '선택' : locale === 'zh-hant' ? '選取' : 'Selection',
    noNodeSelectedLabel:
      locale === 'ko'
        ? '선택된 노드가 없습니다. 레이어 트리나 scene canvas에서 노드를 선택하세요.'
        : locale === 'zh-hant'
          ? '目前沒有選取節點。請從圖層樹或 scene 畫布選擇一個節點。'
          : 'No node selected. Choose a node from the layers tree or scene canvas.',
    inspectorTitle: locale === 'ko' ? '검사기 셸' : locale === 'zh-hant' ? '檢視面板殼層' : 'Inspector shell',
    sourceKindLabel: locale === 'ko' ? '소스 종류' : locale === 'zh-hant' ? '來源種類' : 'Source kind',
    parentLabel: locale === 'ko' ? '부모' : locale === 'zh-hant' ? '父節點' : 'Parent',
    noneLabel: locale === 'ko' ? '없음' : locale === 'zh-hant' ? '無' : 'None',
    childrenLabel: locale === 'ko' ? '자식' : locale === 'zh-hant' ? '子節點' : 'Children',
    sectionLabel: locale === 'ko' ? '섹션' : locale === 'zh-hant' ? '區段' : 'Section',
    surfaceLabel: locale === 'ko' ? '표면' : locale === 'zh-hant' ? '表面' : 'Surface',
    datasetLabel: locale === 'ko' ? '데이터셋' : locale === 'zh-hant' ? '資料集' : 'Dataset',
    datasetTargetLabel: locale === 'ko' ? '데이터셋 대상' : locale === 'zh-hant' ? '資料集目標' : 'Dataset target',
    collectionLabel: locale === 'ko' ? '컬렉션' : locale === 'zh-hant' ? '集合' : 'Collection',
    repeaterPreviewLabel: locale === 'ko' ? '반복기 미리보기' : locale === 'zh-hant' ? '重複器預覽' : 'Repeater preview',
    stateLabel: locale === 'ko' ? '상태' : locale === 'zh-hant' ? '狀態' : 'State',
    notSectionBoundLabel:
      locale === 'ko' ? '섹션에 묶이지 않음' : locale === 'zh-hant' ? '未綁定區段' : 'Not section-bound',
    notSurfaceBoundLabel:
      locale === 'ko' ? '표면에 묶이지 않음' : locale === 'zh-hant' ? '未綁定表面' : 'Not surface-bound',
    notDatasetBoundLabel:
      locale === 'ko' ? '데이터셋에 묶이지 않음' : locale === 'zh-hant' ? '未綁定資料集' : 'Not dataset-bound',
    notRepeaterTargetLabel:
      locale === 'ko' ? '반복기 대상 아님' : locale === 'zh-hant' ? '非重複器目標' : 'Not a repeater target',
    notCollectionBoundLabel:
      locale === 'ko' ? '컬렉션에 묶이지 않음' : locale === 'zh-hant' ? '未綁定集合' : 'Not collection-bound',
    recordsLabel: (count: number) => (locale === 'ko' ? `${count}개 레코드` : locale === 'zh-hant' ? `${count} 筆記錄` : `${count} records`),
    noPreviewRecordsLabel:
      locale === 'ko' ? '미리보기 레코드 없음' : locale === 'zh-hant' ? '沒有預覽記錄' : 'No preview records',
    noInspectorSelectionLabel:
      locale === 'ko'
        ? '일반 검사기 셸은 실행 중이지만 선택된 노드가 없습니다.'
        : locale === 'zh-hant'
          ? '一般檢視面板殼層已啟動，但目前沒有選取節點。'
          : 'The generic inspector shell is live, but no node is selected.',
    sceneSummaryTitle: locale === 'ko' ? 'Scene 요약' : locale === 'zh-hant' ? 'Scene 摘要' : 'Scene summary',
    rootLabel: locale === 'ko' ? '루트' : locale === 'zh-hant' ? '根節點' : 'Root',
    nodesLabel: locale === 'ko' ? '노드' : locale === 'zh-hant' ? '節點' : 'Nodes',
    declaredSurfacesLabel: locale === 'ko' ? '선언된 표면' : locale === 'zh-hant' ? '已宣告表面' : 'Declared surfaces',
    datasetNodesLabel: locale === 'ko' ? '데이터셋 노드' : locale === 'zh-hant' ? '資料集節點' : 'Dataset nodes',
    snapshotSourceLabel: locale === 'ko' ? '스냅샷 출처' : locale === 'zh-hant' ? '快照來源' : 'Snapshot source',
    foundationScopeTitle: locale === 'ko' ? '기초 범위' : locale === 'zh-hant' ? '基礎範圍' : 'Foundation scope',
    foundationScopeItems:
      locale === 'ko'
        ? [
            '레이어/검색/선택/브레드크럼은 이제 호환 scene route에서 실제로 동작합니다.',
            '드래그 재정렬은 호환 scene route에서 로컬 증명 표면으로 존재하지만, 지속성, 리사이즈, 스냅팅 기하, 속성 편집 패리티는 아직 없습니다.',
            '현재 소스는 아직 최종 지속 scene runtime이 아니라 semantic-section 문서입니다.',
          ]
        : locale === 'zh-hant'
          ? [
              '圖層／搜尋／選取／麵包屑現在已在相容的 scene 路由上真實可用。',
              '拖曳排序已作為相容 scene 路由上的本地證明表面，但持久化、縮放、吸附幾何與屬性編輯 parity 仍未提供。',
              '目前來源仍是 semantic-section 文件，而不是最終持久化的 scene runtime。',
            ]
          : [
              'Layers/search/selection/breadcrumbs are now real on the compatibility scene route.',
              'Drag reorder now exists as a local proof surface on the compatibility scene route, but persistence, resize, snapping geometry, and property editing parity are still absent.',
              'The current source is still the semantic-section document, not the final persisted scene runtime.',
            ],
    dragSessionTitle: locale === 'ko' ? '드래그 세션' : locale === 'zh-hant' ? '拖曳工作階段' : 'Drag session',
    draggingLabel: locale === 'ko' ? '드래그 중' : locale === 'zh-hant' ? '拖曳中' : 'Dragging',
    dropLabel: (placement: string, targetNodeId: string) =>
      locale === 'ko'
        ? `드롭 ${placement} ${targetNodeId}`
        : locale === 'zh-hant'
          ? `放置 ${placement} ${targetNodeId}`
          : `Drop ${placement} ${targetNodeId}`,
    rejectedLabel: (reason: string) =>
      locale === 'ko' ? `거부됨: ${reason}` : locale === 'zh-hant' ? `已拒絕：${reason}` : `Rejected: ${reason}`,
    dragHintLabel:
      locale === 'ko'
        ? '유효하거나 거부된 드롭 대상을 보려면 형제 노드 위로 이동하세요.'
        : locale === 'zh-hant'
          ? '將滑鼠移到同層節點上即可看到有效或被拒絕的放置目標。'
          : 'Move over a sibling node to see a valid or rejected drop target.',
    noDragSessionLabel:
      locale === 'ko' ? '활성 드래그 세션이 없습니다. 레이어 행이나 scene 카드에서 드래그하세요.' : locale === 'zh-hant' ? '沒有作用中的拖曳工作階段。請從圖層列或 scene 卡片拖曳。' : 'No drag session active. Drag from layers rows or scene cards.',
    backLinksTitle: locale === 'ko' ? '되돌아가기 링크' : locale === 'zh-hant' ? '返回連結' : 'Back links',
    returnToPageWorkspaceLabel:
      locale === 'ko' ? '페이지 작업공간으로 돌아가기' : locale === 'zh-hant' ? '返回頁面工作區' : 'Return to page workspace',
    openPagePreviewLabel:
      locale === 'ko' ? '페이지 미리보기 열기' : locale === 'zh-hant' ? '開啟頁面預覽' : 'Open page preview',
    sceneGraphLabel: locale === 'ko' ? '장면 그래프' : locale === 'zh-hant' ? '場景圖' : 'Scene graph',
    sourceLabel: locale === 'ko' ? '출처' : locale === 'zh-hant' ? '來源' : 'Source',
    revisionLabel: locale === 'ko' ? '리비전' : locale === 'zh-hant' ? '修訂版' : 'Revision',
    notPersistedLabel: locale === 'ko' ? '아직 지속 저장되지 않음' : locale === 'zh-hant' ? '尚未持久化' : 'Not persisted yet',
    sceneCanvasTitle: locale === 'ko' ? 'Scene 캔버스' : locale === 'zh-hant' ? 'Scene 畫布' : 'Scene canvas',
    sceneCanvasDescription:
      locale === 'ko'
        ? '이것은 아직 호환 scene이지만 선택 셸은 이제 실행 중입니다. 레이어 또는 여기에서 선택하면 검사기와 브레드크럼이 동기화됩니다.'
        : locale === 'zh-hant'
          ? '這仍然是相容 scene，但選取殼層現在已啟動。在圖層或此處選取會讓檢視面板與麵包屑保持同步。'
          : 'This is still a compatibility scene, but the selection shell is now live. Selecting in layers or here keeps the inspector and breadcrumbs synchronized.',
    hiddenLabel: locale === 'ko' ? '숨김' : locale === 'zh-hant' ? '隱藏' : 'hidden',
    lockedLabel: locale === 'ko' ? '잠김' : locale === 'zh-hant' ? '鎖定' : 'locked',
    surfaceBadgeLabel: locale === 'ko' ? '표면' : locale === 'zh-hant' ? '表面' : 'surface',
    datasetBadgeLabel: locale === 'ko' ? '데이터셋' : locale === 'zh-hant' ? '資料集' : 'dataset',
    sectionPrefix: locale === 'ko' ? '섹션' : locale === 'zh-hant' ? '區段' : 'section',
    surfacePrefix: locale === 'ko' ? '표면' : locale === 'zh-hant' ? '表面' : 'surface',
    datasetPrefix: locale === 'ko' ? '데이터셋' : locale === 'zh-hant' ? '資料集' : 'dataset',
    repeaterItemLabel: locale === 'ko' ? '반복기 항목' : locale === 'zh-hant' ? '重複器項目' : 'Repeater item',
    noSelectionLabel: locale === 'ko' ? '선택 없음' : locale === 'zh-hant' ? '未選取' : 'No selection',
    oneSelectionLabel: locale === 'ko' ? '노드 1개 선택됨' : locale === 'zh-hant' ? '已選取 1 個節點' : '1 node selected',
    manySelectionsLabel: (count: number) =>
      locale === 'ko' ? `${count}개 노드 선택됨` : locale === 'zh-hant' ? `${count} 個節點已選取` : `${count} nodes selected`,
  } as const;
}

function getSelectionLabel(copy: ReturnType<typeof getSceneWorkspaceCopy>, selectionCount: number) {
  if (selectionCount === 0) {
    return copy.noSelectionLabel;
  }

  if (selectionCount === 1) {
    return copy.oneSelectionLabel;
  }

  return copy.manySelectionsLabel(selectionCount);
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
