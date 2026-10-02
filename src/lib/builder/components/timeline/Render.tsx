import type { BuilderTimelineCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getNavigationDecorativeCopy, localizedTimelineItems } from '../navigation-decorative-copy';

function TimelineRender({
  node,
  locale = 'ko',
}: {
  node: BuilderTimelineCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getNavigationDecorativeCopy(locale);
  const items = localizedTimelineItems(c.items, copy.timeline);
  return (
    <ol
      className="builder-datadisplay-timeline"
      data-builder-datadisplay-widget="timeline"
      data-builder-timeline-orientation={c.orientation}
      style={{ '--builder-timeline-accent': c.accentColor } as React.CSSProperties}
    >
      {items.length === 0 ? (
        <li><em>{copy.timeline.empty}</em></li>
      ) : (
        items.map((item, idx) => (
          <li key={`${item.year}-${idx}`}>
            <span className="builder-datadisplay-timeline-year">{item.year}</span>
            <strong>{item.title}</strong>
            {item.description ? <p>{item.description}</p> : null}
          </li>
        ))
      )}
    </ol>
  );
}

export default TimelineRender;
