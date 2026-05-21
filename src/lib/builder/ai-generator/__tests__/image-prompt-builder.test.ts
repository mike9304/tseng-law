import { describe, expect, it } from 'vitest';
import {
  buildImagePrompt,
  describeImageRegister,
  IMAGE_REGISTERS,
} from '@/lib/builder/ai-generator/image-prompt-builder';
import { analyzeBrandVoice } from '@/lib/builder/ai-generator/brand-voice';

describe('image-prompt-builder', () => {
  it('exposes the supported registers', () => {
    expect(IMAGE_REGISTERS).toEqual([
      'editorial',
      'lifestyle',
      'architectural',
      'studio',
      'documentary',
      'minimal',
    ]);
  });

  it('builds a hero prompt with composition + lighting + forbidden list', () => {
    const result = buildImagePrompt({
      pagePurpose: 'Boutique law firm welcoming Korean founders to Taiwan.',
      sectionKind: 'hero',
      locale: 'en',
      industry: 'law',
    });
    expect(result.prompt).toContain('Boutique law firm');
    expect(result.prompt).toContain('Composition');
    expect(result.prompt).toContain('Lighting');
    expect(result.prompt).toContain('Forbidden');
    expect(result.prompt).toContain('no text');
    expect(result.prompt).toContain('no logos');
  });

  it('selects editorial register by default for hero', () => {
    const result = buildImagePrompt({
      pagePurpose: 'A hero image.',
      sectionKind: 'hero',
      locale: 'en',
    });
    expect(result.register).toBe('editorial');
  });

  it('selects lifestyle register for warm + non-formal brand voice', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Welcome to our family. We care about every guest. Together we make warm memories.',
        'Hey friend, gladly drop by anytime, grab a coffee.',
      ],
    });
    const result = buildImagePrompt({
      pagePurpose: 'Friendly community cafe.',
      sectionKind: 'hero',
      locale: 'en',
      brandVoice: profile,
    });
    expect(profile.warmth).toBe('warm');
    expect(result.register).toBe('lifestyle');
    expect(result.modifiers.some((mod) => mod.includes('warm color palette'))).toBe(true);
  });

  it.skip('selects architectural register for formal + cool brand voice', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: [
        'Furthermore the firm leverages efficient, precise metric-driven workflows.',
        'Therefore the engagement returns measurable ROI through exact KPIs.',
      ],
    });
    expect(profile.formality).toBe('formal');
    expect(profile.warmth).toBe('cool');
    const result = buildImagePrompt({
      pagePurpose: 'Professional consulting firm in Taipei.',
      sectionKind: 'hero',
      locale: 'en',
      brandVoice: profile,
      industry: 'consulting',
    });
    expect(result.register).toBe('architectural');
  });

  it('includes brand voice taboos in the forbidden list', () => {
    const profile = analyzeBrandVoice({
      locale: 'en',
      samples: ['Hello there.'],
      taboos: ['cheap', 'discount stunt'],
    });
    const result = buildImagePrompt({
      pagePurpose: 'Premium offering.',
      sectionKind: 'cta',
      locale: 'en',
      brandVoice: profile,
    });
    expect(result.prompt).toContain('no cheap');
    expect(result.prompt).toContain('no discount stunt');
  });

  it('emits a Korean reading-direction hint for ko locale', () => {
    const result = buildImagePrompt({
      pagePurpose: '한국 창업자를 위한 법률 자문 서비스.',
      sectionKind: 'hero',
      locale: 'ko',
    });
    expect(result.prompt).toContain('Korean reading patterns');
  });

  it('emits a Traditional Chinese reading-direction hint for zh-hant locale', () => {
    const result = buildImagePrompt({
      pagePurpose: 'Premium consultation service.',
      sectionKind: 'hero',
      locale: 'zh-hant',
    });
    expect(result.prompt).toContain('Traditional Chinese reading patterns');
  });

  it('appends editor direction and aspect when provided', () => {
    const result = buildImagePrompt({
      pagePurpose: 'Cafe page.',
      sectionKind: 'features',
      locale: 'en',
      visualDirection: 'Show oat milk being poured into latte art with morning light.',
      aspect: '4:5',
    });
    expect(result.prompt).toContain('Editor direction: Show oat milk');
    expect(result.prompt).toContain('Aspect ratio: 4:5');
  });

  it('describeImageRegister returns capitalized labels for each register', () => {
    expect(describeImageRegister('editorial')).toBe('Editorial');
    expect(describeImageRegister('lifestyle')).toBe('Lifestyle');
    expect(describeImageRegister('architectural')).toBe('Architectural');
    expect(describeImageRegister('studio')).toBe('Studio');
    expect(describeImageRegister('documentary')).toBe('Documentary');
    expect(describeImageRegister('minimal')).toBe('Minimal');
  });

  it('always includes the universal forbidden items', () => {
    const result = buildImagePrompt({
      pagePurpose: 'Anything.',
      sectionKind: 'faq',
      locale: 'en',
    });
    expect(result.negativeSpace.join(' / ')).toContain('no text');
    expect(result.negativeSpace.join(' / ')).toContain('no logos');
    expect(result.negativeSpace.join(' / ')).toContain('no AI artifacts');
  });

  it('clamps oversized inputs without dropping critical sections', () => {
    const giantPurpose = 'a'.repeat(5000);
    const result = buildImagePrompt({
      pagePurpose: giantPurpose,
      sectionKind: 'hero',
      locale: 'en',
    });
    expect(result.prompt.length).toBeLessThanOrEqual(1800);
    expect(result.prompt).toContain('Forbidden');
  });
});