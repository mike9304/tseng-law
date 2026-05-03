'use client';

import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export default function ImageInspector({
  node,
  onUpdate,
  disabled = false,
  onRequestAssetLibrary,
  onRequestImageEditor,
  linkPickerContext,
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
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !imageNode.content.src}
          onClick={() => onRequestImageEditor?.()}
          style={{ marginLeft: 6 }}
        >
          Crop / Filter / Alt
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
          Link
        </span>
        <LinkPicker
          value={(imageNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
        />
      </div>
      {imageNode.content.cropAspect && imageNode.content.cropAspect !== 'Free' && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
          Crop: {imageNode.content.cropAspect}
        </div>
      )}
    </>
  );
}
