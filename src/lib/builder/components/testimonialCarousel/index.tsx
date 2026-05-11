'use client';

import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTestimonialCarouselCanvasNode } from '@/lib/builder/canvas/types';

function TestimonialCarouselRender({
  node,
  mode = 'edit',
}: {
  node: BuilderTestimonialCarouselCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (mode === 'edit' || c.autoplayMs === 0 || c.items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIdx((current) => (current + 1) % c.items.length);
    }, c.autoplayMs);
    return () => window.clearInterval(timer);
  }, [c.autoplayMs, c.items.length, mode]);

  const active = c.items[idx] ?? null;

  return (
    <section className="builder-datadisplay-testimonial" data-builder-datadisplay-widget="testimonial-carousel">
      {active ? (
        <article>
          {c.showStars ? <div className="builder-datadisplay-testimonial-stars">★★★★★</div> : null}
          <blockquote>{active.quote}</blockquote>
          <footer>
            <strong>{active.name}</strong>
            {active.role ? <small>{active.role}</small> : null}
          </footer>
        </article>
      ) : (
        <em>의뢰인 후기를 인스펙터에서 추가하세요</em>
      )}
      {c.items.length > 1 ? (
        <nav>
          {c.items.map((_, i) => (
            <button
              key={i}
              type="button"
              data-active={idx === i ? 'true' : 'false'}
              onClick={() => mode !== 'edit' && setIdx(i)}
              aria-label={`testimonial ${i + 1}`}
            />
          ))}
        </nav>
      ) : null}
    </section>
  );
}

function itemsToText(items: BuilderTestimonialCarouselCanvasNode['content']['items']): string {
  return items.map((it) => `${it.name} | ${it.role ?? ''} | ${it.quote}`).join('\n');
}

function parseItems(value: string): BuilderTestimonialCarouselCanvasNode['content']['items'] {
  const out: BuilderTestimonialCarouselCanvasNode['content']['items'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [name, role, ...rest] = line.split('|').map((p) => p.trim());
    const quote = rest.join(' | ').trim();
    if (!name || !quote) continue;
    out.push({ name: name.slice(0, 80), role: role || undefined, quote: quote.slice(0, 800) });
  }
  return out.slice(0, 20);
}

function TestimonialCarouselInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tcNode = node as BuilderTestimonialCarouselCanvasNode;
  const c = tcNode.content;
  return (
    <>
      <label>
        <span>후기 (name | role | quote)</span>
        <textarea
          rows={6}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label>
        <span>자동 전환 (ms, 0 = 끔)</span>
        <input
          type="number"
          min={0}
          max={60000}
          step={500}
          value={c.autoplayMs}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplayMs: Number(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showStars} disabled={disabled} onChange={(event) => onUpdate({ showStars: event.target.checked })} />
        <span>별점 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'testimonial-carousel',
  displayName: '의뢰인 후기',
  category: 'advanced',
  icon: '❝',
  defaultContent: {
    items: [
      { name: '김 OO', role: '기업 의뢰인', quote: '한·대 양국 법무를 정확하게 검토해 주셔서 협상이 안전했습니다.' },
      { name: '張 OO', role: 'PMC 대표', quote: '시간대 차이를 고려해 빠르게 응답해 주셨고 결과도 만족스러웠습니다.' },
    ],
    autoplayMs: 6000,
    showStars: true,
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 240 },
  Render: TestimonialCarouselRender,
  Inspector: TestimonialCarouselInspector,
});
