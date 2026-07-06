import { describe, expect, it } from 'vitest';
import { getSeoPanelBasicsCopy } from '../seo-panel-basics-copy';

describe('seo panel basics copy', () => {
  it('returns ko SEO basics tab copy', () => {
    const copy = getSeoPanelBasicsCopy('ko');

    expect(copy.basicsTitle).toBe('기본 검색 설정');
    expect(copy.slug).toBe('슬러그');
    expect(copy.slugHelp('ko', 'about')).toContain('/ko/about');
    expect(copy.createRedirectBody1('ko', 'old-page')).toContain('/ko/old-page');
    expect(copy.recommendedCounter(30, 60)).toBe('권장 30-60자');
  });

  it('returns zh-hant SEO basics tab copy without Hangul', () => {
    const copy = getSeoPanelBasicsCopy('zh-hant');
    const text = [
      copy.basicsTitle,
      copy.slugPlaceholder,
      copy.slugHelp('zh-hant', 'about'),
      copy.canonical,
      copy.createRedirect,
      copy.createRedirectBody1('zh-hant', 'old-page'),
      copy.createRedirectBody2,
      copy.titlePlaceholder,
      copy.descriptionPlaceholder,
      copy.noIndexBody,
      copy.noFollowBody,
      copy.preview,
      copy.recommendedCounter(30, 60),
    ].join(' ');

    expect(copy.basicsTitle).toBe('基本搜尋設定');
    expect(copy.preview).toBe('Google 預覽');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO basics tab copy without CJK', () => {
    const copy = getSeoPanelBasicsCopy('en');
    const text = [
      copy.basicsTitle,
      copy.slugPlaceholder,
      copy.slugHelp('en', 'about'),
      copy.canonical,
      copy.createRedirect,
      copy.createRedirectBody1('en', 'old-page'),
      copy.createRedirectBody2,
      copy.titlePlaceholder,
      copy.descriptionPlaceholder,
      copy.noIndexBody,
      copy.noFollowBody,
      copy.preview,
      copy.recommendedCounter(30, 60),
    ].join(' ');

    expect(copy.basicsTitle).toBe('Basic SEO settings');
    expect(copy.recommendedCounter(30, 60)).toBe('Recommended 30-60 chars');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
