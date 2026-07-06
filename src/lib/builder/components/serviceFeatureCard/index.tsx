import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderServiceFeatureCardCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getServiceFeatureCardCopy,
  localizedServiceFeatureCardText,
  SERVICE_FEATURE_CARD_LEGACY_DEFAULTS,
} from './service-feature-card-copy';
import styles from './ServiceFeatureCardInspector.module.css';

function ServiceFeatureCardRender({
  node,
  locale,
}: {
  node: BuilderServiceFeatureCardCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getServiceFeatureCardCopy(normalizeLocale(locale || 'ko'));
  const title = localizedServiceFeatureCardText(
    c.title,
    copy.defaults.title,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.title,
  );
  const description = localizedServiceFeatureCardText(
    c.description,
    copy.defaults.description,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.description,
  );
  const ctaLabel = localizedServiceFeatureCardText(
    c.ctaLabel,
    copy.defaults.ctaLabel,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaLabel,
  );
  const ctaHrefValue = localizedServiceFeatureCardText(
    c.ctaHref,
    copy.defaults.ctaHref,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaHref,
  );
  return (
    <article
      className="builder-datadisplay-service-card"
      data-builder-datadisplay-widget="service-feature-card"
      data-builder-service-variant={c.variant}
    >
      <span className="builder-datadisplay-service-icon" aria-hidden="true">{c.icon}</span>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {(() => {
        const ctaHref = safeHref(ctaHrefValue);
        return ctaHref && ctaLabel ? (
          <a href={ctaHref}>{ctaLabel} →</a>
        ) : null;
      })()}
    </article>
  );
}

function ServiceFeatureCardInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sfNode = node as BuilderServiceFeatureCardCanvasNode;
  const c = sfNode.content;
  const copy = getServiceFeatureCardCopy(normalizeLocale(locale));
  const title = localizedServiceFeatureCardText(
    c.title,
    copy.defaults.title,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.title,
  );
  const description = localizedServiceFeatureCardText(
    c.description,
    copy.defaults.description,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.description,
  );
  const ctaLabel = localizedServiceFeatureCardText(
    c.ctaLabel,
    copy.defaults.ctaLabel,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaLabel,
  );
  const ctaHref = localizedServiceFeatureCardText(
    c.ctaHref,
    copy.defaults.ctaHref,
    SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaHref,
  );
  return (
    <div className={styles.root} data-builder-service-feature-card-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.icon}</span>
        <input className={styles.control} type="text" value={c.icon} disabled={disabled} onChange={(event) => onUpdate({ icon: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.title}</span>
        <input className={styles.control} type="text" value={title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.description}</span>
        <textarea className={`${styles.control} ${styles.textarea}`} rows={4} value={description} disabled={disabled} onChange={(event) => onUpdate({ description: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.ctaLabel}</span>
        <input className={styles.control} type="text" value={ctaLabel} disabled={disabled} onChange={(event) => onUpdate({ ctaLabel: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.ctaHref}</span>
        <input className={styles.control} type="text" value={ctaHref} disabled={disabled} onChange={(event) => onUpdate({ ctaHref: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.variant}</span>
        <select
          className={styles.control}
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderServiceFeatureCardCanvasNode['content']['variant'] })}
        >
          <option value="minimal">{copy.inspector.variants.minimal}</option>
          <option value="card">{copy.inspector.variants.card}</option>
          <option value="gradient">{copy.inspector.variants.gradient}</option>
        </select>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'service-feature-card',
  displayName: '서비스 카드',
  category: 'advanced',
  icon: '⊞',
  defaultContent: {
    icon: '⚖',
    title: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.title,
    description: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.description,
    ctaLabel: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaLabel,
    ctaHref: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaHref,
    variant: 'card' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 220 },
  Render: ServiceFeatureCardRender,
  Inspector: ServiceFeatureCardInspector,
});
