import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import IntentLandingPage from '@/components/IntentLandingPage';
import PricingCards from '@/components/PricingCards';
import ServicesBento from '@/components/ServicesBento';
import {
  CORPORATE_ADVISORY_ANCHOR,
  getCorporateAdvisory,
  getCorporateAdvisoryHref,
} from '@/data/corporate-advisory';
import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

function htmlHref(href: string): string {
  return href.replace(/&/g, '&amp;');
}

function advisorySectionHtml(html: string): string {
  const start = html.indexOf(`id="${CORPORATE_ADVISORY_ANCHOR}"`);
  if (start === -1) {
    return '';
  }
  const nextSection = html.indexOf('class="section ', start + 1);
  return html.slice(start, nextSection === -1 ? undefined : nextSection);
}

function relatedResourcesHtml(html: string): string {
  const start = html.indexOf('RELATED GUIDES') !== -1
    ? html.indexOf('RELATED GUIDES')
    : html.indexOf('関連ガイド');
  if (start === -1) {
    return '';
  }
  const faqStart = html.indexOf('class="section section--gray"', start);
  return html.slice(start, faqStart === -1 ? undefined : faqStart);
}

function hrefPositions(html: string, hrefs: readonly string[]): number[] {
  return hrefs.map((href) => html.indexOf(`href="${href}"`));
}

