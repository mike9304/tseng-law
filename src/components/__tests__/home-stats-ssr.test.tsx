import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeStatsSection from '@/components/HomeStatsSection';
import type { Locale } from '@/lib/locales';

describe('HomeStatsSection SSR', () => {
  it.each(['ko', 'zh-hant', 'en'] as Locale[])(
    'renders real targets for %s without JavaScript animation',
    (locale) => {
      const html = renderToStaticMarkup(<HomeStatsSection locale={locale} />);
      const numbers = Array.from(html.matchAll(/class="stat-number"[^>]*>([^<]+)</g)).map((m) =>
        m[1].replace(/,/g, '').trim(),
      );
      expect(numbers).toEqual(['10+', '500+', '5', '4']);
    },
  );
});
