import { describe, expect, it } from 'vitest';
import { getBuilderPortfolioApiErrorPayload } from '../portfolio-api-copy';

describe('builder portfolio API copy', () => {
  it('returns localized stable-code payloads', () => {
    expect(getBuilderPortfolioApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '포트폴리오 요청 내용을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderPortfolioApiErrorPayload('zh-hant', 'portfolio_project_not_found')).toEqual({
      error: '找不到作品集專案。',
      errorCode: 'portfolio_project_not_found',
    });
    expect(getBuilderPortfolioApiErrorPayload('en', 'portfolio_list_failed')).toEqual({
      error: 'Unable to load portfolio projects.',
      errorCode: 'portfolio_list_failed',
    });
  });
});
