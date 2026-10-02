'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTestimonialCarouselCanvasNode } from '@/lib/builder/canvas/types';
import { getMarketingWidgetsCopy, localizedTestimonialItems, TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS } from '../marketing-widgets-copy';
import styles from './TestimonialCarouselInspector.module.css';

import TestimonialCarouselRender from './Render';

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
