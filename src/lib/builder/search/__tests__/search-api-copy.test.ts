import { describe, expect, it } from 'vitest';
import { getPublicSearchApiErrorPayload } from '../search-api-copy';

describe('public search API copy', () => {
  it('returns localized stable-code payloads', () => {
    expect(getPublicSearchApiErrorPayload('ko', 'too_many_requests')).toEqual({
      error: '검색 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      errorCode: 'too_many_requests',
    });
    expect(getPublicSearchApiErrorPayload('zh-hant', 'search_index_failed')).toEqual({
      error: '無法載入搜尋索引。',
      errorCode: 'search_index_failed',
    });
    expect(getPublicSearchApiErrorPayload('en', 'search_query_failed')).toEqual({
      error: 'Unable to complete the search.',
      errorCode: 'search_query_failed',
    });
  });
});
