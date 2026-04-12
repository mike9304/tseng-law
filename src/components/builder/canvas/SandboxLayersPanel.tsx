'use client';

import { useMemo, useState } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

export default function SandboxLayersPanel() {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    setSelectedNodeId,
    toggleNodeSelection,
    updateNode,
  } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);

  const layers = useMemo(
    () => [...(document?.nodes ?? [])].sort((left, right) => right.zIndex - left.zIndex),
    [document?.nodes],
  );

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Layers</span>
          <strong>{layers.length} nodes</strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '레이어 패널 접기' : '레이어 패널 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        {layers.length === 0 ? (
          <p className={styles.panelEmpty}>아직 node 가 없습니다. catalog 에서 추가하세요.</p>
        ) : (
          <ul className={styles.layerList}>
            {layers.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  className={`${styles.layerRow} ${selectedNodeIds.includes(node.id) ? styles.layerRowSelected : ''}`}
                  title={`${node.kind} ${node.id} 선택 (Cmd-click 으로 다중선택)`}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey) {
                      toggleNodeSelection(node.id);
                      return;
                    }
                    setSelectedNodeId(node.id);
                  }}
                >
                  <div className={styles.layerRowMain}>
                    <span className={styles.layerRowKind} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 14, textAlign: 'center', fontSize: '0.75rem' }}>
                        {getLayerNodeKindGlyph(node.kind)}
                      </span>
                      {node.kind}
                    </span>
                    <strong>{node.id}</strong>
                    <small>
                      x {node.rect.x} · y {node.rect.y} · z {node.zIndex}
                      {selectedNodeId === node.id ? ' · primary' : ''}
                      {!node.visible ? ' · hidden' : ''}
                      {node.locked ? ' · locked' : ''}
                    </small>
                  </div>
                  <div className={styles.layerRowActions}>
                    <button
                      type="button"
                      className={styles.layerQuickAction}
                      title={node.visible ? '캔버스에서 숨기기' : '캔버스에 다시 표시'}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateNode(node.id, (currentNode) => ({
                          ...currentNode,
                          visible: !currentNode.visible,
                        }));
                      }}
                    >
                      {node.visible ? '👁' : '👁‍🗨'}
                    </button>
                    <button
                      type="button"
                      className={styles.layerQuickAction}
                      title={node.locked ? '잠금 해제' : '잠금'}
                      onClick={(event) => {
                        event.stopPropagation();
                        updateNode(node.id, (currentNode) => ({
                          ...currentNode,
                          locked: !currentNode.locked,
                        }));
                      }}
                    >
                      {node.locked ? '🔒' : '🔓'}
                    </button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function getLayerNodeKindGlyph(kind: BuilderCanvasNodeKind) {
  switch (kind) {
    case 'text':
      return 'T';
    case 'heading':
      return 'H';
    case 'image':
      return '🖼';
    case 'button':
      return '▢';
    case 'container':
      return '◻';
    case 'section':
      return '▬';
    default:
      return '·';
  }
}
