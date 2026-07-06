import { describe, expect, it } from 'vitest';
import { faqItemsToSchemaItems, type BuilderFaqItem } from '@/lib/builder/faq/faq-engine';
import { generateFAQSchema } from '@/lib/builder/seo/schema-org';

const BASE_FAQ: BuilderFaqItem = {
  faqId: 'faq-test-1',
  slug: 'test-question',
  locale: 'ko',
  question: '공개 FAQ가 JSON-LD에 들어가나요?',
  answer: '공개 상태이고 schemaEnabled가 true이면 FAQPage mainEntity로 변환됩니다.',
  categoryId: 'consultation',
  tags: [],
  status: 'published',
  sortOrder: 10,
  schemaEnabled: true,
  createdAt: '2026-05-20T00:00:00.000Z',
  updatedAt: '2026-05-20T00:00:00.000Z',
};

describe('structured data FAQ helpers', () => {
  it('builds FAQPage JSON-LD from published schema-enabled FAQ items only', () => {
    const schemaItems = faqItemsToSchemaItems([
      BASE_FAQ,
      {
        ...BASE_FAQ,
        faqId: 'faq-test-2',
        slug: 'draft-question',
        question: '초안 FAQ는 제외되나요?',
        status: 'draft',
      },
      {
        ...BASE_FAQ,
        faqId: 'faq-test-3',
        slug: 'schema-disabled-question',
        question: 'schemaEnabled=false FAQ는 제외되나요?',
        schemaEnabled: false,
      },
    ]);

    expect(generateFAQSchema(schemaItems)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '공개 FAQ가 JSON-LD에 들어가나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '공개 상태이고 schemaEnabled가 true이면 FAQPage mainEntity로 변환됩니다.',
          },
        },
      ],
    });
  });
});
