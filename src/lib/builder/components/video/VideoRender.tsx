'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { BuilderVideoCanvasNode } from '@/lib/builder/canvas/types';

function extractVideoEmbed(url: string, autoplay: boolean, loop: boolean, muted: boolean): string | null {
  if (!url) return null;

  // YouTube
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (match) {
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (loop) params.set('loop', '1');
    if (muted) params.set('mute', '1');
    const qs = params.toString();
    return `https://www.youtube.com/embed/${match[1]}${qs ? '?' + qs : ''}`;
  }

  // Vimeo
  match = url.match(/vimeo\.com\/(\d+)/);
  if (match) {
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (loop) params.set('loop', '1');
    if (muted) params.set('muted', '1');
    const qs = params.toString();
    return `https://player.vimeo.com/video/${match[1]}${qs ? '?' + qs : ''}`;
  }

  return null;
}

function isDirectVideoUrl(url: string): boolean {
  const value = url.trim().toLowerCase();
  return Boolean(value) && (
    value.startsWith('/')
    || value.startsWith('blob:')
    || value.endsWith('.mp4')
    || value.endsWith('.webm')
    || value.endsWith('.ogg')
  );
}

export default function VideoRender({ node }: { node: BuilderVideoCanvasNode }) {
  const {
    url = '',
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    thumbnail,
    mode = 'box',
  } = node.content;
  const [playing, setPlaying] = useState(false);
  const embedUrl = extractVideoEmbed(url, autoplay, loop, muted);
  const directVideo = isDirectVideoUrl(url);

  if (directVideo) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
          background: '#0f172a',
        }}
        data-builder-media-widget={mode === 'background' ? 'video-background' : 'video-box'}
      >
        <video
          src={url}
          poster={thumbnail || undefined}
          autoPlay={mode === 'background' ? true : autoplay}
          loop={loop || mode === 'background'}
          muted={mode === 'background' ? true : muted}
          controls={mode === 'background' ? false : controls}
          playsInline
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: mode === 'background' ? 'cover' : 'contain',
          }}
        />
        {mode === 'background' ? (
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              borderRadius: 999,
              background: 'rgba(15, 23, 42, 0.72)',
              color: '#fff',
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Background video
          </span>
        ) : null}
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13,
        }}
        data-builder-media-widget="video-empty"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    );
  }

  // Show thumbnail with play button if thumbnail is set and not playing yet
  if (thumbnail && !playing) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => setPlaying(true)}
      >
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          sizes="(max-width: 1280px) 100vw, 420px"
          style={{
            objectFit: 'cover',
          }}
        />
        {/* Play button overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            transition: 'background 200ms ease',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#1f2937"
              stroke="none"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }} data-builder-media-widget="video-embed">
      <iframe
        src={embedUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Video embed"
      />
    </div>
  );
}
