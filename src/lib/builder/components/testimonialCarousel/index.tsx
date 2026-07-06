'use client';

import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTestimonialCarouselCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getMarketingWidgetsCopy,
  localizedTestimonialItems,
  TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS,
} from '../marketing-widgets-copy';
import styles from './TestimonialCarouselInspector.module.css';

function TestimonialCarouselRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderTestimonialCarouselCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getMarketingWidgetsCopy(locale).testimonialCarousel;
  const items = localizedTestimonialItems(c.items, copy.defaultItems);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (mode === 'edit' || c.autoplayMs === 0 || items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIdx((current) => (current + 1) % items.length);
    }, c.autoplayMs);
    return () => window.clearInterval(timer);
  }, [c.autoplayMs, items.length, mode]);

  const active = items[idx] ?? null;

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
        <em>{copy.empty}</em>
      )}
      {items.length > 1 ? (
        <nav>
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              data-active={idx === i ? 'true' : 'false'}
              onClick={() => mode !== 'edit' && setIdx(i)}
              aria-label={copy.itemAriaLabel(i + 1)}
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
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tcNode = node as BuilderTestimonialCarouselCanvasNode;
  const c = tcNode.content;
  const testimonialCopy = getMarketingWidgetsCopy(locale).testimonialCarousel;
  const items = localizedTestimonialItems(c.items, testimonialCopy.defaultItems);
  const copy = testimonialCopy.inspector;
  return (
    <div className={styles.root} data-builder-testimonial-carousel-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.items}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={6}
          value={itemsToText(items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.autoplayMs}</span>
        <input
          className={styles.control}
          type="number"
          min={0}
          max={60000}
          step={500}
          value={c.autoplayMs}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoplayMs: Number(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showStars} disabled={disabled} onChange={(event) => onUpdate({ showStars: event.target.checked })} />
        <span>{copy.showStars}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'testimonial-carousel',
  displayName: '의뢰인 후기',
  category: 'advanced',
  icon: '❝',
  defaultContent: {
    items: TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS,
    autoplayMs: 6000,
    showStars: true,
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 240 },
  Render: TestimonialCarouselRender,
  Inspector: TestimonialCarouselInspector,
});
