import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderVideoCanvasNode } from '@/lib/builder/canvas/types';
import VideoRender from './VideoRender';

function VideoInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const videoNode = node as BuilderVideoCanvasNode;
  const content = videoNode.content;

  return (
    <>
      <label>
        <span>Video URL</span>
        <input
          type="text"
          value={content.url}
          placeholder="/videos/intro.mp4 or https://youtu.be/..."
          disabled={disabled}
          onChange={(event) => onUpdate({ url: event.target.value })}
        />
      </label>
      <label>
        <span>Mode</span>
        <select
          value={content.mode}
          disabled={disabled}
          onChange={(event) => onUpdate({ mode: event.target.value })}
        >
          <option value="box">Video box</option>
          <option value="background">Background video</option>
        </select>
      </label>
      <label>
        <span>Poster / thumbnail</span>
        <input
          type="text"
          value={content.thumbnail ?? ''}
          disabled={disabled}
          placeholder="/images/video-poster.jpg"
          onChange={(event) => onUpdate({ thumbnail: event.target.value || undefined })}
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
          disabled={disabled || content.mode === 'background'}
          onChange={(event) => onUpdate({ controls: event.target.checked })}
        />
        <span>Show controls</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'video',
  displayName: 'video',
  category: 'media',
  icon: '\u25FB',
  defaultContent: {
    url: '',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
    thumbnail: '',
    mode: 'box' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 300, height: 200 },
  Render: VideoRender,
  Inspector: VideoInspector,
});
