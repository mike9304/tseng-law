import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ja/faq',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import FaqPublicExplorer from '@/components/faq/FaqPublicExplorer';
import { faqContent } from '@/data/faq-content';
import { listFaqCategories, seedFaqItems } from '@/lib/builder/faq/faq-engine';

const jaSeedItems = seedFaqItems().filter((item) => item.locale === 'ja');

describe('WO#17 Japanese FaqPublicExplorer surface', () => {
  it('renders the Japanese search input, category chips, question count, and all seeded questions', () => {
    const html = renderToStaticMarkup(
      <FaqPublicExplorer locale="ja" categories={listFaqCategories()} items={jaSeedItems} />,
    );

    expect(html).toContain('data-public-faq-explorer="true"');
    expect(html).toContain('type="search"');
    expect(html).toContain('FAQ を検索');
    expect(html).toContain('すべて');
    for (const chip of ['会社設立', '労働法', '民事・交通事故', '家事・離婚', '刑事', '相談・費用']) {
      expect(html).toContain(chip);
    }
    expect(html).toContain(`${faqContent.ja.length}件の質問`);
    for (const item of faqContent.ja) {
      expect(html).toContain(item.question);
    }
  });

  it('seeds one explorer item per existing Japanese FAQ entry', () => {
    expect(jaSeedItems).toHaveLength(faqContent.ja.length);
    expect(jaSeedItems.map((item) => item.question)).toEqual(faqContent.ja.map((item) => item.question));
  });
});
