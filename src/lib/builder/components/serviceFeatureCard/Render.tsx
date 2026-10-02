import type { BuilderServiceFeatureCardCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getServiceFeatureCardCopy, localizedServiceFeatureCardText, SERVICE_FEATURE_CARD_LEGACY_DEFAULTS } from './service-feature-card-copy';

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

export default ServiceFeatureCardRender;
