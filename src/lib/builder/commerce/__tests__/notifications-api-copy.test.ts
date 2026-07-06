import { describe, expect, it } from 'vitest';
import { getCommerceNotificationsApiErrorPayload } from '@/lib/builder/commerce/notifications-api-copy';

describe('commerce notifications API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceNotificationsApiErrorPayload('ko', 'invalid_notification_filters')).toEqual({
      error: '알림 필터를 확인해 주세요.',
      errorCode: 'invalid_notification_filters',
    });
    expect(getCommerceNotificationsApiErrorPayload('zh-hant', 'notifications_failed')).toEqual({
      error: '無法載入通知。',
      errorCode: 'notifications_failed',
    });
    expect(getCommerceNotificationsApiErrorPayload('ko', 'invalid_json')).toEqual({
      error: '알림 설정 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(getCommerceNotificationsApiErrorPayload('en', 'notifications_save_failed')).toEqual({
      error: 'Unable to save notification settings.',
      errorCode: 'notifications_save_failed',
    });
  });
});
