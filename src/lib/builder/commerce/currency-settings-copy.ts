import type { Locale } from '@/lib/locales';

export type CommerceCurrencySettingsApiErrorCode =
  | 'currency_settings_failed'
  | 'currency_settings_save_failed';

export interface CommerceCurrencySettingsApiErrorPayload {
  error: string;
  errorCode: CommerceCurrencySettingsApiErrorCode;
}

const commerceCurrencySettingsApiErrorMessages: Record<Locale, Record<CommerceCurrencySettingsApiErrorCode, string>> = {
  ko: {
    currency_settings_failed: '통화 설정을 불러오지 못했습니다.',
    currency_settings_save_failed: '통화 설정을 저장하지 못했습니다.',
  },
  'zh-hant': {
    currency_settings_failed: '無法載入幣別設定。',
    currency_settings_save_failed: '無法儲存幣別設定。',
  },
  en: {
    currency_settings_failed: 'Unable to load currency settings.',
    currency_settings_save_failed: 'Unable to save currency settings.',
  },
};

export function getCommerceCurrencySettingsApiErrorPayload(
  locale: Locale,
  errorCode: CommerceCurrencySettingsApiErrorCode,
): CommerceCurrencySettingsApiErrorPayload {
  return {
    error: commerceCurrencySettingsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
