import { describe, expect, it } from 'vitest';
import { getCommerceShippingRulesApiErrorPayload } from '@/lib/builder/commerce/shipping-rules-copy';

describe('commerce shipping rules API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceShippingRulesApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '배송 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceShippingRulesApiErrorPayload('zh-hant', 'invalid_json')).toEqual({
      error: '請確認運送規則請求格式。',
      errorCode: 'invalid_json',
    });
    expect(getCommerceShippingRulesApiErrorPayload('zh-hant', 'shipping_rules_failed')).toEqual({
      error: '無法載入運送規則。',
      errorCode: 'shipping_rules_failed',
    });
    expect(getCommerceShippingRulesApiErrorPayload('en', 'shipping_rules_update_failed')).toEqual({
      error: 'Unable to save shipping rules.',
      errorCode: 'shipping_rules_update_failed',
    });
  });
});
