import { describe, expect, it } from 'vitest';
import { getCommerceSubscriptionsApiErrorPayload } from '@/lib/builder/commerce/subscriptions-api-copy';

describe('commerce subscriptions API copy', () => {
  it('returns localized stable-code subscription API errors', () => {
    expect(getCommerceSubscriptionsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '구독 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('zh-hant', 'subscriptions_list_failed')).toEqual({
      error: '無法載入訂閱列表。',
      errorCode: 'subscriptions_list_failed',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('en', 'plan_not_found')).toEqual({
      error: 'Subscription plan not found.',
      errorCode: 'plan_not_found',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('ko', 'transition_not_allowed')).toEqual({
      error: '현재 상태에서는 이 구독 작업을 할 수 없습니다.',
      errorCode: 'transition_not_allowed',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('en', 'subscription_delete_failed')).toEqual({
      error: 'Unable to delete subscription.',
      errorCode: 'subscription_delete_failed',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('ko', 'subscription_load_failed')).toEqual({
      error: '구독 정보를 불러오지 못했습니다.',
      errorCode: 'subscription_load_failed',
    });
    expect(getCommerceSubscriptionsApiErrorPayload('zh-hant', 'id_kind_mismatch')).toEqual({
      error: '請求的 ID 類型與操作類型不一致。',
      errorCode: 'id_kind_mismatch',
    });
  });
});
