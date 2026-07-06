import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderBookingWidgetCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import {
  BOOKING_WIDGET_LEGACY_DEFAULTS,
  getBookingWidgetCopy,
  localizedBookingWidgetText,
} from './booking-widget-copy';
import styles from './BookingWidgetInspector.module.css';

export default function BookingWidgetInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bookingNode = node as BuilderBookingWidgetCanvasNode;
  const c = bookingNode.content;
  const effectiveLocale = normalizeLocale(locale);
  const widgetLocale = normalizeLocale(c.locale ?? effectiveLocale);
  const inspectorCopy = getBookingWidgetCopy(effectiveLocale);
  const widgetCopy = getBookingWidgetCopy(widgetLocale);
  const inspector = inspectorCopy.inspector;
  const defaults = widgetCopy.defaults;
  const values = {
    eyebrow: localizedBookingWidgetText(c.eyebrow, defaults.eyebrow, BOOKING_WIDGET_LEGACY_DEFAULTS.eyebrow),
    title: localizedBookingWidgetText(c.title, defaults.title, BOOKING_WIDGET_LEGACY_DEFAULTS.title),
    successMessage: localizedBookingWidgetText(
      c.successMessage,
      defaults.successMessage,
      BOOKING_WIDGET_LEGACY_DEFAULTS.successMessage,
    ),
    caseSummaryLabel: localizedBookingWidgetText(
      c.caseSummaryLabel,
      defaults.caseSummaryLabel,
      BOOKING_WIDGET_LEGACY_DEFAULTS.caseSummaryLabel,
    ),
    attachmentLinksLabel: localizedBookingWidgetText(
      c.attachmentLinksLabel,
      defaults.attachmentLinksLabel,
      BOOKING_WIDGET_LEGACY_DEFAULTS.attachmentLinksLabel,
    ),
    customFieldLabels: localizedBookingWidgetText(
      c.customFieldLabels,
      defaults.customFieldLabels,
      BOOKING_WIDGET_LEGACY_DEFAULTS.customFieldLabels,
    ),
  };

  return (
    <div className={styles.root} data-builder-booking-widget-inspector="true">
      <span className={styles.sectionLabel}>{inspector.section}</span>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.eyebrow}</span>
        <input
          className={styles.control}
          type="text"
          value={values.eyebrow}
          disabled={disabled}
          onChange={(event) => onUpdate({ eyebrow: event.target.value })}
          placeholder={inspector.eyebrowPlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.title}</span>
        <input
          className={styles.control}
          type="text"
          value={values.title}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
          placeholder={inspector.titlePlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.locale}</span>
        <select
          className={styles.control}
          value={widgetLocale}
          disabled={disabled}
          onChange={(event) => onUpdate({ locale: event.target.value })}
        >
          <option value="ko">{inspector.localeOptions.ko}</option>
          <option value="zh-hant">{inspector.localeOptions['zh-hant']}</option>
          <option value="en">{inspector.localeOptions.en}</option>
        </select>
      </label>

      <span className={styles.sectionLabel}>{inspector.filters}</span>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.serviceId}</span>
        <input
          className={styles.control}
          type="text"
          value={c.serviceId}
          disabled={disabled}
          onChange={(event) => onUpdate({ serviceId: event.target.value })}
          placeholder={inspector.serviceIdPlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.staffId}</span>
        <input
          className={styles.control}
          type="text"
          value={c.staffId}
          disabled={disabled}
          onChange={(event) => onUpdate({ staffId: event.target.value })}
          placeholder={inspector.staffIdPlaceholder}
        />
      </label>

      <span className={styles.sectionLabel}>{inspector.completion}</span>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.successMessage}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={3}
          value={values.successMessage}
          disabled={disabled}
          onChange={(event) => onUpdate({ successMessage: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.redirectAfterBooking}</span>
        <input
          className={styles.control}
          type="text"
          value={c.redirectAfterBooking}
          disabled={disabled}
          onChange={(event) => onUpdate({ redirectAfterBooking: event.target.value })}
          placeholder={inspector.redirectPlaceholder}
        />
      </label>

      <span className={styles.sectionLabel}>{inspector.form}</span>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showCaseSummary}
          disabled={disabled}
          onChange={(event) => onUpdate({ showCaseSummary: event.target.checked })}
        />
        <span>{inspector.showCaseSummary}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.caseSummaryLabel}</span>
        <input
          className={styles.control}
          type="text"
          value={values.caseSummaryLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ caseSummaryLabel: event.target.value })}
          placeholder={inspector.caseSummaryPlaceholder}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showAttachmentLinks}
          disabled={disabled}
          onChange={(event) => onUpdate({ showAttachmentLinks: event.target.checked })}
        />
        <span>{inspector.showAttachmentLinks}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.attachmentLabel}</span>
        <input
          className={styles.control}
          type="text"
          value={values.attachmentLinksLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ attachmentLinksLabel: event.target.value })}
          placeholder={inspector.attachmentPlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{inspector.customFields}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={4}
          value={values.customFieldLabels}
          disabled={disabled}
          onChange={(event) => onUpdate({ customFieldLabels: event.target.value })}
          placeholder={inspector.customFieldsPlaceholder}
        />
      </label>
    </div>
  );
}
