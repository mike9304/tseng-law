import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';
import CompanySetupComparison from '@/components/CompanySetupComparison';
import { siteLocales } from '@/lib/locales';

describe('company-setup landing comparison', () => {
  it.each(siteLocales)('%s shows structure rows and leaves tax rates to the guide', (locale) => {
    const html = renderToStaticMarkup(<CompanySetupComparison locale={locale} />);
    const rows = guideContent[locale].comparisonRows;

    for (const index of [1, 2, 3, 4, 7]) expect(html).not.toContain(rows[index].form);
    expect(html).not.toMatch(/\b(?:5|20|21|30)%/);
    for (const index of [0, 5, 6]) expect(html).toContain(rows[index].form);
    expect(html).toContain(`href="/${locale}/guides/taiwan-company-setup"`);
  });
});
