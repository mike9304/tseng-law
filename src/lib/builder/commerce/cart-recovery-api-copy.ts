import type { Locale } from '@/lib/locales';

export type CommerceCartRecoveryApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'cart_empty'
  | 'cart_recovery_failed'
  | 'too_many_requests';

export interface CommerceCartRecoveryApiErrorPayload {
  error: string;
  errorCode: CommerceCartRecoveryApiErrorCode;
}

const commerceCartRecoveryApiErrorMessages: Record<Locale, Record<CommerceCartRecoveryApiErrorCode, string>> = {
  ko: {
    validation_error: '장바구니 복구 요청을 확인해 주세요.',
    invalid_json: '장바구니 복구 요청 형식을 확인해 주세요.',
    cart_empty: '복구할 장바구니가 비어 있습니다.',
    cart_recovery_failed: '장바구니 복구 정보를 저장하지 못했습니다.',
    too_many_requests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  'zh-hant': {
    validation_error: '請確認購物車復原請求。',
    invalid_json: '請確認購物車復原請求格式。',
    cart_empty: '沒有可復原的購物車內容。',
    cart_recovery_failed: '無法儲存購物車復原資訊。',
    too_many_requests: '請求過於頻繁，請稍後再試。',
  },
  en: {
    validation_error: 'Check the cart recovery request.',
    invalid_json: 'Check the cart recovery request format.',
    cart_empty: 'The cart is empty.',
    cart_recovery_failed: 'Unable to save cart recovery details.',
    too_many_requests: 'Too many requests. Try again shortly.',
  },
};

export function getCommerceCartRecoveryApiErrorPayload(
  locale: Locale,
  errorCode: CommerceCartRecoveryApiErrorCode,
): CommerceCartRecoveryApiErrorPayload {
  return {
    error: commerceCartRecoveryApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
