'use client';

import { useEffect, useMemo, useState } from 'react';
import A11yPanel from '@/components/builder/canvas/A11yPanel';
import ElementCommentsPanel from '@/components/builder/canvas/ElementCommentsPanel';
import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
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
import styles from './SandboxPage.module.css';

function resolveOfficeQuickEdit(nodes: BuilderCanvasNode[], selectedNode: BuilderCanvasNode | null): OfficeNodeGroup | null {
  if (!selectedNode || selectedNode.kind !== 'map') return null;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return resolveOfficeNodeGroup(byId, selectedNode);
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
  sitePages = [],
}: {
  onRequestAssetLibrary: () => void;
  onRequestImageEditor?: () => void;
  siteLightboxes?: LinkPickerContext['siteLightboxes'];
  sitePages?: LinkPickerContext['sitePages'];
}) {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    selectedSurfaceKey,
    setSelectedSurfaceKey,
    updateNode,
    updateNodeContent,
    updateNodeStyle,
    alignSelectedNodes,
    distributeSelectedNodes,
    matchSelectedNodesSize,
    duplicateSelectedNode,
    bringSelectedNodeForward,
    sendSelectedNodeBackward,
    bringSelectedNodeToFront,
    sendSelectedNodeToBack,
    viewport,
    setViewport,
    updateResponsiveOverride,
    resetResponsiveOverride,
    nodesById,
    childrenMap,
  } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'content' | 'animations' | 'a11y' | 'seo'>('layout');
  const shortcutLabels = useShortcutLabels(['duplicate']);
  const duplicateShortcutTitle = shortcutLabels.get('duplicate')?.title;

  const linkPickerContext = useMemo<LinkPickerContext>(
    () => ({
      siteAnchors: (document?.nodes ?? [])
        .map((node) => node.anchorName)
        .filter((anchorName): anchorName is string => Boolean(anchorName)),
      siteLightboxes,
      sitePages,
    }),
    [document?.nodes, siteLightboxes, sitePages],
  );

  const selectedNode = useMemo(
    () => document?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document?.nodes, selectedNodeId],
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
  const builderLocale = document?.locale ?? 'ko';

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

  const officeQuickEdit = useMemo(
    () => resolveOfficeQuickEdit(document?.nodes ?? [], singleSelection ? selectedNode : null),
    [document?.nodes, selectedNode, singleSelection],
  );
  const repeaterQuickEdit = useMemo(
    () =>
      resolveBuilderCanvasRepeaterQuickEdit(
        document?.nodes ?? [],
        singleSelection ? selectedNode?.id : null,
      ),
    [document?.nodes, selectedNode?.id, singleSelection],
  );

  return (
    <aside className={styles.inspectorPlaceholder} data-builder-inspector-panel="true" aria-label="Inspector panel">
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Inspector</span>
          <strong>{singleSelection ? `${selectedNode.kind}` : '캔버스'}</strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '인스펙터 접기' : '인스펙터 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>

      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        {selectedNodeIds.length > 1 ? (
          <>
            <InspectorNotice tone="mixed">
              {selectedNodeIds.length}개 node 가 선택됐습니다. batch duplicate 와 정렬 툴바를 지원합니다.
              <MixedValueBadge />
            </InspectorNotice>
            <InspectorSection label="Common" title="Mixed properties">
              <LabeledRow label="Width" hint="px">
                <MixedValueBadge />
              </LabeledRow>
              <LabeledRow label="Height" hint="px">
                <MixedValueBadge />
              </LabeledRow>
              <LabeledRow label="Opacity" hint="%">
                <MixedValueBadge />
              </LabeledRow>
            </InspectorSection>
            <InspectorSection label="Batch actions" title="Multi-select">
              <div className={styles.actionGrid}>
                <button type="button" className={styles.actionButton} title="선택된 노드 모두 복제" onClick={duplicateSelectedNode}>
                  Duplicate selection
                </button>
              </div>
              <div className={styles.alignToolbar}>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="left" title="왼쪽 정렬" onClick={() => alignSelectedNodes('left')}>
                  Left
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="center" title="가운데 정렬" onClick={() => alignSelectedNodes('center')}>
                  Center
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="right" title="오른쪽 정렬" onClick={() => alignSelectedNodes('right')}>
                  Right
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="top" title="상단 정렬" onClick={() => alignSelectedNodes('top')}>
                  Top
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="middle" title="중앙 정렬" onClick={() => alignSelectedNodes('middle')}>
                  Middle
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-align-action="bottom" title="하단 정렬" onClick={() => alignSelectedNodes('bottom')}>
                  Bottom
                </button>
              </div>
              <div className={styles.alignToolbar}>
                <button type="button" className={styles.toolbarButton} data-builder-distribute-action="horizontal" title="가로 간격 분배" onClick={() => distributeSelectedNodes('horizontal')}>
                  Distribute H
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-distribute-action="vertical" title="세로 간격 분배" onClick={() => distributeSelectedNodes('vertical')}>
                  Distribute V
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-match-size-action="width" title="첫 기준 너비에 맞춤" onClick={() => matchSelectedNodesSize('width')}>
                  Match W
                </button>
                <button type="button" className={styles.toolbarButton} data-builder-match-size-action="height" title="첫 기준 높이에 맞춤" onClick={() => matchSelectedNodesSize('height')}>
                  Match H
                </button>
              </div>
            </InspectorSection>
          </>
        ) : selectedNode ? (
          <>
            {compositeSurfaceEditor}
            {repeaterQuickEdit ? (
              <SandboxInspectorRepeaterQuickEdit
                quickEdit={repeaterQuickEdit}
                disabled={selectedNode.locked}
                updateNodeContent={updateNodeContent}
              />
            ) : null}
            {(() => {
              const tabTitles = {
                layout: 'x/y/w/h, 회전, lock/hidden 설정',
                style: '배경, 테두리, 그림자, 투명도 설정',
                content: '텍스트, 이미지 등 콘텐츠 편집',
                animations: 'Entrance, scroll, hover 애니메이션 설정',
                a11y: '접근성 검사',
                seo: '페이지 SEO 패널 안내',
              } as const;
              const renderTab = (tab: typeof activeTab) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.inspectorTab} ${activeTab === tab ? styles.inspectorTabActive : ''}`}
                  title={tabTitles[tab]}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              );
              return (
                <>
                  <div className={styles.inspectorTabRow}>
                    {(['layout', 'style', 'content'] as const).map(renderTab)}
                  </div>
                  <div className={styles.inspectorTabRow} data-secondary="true">
                    {(['animations', 'a11y', 'seo'] as const).map(renderTab)}
                  </div>
                </>
              );
            })()}

            <section className={styles.panelSection} key={activeTab} style={{ animation: 'fadeIn 150ms ease' }}>
              <header className={styles.panelSectionHeader}>
                <span>{activeTab}</span>
                <strong>{selectedNode.kind}</strong>
              </header>
              {activeTab === 'layout' ? (
                <SandboxInspectorLayoutTab
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

              {activeTab === 'a11y' ? (
                <A11yPanel />
              ) : null}

              {activeTab === 'seo' ? (
                <InspectorNotice tone="neutral">
                  Page-level SEO lives in the dedicated SEO modal from the top bar. Element-level SEO fields will attach here when per-node metadata lands.
                </InspectorNotice>
              ) : null}

              {!selectedNode.visible ? (
                <p className={styles.inspectorHint}>
                  이 node 는 현재 canvas 에 숨겨져 있습니다. layers 나 inspector 에서 다시 표시할 수 있습니다.
                </p>
              ) : null}
              {selectedNode.locked ? (
                <p className={styles.inspectorHint}>
                  locked 상태에서는 drag, resize, nudge, delete, z-order 가 막힙니다. inspector 에서만 unlock 가능합니다.
                </p>
              ) : null}
            </section>

            <section className={styles.panelSection} data-builder-element-comments-section="true">
              <ElementCommentsPanel selectedNodeId={selectedNode.id} />
            </section>

            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <span>Z-order</span>
                <strong>Stacking actions</strong>
              </header>
              <div className={styles.actionGrid}>
                <button type="button" className={styles.actionButton} title="맨 뒤로 보내기" onClick={sendSelectedNodeToBack} disabled={selectedNode.locked}>
                  Send to back
                </button>
                <button type="button" className={styles.actionButton} title="한 단계 뒤로" onClick={sendSelectedNodeBackward} disabled={selectedNode.locked}>
                  Backward
                </button>
                <button type="button" className={styles.actionButton} title="한 단계 앞으로" onClick={bringSelectedNodeForward} disabled={selectedNode.locked}>
                  Forward
                </button>
                <button type="button" className={styles.actionButton} title="맨 앞으로 가져오기" onClick={bringSelectedNodeToFront} disabled={selectedNode.locked}>
                  Bring to front
                </button>
                <button type="button" className={styles.actionButton} title={duplicateShortcutTitle ? `선택 노드 복제 (${duplicateShortcutTitle})` : '선택 노드 복제'} onClick={duplicateSelectedNode} disabled={selectedNode.locked}>
                  Duplicate
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <InspectorEmptyState />
          </>
        )}
      </div>
    </aside>
  );
}
