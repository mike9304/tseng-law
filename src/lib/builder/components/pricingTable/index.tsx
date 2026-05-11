import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPricingTableCanvasNode } from '@/lib/builder/canvas/types';

function PricingTableRender({
  node,
}: {
  node: BuilderPricingTableCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <section className="builder-datadisplay-pricing-table" data-builder-datadisplay-widget="pricing-table">
      {c.plans.length === 0 ? (
        <em>요금제를 인스펙터에서 추가하세요</em>
      ) : (
        c.plans.map((plan, idx) => (
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
            {plan.ctaHref ? (
              <a href={plan.ctaHref}>{plan.ctaLabel}</a>
            ) : (
              <button type="button">{plan.ctaLabel}</button>
            )}
          </article>
        ))
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

function parsePlans(value: string): BuilderPricingTableCanvasNode['content']['plans'] {
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
      ctaLabel: (ctaLabel ?? '선택').slice(0, 60),
      ctaHref: (ctaHref ?? '').slice(0, 2000),
      features: (featuresStr ?? '').split(';').map((p) => p.trim()).filter(Boolean).slice(0, 20),
    };
    out.push(plan);
  }
  return out.slice(0, 6);
}

function PricingTableInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const ptNode = node as BuilderPricingTableCanvasNode;
  const c = ptNode.content;
  return (
    <>
      <label>
        <span>요금제 (name | price | period | featured | ctaLabel | ctaHref | feature1; feature2)</span>
        <textarea
          rows={8}
          style={{ fontFamily: 'inherit', resize: 'vertical', fontSize: 11 }}
          value={plansToText(c.plans)}
          disabled={disabled}
          onChange={(event) => onUpdate({ plans: parsePlans(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'pricing-table',
  displayName: '요금제',
  category: 'advanced',
  icon: '💰',
  defaultContent: {
    plans: [
      { name: '기본', price: '50만원', period: '/ 상담', featured: false, ctaLabel: '신청', ctaHref: '/ko/contact', features: ['초기 1시간 상담', '서면 요약', '문의 1회'] },
      { name: '표준', price: '200만원', period: '/ 월', featured: true, ctaLabel: '추천', ctaHref: '/ko/contact', features: ['월 5건 자문', '계약서 검토', '협상 지원', '월간 보고'] },
      { name: '프리미엄', price: '500만원', period: '/ 월', featured: false, ctaLabel: '문의', ctaHref: '/ko/contact', features: ['무제한 자문', '소송 대응', '한·대 양국 협업', '실시간 응대'] },
    ],
  },
  defaultStyle: {},
  defaultRect: { width: 720, height: 360 },
  Render: PricingTableRender,
  Inspector: PricingTableInspector,
});
