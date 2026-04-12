'use client';

import { listComponents } from '@/lib/builder/components/registry';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 880;

function resolveCenteredNode(
  kind: BuilderCanvasNodeKind,
  existingCount: number,
) {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (existingCount % 6) * 18;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

export default function SandboxCatalogPanel() {
  const { document, addNode } = useBuilderCanvasStore();
  const nodes = document?.nodes ?? [];
  const components = listComponents();

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <span>Catalog</span>
        <strong>{components.length} components</strong>
      </header>
      <p className={styles.panelCopy}>
        registry 에 등록된 컴포넌트만 노출합니다. drag 로 캔버스에 추가하거나, quick-add 로 중앙에 바로 생성합니다.
      </p>
      {components.map((component) => (
        <div key={component.kind} className={styles.catalogItemRow}>
          <button
            type="button"
            className={styles.catalogItem}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/x-builder-node-kind', component.kind);
              event.dataTransfer.effectAllowed = 'copy';
            }}
          >
            <span>{component.icon} {component.displayName}</span>
            <small>{component.kind} · drag to canvas</small>
          </button>
          <button
            type="button"
            className={styles.catalogQuickAdd}
            onClick={() => {
              addNode(resolveCenteredNode(component.kind as BuilderCanvasNodeKind, nodes.length));
            }}
          >
            추가
          </button>
        </div>
      ))}
    </section>
  );
}
