import type { BuilderPricingTableCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { getMarketingWidgetsCopy, localizedPricingPlans } from '../marketing-widgets-copy';

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

export default PricingTableRender;
