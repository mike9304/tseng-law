import { describe, expect, it } from 'vitest';
import { getBuilderReviewSessionsApiErrorPayload } from '../review-sessions-api-copy';

describe('builder review sessions API copy', () => {
  it('returns localized validation errors', () => {
    expect(getBuilderReviewSessionsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '리뷰 세션 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
  });

  it('returns localized invalid JSON errors', () => {
    expect(getBuilderReviewSessionsApiErrorPayload('en', 'invalid_json')).toEqual({
      error: 'Check the review session request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized list failures', () => {
    expect(getBuilderReviewSessionsApiErrorPayload('zh-hant', 'review_sessions_list_failed')).toEqual({
      error: '無法載入審閱工作階段清單。',
      errorCode: 'review_sessions_list_failed',
    });
  });

  it('returns localized invalid token errors', () => {
    expect(getBuilderReviewSessionsApiErrorPayload('ko', 'review_token_invalid')).toEqual({
      error: '리뷰 링크가 만료되었거나 유효하지 않습니다.',
      errorCode: 'review_token_invalid',
    });
  });
});
