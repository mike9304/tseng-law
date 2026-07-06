import type { Locale } from '@/lib/locales';

export const bookingEmailTemplatePlaceholders = [
  'customerName',
  'customerEmail',
  'customerPhone',
  'serviceName',
  'staffName',
  'startTime',
  'endTime',
  'timezone',
  'meetingLink',
  'manageUrl',
  'caseSummary',
  'notes',
  'bookingSummary',
] as const;

const bookingEmailTemplateConfigByLocale = {
  ko: {
    'customer-confirmation': {
      label: '고객 확인',
      description: '예약이 생성되거나 대기열에서 승격된 뒤 고객에게 전송됩니다.',
      subject: '[Hojeong] {{serviceName}} 예약이 확정되었습니다',
      body: `안녕하세요 {{customerName}}님,

상담이 확정되었습니다.

서비스: {{serviceName}}
담당자: {{staffName}}
시간: {{startTime}}
회의 링크: {{meetingLink}}

아래 링크에서 예약을 관리, 일정 변경, 취소할 수 있습니다.
{{manageUrl}}

{{bookingSummary}}`,
    },
    'admin-notification': {
      label: '관리자 알림',
      description: '예약이 생성되면 담당 변호사나 예약 관리자에게 전송됩니다.',
      subject: '[예약] 새 상담: {{customerName}}',
      body: `새 상담이 예약되었습니다.

고객: {{customerName}}
이메일: {{customerEmail}}
전화: {{customerPhone}}
서비스: {{serviceName}}
담당자: {{staffName}}
시간: {{startTime}}

사건 요약:
{{caseSummary}}

{{bookingSummary}}`,
    },
    'customer-reminder': {
      label: '고객 리마인더',
      description: '상담 전에 미리 보내는 리마인더 이메일 본문입니다.',
      subject: '[Hojeong] 상담 리마인더: {{startTime}}',
      body: `안녕하세요 {{customerName}}님,

예정된 상담을 다시 알려드립니다.

서비스: {{serviceName}}
담당자: {{staffName}}
시간: {{startTime}}
회의 링크: {{meetingLink}}

예약 관리:
{{manageUrl}}`,
    },
    'customer-cancellation': {
      label: '고객 취소',
      description: '예약이 취소되면 고객에게 전송됩니다.',
      subject: '[Hojeong] 상담 예약이 취소되었습니다',
      body: `안녕하세요 {{customerName}}님,

상담이 취소되었습니다.

서비스: {{serviceName}}
담당자: {{staffName}}
원래 시간: {{startTime}}

실수로 취소된 경우 사이트에서 새 상담을 예약해 주세요.`,
    },
  },
  'zh-hant': {
    'customer-confirmation': {
      label: '客戶確認',
      description: '預約建立或從候補名單提升後寄給客戶。',
      subject: '[Hojeong] 已確認 {{serviceName}} 預約',
      body: `您好，{{customerName}}：

您的諮詢已確認。

服務：{{serviceName}}
承辦律師：{{staffName}}
時間：{{startTime}}
會議連結：{{meetingLink}}

您可以在這裡管理、改期或取消：
{{manageUrl}}

{{bookingSummary}}`,
    },
    'admin-notification': {
      label: '管理員通知',
      description: '當預約建立後寄給承辦律師或預約管理員。',
      subject: '[預約] 新諮詢：{{customerName}}',
      body: `已預約新的諮詢。

客戶：{{customerName}}
電子郵件：{{customerEmail}}
電話：{{customerPhone}}
服務：{{serviceName}}
承辦律師：{{staffName}}
時間：{{startTime}}

案件摘要：
{{caseSummary}}

{{bookingSummary}}`,
    },
    'customer-reminder': {
      label: '客戶提醒',
      description: '在諮詢前寄送的提醒信內容。',
      subject: '[Hojeong] 諮詢提醒：{{startTime}}',
      body: `您好，{{customerName}}：

這是您即將到來的諮詢提醒。

服務：{{serviceName}}
承辦律師：{{staffName}}
時間：{{startTime}}
會議連結：{{meetingLink}}

管理此預約：
{{manageUrl}}`,
    },
    'customer-cancellation': {
      label: '客戶取消',
      description: '預約取消時寄給客戶。',
      subject: '[Hojeong] 諮詢預約已取消',
      body: `您好，{{customerName}}：

您的諮詢已取消。

服務：{{serviceName}}
承辦律師：{{staffName}}
原始時間：{{startTime}}

若為誤取消，請從網站重新預約。`,
    },
  },
  en: {
    'customer-confirmation': {
      label: 'Customer confirmation',
      description: 'Sent to the customer after a booking is created or promoted from the waitlist.',
      subject: '[Hojeong] {{serviceName}} booking confirmed',
      body: `Hello {{customerName}},

Your consultation is confirmed.

Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}
Meeting link: {{meetingLink}}

You can manage, reschedule, or cancel here:
{{manageUrl}}

{{bookingSummary}}`,
    },
    'admin-notification': {
      label: 'Admin notification',
      description: 'Sent to the assigned attorney or bookings admin when a booking is created.',
      subject: '[Bookings] New consultation: {{customerName}}',
      body: `A new consultation has been booked.

Customer: {{customerName}}
Email: {{customerEmail}}
Phone: {{customerPhone}}
Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}

Case summary:
{{caseSummary}}

{{bookingSummary}}`,
    },
    'customer-reminder': {
      label: 'Customer reminder',
      description: 'Sent before a consultation as the reminder email body.',
      subject: '[Hojeong] Consultation reminder: {{startTime}}',
      body: `Hello {{customerName}},

This is a reminder for your upcoming consultation.

Service: {{serviceName}}
Attorney: {{staffName}}
Time: {{startTime}}
Meeting link: {{meetingLink}}

Manage this booking:
{{manageUrl}}`,
    },
    'customer-cancellation': {
      label: 'Customer cancellation',
      description: 'Sent to the customer when a booking is cancelled.',
      subject: '[Hojeong] Consultation booking cancelled',
      body: `Hello {{customerName}},

Your consultation has been cancelled.

Service: {{serviceName}}
Attorney: {{staffName}}
Original time: {{startTime}}

If this was a mistake, please book a new consultation from the site.`,
    },
  },
} as const;

export function getBookingEmailTemplateConfig(locale: Locale) {
  return bookingEmailTemplateConfigByLocale[locale] ?? bookingEmailTemplateConfigByLocale.en;
}

export const bookingEmailTemplateConfig = bookingEmailTemplateConfigByLocale.en;
