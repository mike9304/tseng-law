import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/zh-hant/faq',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import FaqPublicExplorer from '@/components/faq/FaqPublicExplorer';
import { faqRelatedLinks } from '@/components/faq/FaqPublicExplorer.logic';
import { faqItemsToSchemaItems, listFaqCategories, seedFaqItems } from '@/lib/builder/faq/faq-engine';

const zhItems = seedFaqItems().filter((item) => item.locale === 'zh-hant');

describe('zh-hant FAQ related links', () => {
  it('points only at existing zh-hant seed questions about Korean-language help', () => {
    const map = faqRelatedLinks['zh-hant'] ?? {};
    expect(Object.keys(map).sort()).toEqual(['seed-zh-hant-12', 'seed-zh-hant-9']);
    expect(zhItems.find((item) => item.faqId === 'seed-zh-hant-9')?.question).toBe('韓國人在台灣離婚需要什麼程序？');
    expect(zhItems.find((item) => item.faqId === 'seed-zh-hant-12')?.question).toBe('諮詢方式如何進行？');
    for (const link of Object.values(map)) {
      expect(link.href).toBe('/zh-hant/korean-lawyer-in-taiwan');
    }
    for (const locale of ['ko', 'en', 'ja'] as const) {
      expect(faqRelatedLinks[locale]).toBeUndefined();
    }
  });

  it('renders the link inside the answer panels without changing the FAQ schema text', () => {
    const html = renderToStaticMarkup(
      <FaqPublicExplorer locale="zh-hant" categories={listFaqCategories()} items={zhItems} />,
    );

    expect(html.match(/data-faq-related-link="true"/g)).toHaveLength(2);
    expect(html).toContain('href="/zh-hant/korean-lawyer-in-taiwan"');
    expect(html).toContain('可以用韓文找台灣律師嗎？');

    const schemaText = JSON.stringify(faqItemsToSchemaItems(zhItems));
    expect(schemaText).not.toContain('korean-lawyer-in-taiwan');
    expect(schemaText).not.toContain('可以用韓文找台灣律師嗎？');
  });
});
