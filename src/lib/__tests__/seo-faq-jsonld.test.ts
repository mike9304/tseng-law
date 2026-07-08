import { describe, expect, it } from 'vitest';
import { buildFaqJsonLd } from '@/lib/seo';

describe('buildFaqJsonLd', () => {
  it('returns null for an empty list', () => {
    expect(buildFaqJsonLd([])).toBeNull();
  });

  it('returns null for non-array input', () => {
    expect(buildFaqJsonLd(undefined as never)).toBeNull();
    expect(buildFaqJsonLd(null as never)).toBeNull();
  });

  it('returns null when every item lacks q or a', () => {
    expect(buildFaqJsonLd([{ q: '질문' }, { a: '답' }, {}] as never)).toBeNull();
  });

  it('builds an FAQPage node whose mainEntity length matches the input', () => {
    const node = buildFaqJsonLd([
      { q: '대만 회사 설립 절차는?', a: '10단계로 진행됩니다.' },
      { q: '비자를 받을 수 있나요?', a: '네, 가능합니다.' },
      { q: '최소 자본금이 있나요?', a: '회사 설립 자체는 최소 자본금 제한이 없습니다.' },
    ]);

    expect(node).not.toBeNull();
    expect(node).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
    });
    const mainEntity = node!.mainEntity as unknown[];
    expect(mainEntity).toHaveLength(3);
  });

  it('structures each entry as a Question with an acceptedAnswer Answer', () => {
    const node = buildFaqJsonLd([
      { q: '대만 회사 설립 절차는?', a: '10단계로 진행됩니다.' },
    ]);

    const mainEntity = node!.mainEntity as unknown[];
    expect(mainEntity[0]).toEqual({
      '@type': 'Question',
      name: '대만 회사 설립 절차는?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10단계로 진행됩니다.',
      },
    });
  });

  it('every mainEntity item has Question type and an acceptedAnswer with text', () => {
    const node = buildFaqJsonLd([
      { q: '질문1', a: '답1' },
      { q: '질문2', a: '답2' },
    ]);

    const mainEntity = node!.mainEntity as Array<Record<string, unknown>>;
    for (const entity of mainEntity) {
      expect(entity['@type']).toBe('Question');
      expect(typeof entity.name).toBe('string');
      const acceptedAnswer = entity.acceptedAnswer as Record<string, unknown>;
      expect(acceptedAnswer['@type']).toBe('Answer');
      expect(typeof acceptedAnswer.text).toBe('string');
    }
  });

  it('adds inLanguage=ko when the ko locale is supplied', () => {
    const node = buildFaqJsonLd([{ q: '질문', a: '답변' }], 'ko');
    expect(node!.inLanguage).toBe('ko');
  });

  it('adds inLanguage=zh-Hant when the zh-hant locale is supplied', () => {
    const node = buildFaqJsonLd([{ q: '問題', a: '回答' }], 'zh-hant');
    expect(node!.inLanguage).toBe('zh-Hant');
  });
});