describe('corporate advisory discovery paths', () => {
  it('returns EN/JA copy and a stable taiwan-lawyer anchor, and null for KO/ZH', () => {
    expect(CORPORATE_ADVISORY_ANCHOR).toBe('corporate-advisory');
    expect(getCorporateAdvisory('en')?.headline).toBe('Taiwan Corporate Legal Advisory');
    expect(getCorporateAdvisory('ja')?.headline).toBe('台湾の企業法務・法律顧問');
    expect(getCorporateAdvisoryHref('en')).toBe('/en/taiwan-lawyer#corporate-advisory');
    expect(getCorporateAdvisoryHref('ja')).toBe('/ja/taiwan-lawyer#corporate-advisory');
    expect(getCorporateAdvisory('ko')).toBeNull();
    expect(getCorporateAdvisory('zh-hant')).toBeNull();
    expect(getCorporateAdvisoryHref('ko')).toBeNull();
    expect(getCorporateAdvisoryHref('zh-hant')).toBeNull();
  });

  it('renders the EN taiwan-lawyer advisory section with same-locale destinations before process', () => {
    const html = renderToStaticMarkup(
      <IntentLandingPage locale="en" slug="taiwan-lawyer" />,
    );
    const section = advisorySectionHtml(html);
    const mailto = htmlHref(getConsultationPublicMailto('en'));
    const processIndex = html.indexOf('Workflow and Preparation');
    const advisoryIndex = html.indexOf(`id="${CORPORATE_ADVISORY_ANCHOR}"`);

    expect(section).toContain('Taiwan Corporate Legal Advisory');
    expect(section).toContain(
      'We advise overseas businesses on Taiwan-related contract review, commercial legal risk, and employment matters.',
    );
    expect(section).toContain('Tell us whether you need help with a particular matter or ongoing legal advice.');
    expect(section).toContain('English, Japanese, Korean, and Chinese');
    expect(section).toContain(`href="/en/pricing"`);
    expect(section).toContain(`href="/en/services/labor"`);
    expect(section).toContain(`href="/en/services/ip"`);
    expect(section).toContain(`href="/en/taiwan-company-setup-lawyer"`);
    expect(section).toContain(`href="/en/taiwan-litigation-lawyer"`);
    expect(section).toContain(`href="${mailto}"`);
    expect(section).toContain('Sensitive files should wait');
    expect(section).not.toContain('one assigned');
    expect(section).not.toContain('guaranteed deliverables');
    expect(section).not.toContain('due-diligence report');
    expect(section).not.toContain('HR or payroll administration');
    expect(section).not.toContain('as that page already states');
    expect(section).not.toMatch(/free consult|unlimited|HR or payroll administration service is included/i);
    expect(advisoryIndex).toBeGreaterThan(-1);
    expect(advisoryIndex).toBeLessThan(processIndex);
    expect(html).not.toContain('href="/ko/taiwan-lawyer#corporate-advisory"');
  });

  it('renders the JA taiwan-lawyer advisory section with Japanese copy and same-locale destinations', () => {
    const html = renderToStaticMarkup(
      <IntentLandingPage locale="ja" slug="taiwan-lawyer" />,
    );
    const section = advisorySectionHtml(html);
    const mailto = htmlHref(getConsultationPublicMailto('ja'));

    expect(section).toContain('台湾の企業法務・法律顧問');
    expect(section).toContain(
      '海外企業の台湾に関する契約書の確認、取引上の法的リスク、雇用・労務についてご相談を受けています。',
    );
    expect(section).toContain(
      '個別の案件についてのご相談か、継続的な法律顧問をご希望かをお知らせください。',
    );
    expect(section).toContain('契約書の確認');
    expect(section).toContain('英語・日本語・韓国語・中国語');
    expect(section).toContain(`href="/ja/pricing"`);
    expect(section).toContain(`href="/ja/services/labor"`);
    expect(section).toContain(`href="/ja/services/ip"`);
    expect(section).toContain(`href="/ja/taiwan-company-setup-lawyer"`);
    expect(section).toContain(`href="/ja/taiwan-litigation-lawyer"`);
    expect(section).toContain(`href="${mailto}"`);
    expect(section).not.toContain('Taiwan Corporate Legal Advisory');
    expect(section).not.toContain('成果物をあらかじめ約束するものではありません');
    expect(section).not.toContain('デューデリジェンス');
    expect(section).not.toContain('人事・給与計算');
    expect(html).not.toContain('href="/en/taiwan-lawyer#corporate-advisory"');
  });

  it.each(['ko', 'zh-hant'] as const)(
    'does not render the advisory section on %s taiwan-lawyer',
    (locale) => {
      const html = renderToStaticMarkup(
        <IntentLandingPage locale={locale} slug="taiwan-lawyer" />,
      );

      expect(html).not.toContain(`id="${CORPORATE_ADVISORY_ANCHOR}"`);
      expect(html).not.toContain('Taiwan Corporate Legal Advisory');
      expect(html).not.toContain('台湾の企業法務・法律顧問');
      expect(renderToStaticMarkup(<CorporateAdvisoryLink locale={locale} />)).toBe('');
    },
  );

  it.each(
    intentPageSlugs.filter((slug) => slug !== 'taiwan-lawyer'),
  )('does not mount the advisory section on EN/JA %s', (slug) => {
    const en = renderToStaticMarkup(<IntentLandingPage locale="en" slug={slug} />);
    const ja = renderToStaticMarkup(<IntentLandingPage locale="ja" slug={slug} />);

    expect(en).not.toContain(`id="${CORPORATE_ADVISORY_ANCHOR}"`);
    expect(ja).not.toContain(`id="${CORPORATE_ADVISORY_ANCHOR}"`);
    expect(en).toContain(htmlHref(getIntentPage('en', slug)?.title ?? ''));
    expect(ja).toContain(htmlHref(getIntentPage('ja', slug)?.title ?? ''));
  });

  it('puts general, setup, litigation, and advisory links before the Korean-specific guide on EN taiwan-lawyer', () => {
    const html = relatedResourcesHtml(
      renderToStaticMarkup(<IntentLandingPage locale="en" slug="taiwan-lawyer" />),
    );
    const positions = hrefPositions(html, [
      '/en/taiwan-company-setup-lawyer',
      '/en/taiwan-litigation-lawyer',
      '/en/taiwan-lawyer#corporate-advisory',
      '/en/guides/taiwan-company-setup',
      '/en/korean-lawyer-in-taiwan',
    ]);

    expect(positions.every((index) => index !== -1)).toBe(true);
    expect(positions[0]).toBeLessThan(positions[1]);
    expect(positions[1]).toBeLessThan(positions[2]);
    expect(positions[2]).toBeLessThan(positions[3]);
    expect(positions[3]).toBeLessThan(positions[4]);
  });

  it('keeps the Korean-specific related resource on JA taiwan-lawyer and adds the advisory destination', () => {
    const html = relatedResourcesHtml(
      renderToStaticMarkup(<IntentLandingPage locale="ja" slug="taiwan-lawyer" />),
    );

    expect(html).toContain('/ja/korean-lawyer-in-taiwan');
    expect(html).toContain('/ja/taiwan-lawyer#corporate-advisory');
    expect(html.indexOf('/ja/korean-lawyer-in-taiwan')).toBeLessThan(
      html.indexOf('/ja/taiwan-lawyer#corporate-advisory'),
    );
  });

  it('places the advisory link after the six EN/JA service cards without adding a seventh service item', () => {
    const en = renderToStaticMarkup(<ServicesBento locale="en" />);
    const ja = renderToStaticMarkup(<ServicesBento locale="ja" />);
    const ko = renderToStaticMarkup(<ServicesBento locale="ko" />);
    const cardCount = (html: string) => html.split('class="services-detail-card').length - 1;

    expect(cardCount(en)).toBe(6);
    expect(cardCount(ja)).toBe(6);
    expect(cardCount(ko)).toBe(6);
    expect(en).toContain('href="/en/taiwan-lawyer#corporate-advisory"');
    expect(ja).toContain('href="/ja/taiwan-lawyer#corporate-advisory"');
    expect(en.indexOf('services-card-grid')).toBeLessThan(
      en.indexOf('href="/en/taiwan-lawyer#corporate-advisory"'),
    );
    expect(ko).not.toContain('taiwan-lawyer#corporate-advisory');
  });

  it('adds the advisory link only on the EN/JA annual retainer card and leaves prices unchanged', () => {
    const en = renderToStaticMarkup(<PricingCards locale="en" />);
    const ja = renderToStaticMarkup(<PricingCards locale="ja" />);
    const ko = renderToStaticMarkup(<PricingCards locale="ko" />);

    const retainerSlice = (html: string, title: string) => {
      const start = html.indexOf(title);
      const nextCard = html.indexOf('class="card pricing-card"', start + 1);
      return html.slice(start, nextCard === -1 ? undefined : nextCard);
    };

    expect(retainerSlice(en, 'Annual Legal Retainer')).toContain(
      'href="/en/taiwan-lawyer#corporate-advisory"',
    );
    expect(retainerSlice(ja, '年間法律顧問')).toContain(
      'href="/ja/taiwan-lawyer#corporate-advisory"',
    );
    expect(en).toContain('NT$ 3,000');
    expect(en.match(/NT\$ 50,000/g)).toHaveLength(2);
    expect(ja.match(/NT\$ 50,000/g)).toHaveLength(2);
    expect(ko).not.toContain('taiwan-lawyer#corporate-advisory');
    expect(ko).toContain('NT$ 3,000');
    expect(ko.match(/NT\$ 50,000/g)).toHaveLength(2);
  });

  it('keeps the EN litigation hero as a service-scope statement, not a required sequence', () => {
    const page = getIntentPage('en', 'taiwan-litigation-lawyer');
    const ja = getIntentPage('ja', 'taiwan-litigation-lawyer');

    expect(page?.heroPoints[0]).toBe(
      'We handle Taiwan contract disputes and unpaid invoices, as well as civil claims, criminal matters, and family disputes according to the case.',
    );
    expect(page?.heroPoints[0]).not.toMatch(/Start with|then/i);
    expect(ja?.heroPoints[0]).toContain('契約紛争');
    expect(ja?.heroPoints[0]).toContain('未払い請求');
    expect(ja?.description).toContain('契約紛争・未払い請求');
  });
});
