import type { Locale } from '@/lib/locales';

export type CommerceShippingRulesApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'shipping_rules_failed'
  | 'shipping_rules_update_failed';

export interface CommerceShippingRulesApiErrorPayload {
  error: string;
  errorCode: CommerceShippingRulesApiErrorCode;
}

const commerceShippingRulesApiErrorMessages: Record<Locale, Record<CommerceShippingRulesApiErrorCode, string>> = {
  ko: {
    validation_error: '배송 규칙 요청을 확인해 주세요.',
    invalid_json: '배송 규칙 요청 형식을 확인해 주세요.',
    shipping_rules_failed: '배송 규칙을 불러오지 못했습니다.',
    shipping_rules_update_failed: '배송 규칙을 저장하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認運送規則請求。',
    invalid_json: '請確認運送規則請求格式。',
    shipping_rules_failed: '無法載入運送規則。',
    shipping_rules_update_failed: '無法儲存運送規則。',
  },
  en: {
    validation_error: 'Check the shipping rules request.',
    invalid_json: 'Check the shipping rules request format.',
    shipping_rules_failed: 'Unable to load shipping rules.',
    shipping_rules_update_failed: 'Unable to save shipping rules.',
  },
};

export function getCommerceShippingRulesApiErrorPayload(
  locale: Locale,
  errorCode: CommerceShippingRulesApiErrorCode,
): CommerceShippingRulesApiErrorPayload {
  return {
    error: commerceShippingRulesApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
