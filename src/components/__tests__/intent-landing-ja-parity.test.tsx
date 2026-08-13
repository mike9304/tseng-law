import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import type { SiteLocale } from '@/lib/locales';

function renderLanding(locale: SiteLocale, slug: (typeof intentPageSlugs)[number]): string {
  return renderToStaticMarkup(<IntentLandingPage locale={locale} slug={slug} />);
}

describe('Japanese intent landing render parity', () => {
  it.each(intentPageSlugs)('renders the full landing structure for /ja/%s', (slug) => {
    const html = renderLanding('ja', slug);
    const page = getIntentPage('ja', slug);

    expect(html).toContain(page?.title ?? '');
    // Related services/columns/pricing CTA sections render with /ja paths.
    expect(html).toContain('/ja/services/');
    expect(html).toContain('/ja/columns/');
    expect(html).toContain('/ja/pricing');
    expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');
    // FAQPage JSON-LD is emitted for ja as well.
    expect(html).toContain('"@type":"FAQPage"');
    // Same heading hierarchy as the other locales: first panels h2, detail panels h3.
    expect(html).toContain('<h2');
    expect(html).toContain('<h3');
    // No /ko links leak into the ja surface.
    expect(html).not.toContain('href="/ko/');
  });

  it.each(intentPageSlugs)('links every related column under /ja/columns for %s', (slug) => {
    const html = renderLanding('ja', slug);
    const page = getIntentPage('ja', slug);

    for (const columnSlug of page?.columnSlugs ?? []) {
      expect(html).toContain(`/ja/columns/${columnSlug}`);
    }
  });

  it.each(['ko', 'zh-hant', 'en'] as const)('keeps the %s render intact', (locale) => {
    const html = renderLanding(locale, 'taiwan-lawyer');
    const page = getIntentPage(locale, 'taiwan-lawyer');

    expect(html).toContain(page?.title ?? '');
    expect(html).toContain(`/${locale}/columns/`);
    expect(html).toContain(`/${locale}/services/`);
    expect(html).toContain('"@type":"FAQPage"');
  });
});
