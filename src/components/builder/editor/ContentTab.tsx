'use client';

import { getComponent } from '@/lib/builder/components/registry';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import { getContentTabCopy } from './content-tab-copy';

export default function ContentTab({
  node,
  locale,
  disabled = false,
  onUpdateContent,
  onRequestAssetLibrary,
  onRequestImageEditor,
  linkPickerContext,
}: {
  node: BuilderCanvasNode;
  locale?: Locale;
  disabled?: boolean;
  onUpdateContent: (content: Record<string, unknown>) => void;
  onRequestAssetLibrary?: () => void;
  onRequestImageEditor?: () => void;
  linkPickerContext?: LinkPickerContext;
}) {
  const component = getComponent(node.kind);
  const Inspector = component?.Inspector;
  const copy = getContentTabCopy(locale ?? 'ko');

  if (!Inspector) {
    return (
      <p className={styles.inspectorHint}>
        {copy.missingInspectorMessage(node.kind)}
      </p>
    );
  }

  return (
    <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
      <Inspector
        node={node}
        locale={locale}
        onUpdate={onUpdateContent}
        disabled={disabled}
        onRequestAssetLibrary={onRequestAssetLibrary}
        onRequestImageEditor={onRequestImageEditor}
        linkPickerContext={linkPickerContext}
      />
    </div>
  );
}
