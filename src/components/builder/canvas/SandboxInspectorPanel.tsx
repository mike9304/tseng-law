'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import A11yPanel from '@/components/builder/canvas/A11yPanel';
import ElementCommentsPanel from '@/components/builder/canvas/ElementCommentsPanel';
import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
import {
  getSandboxInspectorPanelCopy,
  type SandboxInspectorTabId,
} from '@/components/builder/canvas/sandbox-inspector-panel-copy';
import { getSandboxLayersPanelCopy } from '@/components/builder/canvas/sandbox-layers-panel-copy';
import AnimationsTab from '@/components/builder/editor/AnimationsTab';
import ContentTab from '@/components/builder/editor/ContentTab';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import StyleTab from '@/components/builder/editor/StyleTab';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type {
  BuilderCanvasNode,
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import {
  resolveOfficeNodeGroup,
  type OfficeNodeGroup,
} from '@/lib/builder/canvas/office-locations';
import { resolveBuilderCanvasRepeaterQuickEdit } from '@/lib/builder/canvas/repeater-quick-edit';
import { getBuilderBindableTarget } from '@/lib/builder/datasets';
import type { BuilderDatasetTargetId } from '@/lib/builder/types';
import {
  InspectorNotice,
  InspectorSection,
  LabeledRow,
  MixedValueBadge,
} from './InspectorControls';
import {
  InspectorEmptyState,
  renderCompositeSurfaceEditor,
} from './SandboxInspectorPanel.widgets';
import SandboxInspectorLayoutTab from './SandboxInspectorLayoutTab';
import SandboxDataBindingPanel from './SandboxDataBindingPanel';
import SandboxInspectorOfficeQuickEdit from './SandboxInspectorOfficeQuickEdit';
import SandboxInspectorRepeaterQuickEdit from './SandboxInspectorRepeaterQuickEdit';
import SandboxInspectorInteractionsTab from './SandboxInspectorInteractionsTab';
import styles from './SandboxPage.module.css';

const EMPTY_INSPECTOR_NODES: BuilderCanvasNode[] = [];

function resolveOfficeQuickEdit(
  nodesById: Map<string, BuilderCanvasNode>,
  selectedNode: BuilderCanvasNode | null,
): OfficeNodeGroup | null {
  if (!selectedNode || selectedNode.kind !== 'map') return null;
  return resolveOfficeNodeGroup(nodesById, selectedNode);
}

function createRepeaterChildDataBinding(
  node: BuilderCanvasNode,
  targetId: BuilderDatasetTargetId,
): BuilderDataBinding | null {
  const target = getBuilderBindableTarget(targetId);
  const fieldsById = new Map(target.bindableFields.map((field) => [field.fieldId, field] as const));
  const firstTextField = target.bindableFields.find((field) => (field.valueKind ?? 'text') === 'text')?.fieldId;
  const firstImageField = target.bindableFields.find((field) => field.valueKind === 'image')?.fieldId;
  const hrefField = fieldsById.has('href') ? 'href' : target.bindableFields.find((field) => field.valueKind === 'url')?.fieldId;
  const titleField = fieldsById.has('title') ? 'title' : firstTextField;
  const summaryField = fieldsById.has('summary')
    ? 'summary'
    : fieldsById.has('description')
      ? 'description'
      : titleField;
  const fields: BuilderDataBindingFieldMap = {};

  if (node.kind === 'text') {
    if (titleField) fields.text = titleField;
    if (hrefField) fields.href = hrefField;
  } else if (node.kind === 'heading') {
    if (titleField) fields.text = titleField;
  } else if (node.kind === 'image') {
    if (firstImageField) fields.src = firstImageField;
    if (titleField) fields.alt = titleField;
    if (hrefField) fields.href = hrefField;
  } else if (node.kind === 'button') {
    if (titleField) fields.label = titleField;
    if (hrefField) fields.href = hrefField;
  } else if (node.kind === 'gallery') {
    if (firstImageField) fields.src = firstImageField;
    if (titleField) fields.alt = titleField;
    if (summaryField) fields.caption = summaryField;
  } else if (node.kind === 'container' && node.content.layoutMode === 'repeater') {
    if (titleField) fields.title = titleField;
    if (summaryField) fields.description = summaryField;
    if (firstImageField) fields.src = firstImageField;
  }

  return Object.keys(fields).length > 0
    ? {
        targetId,
        recordIndex: 0,
        fields,
      }
    : null;
}

export default function SandboxInspectorPanel({
  onRequestAssetLibrary,
  onRequestImageEditor,
  siteLightboxes = [],
  sitePopups = [],
  sitePages = [],
  canDecomposeCurrentPage = false,
  onDecomposeCurrentPage,
}: {
  onRequestAssetLibrary: () => void;
  onRequestImageEditor?: () => void;
  siteLightboxes?: LinkPickerContext['siteLightboxes'];
  sitePopups?: LinkPickerContext['sitePopups'];
  sitePages?: LinkPickerContext['sitePages'];
  canDecomposeCurrentPage?: boolean;
  onDecomposeCurrentPage?: () => Promise<boolean>;
}) {
  const documentNodes = useBuilderCanvasStore((state) => state.document?.nodes ?? EMPTY_INSPECTOR_NODES);
  const builderLocale = useBuilderCanvasStore((state) => state.document?.locale ?? 'ko');
  const selectedNodeId = useBuilderCanvasStore((state) => state.selectedNodeId);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const selectedSurfaceKey = useBuilderCanvasStore((state) => state.selectedSurfaceKey);
  const setSelectedSurfaceKey = useBuilderCanvasStore((state) => state.setSelectedSurfaceKey);
  const updateNode = useBuilderCanvasStore((state) => state.updateNode);
  const updateNodeContent = useBuilderCanvasStore((state) => state.updateNodeContent);
  const updateNodeStyle = useBuilderCanvasStore((state) => state.updateNodeStyle);
  const alignSelectedNodes = useBuilderCanvasStore((state) => state.alignSelectedNodes);
  const distributeSelectedNodes = useBuilderCanvasStore((state) => state.distributeSelectedNodes);
  const matchSelectedNodesSize = useBuilderCanvasStore((state) => state.matchSelectedNodesSize);
  const duplicateSelectedNode = useBuilderCanvasStore((state) => state.duplicateSelectedNode);
  const bringSelectedNodeForward = useBuilderCanvasStore((state) => state.bringSelectedNodeForward);
  const sendSelectedNodeBackward = useBuilderCanvasStore((state) => state.sendSelectedNodeBackward);
  const bringSelectedNodeToFront = useBuilderCanvasStore((state) => state.bringSelectedNodeToFront);
  const sendSelectedNodeToBack = useBuilderCanvasStore((state) => state.sendSelectedNodeToBack);
  const viewport = useBuilderCanvasStore((state) => state.viewport);
  const setViewport = useBuilderCanvasStore((state) => state.setViewport);
  const updateResponsiveOverride = useBuilderCanvasStore((state) => state.updateResponsiveOverride);
  const resetResponsiveOverride = useBuilderCanvasStore((state) => state.resetResponsiveOverride);
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SandboxInspectorTabId>('layout');
  const [decomposingCurrentPage, setDecomposingCurrentPage] = useState(false);
  const shortcutLabels = useShortcutLabels(['duplicate']);
  const duplicateShortcutTitle = shortcutLabels.get('duplicate')?.title;

  const linkPickerContext = useMemo<LinkPickerContext>(
    () => ({
      siteAnchors: documentNodes
        .map((node) => node.anchorName)
        .filter((anchorName): anchorName is string => Boolean(anchorName)),
      siteLightboxes,
      sitePopups,
      sitePages,
    }),
    [documentNodes, siteLightboxes, sitePages, sitePopups],
  );

  const selectedNode = useMemo(
    () => (selectedNodeId ? nodesById.get(selectedNodeId) ?? null : null),
    [nodesById, selectedNodeId],
  );
  const selectedNodeChildren = useMemo(
    () => selectedNode
      ? (childrenMap[selectedNode.id] ?? [])
          .map((childId) => nodesById.get(childId))
          .filter((node): node is BuilderCanvasNode => Boolean(node))
      : [],
    [childrenMap, nodesById, selectedNode],
  );
  const selectedNodeParentRepeaterBinding = useMemo(() => {
    if (!selectedNode?.parentId || !selectedNode.dataBinding) return undefined;
    const parentNode = nodesById.get(selectedNode.parentId);
    if (
      parentNode?.kind !== 'container'
      || parentNode.content.layoutMode !== 'repeater'
      || parentNode.dataBinding?.targetId !== selectedNode.dataBinding.targetId
    ) {
      return undefined;
    }
    return parentNode.dataBinding;
  }, [nodesById, selectedNode]);

  const singleSelection = selectedNodeIds.length === 1 && selectedNode;
  const inspectorCopy = useMemo(() => getSandboxInspectorPanelCopy(builderLocale), [builderLocale]);
  const inspectorKindLabels = useMemo(() => getSandboxLayersPanelCopy(builderLocale).kindLabels, [builderLocale]);
  const selectedNodeKindLabel = selectedNode ? (inspectorKindLabels[selectedNode.kind] ?? selectedNode.kind) : '';

  useEffect(() => {
    if (!singleSelection) {
      setActiveTab('layout');
    }
  }, [singleSelection, selectedNodeId]);

  useEffect(() => {
    if (selectedSurfaceKey && selectedNode?.kind === 'composite') {
      setActiveTab('content');
    }
  }, [selectedSurfaceKey, selectedNode?.kind]);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setActiveTab('content');

      let attempts = 0;
      const focusHrefInput = () => {
        const input = window.document.querySelector<HTMLInputElement>(
          '[data-builder-href-input="true"]',
        );
        if (input) {
          input.scrollIntoView({ block: 'center', inline: 'nearest' });
          input.focus();
          input.select();
          return;
        }
        attempts += 1;
        if (attempts < 12) {
          window.requestAnimationFrame(focusHrefInput);
        }
      };

      window.requestAnimationFrame(focusHrefInput);
    };
    window.document.addEventListener('builder:focus-href-input', handler);
    return () => window.document.removeEventListener('builder:focus-href-input', handler);
  }, []);

  const compositeSurfaceEditor =
    singleSelection && selectedNode && selectedNode.kind === 'composite' && selectedSurfaceKey
      ? renderCompositeSurfaceEditor({
          node: selectedNode,
          surfaceKey: selectedSurfaceKey,
          surfaceTitle: inspectorCopy.compositeSlotTitle(selectedSurfaceKey),
          closeLabel: inspectorCopy.compositeCloseLabel,
          placeholder: inspectorCopy.compositePlaceholder,
          onUpdate: (overrides) =>
            updateNodeContent(selectedNode.id, {
              ...(selectedNode.content as Record<string, unknown>),
              config: {
                ...((selectedNode.content as { config?: Record<string, unknown> }).config ?? {}),
                overrides,
              },
            }),
          onClose: () => setSelectedSurfaceKey(null),
        })
      : null;
  const showCompositeDecomposeCta = Boolean(
    singleSelection
    && selectedNode?.kind === 'composite'
    && canDecomposeCurrentPage
    && onDecomposeCurrentPage,
  );
  const handleDecomposeCurrentPage = useCallback(async () => {
    if (!onDecomposeCurrentPage || decomposingCurrentPage) return;
    setDecomposingCurrentPage(true);
    try {
      await onDecomposeCurrentPage();
    } finally {
      setDecomposingCurrentPage(false);
    }
  }, [decomposingCurrentPage, onDecomposeCurrentPage]);

  const officeQuickEdit = useMemo(
    () => resolveOfficeQuickEdit(nodesById, singleSelection ? selectedNode : null),
    [nodesById, selectedNode, singleSelection],
  );
  const repeaterQuickEdit = useMemo(
    () =>
      resolveBuilderCanvasRepeaterQuickEdit(
        nodesById,
        singleSelection ? selectedNode?.id : null,
      ),
    [nodesById, selectedNode?.id, singleSelection],
  );

  return (
    <aside className={styles.inspectorPlaceholder} data-builder-inspector-panel="true" aria-label={inspectorCopy.inspectorAriaLabel}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>{inspectorCopy.panelTitle}</span>
          <strong>{singleSelection ? selectedNodeKindLabel : inspectorCopy.canvasSelectionLabel}</strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? inspectorCopy.collapseTitle : inspectorCopy.expandTitle}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? inspectorCopy.hideButtonLabel : inspectorCopy.showButtonLabel}
        </button>
      </header>

      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        {selectedNodeIds.length > 1 ? (
          <>
            <InspectorNotice tone="mixed">
              {inspectorCopy.multiSelectionNotice(selectedNodeIds.length)}
              <MixedValueBadge />
            </InspectorNotice>
            <InspectorSection label={inspectorCopy.commonSectionLabel} title={inspectorCopy.mixedPropertiesTitle}>
              <LabeledRow label={inspectorCopy.widthLabel} hint="px">
                <MixedValueBadge />
              </LabeledRow>
              <LabeledRow label={inspectorCopy.heightLabel} hint="px">
                <MixedValueBadge />
              </LabeledRow>
              <LabeledRow label={inspectorCopy.opacityLabel} hint="%">
                <MixedValueBadge />
              </LabeledRow>
            </InspectorSection>
            <InspectorSection label={inspectorCopy.batchActionsLabel} title={inspectorCopy.multiSelectTitle}>
              <div className={styles.actionGrid}>
                <button type="button" className={styles.actionButton} title={inspectorCopy.duplicateSelectionTitle} onClick={duplicateSelectedNode}>
                  {inspectorCopy.duplicateSelectionLabel}
                </button>
              </div>
              <div className={styles.alignToolbar}>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="left" title={inspectorCopy.alignLeftTitle} onClick={() => alignSelectedNodes('left')}>
                  {inspectorCopy.alignLeftLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="center" title={inspectorCopy.alignCenterTitle} onClick={() => alignSelectedNodes('center')}>
                  {inspectorCopy.alignCenterLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="right" title={inspectorCopy.alignRightTitle} onClick={() => alignSelectedNodes('right')}>
                  {inspectorCopy.alignRightLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="top" title={inspectorCopy.alignTopTitle} onClick={() => alignSelectedNodes('top')}>
                  {inspectorCopy.alignTopLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="middle" title={inspectorCopy.alignMiddleTitle} onClick={() => alignSelectedNodes('middle')}>
                  {inspectorCopy.alignMiddleLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="bottom" title={inspectorCopy.alignBottomTitle} onClick={() => alignSelectedNodes('bottom')}>
                  {inspectorCopy.alignBottomLabel}
                </button>
              </div>
              <div className={styles.alignToolbar}>
                <button type="button" className={styles.toolbarButton} data-builder-distribute-action="horizontal" title={inspectorCopy.distributeHorizontalTitle} onClick={() => distributeSelectedNodes('horizontal')}>
                  {inspectorCopy.distributeHorizontalLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-distribute-action="vertical" title={inspectorCopy.distributeVerticalTitle} onClick={() => distributeSelectedNodes('vertical')}>
                  {inspectorCopy.distributeVerticalLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-match-size-action="width" title={inspectorCopy.matchWidthTitle} onClick={() => matchSelectedNodesSize('width')}>
                  {inspectorCopy.matchWidthLabel}
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-match-size-action="height" title={inspectorCopy.matchHeightTitle} onClick={() => matchSelectedNodesSize('height')}>
                  {inspectorCopy.matchHeightLabel}
                </button>
              </div>
            </InspectorSection>
          </>
        ) : selectedNode ? (
          <>
            {showCompositeDecomposeCta ? (
              <section
                className={styles.compositeDecomposeCta}
                data-builder-composite-decompose-cta="true"
              >
                <div>
                  <strong>{inspectorCopy.compositeDecomposeTitle}</strong>
                  <span>{inspectorCopy.compositeDecomposeBody}</span>
                </div>
                <button
                  type="button"
                  className={styles.compositeDecomposeButton}
                  data-builder-decompose-current-page="true"
                  disabled={decomposingCurrentPage}
                  onClick={() => {
                    void handleDecomposeCurrentPage();
                  }}
                >
                  {decomposingCurrentPage
                    ? inspectorCopy.compositeDecomposePending
                    : inspectorCopy.compositeDecomposeButton}
                </button>
              </section>
            ) : null}
            {compositeSurfaceEditor}
            {repeaterQuickEdit ? (
              <SandboxInspectorRepeaterQuickEdit
                quickEdit={repeaterQuickEdit}
                disabled={selectedNode.locked}
                locale={builderLocale}
                updateNodeContent={updateNodeContent}
              />
            ) : null}
            {(() => {
              const renderTab = (tab: SandboxInspectorTabId) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.inspectorTab} ${activeTab === tab ? styles.inspectorTabActive : ''}`}
                  title={inspectorCopy.tabs[tab].title}
                  onClick={() => setActiveTab(tab)}
                >
                  {inspectorCopy.tabs[tab].label}
                </button>
              );
              return (
                <>
                  <div className={styles.inspectorTabRow}>
                    {(['layout', 'style', 'content'] as const).map(renderTab)}
                  </div>
                  <div className={styles.inspectorTabRow} data-secondary="true">
                    {(['animations', 'interactions', 'a11y', 'seo'] as const).map(renderTab)}
                  </div>
                </>
              );
            })()}

            <section className={`${styles.panelSection} ${styles.panelSectionActivePane}`} key={activeTab}>
              <header className={styles.panelSectionHeader}>
                <span>{inspectorCopy.tabs[activeTab].label}</span>
                <strong>{selectedNodeKindLabel}</strong>
              </header>
              {activeTab === 'layout' ? (
                <SandboxInspectorLayoutTab
                  locale={builderLocale}
                  node={selectedNode}
                  viewport={viewport}
                  setViewport={setViewport}
                  updateNode={updateNode}
                  updateNodeContent={updateNodeContent}
                  updateResponsiveOverride={updateResponsiveOverride}
                  resetResponsiveOverride={resetResponsiveOverride}
                  nodesById={nodesById}
                />
              ) : null}

              {activeTab === 'style' ? (
                <StyleTab
                  node={selectedNode}
                  disabled={selectedNode.locked}
                  locale={builderLocale}
                  onUpdateStyle={(style) => updateNodeStyle(selectedNode.id, style)}
                  onUpdateHoverStyle={(hoverStyle) => {
                    updateNode(selectedNode.id, (node) => {
                      if (!hoverStyle) {
                        const next = { ...node };
                        delete (next as { hoverStyle?: unknown }).hoverStyle;
                        return next;
                      }
                      return {
                        ...node,
                        hoverStyle,
                      };
                    });
                  }}
                />
              ) : null}

              {activeTab === 'content' ? (
                <>
                  {officeQuickEdit ? (
                    <SandboxInspectorOfficeQuickEdit
                      officeQuickEdit={officeQuickEdit}
                      builderLocale={builderLocale}
                      disabled={selectedNode.locked}
                      updateNodeContent={updateNodeContent}
                    />
                  ) : null}
                  {!officeQuickEdit ? (
                    <ContentTab
                      node={selectedNode}
                      locale={builderLocale}
                      disabled={selectedNode.locked}
                      onUpdateContent={(content) => updateNodeContent(selectedNode.id, content)}
                      onRequestAssetLibrary={
                        selectedNode.kind === 'image'
                          ? onRequestAssetLibrary
                          : undefined
                      }
                      onRequestImageEditor={
                        selectedNode.kind === 'image'
                          ? onRequestImageEditor
                          : undefined
                      }
                      linkPickerContext={linkPickerContext}
                    />
                  ) : null}
                  <SandboxDataBindingPanel
                    node={selectedNode}
                    childNodes={selectedNodeChildren}
                    childNodeCount={selectedNodeChildren.length}
                    disabled={selectedNode.locked}
                    locale={builderLocale}
                    previewRecordIndexOverride={selectedNodeParentRepeaterBinding?.recordIndex}
                    onApplyRepeaterChildBindings={(targetId) => {
                      selectedNodeChildren.forEach((childNode) => {
                        const dataBinding = createRepeaterChildDataBinding(childNode, targetId);
                        if (!dataBinding) return;
                        updateNode(childNode.id, (node) => ({ ...node, dataBinding }));
                      });
                    }}
                    onUpdateDataBinding={(dataBinding) => {
                      updateNode(selectedNode.id, (node) => {
                        if (!dataBinding) {
                          const next = { ...node };
                          delete (next as { dataBinding?: unknown }).dataBinding;
                          return next;
                        }
                        return { ...node, dataBinding };
                      });
                    }}
                  />
                </>
              ) : null}

              {activeTab === 'animations' ? (
                <AnimationsTab
                  node={selectedNode}
                  disabled={selectedNode.locked}
                  locale={builderLocale}
                  onUpdateAnimation={(animation) => {
                    updateNode(selectedNode.id, (node) => {
                      if (!animation) {
                        const next = { ...node };
                        delete (next as { animation?: unknown }).animation;
                        return next;
                      }
                      return {
                        ...node,
                        animation,
                      };
                    });
                  }}
                />
              ) : null}

              {activeTab === 'interactions' ? (
                <SandboxInspectorInteractionsTab
                  node={selectedNode}
                  disabled={selectedNode.locked}
                  locale={builderLocale}
                  linkPickerContext={linkPickerContext}
                  onUpdateContent={(content) => updateNodeContent(selectedNode.id, content)}
                />
              ) : null}

              {activeTab === 'a11y' ? (
                <A11yPanel locale={builderLocale} />
              ) : null}

              {activeTab === 'seo' ? (
                <InspectorNotice tone="neutral">
                  {inspectorCopy.seoNotice}
                </InspectorNotice>
              ) : null}

              {!selectedNode.visible ? (
                <p className={styles.inspectorHint}>
                  {inspectorCopy.hiddenNodeHint}
                </p>
              ) : null}
              {selectedNode.locked ? (
                <p className={styles.inspectorHint}>
                  {inspectorCopy.lockedNodeHint}
                </p>
              ) : null}
            </section>

            <section className={styles.panelSection} data-builder-element-comments-section="true">
              <ElementCommentsPanel selectedNodeId={selectedNode.id} locale={builderLocale} />
            </section>

            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <span>{inspectorCopy.zOrderLabel}</span>
                <strong>{inspectorCopy.stackingActionsLabel}</strong>
              </header>
              <div className={styles.actionGrid}>
                <button type="button" className={styles.actionButton} title={inspectorCopy.sendToBackTitle} onClick={sendSelectedNodeToBack} disabled={selectedNode.locked}>
                  {inspectorCopy.sendToBackLabel}
                </button>
                <button type="button" className={styles.actionButton} title={inspectorCopy.sendBackwardTitle} onClick={sendSelectedNodeBackward} disabled={selectedNode.locked}>
                  {inspectorCopy.sendBackwardLabel}
                </button>
                <button type="button" className={styles.actionButton} title={inspectorCopy.bringForwardTitle} onClick={bringSelectedNodeForward} disabled={selectedNode.locked}>
                  {inspectorCopy.bringForwardLabel}
                </button>
                <button type="button" className={styles.actionButton} title={inspectorCopy.bringToFrontTitle} onClick={bringSelectedNodeToFront} disabled={selectedNode.locked}>
                  {inspectorCopy.bringToFrontLabel}
                </button>
                <button type="button" className={styles.actionButton} title={inspectorCopy.duplicateTitle(duplicateShortcutTitle)} onClick={duplicateSelectedNode} disabled={selectedNode.locked}>
                  {inspectorCopy.duplicateLabel}
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <InspectorEmptyState
              title={inspectorCopy.emptyStateTitle}
              body={inspectorCopy.emptyStateBody}
              clearSelectionLabel={inspectorCopy.emptyStateClearSelectionLabel}
            />
          </>
        )}
      </div>
    </aside>
  );
}
