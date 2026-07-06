import { describe, expect, it } from 'vitest';
import { getBuilderTranslationsApiErrorPayload } from '@/lib/builder/translations/translations-api-copy';

describe('builder translations API copy', () => {
  it('returns localized stable-code translation API errors', () => {
    expect(getBuilderTranslationsApiErrorPayload('ko', 'invalid_request')).toEqual({
      error: '번역 요청을 확인해 주세요.',
      errorCode: 'invalid_request',
    });
    expect(getBuilderTranslationsApiErrorPayload('zh-hant', 'translation_entry_not_found')).toEqual({
      error: '找不到翻譯項目。',
      errorCode: 'translation_entry_not_found',
    });
    expect(getBuilderTranslationsApiErrorPayload('en', 'translation_sync_failed')).toEqual({
      error: 'Unable to sync translation entries.',
      errorCode: 'translation_sync_failed',
    });
    expect(getBuilderTranslationsApiErrorPayload('ko', 'no_updates_provided')).toEqual({
      error: '저장할 번역 변경사항이 없습니다.',
      errorCode: 'no_updates_provided',
    });
    expect(getBuilderTranslationsApiErrorPayload('zh-hant', 'translation_edit_failed')).toEqual({
      error: '無法儲存翻譯編輯內容。',
      errorCode: 'translation_edit_failed',
    });
    expect(getBuilderTranslationsApiErrorPayload('en', 'translation_provider_unconfigured')).toEqual({
      error: 'No translation provider is configured.',
      errorCode: 'translation_provider_unconfigured',
    });
    expect(getBuilderTranslationsApiErrorPayload('ko', 'translation_batch_failed')).toEqual({
      error: '일괄 번역을 완료하지 못했습니다.',
      errorCode: 'translation_batch_failed',
    });
    expect(getBuilderTranslationsApiErrorPayload('zh-hant', 'translation_dashboard_failed')).toEqual({
      error: '無法載入翻譯儀表板。',
      errorCode: 'translation_dashboard_failed',
    });
    expect(getBuilderTranslationsApiErrorPayload('en', 'translation_publish_warnings_failed')).toEqual({
      error: 'Unable to load translation publish warnings.',
      errorCode: 'translation_publish_warnings_failed',
    });
  });
});
