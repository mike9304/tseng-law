import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderVideoEmbedCanvasNode } from '@/lib/builder/canvas/types';
import VideoEmbedRender from './VideoEmbedRender';
import { getUtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';
import styles from './VideoEmbedInspector.module.css';

function VideoEmbedInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const videoNode = node as BuilderVideoEmbedCanvasNode;
  const content = videoNode.content;
  const copy = getUtilityAdvancedWidgetsCopy(locale).videoEmbed.inspector;

  return (
    <div className={styles.root} data-builder-video-embed-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.provider}</span>
        <select
          className={styles.control}
          value={content.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value })}
        >
          <option value="youtube">{copy.providers.youtube}</option>
          <option value="vimeo">{copy.providers.vimeo}</option>
          <option value="url">{copy.providers.url}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.sourceUrl}</span>
        <input
          className={styles.control}
          type="text"
          value={content.src}
          placeholder={copy.sourceUrlPlaceholder}
          disabled={disabled}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.posterImageUrl}</span>
        <input
          className={styles.control}
          type="text"
          value={content.posterImage ?? ''}
          placeholder={copy.posterImagePlaceholder}
          disabled={disabled}
          onChange={(event) =>
            onUpdate({ posterImage: event.target.value || undefined })
          }
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>{copy.autoplay}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.loop}
          disabled={disabled}
          onChange={(event) => onUpdate({ loop: event.target.checked })}
        />
        <span>{copy.loop}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.muted}
          disabled={disabled}
          onChange={(event) => onUpdate({ muted: event.target.checked })}
        />
        <span>{copy.muted}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.controls}
          disabled={disabled}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>{copy.showControls}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'video-embed',
  displayName: '영상 임베드',
  category: 'media',
  icon: '▶',
  defaultContent: {
    provider: 'youtube' as const,
    src: '',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
    posterImage: undefined,
  },
  defaultStyle: {},
  defaultRect: { width: 560, height: 315 },
  Render: VideoEmbedRender,
  Inspector: VideoEmbedInspector,
});
