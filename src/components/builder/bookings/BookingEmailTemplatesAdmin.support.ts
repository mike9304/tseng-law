import type { Locale } from '@/lib/locales';

type BookingEmailTemplateAdminCopy = {
  readonly listLabel: string;
  readonly editorLabel: string;
  readonly active: string;
  readonly subject: string;
  readonly subjectPlaceholder: string;
  readonly body: string;
  readonly bodyPlaceholder: string;
  readonly placeholders: string;
  readonly save: string;
  readonly saving: string;
  readonly reset: string;
  readonly preview: string;
  readonly saved: string;
  readonly saveFailed: string;
};

export const bookingEmailTemplateAdminCopy = {
  ko: {
    listLabel: '예약 이메일 템플릿 목록',
    editorLabel: '예약 이메일 템플릿 편집기',
    active: '활성',
    subject: '제목',
    subjectPlaceholder: '{{token}} 변수 사용 · 예: {{serviceName}} 예약 확정',
    body: '본문',
    bodyPlaceholder: '{{token}} 변수 사용 · 예: 안녕하세요 {{customerName}}님, {{serviceName}} 예약이 확정되었습니다.',
    placeholders: '사용 가능한 자리표시자',
    save: '템플릿 저장',
    saving: '저장 중...',
    reset: '기본값으로 재설정',
    preview: '실시간 미리보기',
    saved: '이메일 템플릿을 저장했습니다.',
    saveFailed: '이메일 템플릿을 저장하지 못했습니다.',
  },
  'zh-hant': {
    listLabel: '預約電子郵件範本清單',
    editorLabel: '預約電子郵件範本編輯器',
    active: '啟用',
    subject: '主旨',
    subjectPlaceholder: '使用 {{token}} 變數 · 例如：{{serviceName}} 預約確認',
    body: '內文',
    bodyPlaceholder: '使用 {{token}} 變數 · 例如：您好 {{customerName}}，{{serviceName}} 預約已確認。',
    placeholders: '可用的替代符號',
    save: '儲存範本',
    saving: '儲存中...',
    reset: '重設為預設值',
    preview: '即時預覽',
    saved: '已儲存電子郵件範本。',
    saveFailed: '無法儲存電子郵件範本。',
  },
  en: {
    listLabel: 'Booking email template list',
    editorLabel: 'Booking email template editor',
    active: 'Active',
    subject: 'Subject',
    subjectPlaceholder: 'Use {{token}} variables · e.g. {{serviceName}} booking confirmed',
    body: 'Body',
    bodyPlaceholder: 'Use {{token}} variables · e.g. Hi {{customerName}}, your {{serviceName}} booking is confirmed.',
    placeholders: 'Available placeholders',
    save: 'Save template',
    saving: 'Saving...',
    reset: 'Reset default',
    preview: 'Live preview',
    saved: 'Email template saved.',
    saveFailed: 'Unable to save email template.',
  },
} satisfies Record<Locale, BookingEmailTemplateAdminCopy>;

export function sampleBookingEmailValuesForLocale(locale: Locale): Record<string, string> {
  if (locale === 'zh-hant') {
    return {
      customerName: '王小明',
      customerEmail: 'client@example.com',
      customerPhone: '+82-10-1234-5678',
      serviceName: '初期諮詢 30 分鐘',
      staffName: '證偉明 律師',
      startTime: '2026. 5. 18. 下午 2:00',
      endTime: '2026. 5. 18. 下午 2:30',
      timezone: 'Asia/Seoul',
      meetingLink: 'https://meet.example.com/consultation',
      manageUrl: 'https://tseng-law.com/zh-hant/booking/manage/demo-token',
      caseSummary: '希望在設立台灣公司前先檢視合約風險。',
      notes: '偏好中文諮詢。',
      bookingSummary: '服務：初期諮詢 30 分鐘\n承辦律師：證偉明 律師\n時間：2026. 5. 18. 下午 2:00\n管理連結：https://tseng-law.com/zh-hant/booking/manage/demo-token',
    };
  }

  if (locale === 'ko') {
    return {
      customerName: '김민수',
      customerEmail: 'client@example.com',
      customerPhone: '+82-10-1234-5678',
      serviceName: '초기 상담 30분',
      staffName: '증위명 변호사',
      startTime: '2026. 5. 18. 오후 2:00',
      endTime: '2026. 5. 18. 오후 2:30',
      timezone: 'Asia/Seoul',
      meetingLink: 'https://meet.example.com/consultation',
      manageUrl: 'https://tseng-law.com/ko/booking/manage/demo-token',
      caseSummary: '대만 법인 설립 전 계약 리스크를 검토하고 싶습니다.',
      notes: '한국어 상담을 선호합니다.',
      bookingSummary: '서비스: 초기 상담 30분\n담당자: 증위명 변호사\n시간: 2026. 5. 18. 오후 2:00\n관리 링크: https://tseng-law.com/ko/booking/manage/demo-token',
    };
  }

  return {
    customerName: 'Kim Min-su',
    customerEmail: 'client@example.com',
    customerPhone: '+82-10-1234-5678',
    serviceName: 'Initial consultation 30 min',
    staffName: 'Attorney Tseng',
    startTime: '2026-05-18 2:00 PM',
    endTime: '2026-05-18 2:30 PM',
    timezone: 'Asia/Seoul',
    meetingLink: 'https://meet.example.com/consultation',
    manageUrl: 'https://tseng-law.com/booking/manage/demo-token',
    caseSummary: 'I want to review contract risk before forming a Taiwan entity.',
    notes: 'Prefers English or Korean.',
    bookingSummary: 'Service: Initial consultation 30 min\nStaff: Attorney Tseng\nTime: 2026-05-18 2:00 PM\nManage: https://tseng-law.com/booking/manage/demo-token',
  };
}

export function renderBookingEmailPreviewSample(input: string, values: Record<string, string>): string {
  return input.replace(/{{\s*([a-zA-Z0-9]+)\s*}}/g, (match, key: string) => values[key] ?? match);
}
