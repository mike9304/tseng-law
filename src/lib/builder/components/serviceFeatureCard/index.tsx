import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderServiceFeatureCardCanvasNode } from '@/lib/builder/canvas/types';

function ServiceFeatureCardRender({
  node,
}: {
  node: BuilderServiceFeatureCardCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <article
      className="builder-datadisplay-service-card"
      data-builder-datadisplay-widget="service-feature-card"
      data-builder-service-variant={c.variant}
    >
      <span className="builder-datadisplay-service-icon" aria-hidden="true">{c.icon}</span>
      <strong>{c.title}</strong>
      {c.description ? <p>{c.description}</p> : null}
      {c.ctaHref && c.ctaLabel ? (
        <a href={c.ctaHref}>{c.ctaLabel} →</a>
      ) : null}
    </article>
  );
}

function ServiceFeatureCardInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sfNode = node as BuilderServiceFeatureCardCanvasNode;
  const c = sfNode.content;
  return (
    <>
      <label>
        <span>아이콘</span>
        <input type="text" value={c.icon} disabled={disabled} onChange={(event) => onUpdate({ icon: event.target.value })} />
      </label>
      <label>
        <span>제목</span>
        <input type="text" value={c.title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>설명</span>
        <textarea rows={4} value={c.description} disabled={disabled} onChange={(event) => onUpdate({ description: event.target.value })} />
      </label>
      <label>
        <span>CTA 라벨</span>
        <input type="text" value={c.ctaLabel} disabled={disabled} onChange={(event) => onUpdate({ ctaLabel: event.target.value })} />
      </label>
      <label>
        <span>CTA href</span>
        <input type="text" value={c.ctaHref} disabled={disabled} onChange={(event) => onUpdate({ ctaHref: event.target.value })} />
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderServiceFeatureCardCanvasNode['content']['variant'] })}
        >
          <option value="minimal">Minimal</option>
          <option value="card">Card</option>
          <option value="gradient">Gradient</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'service-feature-card',
  displayName: '서비스 카드',
  category: 'advanced',
  icon: '⊞',
  defaultContent: {
    icon: '⚖',
    title: '기업 자문',
    description: '회사 설립부터 분쟁 해결까지 한·대 양국 기준으로 검토합니다.',
    ctaLabel: '자세히',
    ctaHref: '/ko/services/corporate',
    variant: 'card' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 320, height: 220 },
  Render: ServiceFeatureCardRender,
  Inspector: ServiceFeatureCardInspector,
});
