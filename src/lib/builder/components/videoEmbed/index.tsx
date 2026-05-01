import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderVideoEmbedCanvasNode } from '@/lib/builder/canvas/types';
import VideoEmbedRender from './VideoEmbedRender';

function VideoEmbedInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const videoNode = node as BuilderVideoEmbedCanvasNode;
  const content = videoNode.content;

  return (
    <>
      <label>
        <span>Provider</span>
        <select
          value={content.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value })}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="url">Direct URL</option>
        </select>
      </label>
      <label>
        <span>Source URL</span>
        <input
          type="text"
          value={content.src}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={disabled}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Poster Image URL</span>
        <input
          type="text"
          value={content.posterImage ?? ''}
          placeholder="(선택) 포스터 이미지 URL"
          disabled={disabled}
          onChange={(event) =>
            onUpdate({ posterImage: event.target.value || undefined })
          }
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>Autoplay</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.loop}
          disabled={disabled}
          onChange={(event) => onUpdate({ loop: event.target.checked })}
        />
        <span>Loop</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.muted}
          disabled={disabled}
          onChange={(event) => onUpdate({ muted: event.target.checked })}
        />
        <span>Muted</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={content.controls}
          disabled={disabled}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>Show controls</span>
      </label>
    </>
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
