'use client';

import { useMemo } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import styles from './SandboxPage.module.css';

export default function SandboxLayersPanel() {
  const { document, selectedNodeId, selectedNodeIds, setSelectedNodeId, toggleNodeSelection } = useBuilderCanvasStore();

  const layers = useMemo(
    () => [...(document?.nodes ?? [])].sort((left, right) => right.zIndex - left.zIndex),
    [document?.nodes],
  );

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <span>Layers</span>
        <strong>{layers.length} nodes</strong>
      </header>
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
                <span className={styles.layerRowKind}>{node.kind}</span>
                <strong>{node.id}</strong>
                <small>
                  x {node.rect.x} · y {node.rect.y} · z {node.zIndex}
                  {selectedNodeId === node.id ? ' · primary' : ''}
                  {!node.visible ? ' · hidden' : ''}
                  {node.locked ? ' · locked' : ''}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
