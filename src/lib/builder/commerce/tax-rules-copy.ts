import type { Locale } from '@/lib/locales';

export type CommerceTaxRulesApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'tax_rules_failed'
  | 'tax_rules_update_failed';

export interface CommerceTaxRulesApiErrorPayload {
  error: string;
  errorCode: CommerceTaxRulesApiErrorCode;
}

const commerceTaxRulesApiErrorMessages: Record<Locale, Record<CommerceTaxRulesApiErrorCode, string>> = {
  ko: {
    validation_error: '세금 규칙 요청을 확인해 주세요.',
    invalid_json: '세금 규칙 요청 형식을 확인해 주세요.',
    tax_rules_failed: '세금 규칙을 불러오지 못했습니다.',
    tax_rules_update_failed: '세금 규칙을 저장하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認稅務規則請求。',
    invalid_json: '請確認稅務規則請求格式。',
    tax_rules_failed: '無法載入稅務規則。',
    tax_rules_update_failed: '無法儲存稅務規則。',
  },
  en: {
    validation_error: 'Check the tax rules request.',
    invalid_json: 'Check the tax rules request format.',
    tax_rules_failed: 'Unable to load tax rules.',
    tax_rules_update_failed: 'Unable to save tax rules.',
  },
};

export function getCommerceTaxRulesApiErrorPayload(
  locale: Locale,
  errorCode: CommerceTaxRulesApiErrorCode,
): CommerceTaxRulesApiErrorPayload {
  return {
    error: commerceTaxRulesApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
