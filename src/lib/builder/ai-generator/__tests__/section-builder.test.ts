import { describe, expect, it } from 'vitest';
import {
  buildSectionNodes,
  describeAiSection,
  AI_SECTION_KINDS,
} from '@/lib/builder/ai-generator/section-builder';

const STABLE_SEED = 'stable-1';

function rootOf(nodes: ReturnType<typeof buildSectionNodes>['nodes']) {
  return nodes.find((node) => !node.parentId);
}

describe('AI section-builder', () => {
  it('exposes the supported section kinds', () => {
    expect(AI_SECTION_KINDS).toEqual(['hero', 'features', 'testimonials', 'cta', 'faq']);
  });

  it('builds a hero with a section root and CTA button', () => {
    const result = buildSectionNodes({
      spec: {
        sectionKind: 'hero',
        headline: 'Smarter legal partner',
        subhead: 'Bilingual counsel for Korean teams entering Taiwan.',
        ctaLabel: 'Talk to us',
      },
      locale: 'en',
      seed: STABLE_SEED,
    });
    const root = rootOf(result.nodes);
    expect(root).toBeDefined();
    expect(root?.kind).toBe('container');
    if (root?.kind === 'container') {
      expect(root.content.as).toBe('section');
      expect(root.content.className).toContain('ai-generated-section');
      expect(root.content.variant).toBe('hero');
    }
    const button = result.nodes.find((node) => node.kind === 'button');
    expect(button).toBeDefined();
    if (button?.kind === 'button') {
      expect(button.content.label).toBe('Talk to us');
      expect(button.content.href).toBe('/en/contact');
    }
    expect(result.rootId).toBe(root?.id);
  });

  it('builds features grid with each item rendered as a card container with title + body', () => {
    const items = Array.from({ length: 4 }).map((_, index) => ({
      title: `Item ${index + 1}`,
      body: `Body for item ${index + 1}`,
    }));
    const result = buildSectionNodes({
      spec: {
        sectionKind: 'features',
        headline: 'What we deliver',
        items,
      },
      locale: 'ko',
      seed: STABLE_SEED,
    });
    const cards = result.nodes.filter(
      (node) => node.kind === 'container' && node.parentId === result.rootId,
    );
    expect(cards).toHaveLength(items.length);
    for (const item of items) {
      expect(result.nodes.some((node) => node.kind === 'heading' && node.kind === 'heading' && node.content.text === item.title)).toBe(true);
    }
  });

  it('renders testimonials with quote bodies wrapped in curly quotes', () => {
    const result = buildSectionNodes({
      spec: {
        sectionKind: 'testimonials',
        headline: 'Trusted by founders',
        items: [{ title: 'Jane CEO', body: 'They handled our incorporation in days.' }],
      },
      locale: 'en',
      seed: STABLE_SEED,
    });
    const quote = result.nodes.find((node) => node.kind === 'text' && node.kind === 'text' && node.content.text.includes('“'));
    expect(quote).toBeDefined();
  });

  it('uses default CTA label when not provided for cta sections (Korean locale)', () => {
    const result = buildSectionNodes({
      spec: {
        sectionKind: 'cta',
        headline: '바로 시작하세요',
        subhead: '상담 문의를 보내주시면 24시간 내 답변드립니다.',
      },
      locale: 'ko',
      seed: STABLE_SEED,
    });
    const button = result.nodes.find((node) => node.kind === 'button');
    expect(button).toBeDefined();
    if (button?.kind === 'button') {
      expect(button.content.label).toBe('문의하기');
      expect(button.content.href).toBe('/ko/contact');
    }
  });

  it('builds an FAQ with one row per item, all parented to the root', () => {
    const items = [
      { title: 'How long does it take?', body: 'Typically 5 business days.' },
      { title: 'Do you bill hourly?', body: 'We offer fixed packages and hourly options.' },
    ];
    const result = buildSectionNodes({
      spec: { sectionKind: 'faq', headline: 'FAQ', items },
      locale: 'en',
      seed: STABLE_SEED,
    });
    const itemContainers = result.nodes.filter(
      (node) => node.kind === 'container' && node.parentId === result.rootId,
    );
    expect(itemContainers).toHaveLength(items.length);
    const questionHeadings = result.nodes.filter((node) => node.kind === 'heading' && node.parentId !== result.rootId);
    expect(questionHeadings).toHaveLength(items.length);
  });

  it('returns nodes sorted by zIndex ascending', () => {
    const result = buildSectionNodes({
      spec: {
        sectionKind: 'features',
        headline: 'Test',
        items: [
          { title: 'A', body: 'a' },
          { title: 'B', body: 'b' },
        ],
      },
      locale: 'en',
      seed: STABLE_SEED,
    });
    for (let i = 1; i < result.nodes.length; i += 1) {
      expect(result.nodes[i].zIndex).toBeGreaterThanOrEqual(result.nodes[i - 1].zIndex);
    }
  });

  it('describeAiSection produces a stable label per kind', () => {
    expect(describeAiSection('hero')).toBe('Hero');
    expect(describeAiSection('features')).toBe('Features grid');
    expect(describeAiSection('testimonials')).toBe('Testimonials');
    expect(describeAiSection('cta')).toBe('Call to action');
    expect(describeAiSection('faq')).toBe('FAQ');
  });
});