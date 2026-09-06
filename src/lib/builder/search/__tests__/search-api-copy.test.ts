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
    expect(getPublicSearchApiErrorPayload('ja', 'too_many_requests')).toEqual({
      error: '検索リクエストが多すぎます。しばらくしてからもう一度お試しください。',
      errorCode: 'too_many_requests',
    });
    expect(getPublicSearchApiErrorPayload('ja', 'rate_limit_unavailable')).toEqual({
      error: '検索保護システムを一時的に利用できません。しばらくしてからもう一度お試しください。',
      errorCode: 'rate_limit_unavailable',
    });
    expect(getPublicSearchApiErrorPayload('ja', 'search_index_failed')).toEqual({
      error: '検索インデックスを読み込めませんでした。',
      errorCode: 'search_index_failed',
    });
    expect(getPublicSearchApiErrorPayload('ja', 'search_query_failed')).toEqual({
      error: '検索を完了できませんでした。',
      errorCode: 'search_query_failed',
    });
  });
});
