'use client';

import { useEffect, useMemo, useState } from 'react';
import A11yPanel from '@/components/builder/canvas/A11yPanel';
import ElementCommentsPanel from '@/components/builder/canvas/ElementCommentsPanel';
import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
import AnimationsTab from '@/components/builder/editor/AnimationsTab';
import BreakpointBadge from '@/components/builder/editor/BreakpointBadge';
import ContentTab from '@/components/builder/editor/ContentTab';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import StyleTab from '@/components/builder/editor/StyleTab';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  hasResponsiveOverride,
  resolveViewportHidden,
  resolveViewportFontSize,
  resolveViewportRect,
  VIEWPORT_WIDTHS,
} from '@/lib/builder/canvas/responsive';
import {
  googleMapsSearchUrl,
  getOfficeLocationPresets,
  labelPrefix,
  labelValueAfterColon,
  readButtonHref,
  readButtonLabel,
  readMapAddress,
  readMapZoom,
  readNodeText,
  resolveOfficeNodeGroup,
  telHrefFromPhone,
  type OfficeNodeGroup,
} from '@/lib/builder/canvas/office-locations';
import {
  InspectorNotice,
  InspectorSection,
  LabeledRow,
  MixedValueBadge,
  NumberStepper,
  SegmentedControl,
  SliderRow,
  ToggleRow,
} from './InspectorControls';
import nodeQuickStyles from './CanvasNodeQuickPanels.module.css';
import styles from './SandboxPage.module.css';

