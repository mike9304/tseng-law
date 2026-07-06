import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderVideoCanvasNode } from '@/lib/builder/canvas/types';
import { getMediaWidgetsCopy } from '../media-widgets-copy';
import VideoRender from './VideoRender';
import styles from './VideoInspector.module.css';

function VideoInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const videoNode = node as BuilderVideoCanvasNode;
  const content = videoNode.content;
  const copy = getMediaWidgetsCopy(locale);

  return (
    <div className={styles.root} data-builder-video-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.video.inspector.url}</span>
        <input
          type="text"
          value={content.url}
          placeholder={copy.video.inspector.urlPlaceholder}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ url: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.video.inspector.mode}</span>
        <select
          value={content.mode}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ mode: event.target.value })}
        >
          <option value="box">{copy.video.inspector.modes.box}</option>
          <option value="background">{copy.video.inspector.modes.background}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.video.inspector.poster}</span>
        <input
          type="text"
          value={content.thumbnail ?? ''}
          disabled={disabled}
          placeholder={copy.video.inspector.posterPlaceholder}
          className={styles.control}
          onChange={(event) => onUpdate({ thumbnail: event.target.value || undefined })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>{copy.video.inspector.autoplay}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.loop}
          disabled={disabled}
          onChange={(event) => onUpdate({ loop: event.target.checked })}
        />
        <span>{copy.video.inspector.loop}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.muted}
          disabled={disabled}
          onChange={(event) => onUpdate({ muted: event.target.checked })}
        />
        <span>{copy.video.inspector.muted}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.controls}
          disabled={disabled || content.mode === 'background'}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>{copy.video.inspector.showControls}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'video',
  displayName: 'video',
  category: 'media',
  icon: '\u25FB',
  defaultContent: {
    url: '',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
    thumbnail: '',
    mode: 'box' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: VideoRender,
  Inspector: VideoInspector,
});
