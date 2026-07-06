import { describe, expect, it } from 'vitest';
import { getSeoRouteErrorCopy } from '@/lib/builder/seo/route-copy';

describe('SEO route error copy', () => {
  it('returns ko API error copy', () => {
    const copy = getSeoRouteErrorCopy('ko', 'page-seo');

    expect(copy.pageNotFound('page-404')).toBe('페이지를 찾을 수 없습니다: page-404');
    expect(copy.invalidJsonPayload).toBe('JSON 요청 본문 형식이 올바르지 않습니다.');
    expect(copy.requestFailed).toBe('페이지 SEO 요청을 처리하지 못했습니다.');
  });

  it('returns zh-hant API error copy without Hangul', () => {
    const pageSeoCopy = getSeoRouteErrorCopy('zh-hant', 'page-seo');
    const assistantCopy = getSeoRouteErrorCopy('zh-hant', 'seo-assistant');
    const text = [
      pageSeoCopy.pageNotFound('page-404'),
      pageSeoCopy.invalidJsonPayload,
      pageSeoCopy.requestFailed,
      assistantCopy.requestFailed,
    ].join(' ');

    expect(text).toContain('找不到頁面：page-404');
    expect(text).toContain('無法處理頁面 SEO 請求。');
    expect(text).toContain('無法處理 SEO 助理請求。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en API error copy without CJK', () => {
    const pageSeoCopy = getSeoRouteErrorCopy('en', 'page-seo');
    const assistantCopy = getSeoRouteErrorCopy('en', 'seo-assistant');
    const text = [
      pageSeoCopy.pageNotFound('page-404'),
      pageSeoCopy.invalidJsonPayload,
      pageSeoCopy.requestFailed,
      assistantCopy.requestFailed,
    ].join(' ');

    expect(text).toContain('Page not found: page-404');
    expect(text).toContain('Could not process the page SEO request.');
    expect(text).toContain('Could not process the SEO assistant request.');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