const MIN_WIDTH = 72;
const MIN_HEIGHT = 40;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function LayoutField({
  label,
  viewport,
  value,
  onCommit,
  min,
  max,
  step = 1,
  disabled = false,
  hasOverride = false,
}: {
  label: string;
  viewport: 'desktop' | 'tablet' | 'mobile';
  value: number;
  onCommit: (nextValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /**
   * When true, indicates that the field's value differs from desktop because
   * the active viewport has a per-viewport override applied. The visual
   * treatment of this dot is controlled by Codex F1 via CSS — we forward
   * the boolean state as a data attribute and a small inline marker.
   */
  hasOverride?: boolean;
}) {
  return (
    <LabeledRow
      label={label}
      hint={viewport === 'desktop' ? undefined : viewport}
      hasOverride={hasOverride}
      title={`${label} (${viewport})`}
    >
      <NumberStepper
        value={value}
        min={min}
        max={max}
        step={step}
        suffix="px"
        disabled={disabled}
        ariaLabel={`${label} value`}
        onChange={onCommit}
      />
      <BreakpointBadge viewport={viewport} active={hasOverride} label="" />
    </LabeledRow>
  );
}

function contentFontSize(node: BuilderCanvasNode): number | null {
  const content = node.content as Record<string, unknown>;
  return typeof content.fontSize === 'number' ? content.fontSize : null;
}

type ViewportLite = 'desktop' | 'tablet' | 'mobile';

const DEVICE_META: Array<{ vp: ViewportLite; icon: string; short: string; label: string }> = [
  { vp: 'desktop', icon: '🖥', short: 'D', label: 'Desktop' },
  { vp: 'tablet', icon: '⬜', short: 'T', label: 'Tablet' },
  { vp: 'mobile', icon: '▯', short: 'M', label: 'Mobile' },
];

function ShowOnDeviceToggles({
  node,
  updateNode,
  updateResponsiveOverride,
  activeViewport,
}: {
  node: BuilderCanvasNode;
  updateNode: (id: string, updater: (node: BuilderCanvasNode) => BuilderCanvasNode) => void;
  updateResponsiveOverride: (
    id: string,
    viewport: 'tablet' | 'mobile',
    patch: { hidden?: boolean | undefined },
  ) => void;
  activeViewport: ViewportLite;
}) {
  const disabled = node.locked;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        padding: '8px 10px',
        borderRadius: 10,
        background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)',
        border: '1px solid #e2e8f0',
      }}
    >
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Show on
      </span>
      <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
        {DEVICE_META.map(({ vp, icon, short, label }) => {
          const visible = vp === 'desktop'
            ? Boolean(node.visible)
            : !resolveViewportHidden(node, vp);
          const isActiveVp = activeViewport === vp;
          return (
            <button
              key={vp}
              type="button"
              aria-pressed={visible}
              aria-label={`${label}에서 ${visible ? '보임' : '숨김'} (클릭하여 토글)`}
              title={`${label} · ${visible ? '보임' : '숨김'}\n클릭하여 토글${isActiveVp ? ' (현재 편집 중)' : ''}`}
              disabled={disabled}
              onClick={() => {
                if (vp === 'desktop') {
                  updateNode(node.id, (n) => ({ ...n, visible: !visible }));
                  return;
                }
                updateResponsiveOverride(node.id, vp, {
                  hidden: visible ? true : undefined,
                });
              }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 9px',
                borderRadius: 8,
                border: visible
                  ? `1px solid ${isActiveVp ? '#1d4ed8' : '#cbd5e1'}`
                  : '1px solid #e2e8f0',
                background: visible
                  ? (isActiveVp ? 'linear-gradient(180deg, #dbeafe, #bfdbfe)' : '#fff')
                  : '#f1f5f9',
                color: visible ? (isActiveVp ? '#1e3a8a' : '#0f172a') : '#94a3b8',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.55 : 1,
                fontSize: '0.74rem',
                fontWeight: 600,
                lineHeight: 1,
                transition: 'all 120ms ease',
                boxShadow: visible && isActiveVp ? '0 1px 0 rgba(29,78,216,0.18)' : 'none',
              }}
            >
              <span aria-hidden style={{ fontSize: '0.85rem' }}>{icon}</span>
              <span>{short}</span>
              {!visible ? (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '85%',
                      height: 1,
                      background: '#94a3b8',
                      transform: 'rotate(-12deg)',
                      transformOrigin: 'center',
                    }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InspectorEmptyState() {
  return (
    <div
      data-builder-inspector-empty="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '36px 24px',
        textAlign: 'center',
      }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <rect x="6" y="6" width="44" height="44" rx="8" fill="none" stroke="#cbd5e1" strokeDasharray="4 4" />
        <circle cx="28" cy="28" r="3" fill="#94a3b8" />
      </svg>
      <p style={{ margin: 0, color: '#0f172a', fontSize: 13, fontWeight: 700 }}>Select an element to edit</p>
      <p style={{ margin: 0, color: '#475569', fontSize: 11, lineHeight: 1.5 }}>
        Click any element on the canvas, or use the Layers panel.<br />
        Press <kbd style={{ color: '#0f172a', fontWeight: 800 }}>Esc</kbd> to deselect.
      </p>
    </div>
  );
}

function resolveOfficeQuickEdit(nodes: BuilderCanvasNode[], selectedNode: BuilderCanvasNode | null): OfficeNodeGroup | null {
  if (!selectedNode || selectedNode.kind !== 'map') return null;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return resolveOfficeNodeGroup(byId, selectedNode);
}

function updateRectField(
  node: BuilderCanvasNode,
  field: 'x' | 'y' | 'width' | 'height',
  nextValue: number,
): BuilderCanvasNode {
  if (field === 'width') {
    return {
      ...node,
      rect: {
        ...node.rect,
        width: clampNumber(Math.round(nextValue), MIN_WIDTH, 1280),
      },
    };
  }

  if (field === 'height') {
    return {
      ...node,
      rect: {
        ...node.rect,
        height: clampNumber(Math.round(nextValue), MIN_HEIGHT, 880),
      },
    };
  }

  return {
    ...node,
    rect: {
      ...node.rect,
      [field]: Math.max(0, Math.round(nextValue)),
    },
  };
}

function renderCompositeSurfaceEditor({
  node,
  surfaceKey,
  onUpdate,
  onClose,
}: {
  node: BuilderCanvasNode;
  surfaceKey: string;
  onUpdate: (overrides: Record<string, string>) => void;
  onClose: () => void;
}): JSX.Element {
  const config = (node.content as { config?: Record<string, unknown> }).config ?? {};
  const overrides = (config.overrides as Record<string, string> | undefined) ?? {};
  const current = overrides[surfaceKey] ?? '';
  return (
    <section
      style={{
        padding: 12,
        borderRadius: 10,
        border: '1px solid #bfdbfe',
        background: '#eff6ff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.78rem', color: '#1e40af' }}>
          슬롯 편집 · {surfaceKey}
        </strong>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '2px 8px',
            fontSize: '0.72rem',
            border: '1px solid #bfdbfe',
            background: 'white',
            borderRadius: 6,
            cursor: 'pointer',
            color: '#1e40af',
          }}
        >
          닫기
        </button>
      </div>
      <textarea
        value={current}
        placeholder="비워두면 원본 기본값을 사용합니다"
        onChange={(e) => {
          const value = e.target.value;
          const next = { ...overrides };
          if (value === '') {
            delete next[surfaceKey];
          } else {
            next[surfaceKey] = value;
          }
          onUpdate(next);
        }}
        style={{
          padding: '6px 10px',
          border: '1px solid #93c5fd',
          borderRadius: 8,
          fontSize: '0.82rem',
          color: '#0f172a',
          outline: 'none',
          minHeight: 64,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </section>
  );
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

  return (
    <aside className={styles.inspectorPlaceholder} data-builder-inspector-panel="true" aria-label="Inspector panel">
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Inspector</span>
          <strong>{singleSelection ? `${selectedNode.kind} · inspector` : 'Phase 3 shell'}</strong>
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
                <strong>{selectedNode.kind} · {selectedNode.id}</strong>
              </header>
              {activeTab === 'layout' ? (
                <>
                  {(() => {
                    const isViewportOverride = viewport !== 'desktop';
                    const responsiveViewport = isViewportOverride ? viewport : null;
                    const activeOverride = responsiveViewport
                      ? selectedNode.responsive?.[responsiveViewport]
                      : undefined;
                    const effectiveRect = resolveViewportRect(selectedNode, viewport);
                    const hasActiveOverride = isViewportOverride
                      && hasResponsiveOverride(selectedNode, viewport);
                    const baseFontSize = contentFontSize(selectedNode);
                    const effectiveFontSize = resolveViewportFontSize(selectedNode, viewport);
                    const hasFontSizeOverride = isViewportOverride
                      && activeOverride?.fontSize !== undefined;
                    const hasHiddenOverride = isViewportOverride
                      && activeOverride?.hidden !== undefined;
                    const fieldHasOverride = (field: 'x' | 'y' | 'width' | 'height') => (
                      isViewportOverride && activeOverride?.rect?.[field] !== undefined
                    );
                    const isHiddenAtVp = resolveViewportHidden(selectedNode, viewport);
                    const commitRect = (field: 'x' | 'y' | 'width' | 'height', nextValue: number) => {
                      if (!isViewportOverride) {
                        updateNode(selectedNode.id, (node) => updateRectField(node, field, nextValue));
                        return;
                      }
                      const clamped = field === 'width'
                        ? clampNumber(Math.round(nextValue), MIN_WIDTH, 4000)
                        : field === 'height'
                          ? clampNumber(Math.round(nextValue), MIN_HEIGHT, 20000)
                          : Math.max(0, Math.round(nextValue));
                      updateResponsiveOverride(selectedNode.id, viewport, {
                        rect: { [field]: clamped },
                      });
                    };
                    const commitFontSize = (nextValue: number) => {
                      const clamped = clampNumber(Math.round(nextValue), 8, 160);
                      if (!isViewportOverride) {
                        updateNodeContent(selectedNode.id, { fontSize: clamped });
                        return;
                      }
                      updateResponsiveOverride(selectedNode.id, viewport, { fontSize: clamped });
                    };
                    return (
                      <>
                        <LabeledRow
                          label="Viewport"
                          helper={
                            isViewportOverride
                              ? hasActiveOverride
                                ? 'Override created for this viewport.'
                                : 'Inherits desktop until you edit a value.'
                              : 'Desktop is the source layout.'
                          }
                        >
                          <div
                            data-builder-mobile-inspector-viewport="true"
                            data-builder-viewport-override-state={isViewportOverride && hasActiveOverride ? 'created' : 'inherited'}
                            role="group"
                            aria-label="Inspector viewport"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                              gap: 6,
                              width: '100%',
                            }}
                          >
                            {DEVICE_META.map((device) => {
                              const active = viewport === device.vp;
                              const hasOverride = device.vp !== 'desktop' && hasResponsiveOverride(selectedNode, device.vp);
                              return (
                                <button
                                  key={device.vp}
                                  type="button"
                                  data-builder-inspector-viewport-option={device.vp}
                                  aria-pressed={active}
                                  onClick={() => setViewport(device.vp)}
                                  style={{
                                    minWidth: 0,
                                    padding: '7px 6px',
                                    borderRadius: 8,
                                    border: active ? '1px solid #116dff' : '1px solid #dbe3ee',
                                    background: active ? '#eaf3ff' : '#fff',
                                    color: active ? '#0f4ec4' : '#334155',
                                    fontSize: '0.72rem',
                                    fontWeight: 850,
                                    cursor: 'pointer',
                                  }}
                                  title={`${device.label} ${VIEWPORT_WIDTHS[device.vp]}px`}
                                >
                                  <span aria-hidden style={{ display: 'block', fontSize: '0.8rem' }}>{device.short}</span>
                                  <span style={{ display: 'block' }}>{device.label}</span>
                                  <small style={{ display: 'block', color: active ? '#1d4ed8' : '#64748b' }}>
                                    {VIEWPORT_WIDTHS[device.vp]}px{hasOverride ? ' · override' : ''}
                                  </small>
                                </button>
                              );
                            })}
                          </div>
                        </LabeledRow>
                        {isViewportOverride ? (
                          <div
                            data-builder-viewport-override-banner={hasActiveOverride ? 'created' : 'inherited'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 8,
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: '1px solid #bfdbfe',
                              background: '#eff6ff',
                              fontSize: '0.74rem',
                              color: '#1e40af',
                              marginBottom: 8,
                            }}
                          >
                            <span>
                              <strong style={{ marginRight: 6 }}>{viewport}</strong>
                              {hasActiveOverride ? 'Override created' : 'viewport override 편집 중'}
                              {hasActiveOverride ? null : (
                                <span style={{ color: '#475569', marginLeft: 6 }}>
                                  (override 미설정 — desktop 값 표시)
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => resetResponsiveOverride(selectedNode.id, viewport)}
                              disabled={selectedNode.locked || !hasActiveOverride}
                              style={{
                                padding: '2px 8px',
                                fontSize: '0.72rem',
                                border: '1px solid #bfdbfe',
                                background: '#fff',
                                borderRadius: 6,
                                cursor: hasActiveOverride && !selectedNode.locked ? 'pointer' : 'not-allowed',
                                opacity: hasActiveOverride && !selectedNode.locked ? 1 : 0.5,
                                color: '#1e40af',
                              }}
                              title={`${viewport} viewport 의 override 를 모두 제거합니다`}
                            >
                              Reset {viewport}
                            </button>
                          </div>
                        ) : null}
                        <div className={styles.inspectorFieldGrid}>
                          <LayoutField
                            label="X"
                            viewport={viewport}
                            value={effectiveRect.x}
                            onCommit={(nextValue) => commitRect('x', nextValue)}
                            disabled={selectedNode.locked}
                            hasOverride={fieldHasOverride('x')}
                          />
                          <LayoutField
                            label="Y"
                            viewport={viewport}
                            value={effectiveRect.y}
                            onCommit={(nextValue) => commitRect('y', nextValue)}
                            disabled={selectedNode.locked}
                            hasOverride={fieldHasOverride('y')}
                          />
                          <LayoutField
                            label="Width"
                            viewport={viewport}
                            value={effectiveRect.width}
                            min={MIN_WIDTH}
                            onCommit={(nextValue) => commitRect('width', nextValue)}
                            disabled={selectedNode.locked}
                            hasOverride={fieldHasOverride('width')}
                          />
                          <LayoutField
                            label="Height"
                            viewport={viewport}
                            value={effectiveRect.height}
                            min={MIN_HEIGHT}
                            onCommit={(nextValue) => commitRect('height', nextValue)}
                            disabled={selectedNode.locked}
                            hasOverride={fieldHasOverride('height')}
                          />
                          {baseFontSize != null && effectiveFontSize != null ? (
                            <LayoutField
                              label="Font size"
                              viewport={viewport}
                              value={effectiveFontSize}
                              min={8}
                              max={160}
                              onCommit={commitFontSize}
                              disabled={selectedNode.locked}
                              hasOverride={hasFontSizeOverride}
                            />
                          ) : null}
                        </div>
                        <ShowOnDeviceToggles
                          node={selectedNode}
                          updateNode={updateNode}
                          updateResponsiveOverride={updateResponsiveOverride}
                          activeViewport={viewport}
                        />
                        {hasHiddenOverride ? (
                          <p
                            data-builder-viewport-hidden-override="true"
                            style={{
                              margin: '6px 2px 0',
                              fontSize: '0.72rem',
                              color: '#475569',
                              fontWeight: 600,
                            }}
                          >
                            Hidden override exists for {viewport}.
                          </p>
                        ) : null}
                        {isViewportOverride && isHiddenAtVp ? (
                          <p
                            style={{
                              margin: '6px 2px 0',
                              fontSize: '0.72rem',
                              color: '#b45309',
                              fontWeight: 500,
                            }}
                          >
                            ⚠ {viewport}에서 숨김 처리되어 캔버스/미리보기에서 보이지 않습니다.
                          </p>
                        ) : null}
                      </>
                    );
                  })()}

                  <LabeledRow label="Rotation" hint="deg">
                    <SliderRow
                      value={selectedNode.rotation}
                      min={0}
                      max={360}
                      suffix="deg"
                      disabled={selectedNode.locked}
                      onChange={(nextValue) => {
                        updateNode(selectedNode.id, (node) => ({
                          ...node,
                          rotation: clampNumber(Math.round(nextValue), 0, 360),
                        }));
                      }}
                    />
                  </LabeledRow>

                  <InspectorSection label="State" title="Visibility & lock">
                    <LabeledRow label="Lock">
                      <ToggleRow
                        checked={selectedNode.locked}
                        onChange={(checked) => {
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            locked: checked,
                          }));
                        }}
                      />
                    </LabeledRow>
                    <LabeledRow label="Visible">
                      <ToggleRow
                        checked={selectedNode.visible}
                        onChange={(checked) => {
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            visible: checked,
                          }));
                        }}
                      />
                    </LabeledRow>
                    <LabeledRow label="Pin">
                      <ToggleRow
                        checked={Boolean(selectedNode.sticky)}
                        disabled={selectedNode.locked}
                        onChange={(checked) => {
                          updateNode(selectedNode.id, (node) => {
                            if (!checked) {
                              const next = { ...node };
                              delete (next as { sticky?: unknown }).sticky;
                              return next;
                            }
                            return {
                              ...node,
                              sticky: { offset: 0, from: 'top' as const },
                            };
                          });
                        }}
                      />
                    </LabeledRow>
                  </InspectorSection>

                  {selectedNode.sticky ? (
                    <div className={styles.inspectorFieldGrid}>
                      <LayoutField
                        label="Sticky offset (px)"
                        viewport={viewport}
                        value={selectedNode.sticky.offset}
                        min={0}
                        onCommit={(nextValue) => updateNode(selectedNode.id, (node) => ({
                          ...node,
                          sticky: {
                            offset: Math.max(0, Math.round(nextValue)),
                            from: node.sticky?.from ?? 'top',
                          },
                        }))}
                        disabled={selectedNode.locked}
                      />
                      <LabeledRow label="Pin from">
                        <SegmentedControl
                          value={selectedNode.sticky.from ?? 'top'}
                          disabled={selectedNode.locked}
                          ariaLabel="Pin from"
                          options={[
                            { value: 'top', label: 'Top' },
                            { value: 'bottom', label: 'Bottom' },
                          ]}
                          onChange={(nextFrom) => {
                            updateNode(selectedNode.id, (node) => ({
                              ...node,
                              sticky: {
                                offset: node.sticky?.offset ?? 0,
                                from: nextFrom,
                              },
                            }));
                          }}
                        />
                      </LabeledRow>
                    </div>
                  ) : null}

                  <div className={styles.inspectorField}>
                    <span className={styles.inspectorFieldLabel}>⚓ Anchor name</span>
                    <input
                      className={styles.inspectorInput}
                      type="text"
                      placeholder="e.g. about, services"
                      value={selectedNode.anchorName ?? ''}
                      disabled={selectedNode.locked}
                      onChange={(event) => {
                        const raw = event.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-+|-+$/g, '')
                          .slice(0, 64);
                        updateNode(selectedNode.id, (node) => {
                          if (!raw) {
                            const next = { ...node };
                            delete (next as { anchorName?: string }).anchorName;
                            return next;
                          }
                          return { ...node, anchorName: raw };
                        });
                      }}
                    />
                    {selectedNode.anchorName ? (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
                        링크: <code style={{ color: '#0f172a' }}>#{selectedNode.anchorName}</code>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
                        영문 소문자, 숫자, 하이픈만. 버튼 href에 <code>#name</code>으로 연결.
                      </span>
                    )}
                  </div>
                </>
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
                  {officeQuickEdit ? (() => {
                    const address = readMapAddress(officeQuickEdit.mapNode);
                    const phoneLabel = readButtonLabel(officeQuickEdit.phoneNode);
                    const phonePrefix = labelPrefix(phoneLabel, 'TEL');
                    const faxLabel = readNodeText(officeQuickEdit.faxNode);
                    const faxPrefix = labelPrefix(faxLabel, 'FAX');
                    const generatedMapUrl = googleMapsSearchUrl(address);
                    const officePresets = getOfficeLocationPresets(builderLocale);
                    return (
                      <InspectorSection label="Office sync" title="Wix-style location settings">
                        <div className={styles.inspectorField}>
                          <span className={styles.inspectorFieldLabel}>사무소 프리셋</span>
                          <div className={nodeQuickStyles.nodeMapPresetGrid}>
                            {officePresets.map((preset) => (
                              <button
                                key={preset.title}
                                type="button"
                                className={`${nodeQuickStyles.nodeMapPresetButton} ${
                                  address === preset.address ? nodeQuickStyles.nodeMapPresetButtonActive : ''
                                }`}
                                aria-pressed={address === preset.address}
                                aria-label={`${preset.title} office map preset`}
                                disabled={selectedNode.locked}
                                onClick={() => {
                                  updateNodeContent(officeQuickEdit.mapNode.id, {
                                    address: preset.address,
                                    zoom: 16,
                                  });
                                  if (officeQuickEdit.addressNode) {
                                    updateNodeContent(officeQuickEdit.addressNode.id, { text: preset.address });
                                  }
                                  if (officeQuickEdit.mapLinkNode) {
                                    updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: preset.mapsUrl });
                                  }
                                  if (officeQuickEdit.titleNode) {
                                    updateNodeContent(officeQuickEdit.titleNode.id, { text: preset.title });
                                  }
                                  if (officeQuickEdit.phoneNode) {
                                    updateNodeContent(officeQuickEdit.phoneNode.id, {
                                      label: `${phonePrefix}: ${preset.phone}`,
                                      href: telHrefFromPhone(preset.phone),
                                    });
                                  }
                                  if (officeQuickEdit.faxNode && preset.fax) {
                                    updateNodeContent(officeQuickEdit.faxNode.id, {
                                      text: `${faxPrefix}: ${preset.fax}`,
                                    });
                                  }
                                }}
                              >
                                {preset.title}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className={styles.inspectorField}>
                          <span className={styles.inspectorFieldLabel}>사무소명</span>
                          <input
                            className={styles.inspectorInput}
                            type="text"
                            aria-label="Office title synced value"
                            value={readNodeText(officeQuickEdit.titleNode)}
                            disabled={selectedNode.locked || !officeQuickEdit.titleNode}
                            onChange={(event) => {
                              if (!officeQuickEdit.titleNode) return;
                              updateNodeContent(officeQuickEdit.titleNode.id, { text: event.target.value });
                            }}
                          />
                        </div>
                        <div className={styles.inspectorField}>
                          <span className={styles.inspectorFieldLabel}>주소</span>
                          <textarea
                            className={styles.inspectorTextarea}
                            rows={2}
                            aria-label="Office address synced value"
                            value={address}
                            disabled={selectedNode.locked}
                            onChange={(event) => {
                              const nextAddress = event.target.value;
                              updateNodeContent(officeQuickEdit.mapNode.id, { address: nextAddress });
                              if (officeQuickEdit.addressNode) {
                                updateNodeContent(officeQuickEdit.addressNode.id, { text: nextAddress });
                              }
                              if (officeQuickEdit.mapLinkNode) {
                                updateNodeContent(officeQuickEdit.mapLinkNode.id, {
                                  href: googleMapsSearchUrl(nextAddress),
                                });
                              }
                            }}
                          />
                        </div>
                        <div className={styles.inspectorFieldGrid}>
                          <LabeledRow label="Zoom">
                            <NumberStepper
                              value={readMapZoom(officeQuickEdit.mapNode)}
                              min={1}
                              max={20}
                              step={1}
                              disabled={selectedNode.locked}
                              ariaLabel="Office map zoom"
                              onChange={(nextValue) => {
                                updateNodeContent(officeQuickEdit.mapNode.id, {
                                  zoom: clampNumber(Math.round(nextValue), 1, 20),
                                });
                              }}
                            />
                          </LabeledRow>
                          <LabeledRow label="전화">
                            <input
                              className={styles.inspectorInput}
                              type="text"
                              aria-label="Office phone synced value"
                              value={labelValueAfterColon(phoneLabel)}
                              disabled={selectedNode.locked || !officeQuickEdit.phoneNode}
                              onChange={(event) => {
                                if (!officeQuickEdit.phoneNode) return;
                                const nextPhone = event.target.value;
                                updateNodeContent(officeQuickEdit.phoneNode.id, {
                                  label: `${phonePrefix}: ${nextPhone}`,
                                  href: telHrefFromPhone(nextPhone),
                                });
                              }}
                            />
                          </LabeledRow>
                        </div>
                        {officeQuickEdit.faxNode ? (
                          <div className={styles.inspectorField}>
                            <span className={styles.inspectorFieldLabel}>팩스</span>
                            <input
                              className={styles.inspectorInput}
                              type="text"
                              aria-label="Office fax synced value"
                              value={labelValueAfterColon(faxLabel)}
                              disabled={selectedNode.locked}
                              onChange={(event) => {
                                if (!officeQuickEdit.faxNode) return;
                                updateNodeContent(officeQuickEdit.faxNode.id, {
                                  text: `${faxPrefix}: ${event.target.value}`,
                                });
                              }}
                            />
                          </div>
                        ) : null}
                        {officeQuickEdit.mapLinkNode ? (
                          <div className={styles.inspectorField}>
                            <span className={styles.inspectorFieldLabel}>길찾기 URL</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                className={styles.inspectorInput}
                                type="url"
                                aria-label="Office map URL"
                                value={readButtonHref(officeQuickEdit.mapLinkNode)}
                                disabled={selectedNode.locked}
                                onChange={(event) => {
                                  if (!officeQuickEdit.mapLinkNode) return;
                                  updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: event.target.value });
                                }}
                              />
                              <button
                                type="button"
                                className={styles.panelHeaderButton}
                                disabled={selectedNode.locked || !generatedMapUrl}
                                onClick={() => {
                                  if (!officeQuickEdit.mapLinkNode || !generatedMapUrl) return;
                                  updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: generatedMapUrl });
                                }}
                              >
                                주소로 생성
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </InspectorSection>
                    );
                  })() : null}
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
