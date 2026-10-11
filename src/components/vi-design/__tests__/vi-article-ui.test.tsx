import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/vi' }));

import ColumnContent from '@/components/ColumnContent';
import Footer from '@/components/Footer';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import ViArticleAuthority from '../ViArticleAuthority';
import { taiwanOfficeData } from '@/data/office-locations';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceLanguageNames } from '@/data/international-guidance-team';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';

describe('Vietnamese article and shared factual UI', () => {
  it('localizes table and footnote UI while preserving markdown source links', () => {
    const content = '| Mục | Nội dung |\n| --- | --- |\n| A | B |\n\nThông tin[^1].\n\n[^1]: [Nguồn](https://example.org/source).';
    const html = renderToStaticMarkup(<ColumnContent content={content} locale="en" uiLocale="vi" />);
    expect(html).toContain('Bảng có thể cuộn sang ngang để xem đầy đủ nội dung.');
    expect(html).toContain('Chú thích');
    expect(html).toContain('Trở lại nội dung');
    const reference = html.match(/<a[^>]*href="#user-content-fn-1"[^>]*>/)?.[0];
    const returnLink = html.match(/<a[^>]*href="#user-content-fnref-1"[^>]*>/)?.[0];
    expect(reference).toContain('id="user-content-fnref-1"');
    expect(reference).toContain('aria-describedby="footnote-label"');
    expect(returnLink).toContain('aria-label="Trở lại nội dung"');
    expect(reference).not.toContain('target="_blank"');
    expect(returnLink).not.toContain('target="_blank"');
    expect(html).toContain('href="https://example.org/source"');
    expect(html).not.toContain('Footnotes');
    const english = renderToStaticMarkup(<ColumnContent content={content} locale="en" />);
    expect(english).toContain('If the table extends beyond the screen');
    expect(english).toContain('Footnotes');
  });

  it('draws the authority reference from the established attorney record without article-review or Vietnamese-consultation claims', () => {
    const html = renderToStaticMarkup(<ViArticleAuthority />);
    const profile = getAttorneyProfile('en', primaryAttorneySlug)!;
    expect(html).toContain('Wei Tseng');
    expect(html).toContain('Luật sư thành viên tại Đài Loan');
    for (const language of profile.languages) expect(html).toContain(guidanceLanguageNames.vi[language]);
    expect(html).not.toMatch(/Reviewing Attorney|Lead Attorney|rà soát|tiếng Việt/);
    expect(html).toContain('href="/vi/lawyers"');
  });

  it('preserves the canonical local office addresses, including the exact Taichung unit', () => {
    const office = renderToStaticMarkup(<OfficeMapTabs locale="vi" presentation="editorial" />);
    const footer = renderToStaticMarkup(<Footer locale="vi" />);
    expect(office).toContain(taiwanOfficeData['zh-hant'][0].address);
    expect(office).not.toContain('>OFFICES<');
    const footerText = footer.replace(/<[^>]*>/g, '');
    for (const entry of taiwanOfficeData['zh-hant']) expect(footerText).toContain(entry.address);
    expect(footerText).toContain('19號6樓之1');
    expect(footer).toContain(`href="mailto:${CONSULTATION_EMAIL}"`);
    expect(footer).not.toContain('Preferred%20language');
    const english = renderToStaticMarkup(<OfficeMapTabs locale="en" presentation="editorial" />);
    expect(english).toContain(taiwanOfficeData.en[0].address);
  });
});
