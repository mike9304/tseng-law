import type { Locale } from '@/lib/locales';

export type BuilderTranslationsApiErrorCode =
  | 'invalid_request'
  | 'invalid_json'
  | 'no_updates_provided'
  | 'translation_entry_not_found'
  | 'translation_sync_failed'
  | 'translation_edit_failed'
  | 'translation_provider_unconfigured'
  | 'translation_provider_failed'
  | 'translation_batch_failed'
  | 'translation_dashboard_failed'
  | 'translation_publish_warnings_failed'
  | 'translation_save_failed';

export interface BuilderTranslationsApiErrorPayload {
  error: string;
  errorCode: BuilderTranslationsApiErrorCode;
}

const builderTranslationsApiErrorMessages: Record<Locale, Record<BuilderTranslationsApiErrorCode, string>> = {
  ko: {
    invalid_request: '번역 요청을 확인해 주세요.',
    invalid_json: '번역 요청 형식을 확인해 주세요.',
    no_updates_provided: '저장할 번역 변경사항이 없습니다.',
    translation_entry_not_found: '번역 항목을 찾을 수 없습니다.',
    translation_sync_failed: '번역 항목을 동기화하지 못했습니다.',
    translation_edit_failed: '번역 편집 내용을 저장하지 못했습니다.',
    translation_provider_unconfigured: '번역 제공자가 설정되어 있지 않습니다.',
    translation_provider_failed: '번역 제공자 요청을 완료하지 못했습니다.',
    translation_batch_failed: '일괄 번역을 완료하지 못했습니다.',
    translation_dashboard_failed: '번역 대시보드를 불러오지 못했습니다.',
    translation_publish_warnings_failed: '번역 게시 경고를 불러오지 못했습니다.',
    translation_save_failed: '번역을 저장하지 못했습니다.',
  },
  'zh-hant': {
    invalid_request: '請確認翻譯請求。',
    invalid_json: '請確認翻譯請求格式。',
    no_updates_provided: '沒有可儲存的翻譯變更。',
    translation_entry_not_found: '找不到翻譯項目。',
    translation_sync_failed: '無法同步翻譯項目。',
    translation_edit_failed: '無法儲存翻譯編輯內容。',
    translation_provider_unconfigured: '尚未設定翻譯提供者。',
    translation_provider_failed: '無法完成翻譯提供者請求。',
    translation_batch_failed: '無法完成批次翻譯。',
    translation_dashboard_failed: '無法載入翻譯儀表板。',
    translation_publish_warnings_failed: '無法載入翻譯發布警告。',
    translation_save_failed: '無法儲存翻譯。',
  },
  en: {
    invalid_request: 'Check the translation request.',
    invalid_json: 'Check the translation request format.',
    no_updates_provided: 'There are no translation changes to save.',
    translation_entry_not_found: 'Translation entry not found.',
    translation_sync_failed: 'Unable to sync translation entries.',
    translation_edit_failed: 'Unable to save translation edits.',
    translation_provider_unconfigured: 'No translation provider is configured.',
    translation_provider_failed: 'Unable to complete the translation provider request.',
    translation_batch_failed: 'Unable to complete the batch translation.',
    translation_dashboard_failed: 'Unable to load the translation dashboard.',
    translation_publish_warnings_failed: 'Unable to load translation publish warnings.',
    translation_save_failed: 'Unable to save the translation.',
  },
};

export function getBuilderTranslationsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderTranslationsApiErrorCode,
): BuilderTranslationsApiErrorPayload {
  return { error: builderTranslationsApiErrorMessages[locale][errorCode], errorCode };
}
