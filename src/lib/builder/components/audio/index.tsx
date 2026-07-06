import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAudioCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { AUDIO_LEGACY_DEFAULTS, getMediaWidgetsCopy, localizedAudioTitle } from '../media-widgets-copy';
import styles from './AudioInspector.module.css';

function isSpotifyUrl(src: string): boolean {
  return /open\.spotify\.com\/(track|playlist|album|episode)\//.test(src);
}

function spotifyEmbedUrl(src: string): string | null {
  if (!isSpotifyUrl(src)) return null;
  return src.replace('open.spotify.com/', 'open.spotify.com/embed/');
}

function isSoundCloudUrl(src: string): boolean {
  return /soundcloud\.com\//.test(src);
}

function soundCloudEmbedUrl(src: string): string | null {
  if (!isSoundCloudUrl(src)) return null;
  const params = new URLSearchParams({
    url: src,
    color: '#116dff',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function AudioRender({ node, locale = 'ko' }: { node: BuilderAudioCanvasNode; locale?: Locale }) {
  const { provider, src, title, artist, autoplay, controls } = node.content;
  const copy = getMediaWidgetsCopy(locale);
  const displayTitle = localizedAudioTitle(title, copy.audio.fallbackTitle) || copy.audio.fallbackTitle;
  const embedUrl = provider === 'spotify'
    ? spotifyEmbedUrl(src)
    : provider === 'soundcloud'
      ? soundCloudEmbedUrl(src)
      : null;

  if (embedUrl) {
    return (
      <div
        data-builder-media-widget={provider}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 12,
          background: '#0f172a',
        }}
      >
        <iframe
          src={embedUrl}
          title={copy.audio.embedTitle(copy.audio.providers[provider])}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      data-builder-media-widget="audio-player"
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        gap: 10,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#fff',
        padding: 16,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ minWidth: 0, display: 'grid', gap: 4, alignContent: 'center' }}>
        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16 }}>
          {displayTitle}
        </strong>
        <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12 }}>
          {artist || copy.audio.fallbackArtist}
        </span>
      </div>
      {src ? (
        <audio
          src={src}
          controls={controls}
          autoPlay={autoplay}
          style={{ width: '100%' }}
        />
      ) : (
        <div
          style={{
            border: '1px dashed rgba(255,255,255,0.35)',
            borderRadius: 10,
            padding: '10px 12px',
            color: 'rgba(255,255,255,0.72)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {copy.audio.emptyUrl}
        </div>
      )}
    </div>
  );
}

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
