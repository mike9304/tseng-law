import type { Locale } from '@/lib/locales';

export type CommerceNotificationsApiErrorCode =
  | 'invalid_notification_filters'
  | 'notifications_failed'
  | 'invalid_json'
  | 'notifications_save_failed';

export interface CommerceNotificationsApiErrorPayload {
  error: string;
  errorCode: CommerceNotificationsApiErrorCode;
}

const commerceNotificationsApiErrorMessages: Record<Locale, Record<CommerceNotificationsApiErrorCode, string>> = {
  ko: {
    invalid_notification_filters: '알림 필터를 확인해 주세요.',
    notifications_failed: '알림을 불러오지 못했습니다.',
    invalid_json: '알림 설정 요청 형식을 확인해 주세요.',
    notifications_save_failed: '알림 설정을 저장하지 못했습니다.',
  },
  'zh-hant': {
    invalid_notification_filters: '請確認通知篩選條件。',
    notifications_failed: '無法載入通知。',
    invalid_json: '請確認通知設定請求格式。',
    notifications_save_failed: '無法儲存通知設定。',
  },
  en: {
    invalid_notification_filters: 'Check the notification filters.',
    notifications_failed: 'Unable to load notifications.',
    invalid_json: 'Check the notification settings request format.',
    notifications_save_failed: 'Unable to save notification settings.',
  },
};

export function getCommerceNotificationsApiErrorPayload(
  locale: Locale,
  errorCode: CommerceNotificationsApiErrorCode,
): CommerceNotificationsApiErrorPayload {
  return {
    error: commerceNotificationsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
