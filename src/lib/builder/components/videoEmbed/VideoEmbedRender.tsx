'use client';

import type { BuilderVideoEmbedCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getUtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';
import styles from './VideoEmbed.module.css';

interface VideoEmbedFlags {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/,
  );
  if (match) return match[1] ?? null;
  if (/^[\w-]{6,}$/.test(trimmed) && !trimmed.includes('/')) return trimmed;
  return null;
}

function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (match) return match[1] ?? null;
  if (/^\d+$/.test(url.trim())) return url.trim();
  return null;
}

function buildYouTubeEmbedUrl(videoId: string, flags: VideoEmbedFlags): string {
  const params = new URLSearchParams();
  if (flags.autoplay) params.set('autoplay', '1');
  if (flags.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (flags.muted) params.set('mute', '1');
  if (!flags.controls) params.set('controls', '0');
  const qs = params.toString();
  return `https://www.youtube.com/embed/${videoId}${qs ? '?' + qs : ''}`;
}

function buildVimeoEmbedUrl(videoId: string, flags: VideoEmbedFlags): string {
  const params = new URLSearchParams();
  if (flags.autoplay) params.set('autoplay', '1');
  if (flags.loop) params.set('loop', '1');
  if (flags.muted) params.set('muted', '1');
  if (!flags.controls) params.set('controls', '0');
  const qs = params.toString();
  return `https://player.vimeo.com/video/${videoId}${qs ? '?' + qs : ''}`;
}

function isSafeUrl(value: string): boolean {
  // Block protocol-relative URLs (`//evil.example/...`) which resolve
  // against the current origin and let an attacker swap the host.
  if (value.trim().startsWith('//')) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function resolveEmbedUrl(
  provider: BuilderVideoEmbedCanvasNode['content']['provider'],
  src: string,
  flags: VideoEmbedFlags,
): string | null {
  if (!src) return null;
  if (provider === 'youtube') {
    const id = extractYouTubeId(src);
    return id ? buildYouTubeEmbedUrl(id, flags) : null;
  }
  if (provider === 'vimeo') {
    const id = extractVimeoId(src);
    return id ? buildVimeoEmbedUrl(id, flags) : null;
  }
  return isSafeUrl(src) ? src : null;
}

export default function VideoEmbedRender({
  node,
  locale = 'ko',
}: {
  node: BuilderVideoEmbedCanvasNode;
  locale?: Locale;
}) {
  const { provider, src, autoplay, loop, muted, controls, posterImage } = node.content;
  const flags: VideoEmbedFlags = { autoplay, loop, muted, controls };
  const embedUrl = resolveEmbedUrl(provider, src, flags);
  const copy = getUtilityAdvancedWidgetsCopy(locale).videoEmbed;
  const providerLabel = copy.inspector.providers[provider];

  if (!embedUrl) {
    return (
      <div
        className={`builder-widget-empty ${styles.empty}`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span>{src ? copy.runtime.invalidUrl(providerLabel) : copy.runtime.emptyUrl}</span>
      </div>
    );
  }

  return (
    <div
      className={styles.frame}
    >
      <iframe
        src={embedUrl}
        title={copy.runtime.iframeTitle}
        className={styles.iframe}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        {...(posterImage ? { poster: posterImage } : {})}
      />
    </div>
  );
}
