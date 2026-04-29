'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import A11yPanel from '@/components/builder/canvas/A11yPanel';
import AnimationsTab from '@/components/builder/editor/AnimationsTab';
import ContentTab from '@/components/builder/editor/ContentTab';
import StyleTab from '@/components/builder/editor/StyleTab';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

/* ── SEO Inspector inline styles ────────────────────────────── */

const seoFieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const seoLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#334155',
};

const seoInputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
};

const seoTextareaStyle: React.CSSProperties = {
  ...seoInputStyle,
  minHeight: 64,
  resize: 'vertical' as const,
  fontFamily: 'inherit',
};

const seoCheckboxRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.78rem',
  color: '#334155',
};

const seoScoreStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '8px 10px',
  borderRadius: 8,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  fontSize: '0.75rem',
  color: '#475569',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const scoreOk: React.CSSProperties = { color: '#16a34a', fontWeight: 600 };
const scoreWarn: React.CSSProperties = { color: '#d97706', fontWeight: 600 };
const scoreErr: React.CSSProperties = { color: '#dc2626', fontWeight: 600 };

interface SeoData {
  title: string;
  description: string;
  ogImage: string;
  noIndex: boolean;
  canonical: string;
}

const EMPTY_SEO: SeoData = {
  title: '',
  description: '',
  ogImage: '',
  noIndex: false,
  canonical: '',
};

function SeoScoreWidget({ seo, imageNodesWithoutAlt }: { seo: SeoData; imageNodesWithoutAlt: number }) {
  const checks: Array<{ label: string; style: React.CSSProperties }> = [];
  const titleLen = seo.title.length;
  if (titleLen === 0) {
    checks.push({ label: 'Title 누락', style: scoreErr });
  } else if (titleLen < 30 || titleLen > 60) {
    checks.push({ label: `Title 길이: ${titleLen}자 (권장 30-60)`, style: scoreWarn });
  } else {
    checks.push({ label: `Title 길이: ${titleLen}자`, style: scoreOk });
  }

  const descLen = seo.description.length;
  if (descLen === 0) {
    checks.push({ label: 'Description 누락', style: scoreErr });
  } else if (descLen < 120 || descLen > 160) {
    checks.push({ label: `Description 길이: ${descLen}자 (권장 120-160)`, style: scoreWarn });
  } else {
    checks.push({ label: `Description 길이: ${descLen}자`, style: scoreOk });
  }

  if (imageNodesWithoutAlt > 0) {
    checks.push({ label: `Alt 텍스트 누락 이미지: ${imageNodesWithoutAlt}개`, style: scoreWarn });
  } else {
    checks.push({ label: '모든 이미지 alt 텍스트 설정됨', style: scoreOk });
  }

  return (
    <div style={seoScoreStyle}>
      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>SEO 점수</div>
      {checks.map((c, i) => (
        <div key={i} style={c.style}>{c.label}</div>
      ))}
    </div>
  );
}

