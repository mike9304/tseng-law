import { describe, expect, it } from 'vitest';
import { getSeoPanelAdvancedCopy } from '../seo-panel-advanced-copy';

describe('seo panel advanced copy', () => {
  it('returns ko SEO advanced tab copy with localized form labels', () => {
    const copy = getSeoPanelAdvancedCopy('ko');

    expect(copy.title).toBe('고급 SEO 메타 태그');
    expect(copy.addMeta).toBe('+ 메타');
    expect(copy.noTags).toBe('추가 메타 태그가 없습니다.');
    expect(copy.type).toBe('유형');
    expect(copy.label).toBe('라벨');
    expect(copy.structuredDataBlockTypes.find((option) => option.type === 'Article')?.label).toBe('칼럼');
    expect(copy.structuredDataBlockTypes.find((option) => option.type === 'Custom')?.label).toBe('사용자 정의');
  });

  it('returns zh-hant SEO advanced tab copy without Hangul', () => {
    const copy = getSeoPanelAdvancedCopy('zh-hant');
    const text = [
      copy.title,
      copy.help,
      copy.noTags,
      copy.delete,
      copy.structuredTitle,
      copy.faqAuto,
      copy.faqOff,
      copy.jsonLdTitle,
      copy.jsonLdHelp,
      copy.noBlocks,
      copy.type,
      copy.label,
      copy.use,
      copy.addArticle,
      ...copy.structuredDataBlockTypes.map((option) => option.label),
    ].join(' ');

    expect(copy.structuredTitle).toBe('結構化資料');
    expect(copy.structuredDataBlockTypes.find((option) => option.type === 'BreadcrumbList')?.label).toBe('麵包屑導覽');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO advanced tab copy without CJK', () => {
    const copy = getSeoPanelAdvancedCopy('en');
    const text = [
      copy.title,
      copy.help,
      copy.noTags,
      copy.delete,
      copy.structuredTitle,
      copy.faqAuto,
      copy.faqOff,
      copy.jsonLdTitle,
      copy.jsonLdHelp,
      copy.noBlocks,
      copy.type,
      copy.label,
      copy.use,
      copy.addArticle,
      ...copy.structuredDataBlockTypes.map((option) => option.label),
    ].join(' ');

    expect(copy.title).toBe('Advanced SEO meta tags');
    expect(copy.structuredDataBlockTypes.find((option) => option.type === 'Custom')?.label).toBe('Custom');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
