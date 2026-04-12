import { defineComponent } from '../define';

interface VideoContent {
  url: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
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

function VideoRender({ node }: { node: { content: VideoContent } }) {
  const { url = '', autoplay = false, loop = false, muted = false } = node.content;
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

export default defineComponent({
  kind: 'video',
  displayName: 'video',
  category: 'media',
  icon: '◻',
  defaultContent: {
    url: '',
    autoplay: false,
    loop: false,
    muted: false,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: VideoRender,
});
