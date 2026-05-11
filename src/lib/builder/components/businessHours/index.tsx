import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBusinessHoursCanvasNode } from '@/lib/builder/canvas/types';

function BusinessHoursRender({
  node,
  mode = 'edit',
}: {
  node: BuilderBusinessHoursCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const today = mode !== 'edit' ? new Date().getDay() : -1;

  return (
    <section
      className="builder-location-business-hours"
      data-builder-location-widget="business-hours"
    >
      <strong>{c.title}</strong>
      {c.timezone ? <small>{c.timezone}</small> : null}
      <ul>
        {c.rows.length === 0 ? (
          <li className="builder-location-empty"><em>영업 시간을 인스펙터에서 추가하세요</em></li>
        ) : (
          c.rows.map((row, idx) => (
            <li
              key={`${row.day}-${idx}`}
              data-builder-business-hours-today={today === idx ? 'true' : 'false'}
              data-builder-business-hours-closed={row.closed ? 'true' : 'false'}
            >
              <span>{row.day}</span>
              <em>{row.closed ? '휴무' : row.hours || '—'}</em>
            </li>
          ))
        )}
      </ul>
      {c.note ? <p>{c.note}</p> : null}
    </section>
  );
}

function rowsToText(rows: BuilderBusinessHoursCanvasNode['content']['rows']): string {
  return rows.map((r) => `${r.day} | ${r.hours}${r.closed ? ' | closed' : ''}`).join('\n');
}

function parseRows(value: string): BuilderBusinessHoursCanvasNode['content']['rows'] {
  const out: BuilderBusinessHoursCanvasNode['content']['rows'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split('|').map((p) => p.trim());
    const day = parts[0]?.slice(0, 20) ?? '';
    if (!day) continue;
    const hours = parts[1]?.slice(0, 60) ?? '';
    const closed = parts[2]?.toLowerCase() === 'closed';
    out.push({ day, hours, closed });
  }
  return out.slice(0, 14);
}

function BusinessHoursInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bhNode = node as BuilderBusinessHoursCanvasNode;
  const c = bhNode.content;
  return (
    <>
      <label>
        <span>제목</span>
        <input type="text" value={c.title} disabled={disabled} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label>
        <span>시간대</span>
        <input type="text" value={c.timezone} disabled={disabled} onChange={(event) => onUpdate({ timezone: event.target.value })} />
      </label>
      <label>
        <span>요일별 시간 (day | hours [| closed])</span>
        <textarea
          rows={7}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={rowsToText(c.rows)}
          disabled={disabled}
          onChange={(event) => onUpdate({ rows: parseRows(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showCurrentStatus} disabled={disabled} onChange={(event) => onUpdate({ showCurrentStatus: event.target.checked })} />
        <span>오늘 강조</span>
      </label>
      <label>
        <span>비고</span>
        <textarea rows={2} value={c.note} disabled={disabled} onChange={(event) => onUpdate({ note: event.target.value })} />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'business-hours',
  displayName: '영업 시간',
  category: 'advanced',
  icon: '🕒',
  defaultContent: {
    title: '영업 시간',
    timezone: 'Asia/Seoul',
    rows: [
      { day: '일', hours: '', closed: true },
      { day: '월', hours: '09:00 ~ 18:00', closed: false },
      { day: '화', hours: '09:00 ~ 18:00', closed: false },
      { day: '수', hours: '09:00 ~ 18:00', closed: false },
      { day: '목', hours: '09:00 ~ 18:00', closed: false },
      { day: '금', hours: '09:00 ~ 18:00', closed: false },
      { day: '토', hours: '10:00 ~ 14:00', closed: false },
    ],
    showCurrentStatus: true,
    note: '공휴일은 별도 안내합니다.',
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 280 },
  Render: BusinessHoursRender,
  Inspector: BusinessHoursInspector,
});
