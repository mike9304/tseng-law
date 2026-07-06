import { describe, expect, it } from 'vitest';
import { getBuilderFaqApiErrorPayload } from '../faq-api-copy';

describe('builder FAQ API copy', () => {
  it('returns localized validation errors', () => {
    expect(getBuilderFaqApiErrorPayload('ko', 'validation_error')).toEqual({
      error: 'FAQ 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
  });

  it('returns localized invalid JSON errors', () => {
    expect(getBuilderFaqApiErrorPayload('en', 'invalid_json')).toEqual({
      error: 'Check the FAQ request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized list failures', () => {
    expect(getBuilderFaqApiErrorPayload('zh-hant', 'faq_list_failed')).toEqual({
      error: '無法載入 FAQ 清單。',
      errorCode: 'faq_list_failed',
    });
  });

  it('returns localized not-found errors', () => {
    expect(getBuilderFaqApiErrorPayload('ko', 'faq_not_found')).toEqual({
      error: 'FAQ 항목을 찾을 수 없습니다.',
      errorCode: 'faq_not_found',
    });
  });
});
