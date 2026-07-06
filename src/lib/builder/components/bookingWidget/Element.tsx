'use client';

import BookingFlowSteps from '@/components/builder/bookings/BookingFlowSteps';
import type { BuilderBookingWidgetCanvasNode } from '@/lib/builder/canvas/types';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  BOOKING_WIDGET_LEGACY_DEFAULTS,
  getBookingWidgetCopy,
  localizedBookingWidgetText,
} from './booking-widget-copy';

interface BookingWidgetElementProps {
  node: BuilderBookingWidgetCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

const shellStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  height: '100%',
  overflow: 'auto',
  padding: 20,
  width: '100%',
};

const eyebrowStyle: React.CSSProperties = {
  color: '#176bff',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.08em',
  margin: 0,
  textTransform: 'uppercase',
};

const titleStyle: React.CSSProperties = {
  color: '#172033',
  fontSize: 28,
  fontWeight: 800,
  lineHeight: 1.18,
  margin: 0,
};

const previewShellStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #dce4ef',
  borderRadius: 8,
  display: 'grid',
  gap: 18,
  padding: 20,
};

const stepsStyle: React.CSSProperties = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
};

const stepStyle: React.CSSProperties = {
  borderBottom: '3px solid #d9e2f0',
  color: '#64748b',
  fontSize: 12,
  fontWeight: 900,
  paddingBottom: 9,
};

const activeStepStyle: React.CSSProperties = {
  ...stepStyle,
  borderColor: '#176bff',
  color: '#176bff',
};

const optionGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
};

const optionStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d5deeb',
  borderRadius: 8,
  padding: 14,
  textAlign: 'left',
};

const mutedStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 13,
  lineHeight: 1.45,
  margin: '6px 0 0',
};

const noticeStyle: React.CSSProperties = {
  background: '#ecfdf5',
  border: '1px solid #bbf7d0',
  borderRadius: 8,
  color: '#166534',
  fontSize: 13,
  fontWeight: 800,
  padding: 14,
};

function normalizeOptionalId(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function BookingWidgetPreview({ node, locale: renderLocale }: { node: BuilderBookingWidgetCanvasNode; locale?: Locale }) {
  const locale = normalizeLocale((node.content.locale as Locale | string | undefined) ?? renderLocale);
  const copy = getBookingFlowCopy(locale);
  const widgetCopy = getBookingWidgetCopy(locale);
  const serviceLabel = normalizeOptionalId(node.content.serviceId) ?? copy.preview.allActiveServices;
  const staffLabel = normalizeOptionalId(node.content.staffId) ?? copy.preview.anyAssignedStaff;
  const successMessage = localizedBookingWidgetText(
    node.content.successMessage,
    widgetCopy.defaults.successMessage,
    BOOKING_WIDGET_LEGACY_DEFAULTS.successMessage,
  );

  return (
    <div style={previewShellStyle}>
      <div style={stepsStyle}>
        {copy.steps.map((label, index) => (
          <div key={label} style={index === 0 ? activeStepStyle : stepStyle}>
            {index + 1}. {label}
          </div>
        ))}
      </div>
      <div style={optionGridStyle}>
        <div style={optionStyle}>
          <strong style={{ color: '#172033' }}>{serviceLabel}</strong>
          <p style={mutedStyle}>{copy.preview.serviceCards}</p>
        </div>
        <div style={optionStyle}>
          <strong style={{ color: '#172033' }}>{staffLabel}</strong>
          <p style={mutedStyle}>{copy.preview.staffCards}</p>
        </div>
      </div>
      <div style={noticeStyle}>{successMessage}</div>
    </div>
  );
}

export default function BookingWidgetElement({ node, mode = 'edit', locale: renderLocale }: BookingWidgetElementProps) {
  const {
    eyebrow,
    title,
    locale,
    successMessage,
    redirectAfterBooking,
    showCaseSummary,
    caseSummaryLabel,
    showAttachmentLinks,
    attachmentLinksLabel,
    customFieldLabels,
  } = node.content;
  const widgetLocale = normalizeLocale((locale as Locale | string | undefined) ?? renderLocale);
  const widgetCopy = getBookingWidgetCopy(widgetLocale);
  const displayEyebrow = localizedBookingWidgetText(
    eyebrow,
    widgetCopy.defaults.eyebrow,
    BOOKING_WIDGET_LEGACY_DEFAULTS.eyebrow,
  );
  const displayTitle = localizedBookingWidgetText(
    title,
    widgetCopy.defaults.title,
    BOOKING_WIDGET_LEGACY_DEFAULTS.title,
  );
  const displaySuccessMessage = localizedBookingWidgetText(
    successMessage,
    widgetCopy.defaults.successMessage,
    BOOKING_WIDGET_LEGACY_DEFAULTS.successMessage,
  );
  const displayCaseSummaryLabel = localizedBookingWidgetText(
    caseSummaryLabel,
    widgetCopy.defaults.caseSummaryLabel,
    BOOKING_WIDGET_LEGACY_DEFAULTS.caseSummaryLabel,
  );
  const displayAttachmentLinksLabel = localizedBookingWidgetText(
    attachmentLinksLabel,
    widgetCopy.defaults.attachmentLinksLabel,
    BOOKING_WIDGET_LEGACY_DEFAULTS.attachmentLinksLabel,
  );
  const displayCustomFieldLabels = localizedBookingWidgetText(
    customFieldLabels,
    widgetCopy.defaults.customFieldLabels,
    BOOKING_WIDGET_LEGACY_DEFAULTS.customFieldLabels,
  );
  const serviceId = normalizeOptionalId(node.content.serviceId);
  const staffId = normalizeOptionalId(node.content.staffId);
  const redirectUrl = normalizeOptionalId(redirectAfterBooking);
  const hasHeader = Boolean(displayEyebrow || displayTitle);

  return (
    <section style={shellStyle}>
      {hasHeader ? (
        <header style={{ display: 'grid', gap: 8 }}>
          {displayEyebrow ? <p style={eyebrowStyle}>{displayEyebrow}</p> : null}
          {displayTitle ? <h2 style={titleStyle}>{displayTitle}</h2> : null}
        </header>
      ) : null}
      {mode === 'published' ? (
        <BookingFlowSteps
          locale={widgetLocale}
          serviceId={serviceId}
          staffId={staffId}
          successMessage={displaySuccessMessage}
          redirectAfterBooking={redirectUrl}
          showCaseSummary={showCaseSummary}
          caseSummaryLabel={displayCaseSummaryLabel}
          showAttachmentLinks={showAttachmentLinks}
          attachmentLinksLabel={displayAttachmentLinksLabel}
          customFieldLabels={displayCustomFieldLabels}
        />
      ) : (
        <BookingWidgetPreview node={node} locale={renderLocale} />
      )}
    </section>
  );
}
