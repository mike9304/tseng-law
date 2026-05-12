import { defineComponent } from '../define';
import BookingWidgetElement from './Element';
import BookingWidgetInspector from './Inspector';

export default defineComponent({
  kind: 'booking-widget',
  displayName: 'Booking Widget',
  category: 'domain',
  icon: 'B',
  defaultContent: {
    eyebrow: '',
    title: 'Book a consultation',
    locale: 'ko' as const,
    serviceId: '',
    staffId: '',
    successMessage: '예약이 완료되었습니다',
    redirectAfterBooking: '',
    showCaseSummary: true,
    caseSummaryLabel: '사건 개요',
    showAttachmentLinks: true,
    attachmentLinksLabel: '첨부 링크',
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
