import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getColumnPost } from '@/lib/columns';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import ColumnDetailPage from '../page';

/**
 * WO-B2B-R1 §4 (research P8 / G3).
 *
 * The guidance column route normalizes its locale to `en` so the `SiteLocale`-
 * keyed copy tables resolve, and the FAQPage node was built from that value —
 * so live `/vi/columns/*` published `"inLanguage": "en"` above Vietnamese
 * questions and answers. An answer engine reading that node is told the text is
 * English, which is the opposite of the page's whole purpose.
 *
 * Only the `seo` block is switched on below: the hero and body are not needed
 * to observe the JSON-LD, and leaving them off keeps the test off the markdown
 * renderer.
 */
const visibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    persisted: true,
    revision: 1,
    savedAt: '2026-09-11T00:00:00.000Z',
    visibleBlockIds: ['columns.item.seo'],
  })),
}));

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: visibilityMock.read,
  };
});

const SLUG = 'taiwan-company-establishment-basics';

function jsonLdNodes(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]!) as Record<string, unknown>,
  );
}

async function renderColumn(locale: string): Promise<string> {
  const page = await ColumnDetailPage({
    params: Promise.resolve({ locale, slug: SLUG }),
  });
  return renderToStaticMarkup(page);
}

describe('guidance column JSON-LD language', () => {
  it.each(GUIDANCE_LOCALES_4)(
    'declares inLanguage=%s on the FAQPage and Article of /%s/columns',
    async (locale) => {
      const post = getColumnPost(SLUG, locale);
      expect(post?.faq?.length, `columns-${locale}/${SLUG} must carry FAQ frontmatter`)
        .toBeGreaterThan(0);

      const nodes = jsonLdNodes(await renderColumn(locale));
      const faqPage = nodes.find((node) => node['@type'] === 'FAQPage');
      const article = nodes.find((node) => node['@type'] === 'Article');

      expect(faqPage, `${locale} FAQPage node`).toBeDefined();
      expect(faqPage?.inLanguage).toBe(locale);
      // The Article node was already correct; asserted here so the two nodes on
      // one page can never disagree about the language of the same text.
      expect(article?.inLanguage).toBe(locale);

      // The questions in the node are this locale's own, not English.
      const mainEntity = faqPage?.mainEntity as Array<{ name: string }>;
      expect(mainEntity).toHaveLength(post!.faq!.length);
      expect(mainEntity[0]?.name).toBe(post!.faq![0]!.q);
    },
  );
});
