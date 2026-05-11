import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTimelineCanvasNode } from '@/lib/builder/canvas/types';

function TimelineRender({
  node,
}: {
  node: BuilderTimelineCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <ol
      className="builder-datadisplay-timeline"
      data-builder-datadisplay-widget="timeline"
      data-builder-timeline-orientation={c.orientation}
      style={{ '--builder-timeline-accent': c.accentColor } as React.CSSProperties}
    >
      {c.items.length === 0 ? (
        <li><em>타임라인 항목을 인스펙터에서 추가하세요</em></li>
      ) : (
        c.items.map((item, idx) => (
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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tNode = node as BuilderTimelineCanvasNode;
  const c = tNode.content;
  return (
    <>
      <label>
        <span>방향</span>
        <select
          value={c.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value as BuilderTimelineCanvasNode['content']['orientation'] })}
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </label>
      <label>
        <span>강조 색</span>
        <input type="text" value={c.accentColor} disabled={disabled} onChange={(event) => onUpdate({ accentColor: event.target.value })} />
      </label>
      <label>
        <span>항목 (year | title | description)</span>
        <textarea
          rows={6}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'timeline',
  displayName: '연혁',
  category: 'advanced',
  icon: '⌒',
  defaultContent: {
    items: [
      { year: '2018', title: '호정국제 설립', description: '서울·타이베이 동시 개소' },
      { year: '2020', title: '대만 변호사 파트너십' },
      { year: '2023', title: '연 자문 200건 돌파' },
      { year: '2025', title: '한·대 양국 자문 100% 디지털화' },
    ],
    orientation: 'vertical' as const,
    accentColor: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 360 },
  Render: TimelineRender,
  Inspector: TimelineInspector,
});
