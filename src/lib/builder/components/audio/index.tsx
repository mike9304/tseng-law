import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAudioCanvasNode } from '@/lib/builder/canvas/types';

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

function AudioRender({ node }: { node: BuilderAudioCanvasNode }) {
  const { provider, src, title, artist, autoplay, controls } = node.content;
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
          title={`${provider} audio embed`}
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
          {title || 'Audio track'}
        </strong>
        <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12 }}>
          {artist || 'Builder audio'}
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
          오디오 URL을 입력하세요
        </div>
      )}
    </div>
  );
}

function AudioInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const audioNode = node as BuilderAudioCanvasNode;
  const content = audioNode.content;

  return (
    <>
      <label>
        <span>Provider</span>
        <select
          value={content.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value })}
        >
          <option value="file">Audio file</option>
          <option value="spotify">Spotify</option>
          <option value="soundcloud">SoundCloud</option>
        </select>
      </label>
      <label>
        <span>Source URL</span>
        <input
          type="text"
          value={content.src}
          disabled={disabled}
          placeholder={content.provider === 'file' ? '/audio/intro.mp3' : 'https://open.spotify.com/...'}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Title</span>
        <input
          type="text"
          value={content.title}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>
      <label>
        <span>Artist / source</span>
        <input
          type="text"
          value={content.artist}
          disabled={disabled}
          onChange={(event) => onUpdate({ artist: event.target.value })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.controls}
          disabled={disabled || content.provider !== 'file'}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>Show controls</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled || content.provider !== 'file'}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>Autoplay</span>
      </label>
    </>
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
    title: 'Audio track',
    artist: '',
    autoplay: false,
    controls: true,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 150 },
  Render: AudioRender,
  Inspector: AudioInspector,
});
