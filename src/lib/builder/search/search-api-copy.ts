import type { Locale } from '@/lib/locales';

export type PublicSearchApiErrorCode =
  | 'too_many_requests'
  | 'rate_limit_unavailable'
  | 'search_index_failed'
  | 'search_query_failed';

export interface PublicSearchApiErrorPayload {
  error: string;
  errorCode: PublicSearchApiErrorCode;
}

const publicSearchApiErrorMessages: Record<Locale, Record<PublicSearchApiErrorCode, string>> = {
  ko: {
    too_many_requests: '검색 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    rate_limit_unavailable: '검색 보호 시스템을 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    search_index_failed: '검색 색인을 불러오지 못했습니다.',
    search_query_failed: '검색을 완료하지 못했습니다.',
  },
  'zh-hant': {
    too_many_requests: '搜尋請求過多，請稍後再試。',
    rate_limit_unavailable: '搜尋防護系統暫時無法使用，請稍後再試。',
    search_index_failed: '無法載入搜尋索引。',
    search_query_failed: '無法完成搜尋。',
  },
  en: {
    too_many_requests: 'Too many search requests. Try again shortly.',
    rate_limit_unavailable: 'Search protection is temporarily unavailable. Try again shortly.',
    search_index_failed: 'Unable to load the search index.',
    search_query_failed: 'Unable to complete the search.',
  },
};

export function getPublicSearchApiErrorPayload(
  locale: Locale,
  errorCode: PublicSearchApiErrorCode,
): PublicSearchApiErrorPayload {
  return { error: publicSearchApiErrorMessages[locale][errorCode], errorCode };
}
