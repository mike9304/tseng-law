import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderLottieCanvasNode } from '@/lib/builder/canvas/types';

function isEmbeddableLottieUrl(src: string): boolean {
  return /^https:\/\/(lottie\.host|assets[0-9]?\.lottiefiles\.com|lottiefiles\.com)\//.test(src);
}

function LottieRender({ node }: { node: BuilderLottieCanvasNode }) {
  const { src, label, autoplay, loop, speed } = node.content;
  const canEmbed = src && isEmbeddableLottieUrl(src);

  if (canEmbed) {
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (loop) params.set('loop', '1');
    params.set('speed', String(speed));
    const separator = src.includes('?') ? '&' : '?';
    return (
      <iframe
        src={`${src}${separator}${params.toString()}`}
        title={label || 'Lottie animation'}
        data-builder-media-widget="lottie"
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: 12,
          background: '#f8fafc',
        }}
        allow="autoplay"
      />
    );
  }

  return (
    <div
      data-builder-media-widget="lottie"
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: 'radial-gradient(circle at 50% 45%, rgba(17,109,255,0.16), rgba(248,250,252,0.96) 56%)',
        color: '#0f172a',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
        <div className="builder-lottie-preview-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <strong style={{ fontSize: 13 }}>{label || 'Lottie animation'}</strong>
      </div>
    </div>
  );
}

function LottieInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const lottieNode = node as BuilderLottieCanvasNode;
  const content = lottieNode.content;

  return (
    <>
      <label>
        <span>Lottie URL</span>
        <input
          type="text"
          value={content.src}
          disabled={disabled}
          placeholder="https://lottie.host/embed/..."
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>Speed {content.speed}x</span>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={content.speed}
          disabled={disabled}
          onChange={(event) => onUpdate({ speed: Number(event.target.value) })}
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
    </>
  );
}

export default defineComponent({
  kind: 'lottie',
  displayName: 'Lottie',
  category: 'media',
  icon: '◌',
  defaultContent: {
    src: '',
    label: 'Lottie animation',
    autoplay: true,
    loop: true,
    speed: 1,
  },
  defaultStyle: {},
  defaultRect: { width: 260, height: 220 },
  Render: LottieRender,
  Inspector: LottieInspector,
});
