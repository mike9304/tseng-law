import type { Locale } from '@/lib/locales';

export type BuilderFaqApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'faq_list_failed'
  | 'faq_create_failed'
  | 'faq_load_failed'
  | 'faq_update_failed'
  | 'faq_delete_failed'
  | 'faq_not_found';

export interface BuilderFaqApiErrorPayload {
  error: string;
  errorCode: BuilderFaqApiErrorCode;
}

const builderFaqApiErrorMessages: Record<Locale, Record<BuilderFaqApiErrorCode, string>> = {
  ko: {
    validation_error: 'FAQ 요청을 확인해 주세요.',
    invalid_json: 'FAQ 요청 형식을 확인해 주세요.',
    faq_list_failed: 'FAQ 목록을 불러오지 못했습니다.',
    faq_create_failed: 'FAQ 항목을 만들지 못했습니다.',
    faq_load_failed: 'FAQ 항목을 불러오지 못했습니다.',
    faq_update_failed: 'FAQ 항목을 저장하지 못했습니다.',
    faq_delete_failed: 'FAQ 항목을 삭제하지 못했습니다.',
    faq_not_found: 'FAQ 항목을 찾을 수 없습니다.',
  },
  'zh-hant': {
    validation_error: '請確認 FAQ 請求。',
    invalid_json: '請確認 FAQ 請求格式。',
    faq_list_failed: '無法載入 FAQ 清單。',
    faq_create_failed: '無法建立 FAQ 項目。',
    faq_load_failed: '無法載入 FAQ 項目。',
    faq_update_failed: '無法儲存 FAQ 項目。',
    faq_delete_failed: '無法刪除 FAQ 項目。',
    faq_not_found: '找不到 FAQ 項目。',
  },
  en: {
    validation_error: 'Check the FAQ request.',
    invalid_json: 'Check the FAQ request format.',
    faq_list_failed: 'Unable to load FAQ items.',
    faq_create_failed: 'Unable to create the FAQ item.',
    faq_load_failed: 'Unable to load the FAQ item.',
    faq_update_failed: 'Unable to save the FAQ item.',
    faq_delete_failed: 'Unable to delete the FAQ item.',
    faq_not_found: 'FAQ item not found.',
  },
};

export function getBuilderFaqApiErrorPayload(
  locale: Locale,
  errorCode: BuilderFaqApiErrorCode,
): BuilderFaqApiErrorPayload {
  return { error: builderFaqApiErrorMessages[locale][errorCode], errorCode };
}
