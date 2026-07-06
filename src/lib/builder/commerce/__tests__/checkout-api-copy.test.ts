import { describe, expect, it } from 'vitest';
import { getCommerceCheckoutApiErrorPayload } from '@/lib/builder/commerce/checkout-api-copy';

describe('commerce checkout API copy', () => {
  it('returns localized stable-code checkout API errors', () => {
    expect(getCommerceCheckoutApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '체크아웃 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceCheckoutApiErrorPayload('zh-hant', 'checkout_validation_error')).toEqual({
      error: '請確認結帳資訊。',
      errorCode: 'checkout_validation_error',
    });
    expect(getCommerceCheckoutApiErrorPayload('en', 'invalid_json')).toEqual({
      error: 'Check the checkout request format.',
      errorCode: 'invalid_json',
    });
    expect(getCommerceCheckoutApiErrorPayload('zh-hant', 'checkout_failed')).toEqual({
      error: '無法完成結帳。',
      errorCode: 'checkout_failed',
    });
    expect(getCommerceCheckoutApiErrorPayload('ko', 'too_many_requests')).toEqual({
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      errorCode: 'too_many_requests',
    });
  });
});
