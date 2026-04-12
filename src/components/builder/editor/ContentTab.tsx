'use client';

import { getComponent } from '@/lib/builder/components/registry';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export default function ContentTab({
  node,
  disabled = false,
  onUpdateContent,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateContent: (content: Record<string, unknown>) => void;
}) {
  const component = getComponent(node.kind);
  const Inspector = component?.Inspector;

  if (!Inspector) {
    return (
      <p className={styles.inspectorHint}>
        {node.kind} 은 아직 content inspector 가 연결되지 않았습니다.
      </p>
    );
  }

  return (
    <div className={styles.inspectorFormStack}>
      <Inspector node={node} onUpdate={onUpdateContent} disabled={disabled} />
    </div>
  );
}
