'use client';

import { getComponent } from '@/lib/builder/components/registry';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export default function ContentTab({
  node,
  disabled = false,
  onUpdateContent,
  onRequestAssetLibrary,
  onRequestImageEditor,
  linkPickerContext,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateContent: (content: Record<string, unknown>) => void;
  onRequestAssetLibrary?: () => void;
  onRequestImageEditor?: () => void;
  linkPickerContext?: LinkPickerContext;
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
    <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
      <Inspector
        node={node}
        onUpdate={onUpdateContent}
        disabled={disabled}
        onRequestAssetLibrary={onRequestAssetLibrary}
        onRequestImageEditor={onRequestImageEditor}
        linkPickerContext={linkPickerContext}
      />
    </div>
  );
}
