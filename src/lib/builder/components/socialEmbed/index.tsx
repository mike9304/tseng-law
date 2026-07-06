import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSocialEmbedCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getSocialWidgetsCopy } from '../social-widgets-copy';
import styles from './SocialEmbedInspector.module.css';

function SocialEmbedRender({
  node,
  locale = 'ko',
  mode = 'edit',
}: {
  node: BuilderSocialEmbedCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const isEdit = mode === 'edit';
  const copy = getSocialWidgetsCopy(locale);
  const providerLabel = copy.socialEmbed.providers[c.provider];

  return (
    <div
      className="builder-social-embed"
      data-builder-social-widget="embed"
      data-builder-social-provider={c.provider}
      data-builder-social-layout={c.layout}
    >
      {c.showHeader ? (
        <header>
          <strong>{providerLabel}</strong>
          <small>{c.handle || c.channelId || copy.socialEmbed.handleFallback}</small>
        </header>
      ) : null}
      {isEdit ? (
        <div className="builder-social-embed-placeholder">
          <em>{copy.socialEmbed.editPlaceholder(providerLabel)}</em>
          <small>({copy.socialEmbed.editSdkHint})</small>
        </div>
      ) : (
        <div
          className="builder-social-embed-grid"
          data-builder-social-count={c.count}
        >
          {Array.from({ length: c.count }, (_, idx) => (
            <div key={idx} data-builder-social-tile={idx + 1}>
              <small>{providerLabel}/{idx + 1}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialEmbedInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const seNode = node as BuilderSocialEmbedCanvasNode;
  const c = seNode.content;
  const copy = getSocialWidgetsCopy(locale);
  return (
    <div className={styles.root} data-builder-social-embed-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialEmbed.inspector.provider}</span>
        <select
          value={c.provider}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderSocialEmbedCanvasNode['content']['provider'] })}
        >
          <option value="instagram-feed">{copy.socialEmbed.providers['instagram-feed']}</option>
          <option value="youtube-subscribe">{copy.socialEmbed.providers['youtube-subscribe']}</option>
          <option value="linkedin-follow">{copy.socialEmbed.providers['linkedin-follow']}</option>
          <option value="tiktok-feed">{copy.socialEmbed.providers['tiktok-feed']}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialEmbed.inspector.handle}</span>
        <input
          type="text"
          value={c.handle}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ handle: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialEmbed.inspector.layout}</span>
        <select
          value={c.layout}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderSocialEmbedCanvasNode['content']['layout'] })}
        >
          <option value="grid">{copy.socialEmbed.layouts.grid}</option>
          <option value="list">{copy.socialEmbed.layouts.list}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialEmbed.inspector.count}</span>
        <input
          type="number"
          min={1}
          max={20}
          value={c.count}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ count: Number(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showHeader}
          disabled={disabled}
          onChange={(event) => onUpdate({ showHeader: event.target.checked })}
        />
        <span>{copy.socialEmbed.inspector.showHeader}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'social-embed',
  displayName: '소셜 임베드',
  category: 'advanced',
  icon: 'SE',
  defaultContent: {
    provider: 'instagram-feed' as const,
    handle: '@hojeong',
    layout: 'grid' as const,
    count: 6,
    showHeader: true,
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 360 },
  Render: SocialEmbedRender,
  Inspector: SocialEmbedInspector,
});
