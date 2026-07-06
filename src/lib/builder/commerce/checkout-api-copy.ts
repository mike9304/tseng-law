import type { Locale } from '@/lib/locales';

export type CommerceCheckoutApiErrorCode =
  | 'validation_error'
  | 'checkout_validation_error'
  | 'invalid_json'
  | 'checkout_failed'
  | 'too_many_requests';

export interface CommerceCheckoutApiErrorPayload {
  error: string;
  errorCode: CommerceCheckoutApiErrorCode;
}

const commerceCheckoutApiErrorMessages: Record<Locale, Record<CommerceCheckoutApiErrorCode, string>> = {
  ko: {
    validation_error: '체크아웃 요청을 확인해 주세요.',
    checkout_validation_error: '체크아웃 정보를 확인해 주세요.',
    invalid_json: '체크아웃 요청 형식을 확인해 주세요.',
    checkout_failed: '체크아웃을 완료하지 못했습니다.',
    too_many_requests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  'zh-hant': {
    validation_error: '請確認結帳請求。',
    checkout_validation_error: '請確認結帳資訊。',
    invalid_json: '請確認結帳請求格式。',
    checkout_failed: '無法完成結帳。',
    too_many_requests: '請求過於頻繁，請稍後再試。',
  },
  en: {
    validation_error: 'Check the checkout request.',
    checkout_validation_error: 'Check the checkout details.',
    invalid_json: 'Check the checkout request format.',
    checkout_failed: 'Unable to complete checkout.',
    too_many_requests: 'Too many requests. Try again shortly.',
  },
};

export function getCommerceCheckoutApiErrorPayload(
  locale: Locale,
  errorCode: CommerceCheckoutApiErrorCode,
): CommerceCheckoutApiErrorPayload {
  return {
    error: commerceCheckoutApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
