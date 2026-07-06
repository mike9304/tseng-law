import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPricingTableCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import {
  getMarketingWidgetsCopy,
  localizedPricingPlans,
  PRICING_TABLE_LEGACY_DEFAULT_PLANS,
} from '../marketing-widgets-copy';
import styles from './PricingTableInspector.module.css';

function PricingTableRender({
  node,
  locale = 'ko',
}: {
  node: BuilderPricingTableCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getMarketingWidgetsCopy(locale);
  const plans = localizedPricingPlans(c.plans, copy.pricingTable.defaultPlans);
  return (
    <section className="builder-datadisplay-pricing-table" data-builder-datadisplay-widget="pricing-table">
      {plans.length === 0 ? (
        <em>{copy.pricingTable.empty}</em>
      ) : (
        plans.map((plan, idx) => {
          const ctaHref = safeHref(plan.ctaHref);
          return (
            <article key={`${plan.name}-${idx}`} data-featured={plan.featured ? 'true' : 'false'}>
              <header>
                <strong>{plan.name}</strong>
                <span className="builder-datadisplay-pricing-price">
                  {plan.price}
                  {plan.period ? <small>{plan.period}</small> : null}
                </span>
              </header>
              <ul>
                {plan.features.map((feat, i) => <li key={i}>{feat}</li>)}
              </ul>
              {ctaHref ? (
                <a href={ctaHref}>{plan.ctaLabel}</a>
              ) : (
                <button type="button">{plan.ctaLabel}</button>
              )}
            </article>
          );
        })
      )}
    </section>
  );
}

function plansToText(plans: BuilderPricingTableCanvasNode['content']['plans']): string {
  return plans.map((p) => [
    p.name,
    p.price,
    p.period ?? '',
    p.featured ? 'featured' : '',
    p.ctaLabel,
    p.ctaHref,
    p.features.join('; '),
  ].join(' | ')).join('\n');
}

function parsePlans(value: string, defaultCtaLabel: string): BuilderPricingTableCanvasNode['content']['plans'] {
  const out: BuilderPricingTableCanvasNode['content']['plans'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split('|').map((p) => p.trim());
    const [name, price, period, flag, ctaLabel, ctaHref, featuresStr] = parts;
    if (!name) continue;
    const plan: BuilderPricingTableCanvasNode['content']['plans'][number] = {
      name: name.slice(0, 60),
      price: (price ?? '').slice(0, 60),
      period: period || undefined,
      featured: (flag ?? '').toLowerCase() === 'featured',
      ctaLabel: (ctaLabel || defaultCtaLabel).slice(0, 60),
      ctaHref: (ctaHref ?? '').slice(0, 2000),
      features: (featuresStr ?? '').split(';').map((p) => p.trim()).filter(Boolean).slice(0, 20),
    };
    out.push(plan);
  }
  return out.slice(0, 6);
}

function PricingTableInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ptNode = node as BuilderPricingTableCanvasNode;
  const c = ptNode.content;
  const copy = getMarketingWidgetsCopy(locale);
  const plans = localizedPricingPlans(c.plans, copy.pricingTable.defaultPlans);
  return (
    <div className={styles.root} data-builder-pricing-table-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.pricingTable.inspector.plans}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={8}
          value={plansToText(plans)}
          disabled={disabled}
          onChange={(event) => onUpdate({ plans: parsePlans(event.target.value, copy.pricingTable.defaultCtaLabel) })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'pricing-table',
  displayName: '요금제',
  category: 'advanced',
  icon: '💰',
  defaultContent: {
    plans: PRICING_TABLE_LEGACY_DEFAULT_PLANS,
  },
  defaultStyle: {},
  defaultRect: { width: 720, height: 360 },
  Render: PricingTableRender,
  Inspector: PricingTableInspector,
});
