import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export default function ImageInspector({
  node,
  onUpdate,
  disabled = false,
  onRequestAssetLibrary,
}: BuilderComponentInspectorProps) {
  const imageNode = node as BuilderImageCanvasNode;

  return (
    <>
      <div className={styles.inspectorActionRow}>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !onRequestAssetLibrary}
          onClick={() => onRequestAssetLibrary?.()}
        >
          Open asset library
        </button>
      </div>
      <label>
        <span>Source URL</span>
        <input
          type="text"
          value={imageNode.content.src}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Alt text</span>
        <input
          type="text"
          value={imageNode.content.alt}
          disabled={disabled}
          onChange={(event) => onUpdate({ alt: event.target.value })}
        />
      </label>
      <label>
        <span>Fit</span>
        <select
          value={imageNode.content.fit}
          disabled={disabled}
          onChange={(event) => onUpdate({ fit: event.target.value })}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </label>
    </>
  );
}
