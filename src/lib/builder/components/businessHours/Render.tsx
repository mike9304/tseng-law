import type { BuilderBusinessHoursCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getLocationWidgetsCopy, localizedBusinessHourRows, localizedLocationWidgetText, LOCATION_WIDGETS_LEGACY_DEFAULTS } from '../location-widgets-copy';

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

export default BusinessHoursRender;
