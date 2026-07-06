import { describe, expect, it } from 'vitest';
import { getCommerceCurrencySettingsApiErrorPayload } from '@/lib/builder/commerce/currency-settings-copy';

describe('commerce currency settings API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceCurrencySettingsApiErrorPayload('ko', 'currency_settings_failed')).toEqual({
      error: '통화 설정을 불러오지 못했습니다.',
      errorCode: 'currency_settings_failed',
    });
    expect(getCommerceCurrencySettingsApiErrorPayload('zh-hant', 'currency_settings_failed')).toEqual({
      error: '無法載入幣別設定。',
      errorCode: 'currency_settings_failed',
    });
    expect(getCommerceCurrencySettingsApiErrorPayload('ko', 'currency_settings_save_failed')).toEqual({
      error: '통화 설정을 저장하지 못했습니다.',
      errorCode: 'currency_settings_save_failed',
    });
    expect(getCommerceCurrencySettingsApiErrorPayload('en', 'currency_settings_save_failed')).toEqual({
      error: 'Unable to save currency settings.',
      errorCode: 'currency_settings_save_failed',
    });
  });
});
