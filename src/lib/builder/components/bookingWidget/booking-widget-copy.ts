import type { Locale } from '@/lib/locales';

export interface BookingWidgetCopy {
  defaults: {
    eyebrow: string;
    title: string;
    successMessage: string;
    caseSummaryLabel: string;
    attachmentLinksLabel: string;
    customFieldLabels: string;
  };
  inspector: {
    section: string;
    eyebrow: string;
    eyebrowPlaceholder: string;
    title: string;
    titlePlaceholder: string;
    locale: string;
    localeOptions: Record<Locale, string>;
    filters: string;
    serviceId: string;
    serviceIdPlaceholder: string;
    staffId: string;
    staffIdPlaceholder: string;
    completion: string;
    successMessage: string;
    redirectAfterBooking: string;
    redirectPlaceholder: string;
    form: string;
    showCaseSummary: string;
    caseSummaryLabel: string;
    caseSummaryPlaceholder: string;
    showAttachmentLinks: string;
    attachmentLabel: string;
    attachmentPlaceholder: string;
    customFields: string;
    customFieldsPlaceholder: string;
  };
}

export const BOOKING_WIDGET_LEGACY_DEFAULTS = {
  eyebrow: ['Booking'],
  title: ['Book a consultation'],
  successMessage: ['예약이 완료되었습니다'],
  caseSummaryLabel: ['사건 개요'],
  attachmentLinksLabel: ['첨부 링크'],
  customFieldLabels: [
    '희망 상담 언어\n상대방 이름\n사건 지역',
  ],
} as const;

const BOOKING_WIDGET_COPY: Record<Locale, BookingWidgetCopy> = {
  ko: {
    defaults: {
      eyebrow: '예약',
      title: '상담 예약',
      successMessage: '예약이 완료되었습니다',
      caseSummaryLabel: '사건 개요',
      attachmentLinksLabel: '첨부 링크',
      customFieldLabels: '희망 상담 언어\n상대방 이름\n사건 지역',
    },
    inspector: {
      section: '섹션',
      eyebrow: '상단 라벨',
      eyebrowPlaceholder: '예약',
      title: '제목',
      titlePlaceholder: '상담 예약',
      locale: '예약 언어',
      localeOptions: {
        ko: '한국어',
        'zh-hant': '번체 중국어',
        en: '영어',
      },
      filters: '예약 필터',
      serviceId: '서비스 ID',
      serviceIdPlaceholder: 'svc-initial-consultation',
      staffId: '담당자 ID',
      staffIdPlaceholder: 'staff-tseng',
      completion: '완료',
      successMessage: '완료 메시지',
      redirectAfterBooking: '예약 후 이동',
      redirectPlaceholder: '/ko/thank-you',
      form: '예약 양식',
      showCaseSummary: '사건 개요 필드 표시',
      caseSummaryLabel: '사건 개요 라벨',
      caseSummaryPlaceholder: '사건 개요',
      showAttachmentLinks: '첨부 링크 필드 표시',
      attachmentLabel: '첨부 라벨',
      attachmentPlaceholder: '첨부 링크',
      customFields: '커스텀 필드',
      customFieldsPlaceholder: '희망 상담 언어\n상대방 이름\n사건 지역',
    },
  },
  'zh-hant': {
    defaults: {
      eyebrow: '預約',
      title: '預約諮詢',
      successMessage: '預約已完成。',
      caseSummaryLabel: '案件概述',
      attachmentLinksLabel: '附件連結',
      customFieldLabels: '偏好諮詢語言\n對方姓名\n案件地區',
    },
    inspector: {
      section: '區段',
      eyebrow: '眉標',
      eyebrowPlaceholder: '預約',
      title: '標題',
      titlePlaceholder: '預約諮詢',
      locale: '預約語言',
      localeOptions: {
        ko: '韓文',
        'zh-hant': '繁體中文',
        en: '英文',
      },
      filters: '預約篩選',
      serviceId: '服務 ID',
      serviceIdPlaceholder: 'svc-initial-consultation',
      staffId: '員工 ID',
      staffIdPlaceholder: 'staff-tseng',
      completion: '完成',
      successMessage: '成功訊息',
      redirectAfterBooking: '預約後重新導向',
      redirectPlaceholder: '/zh-hant/thank-you',
      form: '預約表單',
      showCaseSummary: '顯示案件概述欄位',
      caseSummaryLabel: '案件概述標籤',
      caseSummaryPlaceholder: '案件概述',
      showAttachmentLinks: '顯示附件連結欄位',
      attachmentLabel: '附件標籤',
      attachmentPlaceholder: '附件連結',
      customFields: '自訂欄位',
      customFieldsPlaceholder: '偏好諮詢語言\n對方姓名\n案件地區',
    },
  },
  en: {
    defaults: {
      eyebrow: 'Booking',
      title: 'Book a consultation',
      successMessage: 'Booking complete.',
      caseSummaryLabel: 'Case summary',
      attachmentLinksLabel: 'Attachment links',
      customFieldLabels: 'Preferred consultation language\nOpposing party name\nCase location',
    },
    inspector: {
      section: 'Section',
      eyebrow: 'Eyebrow',
      eyebrowPlaceholder: 'Booking',
      title: 'Title',
      titlePlaceholder: 'Book a consultation',
      locale: 'Booking language',
      localeOptions: {
        ko: 'Korean',
        'zh-hant': 'Traditional Chinese',
        en: 'English',
      },
      filters: 'Booking filters',
      serviceId: 'Service ID',
      serviceIdPlaceholder: 'svc-initial-consultation',
      staffId: 'Staff ID',
      staffIdPlaceholder: 'staff-tseng',
      completion: 'Completion',
      successMessage: 'Success message',
      redirectAfterBooking: 'Redirect after booking',
      redirectPlaceholder: '/en/thank-you',
      form: 'Booking form',
      showCaseSummary: 'Show case summary field',
      caseSummaryLabel: 'Case summary label',
      caseSummaryPlaceholder: 'Case summary',
      showAttachmentLinks: 'Show attachment links field',
      attachmentLabel: 'Attachment label',
      attachmentPlaceholder: 'Attachment links',
      customFields: 'Custom fields',
      customFieldsPlaceholder: 'Preferred consultation language\nOpposing party name\nCase location',
    },
  },
};

export function getBookingWidgetCopy(locale: Locale): BookingWidgetCopy {
  return BOOKING_WIDGET_COPY[locale] ?? BOOKING_WIDGET_COPY.ko;
}

export function localizedBookingWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefaults: readonly string[],
): string {
  const current = value ?? '';
  if (!current) return current;
  return legacyDefaults.includes(current) ? localized : current;
}
