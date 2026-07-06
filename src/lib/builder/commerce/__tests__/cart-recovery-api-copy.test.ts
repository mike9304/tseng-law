import { describe, expect, it } from 'vitest';
import { getCommerceCartRecoveryApiErrorPayload } from '@/lib/builder/commerce/cart-recovery-api-copy';

describe('commerce cart recovery API copy', () => {
  it('returns localized stable-code cart recovery API errors', () => {
    expect(getCommerceCartRecoveryApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '장바구니 복구 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceCartRecoveryApiErrorPayload('zh-hant', 'invalid_json')).toEqual({
      error: '請確認購物車復原請求格式。',
      errorCode: 'invalid_json',
    });
    expect(getCommerceCartRecoveryApiErrorPayload('en', 'cart_empty')).toEqual({
      error: 'The cart is empty.',
      errorCode: 'cart_empty',
    });
    expect(getCommerceCartRecoveryApiErrorPayload('zh-hant', 'cart_recovery_failed')).toEqual({
      error: '無法儲存購物車復原資訊。',
      errorCode: 'cart_recovery_failed',
    });
    expect(getCommerceCartRecoveryApiErrorPayload('ko', 'too_many_requests')).toEqual({
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      errorCode: 'too_many_requests',
    });
  });
});
