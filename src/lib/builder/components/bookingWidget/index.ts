import { defineComponent } from '../define';
import BookingWidgetElement from './Element';
import BookingWidgetInspector from './Inspector';
import { BOOKING_WIDGET_LEGACY_DEFAULTS } from './booking-widget-copy';

export default defineComponent({
  kind: 'booking-widget',
  displayName: 'Booking Widget',
  category: 'domain',
  icon: 'B',
  defaultContent: {
    eyebrow: '',
    title: BOOKING_WIDGET_LEGACY_DEFAULTS.title[0],
    serviceId: '',
    staffId: '',
    successMessage: BOOKING_WIDGET_LEGACY_DEFAULTS.successMessage[0],
    redirectAfterBooking: '',
    showCaseSummary: true,
    caseSummaryLabel: BOOKING_WIDGET_LEGACY_DEFAULTS.caseSummaryLabel[0],
    showAttachmentLinks: true,
    attachmentLinksLabel: BOOKING_WIDGET_LEGACY_DEFAULTS.attachmentLinksLabel[0],
    customFieldLabels: '',
  },
  defaultStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'solid' as const,
    borderWidth: 0,
    borderRadius: 0,
  },
  defaultRect: { width: 720, height: 620 },
  Render: BookingWidgetElement,
  Inspector: BookingWidgetInspector,
});
