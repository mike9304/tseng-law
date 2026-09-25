import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import IntentLandingPage from '@/components/IntentLandingPage';
import type { SiteLocale } from '@/lib/locales';

const locales: SiteLocale[] = ['en', 'ja', 'ko', 'zh-hant'];

describe('Taiwan matter intake from the lawyer landing page', () => {
  it.each(locales)('offers real matter paths and a same-language inquiry on %s', (locale) => {
    const html = renderToStaticMarkup(
      <IntentLandingPage locale={locale} slug="taiwan-lawyer" />,
    );
    const router = html.match(/<section[^>]+id="matter-router"[\s\S]*?<\/section>/)?.[0];

    expect(router).toBeDefined();
    for (const slug of ['investment', 'civil', 'family', 'labor', 'criminal']) {
      expect(router).toContain(`href="/${locale}/services/${slug}"`);
    }
    expect(router).toContain(`href="/${locale}/contact"`);
    expect(router).not.toContain(`/services/immigration`);
    expect(router).not.toMatch(/Book Consultation|consultation confirmed|予約完了|상담 확정|諮詢已確認/i);
  });

  it('keeps the matter router specific to the broad lawyer landing', () => {
    const html = renderToStaticMarkup(
      <IntentLandingPage locale="en" slug="taiwan-litigation-lawyer" />,
    );
    expect(html).not.toContain('id="matter-router"');
  });
});
