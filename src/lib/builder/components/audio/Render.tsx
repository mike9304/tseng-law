import type { BuilderAudioCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getMediaWidgetsCopy, localizedAudioTitle } from '../media-widgets-copy';

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

export default AudioRender;