const MIN_WIDTH = 72;
const MIN_HEIGHT = 40;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseNumberInput(rawValue: string): number | null {
  if (rawValue.trim().length === 0) return null;
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function LayoutField({
  label,
  value,
  onCommit,
  min,
  max,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onCommit: (nextValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <label className={styles.inspectorField}>
      <span className={styles.inspectorFieldLabel}>{label}</span>
      <input
        className={styles.inspectorInput}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => {
          const parsed = parseNumberInput(event.target.value);
          if (parsed === null) return;
          onCommit(parsed);
        }}
      />
    </label>
  );
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
}: {
  onRequestAssetLibrary: () => void;
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
    duplicateSelectedNode,
    bringSelectedNodeForward,
    sendSelectedNodeBackward,
    bringSelectedNodeToFront,
    sendSelectedNodeToBack,
  } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'content' | 'animations' | 'a11y' | 'seo'>('layout');
  const [seo, setSeo] = useState<SeoData>(EMPTY_SEO);

  const imageNodesWithoutAlt = useMemo(
    () =>
      (document?.nodes ?? []).filter(
        (n) => n.kind === 'image' && !n.content.alt,
      ).length,
    [document?.nodes],
  );

  const updateSeoField = useCallback(
    <K extends keyof SeoData>(key: K, value: SeoData[K]) => {
      setSeo((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );
  const selectedNode = useMemo(
    () => document?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document?.nodes, selectedNodeId],
  );

  const singleSelection = selectedNodeIds.length === 1 && selectedNode;

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
      setActiveTab('content');
      requestAnimationFrame(() => {
        const input = window.document.querySelector<HTMLInputElement>(
          '[data-builder-href-input="true"]',
        );
        if (input) {
          input.focus();
          input.select();
        }
      });
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

  return (
    <aside className={styles.inspectorPlaceholder}>
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
            <p className={styles.inspectorEmpty}>
              {selectedNodeIds.length}개 node 가 선택됐습니다. batch duplicate 와 정렬 툴바를 지원합니다.
            </p>
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <span>Batch actions</span>
                <strong>Multi-select</strong>
              </header>
              <div className={styles.actionGrid}>
                <button type="button" className={styles.actionButton} title="선택된 노드 모두 복제" onClick={duplicateSelectedNode}>
                  Duplicate selection
                </button>
              </div>
              <div className={styles.alignToolbar}>
                <button type="button" className={styles.toolbarButton} title="왼쪽 정렬" onClick={() => alignSelectedNodes('left')}>
                  Left
                </button>
                <button type="button" className={styles.toolbarButton} title="가운데 정렬" onClick={() => alignSelectedNodes('center')}>
                  Center
                </button>
                <button type="button" className={styles.toolbarButton} title="오른쪽 정렬" onClick={() => alignSelectedNodes('right')}>
                  Right
                </button>
                <button type="button" className={styles.toolbarButton} title="상단 정렬" onClick={() => alignSelectedNodes('top')}>
                  Top
                </button>
                <button type="button" className={styles.toolbarButton} title="중앙 정렬" onClick={() => alignSelectedNodes('middle')}>
                  Middle
                </button>
                <button type="button" className={styles.toolbarButton} title="하단 정렬" onClick={() => alignSelectedNodes('bottom')}>
                  Bottom
                </button>
              </div>
            </section>
          </>
        ) : selectedNode ? (
          <>
            {compositeSurfaceEditor}
            <div className={styles.inspectorTabRow}>
              {(['layout', 'style', 'content', 'animations', 'a11y', 'seo'] as const).map((tab) => {
                const tabTitles = { layout: 'x/y/w/h, 회전, lock/hidden 설정', style: '배경, 테두리, 그림자, 투명도 설정', content: '텍스트, 이미지 등 콘텐츠 편집', animations: 'Entrance, scroll, hover 애니메이션 설정', a11y: '접근성 검사', seo: 'SEO 메타데이터 설정' };
                return (
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
              })}
            </div>

            <section className={styles.panelSection} key={activeTab} style={{ animation: 'fadeIn 150ms ease' }}>
              <header className={styles.panelSectionHeader}>
                <span>{activeTab}</span>
                <strong>{selectedNode.kind} · {selectedNode.id}</strong>
              </header>
              {activeTab === 'layout' ? (
                <>
                  <div className={styles.inspectorFieldGrid}>
                    <LayoutField
                      label="X"
                      value={selectedNode.rect.x}
                      onCommit={(nextValue) => updateNode(selectedNode.id, (node) => updateRectField(node, 'x', nextValue))}
                      disabled={selectedNode.locked}
                    />
                    <LayoutField
                      label="Y"
                      value={selectedNode.rect.y}
                      onCommit={(nextValue) => updateNode(selectedNode.id, (node) => updateRectField(node, 'y', nextValue))}
                      disabled={selectedNode.locked}
                    />
                    <LayoutField
                      label="Width"
                      value={selectedNode.rect.width}
                      min={MIN_WIDTH}
                      onCommit={(nextValue) => updateNode(selectedNode.id, (node) => updateRectField(node, 'width', nextValue))}
                      disabled={selectedNode.locked}
                    />
                    <LayoutField
                      label="Height"
                      value={selectedNode.rect.height}
                      min={MIN_HEIGHT}
                      onCommit={(nextValue) => updateNode(selectedNode.id, (node) => updateRectField(node, 'height', nextValue))}
                      disabled={selectedNode.locked}
                    />
                  </div>

                  <div className={styles.inspectorField}>
                    <span className={styles.inspectorFieldLabel}>Rotation</span>
                    <div className={styles.inspectorRangeRow}>
                      <input
                        className={styles.inspectorRange}
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={selectedNode.rotation}
                        disabled={selectedNode.locked}
                        onChange={(event) => {
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            rotation: clampNumber(Math.round(Number(event.target.value)), 0, 360),
                          }));
                        }}
                      />
                      <input
                        className={styles.inspectorInput}
                        type="number"
                        min={0}
                        max={360}
                        step={1}
                        value={selectedNode.rotation}
                        disabled={selectedNode.locked}
                        onChange={(event) => {
                          const parsed = parseNumberInput(event.target.value);
                          if (parsed === null) return;
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            rotation: clampNumber(Math.round(parsed), 0, 360),
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.inspectorToggleList}>
                    <label className={styles.inspectorToggle}>
                      <input
                        type="checkbox"
                        checked={selectedNode.locked}
                        onChange={(event) => {
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            locked: event.target.checked,
                          }));
                        }}
                      />
                      <span>Lock node</span>
                    </label>
                    <label className={styles.inspectorToggle}>
                      <input
                        type="checkbox"
                        checked={!selectedNode.visible}
                        onChange={(event) => {
                          updateNode(selectedNode.id, (node) => ({
                            ...node,
                            visible: !event.target.checked,
                          }));
                        }}
                      />
                      <span>Hide on canvas</span>
                    </label>
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
                <ContentTab
                  node={selectedNode}
                  disabled={selectedNode.locked}
                  onUpdateContent={(content) => updateNodeContent(selectedNode.id, content)}
                  onRequestAssetLibrary={
                    selectedNode.kind === 'image'
                      ? onRequestAssetLibrary
                      : undefined
                  }
                />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                  <div style={seoFieldStyle}>
                    <label style={seoLabelStyle}>Title</label>
                    <input
                      type="text"
                      value={seo.title}
                      placeholder="페이지 제목 (30-60자 권장)"
                      style={seoInputStyle}
                      onChange={(e) => updateSeoField('title', e.target.value)}
                    />
                  </div>
                  <div style={seoFieldStyle}>
                    <label style={seoLabelStyle}>Description</label>
                    <textarea
                      value={seo.description}
                      placeholder="페이지 설명 (120-160자 권장)"
                      style={seoTextareaStyle}
                      onChange={(e) => updateSeoField('description', e.target.value)}
                    />
                  </div>
                  <div style={seoFieldStyle}>
                    <label style={seoLabelStyle}>OG Image URL</label>
                    <input
                      type="url"
                      value={seo.ogImage}
                      placeholder="https://example.com/og-image.jpg"
                      style={seoInputStyle}
                      onChange={(e) => updateSeoField('ogImage', e.target.value)}
                    />
                  </div>
                  <div style={seoFieldStyle}>
                    <label style={seoLabelStyle}>Canonical URL</label>
                    <input
                      type="url"
                      value={seo.canonical}
                      placeholder="https://example.com/page"
                      style={seoInputStyle}
                      onChange={(e) => updateSeoField('canonical', e.target.value)}
                    />
                  </div>
                  <label style={seoCheckboxRow}>
                    <input
                      type="checkbox"
                      checked={seo.noIndex}
                      onChange={(e) => updateSeoField('noIndex', e.target.checked)}
                    />
                    <span>noIndex (검색엔진 색인 제외)</span>
                  </label>
                  <SeoScoreWidget seo={seo} imageNodesWithoutAlt={imageNodesWithoutAlt} />
                </div>
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
                <button type="button" className={styles.actionButton} title="선택 노드 복제 (Cmd-D)" onClick={duplicateSelectedNode} disabled={selectedNode.locked}>
                  Duplicate
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <div className={styles.inspectorTabRow}>
              <button
                type="button"
                className={`${styles.inspectorTab} ${activeTab === 'a11y' ? styles.inspectorTabActive : ''}`}
                title="접근성 검사"
                onClick={() => setActiveTab('a11y')}
              >
                a11y
              </button>
            </div>
            {activeTab === 'a11y' ? (
              <A11yPanel />
            ) : (
              <p className={styles.inspectorEmpty}>
                캔버스나 layers 에서 node 를 선택하면 layout 값과 lock/hidden 토글이 여기 표시됩니다.
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
