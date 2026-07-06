import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderLottieCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getMediaWidgetsCopy } from '../media-widgets-copy';
import styles from './LottieInspector.module.css';

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

function LottieInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const lottieNode = node as BuilderLottieCanvasNode;
  const content = lottieNode.content;
  const copy = getMediaWidgetsCopy(locale);
  const srcIsEmbeddable = content.src ? isEmbeddableLottieUrl(content.src) : false;

  return (
    <div className={styles.root} data-builder-lottie-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.lottie.inspector.url}</span>
        <input
          className={styles.control}
          type="text"
          value={content.src}
          disabled={disabled}
          placeholder={copy.lottie.inspector.urlPlaceholder}
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      {!content.src ? (
        <p className={styles.helpText}>
          <a
            href="https://lottiefiles.com/featured"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.helpLink}
          >
            lottiefiles.com
          </a>
          {copy.lottie.inspector.emptyHint.spaceAfterSource ? ' ' : ''}
          {copy.lottie.inspector.emptyHint.start}{' '}
          <strong>{copy.lottie.inspector.emptyHint.embedTab}</strong> {copy.lottie.inspector.emptyHint.middle}{' '}
          <code>{copy.lottie.inspector.emptyHint.iframeUrl}</code> {copy.lottie.inspector.emptyHint.end}{' '}
          <code>{copy.lottie.inspector.emptyHint.host}</code>{copy.lottie.inspector.emptyHint.spaceBeforeFinal ? ' ' : ''}
          {copy.lottie.inspector.emptyHint.final}
        </p>
      ) : !srcIsEmbeddable ? (
        <p className={styles.warningText}>
          ⚠ <code>lottie.host</code> / <code>lottiefiles.com</code> {copy.lottie.inspector.unsupportedHostWarning}
        </p>
      ) : null}
      <label className={styles.field}>
        <span className={styles.label}>{copy.lottie.inspector.label}</span>
        <input
          className={styles.control}
          type="text"
          value={content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.lottie.inspector.speed(content.speed)}</span>
        <input
          className={styles.range}
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={content.speed}
          disabled={disabled}
          onChange={(event) => onUpdate({ speed: Number(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.autoplay}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplay: event.target.checked })}
        />
        <span>{copy.lottie.inspector.autoplay}</span>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.loop}
          disabled={disabled}
          onChange={(event) => onUpdate({ loop: event.target.checked })}
        />
        <span>{copy.lottie.inspector.loop}</span>
      </label>
    </div>
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
