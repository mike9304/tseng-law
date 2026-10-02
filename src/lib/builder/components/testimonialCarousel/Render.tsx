'use client';

import { useEffect, useState } from 'react';
import type { BuilderTestimonialCarouselCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getMarketingWidgetsCopy, localizedTestimonialItems } from '../marketing-widgets-copy';

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

export default TestimonialCarouselRender;
