import { describe, expect, it } from 'vitest';
import { getSeoPanelCopy } from '../seo-panel-copy';

describe('seo panel copy', () => {
  it('returns ko SEO panel shell and status copy', () => {
    const copy = getSeoPanelCopy('ko');

    expect(copy.title).toBe('페이지 SEO');
    expect(copy.tabs.hreflang).toBe('Hreflang / 사이트맵');
    expect(copy.summary(2, 1)).toBe('차단 2개 · 경고 1개');
    expect(copy.assistantSaveFailed).toBe('도우미 저장 실패');
    expect(copy.redirectWarning('/old', 'conflict')).toContain('리디렉트는 생성되지 않았습니다');
  });

  it('returns zh-hant SEO panel shell and status copy without Hangul', () => {
    const copy = getSeoPanelCopy('zh-hant');
    const text = [
      copy.dialogLabel,
      copy.applyRecommendation,
      copy.tabs.hreflang,
      copy.summary(2, 1),
      copy.noPageSelected,
      copy.loadError,
      copy.saveError,
      copy.assistantSaveFailed,
      copy.redirectWarning('/old', 'conflict'),
      copy.recommendationDescription('首頁', '皓正國際'),
      copy.searchDescriptionFallback,
      copy.socialDescriptionFallback,
    ].join(' ');

    expect(copy.tabs.hreflang).toBe('Hreflang 與 Sitemap');
    expect(copy.summary(2, 1)).toBe('阻擋 2 · 警告 1');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO panel shell and status copy without CJK', () => {
    const copy = getSeoPanelCopy('en');
    const text = [
      copy.dialogLabel,
      copy.applyRecommendation,
      copy.tabs.hreflang,
      copy.summary(2, 1),
      copy.noPageSelected,
      copy.loadError,
      copy.saveError,
      copy.assistantSaveFailed,
      copy.redirectWarning('/old', 'conflict'),
      copy.recommendationDescription('Home', 'HoJeong International'),
      copy.searchDescriptionFallback,
      copy.socialDescriptionFallback,
    ].join(' ');

    expect(copy.summary(2, 1)).toBe('blocker 2 · warning 1');
    expect(copy.cancel).toBe('Cancel');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
