import type { BuilderLottieCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getMediaWidgetsCopy } from '../media-widgets-copy';

function isEmbeddableLottieUrl(src: string): boolean {
  return /^https:\/\/(lottie\.host|assets[0-9]?\.lottiefiles\.com|lottiefiles\.com)\//.test(src);
}

function LottieRender({ node, locale = 'ko' }: { node: BuilderLottieCanvasNode; locale?: Locale }) {
  const { src, label, autoplay, loop, speed } = node.content;
  const copy = getMediaWidgetsCopy(locale);
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
        title={label || copy.lottie.fallbackLabel}
        data-builder-media-widget="lottie"
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: 12,
          background: '#f8fafc',
        }}
        allow="autoplay"
        // Isolate the LottieFiles iframe — the embedded page can still run
        // its own scripts (Lottie playback requires it) but cannot reach
        // back into the parent origin or trigger top-level navigations.
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        referrerPolicy="no-referrer"
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
        <strong style={{ fontSize: 13 }}>{label || copy.lottie.fallbackLabel}</strong>
      </div>
    </div>
  );
}

export { isEmbeddableLottieUrl };

export default LottieRender;
