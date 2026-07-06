import { describe, expect, it } from 'vitest';
import { getCommercePaymentIntentsApiErrorPayload } from '@/lib/builder/commerce/payment-intents-api-copy';

describe('commerce payment intents API copy', () => {
  it('returns localized stable-code payment intent API errors', () => {
    expect(getCommercePaymentIntentsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '결제 의도 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommercePaymentIntentsApiErrorPayload('zh-hant', 'invalid_json')).toEqual({
      error: '請確認付款意圖請求格式。',
      errorCode: 'invalid_json',
    });
    expect(getCommercePaymentIntentsApiErrorPayload('en', 'payment_intent_invalid')).toEqual({
      error: 'Payment intent is invalid.',
      errorCode: 'payment_intent_invalid',
    });
    expect(getCommercePaymentIntentsApiErrorPayload('zh-hant', 'payment_intent_failed')).toEqual({
      error: '無法處理付款意圖。',
      errorCode: 'payment_intent_failed',
    });
  });
});
