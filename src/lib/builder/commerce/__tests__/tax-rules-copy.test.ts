import { describe, expect, it } from 'vitest';
import { getCommerceTaxRulesApiErrorPayload } from '@/lib/builder/commerce/tax-rules-copy';

describe('commerce tax rules API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceTaxRulesApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '세금 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceTaxRulesApiErrorPayload('zh-hant', 'invalid_json')).toEqual({
      error: '請確認稅務規則請求格式。',
      errorCode: 'invalid_json',
    });
    expect(getCommerceTaxRulesApiErrorPayload('zh-hant', 'tax_rules_failed')).toEqual({
      error: '無法載入稅務規則。',
      errorCode: 'tax_rules_failed',
    });
    expect(getCommerceTaxRulesApiErrorPayload('en', 'tax_rules_update_failed')).toEqual({
      error: 'Unable to save tax rules.',
      errorCode: 'tax_rules_update_failed',
    });
  });
});
