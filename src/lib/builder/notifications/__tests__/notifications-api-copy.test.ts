import { describe, expect, it } from 'vitest';
import { getBuilderNotificationsApiErrorPayload } from '@/lib/builder/notifications/notifications-api-copy';

describe('builder notifications API copy', () => {
  it('returns localized stable-code notification API errors', () => {
    expect(getBuilderNotificationsApiErrorPayload('ko', 'internal_only')).toEqual({
      error: '내부 알림 요청만 허용됩니다.',
      errorCode: 'internal_only',
    });
    expect(getBuilderNotificationsApiErrorPayload('zh-hant', 'invalid_kind')).toEqual({
      error: '請確認通知類型。',
      errorCode: 'invalid_kind',
    });
    expect(getBuilderNotificationsApiErrorPayload('en', 'invalid_content_type')).toEqual({
      error: 'Notification requests must use JSON.',
      errorCode: 'invalid_content_type',
    });
    expect(getBuilderNotificationsApiErrorPayload('ko', 'invalid_link')).toEqual({
      error: '알림 링크는 사이트 내부 경로만 사용할 수 있습니다.',
      errorCode: 'invalid_link',
    });
    expect(getBuilderNotificationsApiErrorPayload('zh-hant', 'notification_forbidden')).toEqual({
      error: '您沒有權限存取此通知。',
      errorCode: 'notification_forbidden',
    });
    expect(getBuilderNotificationsApiErrorPayload('en', 'notifications_list_failed')).toEqual({
      error: 'Unable to load notifications.',
      errorCode: 'notifications_list_failed',
    });
    expect(getBuilderNotificationsApiErrorPayload('ko', 'notification_delete_failed')).toEqual({
      error: '알림을 삭제하지 못했습니다.',
      errorCode: 'notification_delete_failed',
    });
  });
});
