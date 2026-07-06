import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTimelineCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getNavigationDecorativeCopy,
  localizedTimelineItems,
  TIMELINE_LEGACY_DEFAULT_ITEMS,
} from '../navigation-decorative-copy';
import styles from './TimelineInspector.module.css';

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

function itemsToText(items: BuilderTimelineCanvasNode['content']['items']): string {
  return items.map((it) => `${it.year} | ${it.title} | ${it.description ?? ''}`).join('\n');
}

function parseItems(value: string): BuilderTimelineCanvasNode['content']['items'] {
  const out: BuilderTimelineCanvasNode['content']['items'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [year, title, ...rest] = line.split('|').map((p) => p.trim());
    if (!year || !title) continue;
    const description = rest.join(' | ').trim();
    out.push({
      year: year.slice(0, 20),
      title: title.slice(0, 120),
      description: description ? description.slice(0, 400) : undefined,
    });
  }
  return out.slice(0, 40);
}

function TimelineInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tNode = node as BuilderTimelineCanvasNode;
  const c = tNode.content;
  const copy = getNavigationDecorativeCopy(locale);
  const items = localizedTimelineItems(c.items, copy.timeline);
  return (
    <div className={styles.root} data-builder-timeline-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.timeline.inspector.orientation}</span>
        <select
          className={styles.control}
          value={c.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value as BuilderTimelineCanvasNode['content']['orientation'] })}
        >
          <option value="vertical">{copy.timeline.inspector.orientations.vertical}</option>
          <option value="horizontal">{copy.timeline.inspector.orientations.horizontal}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.timeline.inspector.accentColor}</span>
        <input className={styles.control} type="text" value={c.accentColor} disabled={disabled} onChange={(event) => onUpdate({ accentColor: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.timeline.inspector.items}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={6}
          value={itemsToText(items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'timeline',
  displayName: '연혁',
  category: 'advanced',
  icon: '⌒',
  defaultContent: {
    items: TIMELINE_LEGACY_DEFAULT_ITEMS.map((item) => ({ ...item })),
    orientation: 'vertical' as const,
    accentColor: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 360 },
  Render: TimelineRender,
  Inspector: TimelineInspector,
});
