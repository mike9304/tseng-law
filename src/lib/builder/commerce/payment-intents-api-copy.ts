import type { Locale } from '@/lib/locales';

export type CommercePaymentIntentsApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'payment_provider_not_configured'
  | 'payment_intent_invalid'
  | 'payment_intent_failed';

export interface CommercePaymentIntentsApiErrorPayload {
  error: string;
  errorCode: CommercePaymentIntentsApiErrorCode;
}

const commercePaymentIntentsApiErrorMessages: Record<Locale, Record<CommercePaymentIntentsApiErrorCode, string>> = {
  ko: {
    validation_error: '결제 의도 요청을 확인해 주세요.',
    invalid_json: '결제 의도 요청 형식을 확인해 주세요.',
    payment_provider_not_configured: '선택한 결제 제공업체는 운영 환경에 설정되지 않았습니다.',
    payment_intent_invalid: '결제 의도가 유효하지 않습니다.',
    payment_intent_failed: '결제 의도를 처리하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認付款意圖請求。',
    invalid_json: '請確認付款意圖請求格式。',
    payment_provider_not_configured: '所選付款服務提供者尚未在正式環境中設定。',
    payment_intent_invalid: '付款意圖無效。',
    payment_intent_failed: '無法處理付款意圖。',
  },
  en: {
    validation_error: 'Check the payment intent request.',
    invalid_json: 'Check the payment intent request format.',
    payment_provider_not_configured: 'The selected payment provider is not configured for production.',
    payment_intent_invalid: 'Payment intent is invalid.',
    payment_intent_failed: 'Unable to process payment intent.',
  },
};

export function getCommercePaymentIntentsApiErrorPayload(
  locale: Locale,
  errorCode: CommercePaymentIntentsApiErrorCode,
): CommercePaymentIntentsApiErrorPayload {
  return {
    error: commercePaymentIntentsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
