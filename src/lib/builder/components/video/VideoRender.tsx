'use client';

import { useState } from 'react';

interface VideoContent {
  url: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  thumbnail?: string;
}

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

export default function VideoRender({ node }: { node: { content: VideoContent } }) {
  const { url = '', autoplay = false, loop = false, muted = false, thumbnail } = node.content;
  const [playing, setPlaying] = useState(false);
  const embedUrl = extractVideoEmbed(url, autoplay, loop, muted);

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
        <img
          src={thumbnail}
          alt="Video thumbnail"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
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
    <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
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
