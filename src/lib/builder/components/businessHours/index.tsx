import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBusinessHoursCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getLocationWidgetsCopy,
  localizedBusinessHourRows,
  localizedLocationWidgetText,
  LOCATION_WIDGETS_LEGACY_DEFAULTS,
} from '../location-widgets-copy';
import styles from './BusinessHoursInspector.module.css';

function BusinessHoursRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderBusinessHoursCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getLocationWidgetsCopy(locale);
  const title = localizedLocationWidgetText(c.title, copy.businessHours.defaultTitle, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.title);
  const timezone = localizedLocationWidgetText(c.timezone, copy.businessHours.defaultTimezone, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.timezone);
  const rows = localizedBusinessHourRows(c.rows, copy.businessHours.defaultRows);
  const note = localizedLocationWidgetText(c.note, copy.businessHours.defaultNote, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.note);
  const today = mode !== 'edit' ? new Date().getDay() : -1;

  return (
    <section
      className="builder-location-business-hours"
      data-builder-location-widget="business-hours"
    >
      <strong>{title}</strong>
      {timezone ? <small>{timezone}</small> : null}
      <ul>
        {rows.length === 0 ? (
          <li className="builder-location-empty"><em>{copy.businessHours.empty}</em></li>
        ) : (
          rows.map((row, idx) => (
            <li
              key={`${row.day}-${idx}`}
              data-builder-business-hours-today={today === idx ? 'true' : 'false'}
              data-builder-business-hours-closed={row.closed ? 'true' : 'false'}
            >
              <span>{row.day}</span>
              <em>{row.closed ? copy.businessHours.closed : row.hours || '—'}</em>
            </li>
          ))
        )}
      </ul>
      {note ? <p>{note}</p> : null}
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
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bhNode = node as BuilderBusinessHoursCanvasNode;
  const c = bhNode.content;
  const hoursCopy = getLocationWidgetsCopy(locale).businessHours;
  const copy = hoursCopy.inspector;
  const title = localizedLocationWidgetText(c.title, hoursCopy.defaultTitle, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.title);
  const timezone = localizedLocationWidgetText(c.timezone, hoursCopy.defaultTimezone, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.timezone);
  const rows = localizedBusinessHourRows(c.rows, hoursCopy.defaultRows);
  const note = localizedLocationWidgetText(c.note, hoursCopy.defaultNote, LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.note);
  return (
    <div className={styles.root} data-builder-business-hours-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.title}</span>
        <input type="text" value={title} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ title: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.timezone}</span>
        <input type="text" value={timezone} disabled={disabled} className={styles.control} onChange={(event) => onUpdate({ timezone: event.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.rows}</span>
        <textarea
          rows={7}
          className={`${styles.control} ${styles.textarea} ${styles.rowsTextarea}`}
          value={rowsToText(rows)}
          disabled={disabled}
          onChange={(event) => onUpdate({ rows: parseRows(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={c.showCurrentStatus} disabled={disabled} onChange={(event) => onUpdate({ showCurrentStatus: event.target.checked })} />
        <span>{copy.highlightToday}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.note}</span>
        <textarea rows={2} value={note} disabled={disabled} className={`${styles.control} ${styles.textarea}`} onChange={(event) => onUpdate({ note: event.target.value })} />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'business-hours',
  displayName: '영업 시간',
  category: 'advanced',
  icon: '🕒',
  defaultContent: {
    title: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.title,
    timezone: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.timezone,
    rows: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.rows.map((row) => ({ ...row })),
    showCurrentStatus: true,
    note: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.note,
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 280 },
  Render: BusinessHoursRender,
  Inspector: BusinessHoursInspector,
});
