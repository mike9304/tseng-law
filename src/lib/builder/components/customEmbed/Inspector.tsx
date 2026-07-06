import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderCustomEmbedCanvasNode } from '@/lib/builder/canvas/types';
import { getConversionWidgetsCopy } from '../conversion-widgets-copy';
import styles from './CustomEmbedInspector.module.css';

export default function CustomEmbedInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const embedNode = node as BuilderCustomEmbedCanvasNode;
  const copy = getConversionWidgetsCopy(locale).customEmbed.inspector;
  return (
    <div className={styles.root} data-builder-custom-embed-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.htmlLabel}</span>
        <textarea rows={10} value={embedNode.content.html} disabled={disabled}
          placeholder={copy.htmlPlaceholder} onChange={(e) => onUpdate({ html: e.target.value })}
          className={styles.codeInput} />
        <span className={styles.helper}>{copy.helper}</span>
      </label>
    </div>
  );
}
