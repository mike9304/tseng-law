import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeStatsSection from '@/components/HomeStatsSection';
import { siteLocales, type SiteLocale } from '@/lib/locales';

describe('HomeStatsSection SSR', () => {
  it.each(siteLocales as readonly SiteLocale[])(
    'renders real targets for %s without JavaScript animation',
    (locale) => {
      const html = renderToStaticMarkup(<HomeStatsSection locale={locale} />);
      const numbers = Array.from(html.matchAll(/class="stat-number"[^>]*>([^<]+)</g)).map((m) =>
        m[1].replace(/,/g, '').trim(),
      );
      expect(numbers).toEqual(['4', '3', '7', '2']);
    },
  );
});
