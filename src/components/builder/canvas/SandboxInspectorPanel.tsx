'use client';

import { useEffect, useMemo, useState } from 'react';
import ContentTab from '@/components/builder/editor/ContentTab';
import StyleTab from '@/components/builder/editor/StyleTab';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

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

export default function SandboxInspectorPanel({
  onRequestAssetLibrary,
}: {
  onRequestAssetLibrary: () => void;
}) {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    updateNode,
    updateNodeContent,
    updateNodeStyle,
    duplicateSelectedNode,
    bringSelectedNodeForward,
    sendSelectedNodeBackward,
    bringSelectedNodeToFront,
    sendSelectedNodeToBack,
  } = useBuilderCanvasStore();
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'content'>('layout');
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

  return (
    <aside className={styles.inspectorPlaceholder}>
      <header className={styles.panelSectionHeader}>
        <span>Inspector</span>
        <strong>{singleSelection ? `${selectedNode.kind} · inspector` : 'Phase 3 shell'}</strong>
      </header>

      {selectedNodeIds.length > 1 ? (
        <>
          <p className={styles.inspectorEmpty}>
            {selectedNodeIds.length}개 node 가 선택됐습니다. 현재는 batch duplicate, group move,
            group delete, group nudge 만 지원하고 layout editing/z-order 는 단일 선택에서만 허용합니다.
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
          </section>
        </>
      ) : selectedNode ? (
        <>
          <div className={styles.inspectorTabRow}>
            {(['layout', 'style', 'content'] as const).map((tab) => {
              const tabTitles = { layout: 'x/y/w/h, 회전, lock/hidden 설정', style: '배경, 테두리, 그림자, 투명도 설정', content: '텍스트, 이미지 등 콘텐츠 편집' };
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

          <section className={styles.panelSection}>
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
        <p className={styles.inspectorEmpty}>
          캔버스나 layers 에서 node 를 선택하면 layout 값과 lock/hidden 토글이 여기 표시됩니다.
        </p>
      )}

    </aside>
  );
}
