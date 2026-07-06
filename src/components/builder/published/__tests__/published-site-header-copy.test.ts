import { describe, expect, it } from 'vitest';
import { getPublishedSiteHeaderCopy } from '../published-site-header-copy';

describe('published site header copy', () => {
  it('returns localized ko strings', () => {
    const copy = getPublishedSiteHeaderCopy('ko');
    expect(copy.mainNavLabel).toBe('주요 메뉴');
    expect(copy.untitled).toBe('제목 없음');
  });

  it('returns localized zh-hant strings', () => {
    const copy = getPublishedSiteHeaderCopy('zh-hant');
    expect(copy.mainNavLabel).toBe('主要選單');
    expect(copy.untitled).toBe('未命名');
  });
});
