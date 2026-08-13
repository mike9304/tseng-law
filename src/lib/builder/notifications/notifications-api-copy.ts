import type { Locale } from '@/lib/locales';

export type BuilderNotificationsApiErrorCode =
  | 'internal_only'
  | 'invalid_content_type'
  | 'invalid_json'
  | 'invalid_kind'
  | 'invalid_link'
  | 'subject_required'
  | 'notifications_list_failed'
  | 'notification_create_failed'
  | 'notification_forbidden'
  | 'notification_not_found'
  | 'notification_update_failed'
  | 'notification_delete_failed';

export interface BuilderNotificationsApiErrorPayload {
  error: string;
  errorCode: BuilderNotificationsApiErrorCode;
}

const builderNotificationsApiErrorMessages: Record<Locale, Record<BuilderNotificationsApiErrorCode, string>> = {
  ko: {
    internal_only: '내부 알림 요청만 허용됩니다.',
    invalid_content_type: 'JSON 형식의 알림 요청만 허용됩니다.',
    invalid_json: '알림 요청 형식을 확인해 주세요.',
    invalid_kind: '알림 유형을 확인해 주세요.',
    invalid_link: '알림 링크는 사이트 내부 경로만 사용할 수 있습니다.',
    subject_required: '알림 제목을 입력해 주세요.',
    notifications_list_failed: '알림을 불러오지 못했습니다.',
    notification_create_failed: '알림을 만들지 못했습니다.',
    notification_forbidden: '이 알림에 접근할 권한이 없습니다.',
    notification_not_found: '알림을 찾을 수 없습니다.',
    notification_update_failed: '알림 상태를 저장하지 못했습니다.',
    notification_delete_failed: '알림을 삭제하지 못했습니다.',
  },
  'zh-hant': {
    internal_only: '只允許內部通知請求。',
    invalid_content_type: '通知請求必須使用 JSON 格式。',
    invalid_json: '請確認通知請求格式。',
    invalid_kind: '請確認通知類型。',
    invalid_link: '通知連結只能使用網站內部路徑。',
    subject_required: '請輸入通知標題。',
    notifications_list_failed: '無法載入通知。',
    notification_create_failed: '無法建立通知。',
    notification_forbidden: '您沒有權限存取此通知。',
    notification_not_found: '找不到通知。',
    notification_update_failed: '無法儲存通知狀態。',
    notification_delete_failed: '無法刪除通知。',
  },
  en: {
    internal_only: 'Only internal notification requests are allowed.',
    invalid_content_type: 'Notification requests must use JSON.',
    invalid_json: 'Check the notification request format.',
    invalid_kind: 'Check the notification type.',
    invalid_link: 'Notification links must use an internal site path.',
    subject_required: 'Enter a notification subject.',
    notifications_list_failed: 'Unable to load notifications.',
    notification_create_failed: 'Unable to create the notification.',
    notification_forbidden: 'You do not have permission to access this notification.',
    notification_not_found: 'Notification not found.',
    notification_update_failed: 'Unable to save notification status.',
    notification_delete_failed: 'Unable to delete the notification.',
  },
};

export function getBuilderNotificationsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderNotificationsApiErrorCode,
): BuilderNotificationsApiErrorPayload {
  return { error: builderNotificationsApiErrorMessages[locale][errorCode], errorCode };
}
