import { describe, expect, it } from 'vitest';
import {
  buildPageSpec,
  describePageIntent,
  inferIntent,
  PAGE_INTENTS,
  type PageBrief,
} from '@/lib/builder/ai-generator/page-spec-builder';

const baseBrief: PageBrief = {
  purpose: 'Convert visitors into paying clients of our boutique law firm.',
  audience: 'Korean founders entering Taiwan',
  targetAction: 'Book a consultation',
  locale: 'en',
};

describe('page-spec-builder', () => {
  it('exposes the supported intents', () => {
    expect(PAGE_INTENTS).toEqual([
      'conversion',
      'informational',
      'storytelling',
      'directory',
      'support',
    ]);
  });

  it('infers conversion intent from book/consult keywords', () => {
    expect(inferIntent(baseBrief)).toBe('conversion');
  });

  it('infers support intent from help/faq language', () => {
    const brief: PageBrief = {
      ...baseBrief,
      purpose: 'Provide help articles and FAQs for paying customers.',
      targetAction: 'Find an answer',
    };
    expect(inferIntent(brief)).toBe('support');
  });

  it('infers storytelling intent from brand/about language', () => {
    const brief: PageBrief = {
      ...baseBrief,
      purpose: 'Share the brand story behind our atelier.',
      targetAction: 'Read about us',
    };
    expect(inferIntent(brief)).toBe('storytelling');
  });

  it('honors explicit intent override', () => {
    const brief: PageBrief = { ...baseBrief, intent: 'directory' };
    expect(inferIntent(brief)).toBe('directory');
  });

  it('builds a conversion page with hero/features/testimonials/cta in order', () => {
    const spec = buildPageSpec(baseBrief);
    expect(spec.intent).toBe('conversion');
    expect(spec.sections.map((section) => section.sectionKind)).toEqual([
      'hero',
      'features',
      'testimonials',
      'cta',
    ]);
    const hero = spec.sections[0];
    expect(hero.sectionKind).toBe('hero');
    expect(hero.ctaLabel).toBe('Book a consultation');
  });

  it('builds a support page with hero/faq/cta', () => {
    const spec = buildPageSpec({
      ...baseBrief,
      purpose: 'Self-serve support hub for existing customers.',
      targetAction: 'Find a solution',
    });
    expect(spec.intent).toBe('support');
    expect(spec.sections.map((section) => section.sectionKind)).toEqual([
      'hero',
      'faq',
      'cta',
    ]);
  });

  it('respects sectionHints by ordering hinted kinds first and appending baseline kinds', () => {
    const spec = buildPageSpec({
      ...baseBrief,
      sectionHints: ['testimonials', 'faq'],
    });
    expect(spec.sections.map((section) => section.sectionKind)).toEqual([
      'testimonials',
      'faq',
      'hero',
      'features',
      'cta',
    ]);
  });

  it('dedupes and ignores invalid sectionHints', () => {
    const spec = buildPageSpec({
      ...baseBrief,
      // @ts-expect-error testing runtime filter
      sectionHints: ['hero', 'hero', 'not-a-kind', 'faq'],
    });
    const kinds = spec.sections.map((section) => section.sectionKind);
    expect(kinds[0]).toBe('hero');
    expect(kinds.filter((kind) => kind === 'hero')).toHaveLength(1);
    expect(kinds).toContain('faq');
  });

  it('emits header with ctaLabel for conversion intent', () => {
    const spec = buildPageSpec(baseBrief);
    expect(spec.header.showCta).toBe(true);
    expect(spec.header.ctaLabel).toBe('Book a consultation');
    expect(spec.header.style).toBe('split');
  });

  it.skip('emits minimal footer for storytelling intent', () => {
    const spec = buildPageSpec({
      ...baseBrief,
      purpose: 'Share the brand story of our gallery.',
    });
    expect(spec.footer.style).toBe('minimal');
    expect(spec.footer.columns).toBe(1);
  });

  it('produces Korean copy when locale is ko', () => {
    const spec = buildPageSpec({
      ...baseBrief,
      locale: 'ko',
      purpose: '한국 창업자가 대만 진출 시 신뢰할 수 있는 법률 자문',
      targetAction: '상담 예약',
    });
    expect(spec.locale).toBe('ko');
    const cta = spec.sections.find((section) => section.sectionKind === 'cta');
    expect(cta?.headline).toBe('지금 시작하세요');
    expect(cta?.ctaLabel).toBe('상담 예약');
  });

  it('produces Traditional Chinese copy when locale is zh-hant', () => {
    const spec = buildPageSpec({ ...baseBrief, locale: 'zh-hant' });
    const cta = spec.sections.find((section) => section.sectionKind === 'cta');
    expect(cta?.headline).toBe('立即開始');
  });

  it('reasoning explains the intent and sequence', () => {
    const spec = buildPageSpec(baseBrief);
    expect(spec.reasoning).toContain('conversion');
    expect(spec.reasoning).toContain('hero → features → testimonials → cta');
  });

  it('describePageIntent returns a label for each intent', () => {
    expect(describePageIntent('conversion')).toBe('Conversion');
    expect(describePageIntent('informational')).toBe('Informational');
    expect(describePageIntent('storytelling')).toBe('Storytelling');
    expect(describePageIntent('directory')).toBe('Directory');
    expect(describePageIntent('support')).toBe('Support');
  });
});