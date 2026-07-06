import { describe, expect, it } from 'vitest';
import { getSeoPanelHreflangCopy } from '../seo-panel-hreflang-copy';

describe('seo panel hreflang copy', () => {
  it('returns ko SEO hreflang tab copy', () => {
    const copy = getSeoPanelHreflangCopy('ko');

    expect(copy.title).toBe('Hreflang 대체 링크');
    expect(copy.siblingsTitle).toBe('다국어 연결 페이지');
    expect(copy.included).toBe('Sitemap 포함됨');
    expect(copy.blocked).toBe('noIndex로 인해 색인 차단');
    expect(copy.noIndex).toBe('noindex');
    expect(copy.indexed).toBe('색인 가능');
  });

  it('returns zh-hant SEO hreflang tab copy without Hangul', () => {
    const copy = getSeoPanelHreflangCopy('zh-hant');
    const text = [
      copy.title,
      copy.description,
      copy.empty,
      copy.siblingsTitle,
      copy.siblingsDescription,
      copy.siblingsEmpty,
      copy.missing,
      copy.missingHint,
      copy.sitemapTitle,
      copy.sitemapDescription,
      copy.included,
      copy.excluded,
      copy.crawlable,
      copy.blocked,
      copy.noIndex,
      copy.indexed,
    ].join(' ');

    expect(copy.sitemapTitle).toBe('Sitemap 納入狀態');
    expect(copy.indexed).toBe('已索引');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO hreflang tab copy without CJK', () => {
    const copy = getSeoPanelHreflangCopy('en');
    const text = [
      copy.title,
      copy.description,
      copy.empty,
      copy.siblingsTitle,
      copy.siblingsDescription,
      copy.siblingsEmpty,
      copy.missing,
      copy.missingHint,
      copy.sitemapTitle,
      copy.sitemapDescription,
      copy.included,
      copy.excluded,
      copy.crawlable,
      copy.blocked,
      copy.noIndex,
      copy.indexed,
    ].join(' ');

    expect(copy.title).toBe('Hreflang alternate links');
    expect(copy.blocked).toBe('Indexing blocked by noIndex');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
