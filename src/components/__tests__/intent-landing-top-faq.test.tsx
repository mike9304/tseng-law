import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import IntentLandingPage from '@/components/IntentLandingPage';
import {
  getIntentPage,
  getIntentTopFaqs,
  intentPageSlugs,
} from '@/data/intent-pages';
import type { SiteLocale } from '@/lib/locales';

function renderLanding(locale: SiteLocale, slug: (typeof intentPageSlugs)[number]): string {
  return renderToStaticMarkup(<IntentLandingPage locale={locale} slug={slug} />);
}

function parseFaqPage(html: string): {
  mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
} {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)];
  for (const match of scripts) {
    const data = JSON.parse(match[1] as string) as {
      '@type'?: string;
      mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
      return { mainEntity: data.mainEntity };
    }
  }
  throw new Error('FAQPage JSON-LD was not rendered');
}

const generalIntentPageSlugs = intentPageSlugs.filter(
  (slug) => slug !== 'taiwan-semiconductor-supplier-legal',
);

describe('intent landing top Q-A summary (P1-7②)', () => {
  it.each(generalIntentPageSlugs)(
    'places selected FAQ question–answer text before Related Services on EN /%s and matches FAQPage JSON-LD',
    (slug) => {
      const page = getIntentPage('en', slug);
      expect(page).toBeDefined();
      const topFaqs = getIntentTopFaqs(page!);
      expect(topFaqs.length).toBeGreaterThanOrEqual(1);
      expect(topFaqs.length).toBeLessThanOrEqual(3);

      const html = renderLanding('en', slug);
      const relatedIndex = html.indexOf('Related Services');
      expect(relatedIndex).toBeGreaterThan(-1);

      const overviewIndex = html.indexOf('What to review first on this page');
      expect(overviewIndex).toBeGreaterThan(-1);
      expect(overviewIndex).toBeLessThan(relatedIndex);

      // Visible summary sits after the overview heading and before Related Services.
      // FAQPage JSON-LD is emitted earlier in the document with the same strings.
      const summaryHtml = html.slice(overviewIndex, relatedIndex);
      const faqPage = parseFaqPage(html);

      for (const item of topFaqs) {
        expect(summaryHtml).toContain(item.question);
        expect(summaryHtml).toContain(item.answer);

        const schema = faqPage.mainEntity.find((entity) => entity.name === item.question);
        expect(schema).toBeDefined();
        expect(schema?.acceptedAnswer.text).toBe(item.answer);
        expect(item.question).toBe(schema?.name);
        expect(item.answer).toBe(schema?.acceptedAnswer.text);
      }
    },
  );

  it('selects top FAQ entries from intent-pages data rather than new copy', () => {
    for (const slug of generalIntentPageSlugs) {
      const page = getIntentPage('en', slug)!;
      const topFaqs = getIntentTopFaqs(page);
      expect(page.topFaqIds?.length).toBeGreaterThanOrEqual(1);
      expect(topFaqs.every((item) => page.faq.includes(item))).toBe(true);
    }
  });
});
