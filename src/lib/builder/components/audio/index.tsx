import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAudioCanvasNode } from '@/lib/builder/canvas/types';
import { AUDIO_LEGACY_DEFAULTS, getMediaWidgetsCopy, localizedAudioTitle } from '../media-widgets-copy';
import styles from './AudioInspector.module.css';

import AudioRender from './Render';

function AudioInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const audioNode = node as BuilderAudioCanvasNode;
  const content = audioNode.content;
  const copy = getMediaWidgetsCopy(locale);
  const titleValue = localizedAudioTitle(content.title, copy.audio.fallbackTitle);

  return (
    <div className={styles.root} data-builder-audio-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.audio.inspector.provider}</span>
        <select
          className={styles.control}
          value={content.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value })}
        >
          <option value="file">{copy.audio.providers.file}</option>
          <option value="spotify">{copy.audio.providers.spotify}</option>
          <option value="soundcloud">{copy.audio.providers.soundcloud}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.audio.inspector.sourceUrl}</span>
        <input
          className={styles.control}
          type="text"
          value={content.src}
          disabled={disabled}
          placeholder={content.provider === 'file' ? '/audio/intro.mp3' : 'https://open.spotify.com/...'}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.audio.inspector.title}</span>
        <input
          className={styles.control}
          type="text"
          value={titleValue}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.audio.inspector.artist}</span>
        <input
          className={styles.control}
          type="text"
          value={content.artist}
          disabled={disabled}
          onChange={(event) => onUpdate({ artist: event.target.value })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.controls}
          disabled={disabled || content.provider !== 'file'}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>{copy.audio.inspector.showControls}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled || content.provider !== 'file'}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>{copy.audio.inspector.autoplay}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'audio',
  displayName: '오디오',
  category: 'media',
  icon: '♪',
  defaultContent: {
    provider: 'file' as const,
    src: '',
    title: AUDIO_LEGACY_DEFAULTS.title,
    artist: '',
    autoplay: false,
    controls: true,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 150 },
  Render: AudioRender,
  Inspector: AudioInspector,
});
