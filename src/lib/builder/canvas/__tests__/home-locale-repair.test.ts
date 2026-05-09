import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocument } from '../seed-home';
import { repairHomeCanvasLocale } from '../home-locale-repair';

describe('home canvas locale repair', () => {
  it('projects a persisted Traditional Chinese home draft back to Korean without resetting layout styling', () => {
    const zhDraft = createHomePageCanvasDocument('zh-hant');
    const koSeed = createHomePageCanvasDocument('ko');
    const heroTitle = zhDraft.nodes.find((node) => node.id === 'home-hero-title');
    const koHeroTitle = koSeed.nodes.find((node) => node.id === 'home-hero-title');
    if (!heroTitle || !('text' in heroTitle.content)) {
      throw new Error('missing hero title fixture');
    }
    if (!koHeroTitle || !('text' in koHeroTitle.content)) {
      throw new Error('missing Korean hero title fixture');
    }
    heroTitle.rect.x = 123;
    heroTitle.content.fontSize = 44;

    const repaired = repairHomeCanvasLocale(zhDraft, 'ko');
    const repairedHeroTitle = repaired.nodes.find((node) => node.id === 'home-hero-title');
    const repairedOfficesTitle = repaired.nodes.find((node) => node.id === 'home-offices-title');

    expect(repaired.locale).toBe('ko');
    expect(repaired.updatedBy).toContain('locale-repair');
    expect(repairedHeroTitle?.rect.x).toBe(123);
    expect(repairedHeroTitle?.content).toMatchObject({
      text: koHeroTitle.content.text,
      fontSize: 44,
    });
    expect(repairedOfficesTitle?.content).toMatchObject({
      text: '오시는길',
    });
  });

  it('leaves same-locale custom Korean copy untouched', () => {
    const koDraft = createHomePageCanvasDocument('ko');
    const heroTitle = koDraft.nodes.find((node) => node.id === 'home-hero-title');
    if (!heroTitle || !('text' in heroTitle.content)) {
      throw new Error('missing hero title fixture');
    }
    heroTitle.content.text = '사용자가 직접 고친 한국어 문구';

    const repaired = repairHomeCanvasLocale(koDraft, 'ko');

    expect(repaired).toBe(koDraft);
  });
});
