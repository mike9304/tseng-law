import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LegalPageSections from '../LegalPageSections';
import { legalPageContent } from '@/data/legal-pages';
import { siteLocales } from '@/lib/locales';

describe('privacy reading layout', () => {
  it.each(siteLocales)('keeps every %s policy paragraph while limiting the layout to privacy', (locale) => {
    const content = legalPageContent[locale].privacy;
    const html = renderToStaticMarkup(<LegalPageSections locale={locale} content={content} />);
    expect(html).toContain('data-legal-layout="privacy"');
    expect(html.match(/class="card legal-card"/g)).toHaveLength(content.sections.length);
    for (const section of content.sections) {
      for (const paragraph of section.paragraphs) expect(html).toContain(renderToStaticMarkup(<p>{paragraph}</p>));
    }
    for (const key of ['disclaimer', 'accessibility'] as const) {
      expect(renderToStaticMarkup(<LegalPageSections locale={locale} content={legalPageContent[locale][key]} />)).not.toContain('data-legal-layout="privacy"');
    }
  });
});
