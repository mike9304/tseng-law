import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import {
  RECOMMENDED_SECTION_TITLE,
  normalizeColumnAudience,
  prioritizeRecommendedColumns,
  splitRecommendedColumns,
} from '@/lib/column-audience';
import {
  localeFromLanguageTag,
  localeHintFromReferrer,
  personalizeOrder,
  topicFromText,
} from '@/lib/reading-signals';
import RecommendedForYou from '@/components/RecommendedForYou';
import {
  AI_AUTHORED_COLUMN_SLUGS,
  getColumnDisclaimer,
  isAiAuthoredColumn,
} from '@/lib/ai-authored-columns';
import { buildArticleJsonLd } from '@/lib/seo';
import AiAuthorBox from '@/components/AiAuthorBox';
import { archiveLeadPublicationDate, archiveLeadSlugsFor } from './native-locale-columns';

/** Same-day archive order as columns-publication-date.test.ts (Nov 6 main batch, then registered lead). */
const REVIEWED_MAIN_COLUMN_SLUGS_20261106: Record<string, readonly string[]> = {
  ko: [
    'taiwan-korean-employee-missing-pension-contributions',
    'taiwan-former-employee-contract-apparent-authority',
    'taiwan-paid-judgment-debt-second-enforcement-objection',
    'taiwan-shareholder-derivative-suit-director-litigation-costs',
    'taiwan-litigation-notice-korean-manufacturer-intervention-effect',
    'taiwan-creditor-revocation-debtor-property-transfer',
    'taiwan-attached-loaned-machinery-third-party-objection-defendant',
    'taiwan-administrative-decision-missing-appeal-instructions-deadline',
    'taiwan-creditor-refuses-payment-consignation-debt-discharge',
    'taiwan-creditor-subrogation-debtor-unclaimed-receivable',
  ],
  'zh-hant': [
    'taiwan-occupational-accident-emergency-return-home-eight-hour-report',
    'taiwan-taoyuan-agricultural-disaster-certificate-low-interest-loan',
    'taiwan-nonurban-land-permeable-area-compensation-draft-2026',
    'taiwan-agricultural-business-subsidy-eligibility-draft-2026',
    'taiwan-railway-training-ticketing-security-operational-medical-check-draft',
    'taiwan-private-infrastructure-construction-income-tax-reporting-draft',
    'taiwan-power-industry-bond-investment-net-profit-use-draft',
    'taiwan-oral-nicotine-import-control-smoking-cessation-description',
    'taiwan-lost-well-drilling-technician-certificate-reissue-authority',
    'taiwan-military-supplier-certificate-restoration-three-year-period',
  ],
  en: [
    'taiwan-us-driver-license-exchange-state-nationality-reciprocity',
    'taiwan-us-dollar-debt-nt-dollar-check-currency-agreement',
    'taiwan-partial-payment-multiple-debts-appropriation-order',
    'taiwan-civil-plaintiff-withdrawal-defendant-response-consent',
    'taiwan-us-civil-case-taiwan-evidence-court-request',
    'taiwan-us-employee-signature-authority-fbar-records-handoff',
    'taiwan-us-citizen-government-records-access-information-request',
    'taiwan-recruiter-mainland-china-candidate-data-transfer-restriction',
    'taiwan-overseas-draftee-departure-documents-return-2026',
    'taiwan-gambling-link-paid-promotion-principal-accomplice-proceeds',
  ],
  th: ['taiwan-refined-soybean-oil-tariff-columns-zero-duty'],
  id: ['taiwan-online-clothing-outer-packaging-hygiene-seal-withdrawal'],
  hi: ['taiwan-deceased-taxpayer-bank-deposit-tax-payment'],
  fr: ['taiwan-genetic-sequencer-import-ccc-classification-2026'],
  de: ['taiwan-standard-transactions-independent-mandate-restriction'],
  it: ['taiwan-medical-device-clinical-trial-portal-registration-scope'],
  es: ['taiwan-franchise-interviewer-recruiter-advertiser-liability'],
  pt: ['taiwan-patent-prosecution-response-equivalence-estoppel'],
  ar: ['taiwan-delivery-order-minimum-guaranteed-payment-january-2027'],
  vi: ['taiwan-migrant-worker-multidrug-resistant-tuberculosis-treatment'],
  'zh-hans': ['taiwan-financial-business-trial-sixty-day-review-supplement-period'],
  fil: ['taiwan-philippines-direct-hiring-november-2026-new-occupations'],
  ja: [
    'taiwan-tainan-bail-company-asset-transaction-prior-report-order',
    'taiwan-foreign-yacht-repair-berthing-permit-extension',
    'taiwan-columbarium-nonperiodic-use-right-duration',
    'taiwan-religious-group-land-nominee-registration-special-application',
    'taiwan-recreational-diving-foreign-certification-scope',
    'taiwan-temporary-antique-exhibition-reexport-application-timing',
    'taiwan-underwater-cultural-heritage-discovery-emergency-exception',
    'taiwan-indigenous-traditional-pattern-commercial-use-permission',
    'taiwan-domestic-air-ticket-refund-thirty-percent-deduction-scope',
    'taiwan-micro-electric-two-wheeler-rental-insurance-contract',
  ],
};

/**
 * Newest registered own-audience column in `locale`: highest publication day, then
 * highest column number (same tie-break as archive lead / prioritizeRecommendedColumns).
 */
function newestLeadSlug(locale: string): string | undefined {
  const reviewedNov6 = REVIEWED_MAIN_COLUMN_SLUGS_20261106[locale];
  if (reviewedNov6?.length) {
    return reviewedNov6[reviewedNov6.length - 1];
  }
  const slugs = archiveLeadSlugsFor(locale);
  let best: { slug: string; date: string; index: number } | undefined;
  slugs.forEach((slug, index) => {
    const date = archiveLeadPublicationDate(slug, locale);
    if (!best || date > best.date || (date === best.date && index > best.index)) best = { slug, date, index };
  });
  return best?.slug ?? slugs[0];
}

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...(props as object)} />,
}));

describe('audience frontmatter recommendations', () => {
  it('normalizes locale codes, country aliases and shared values', () => {
    expect(normalizeColumnAudience(['JP', 'us', 'TW', 'all'])).toEqual(['ja', 'en', 'zh-hant', 'global']);
    expect(normalizeColumnAudience('vi')).toEqual(['vi']);
    // `uk` is the Ukrainian site locale; `GB` stays an English alias.
    expect(normalizeColumnAudience(['uk', 'GB'])).toEqual(['uk', 'en']);
    expect(normalizeColumnAudience(undefined)).toEqual([]);
  });

  it('parses the audience field and AI author from the column files', () => {
    const ja = getAllColumnPosts('ja').find((post) => post.slug === 'taiwan-subsidiary-employee-dismissal');
    expect(ja?.audience).toEqual(['ja']);
    expect(ja?.aiAuthored).toBe(true);
    const attorney = getAllColumnPosts('ko').find((post) => post.slug === 'taiwan-divorce-lawsuit-qna');
    expect(attorney?.aiAuthored).toBeFalsy();
  });

  it('leads each locale with its own-audience columns newest first, then shared, from its own files only', () => {
    const first = (locale: NonNullable<Parameters<typeof getAllColumnPosts>[0]>) =>
      prioritizeRecommendedColumns(locale, getAllColumnPosts(locale))[0]?.slug;
    // 2026-10-03: registered audience batches lead; same-day ties go to the
    // higher column number, so the last file of the batch comes first.
    expect(first('en')).toBe(newestLeadSlug('en'));
    expect(first('ja')).toBe(newestLeadSlug('ja'));
    expect(first('ko')).toBe(newestLeadSlug('ko'));
    for (const locale of ['th', 'id', 'hi', 'fr', 'de', 'it', 'es', 'pt', 'ar'] as const) {
      expect(first(locale), locale).toBe(newestLeadSlug(locale));
    }
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'vi', 'zh-hans', 'id', 'th', 'fil', 'hi', 'fr', 'de', 'it', 'es', 'pt', 'ar'] as const) {
      const posts = getAllColumnPosts(locale);
      const { recommended, rest } = splitRecommendedColumns(locale, posts);
      expect(recommended.length, locale).toBeGreaterThan(0);
      expect(recommended.length + rest.length, locale).toBe(posts.length);
      const own = new Set(posts.map((post) => post.slug));
      for (const post of recommended) expect(own.has(post.slug), `${locale}/${post.slug}`).toBe(true);
      const dates = recommended.map((post) => post.publicationDate || post.date);
      expect([...dates].sort().reverse(), locale).toEqual(dates);
      expect(RECOMMENDED_SECTION_TITLE[locale], locale).toBeTruthy();
    }
  });

  it('breaks same-day ties by column number regardless of input order', () => {
    const ko = getAllColumnPosts('ko');
    expect(prioritizeRecommendedColumns('ko', [...ko].reverse())[0]?.slug).toBe(newestLeadSlug('ko'));
    expect(prioritizeRecommendedColumns('zh-hant', [...getAllColumnPosts('zh-hant')].reverse())[0]?.slug)
      .toBe(newestLeadSlug('zh-hant'));
  });

  it('puts own-audience columns before shared ones, each newest first', () => {
    const posts = [
      { slug: 'shared-new', date: '2026-09-30', audience: ['global'] },
      { slug: 'ja-old', date: '2026-09-01', audience: ['ja'] },
      { slug: 'other', date: '2026-09-30', audience: ['ko'] },
      { slug: 'ja-new', date: '2026-09-29', audience: ['ja'] },
      { slug: 'shared-old', date: '2026-08-01', audience: ['global'] },
      { slug: 'untagged', date: '2026-09-30' },
    ];
    const { recommended, rest } = splitRecommendedColumns('ja', posts);
    expect(recommended.map((post) => post.slug)).toEqual(['ja-new', 'ja-old', 'shared-new', 'shared-old']);
    expect(rest.map((post) => post.slug)).toEqual(['other', 'untagged']);
  });
});

describe('client reading signals', () => {
  const items = [
    { slug: 'a', topic: 'company' },
    { slug: 'b', topic: 'family' },
    { slug: 'c', topic: 'visa' },
    { slug: 'd', topic: 'family' },
  ];

  it('keeps the static order without signals and moves the landing topic first', () => {
    expect(personalizeOrder(items, { topics: {}, viewed: [] }).map((i) => i.slug)).toEqual(['a', 'b', 'c', 'd']);
    expect(personalizeOrder(items, { topics: { family: 1 }, viewed: ['b'], landingTopic: 'family' }).map((i) => i.slug))
      .toEqual(['d', 'a', 'c', 'b']);
  });

  it('maps UTM text, referrers and browser languages', () => {
    expect(topicFromText('taiwan divorce custody')).toBe('family');
    expect(topicFromText('台湾 ビザ')).toBe('visa');
    expect(localeHintFromReferrer('search.yahoo.co.jp')).toBe('ja');
    expect(localeHintFromReferrer('www.google.com')).toBeUndefined();
    const known = ['ko', 'en', 'ja', 'zh-hant', 'zh-hans', 'vi', 'fil', 'id'];
    expect(localeFromLanguageTag('ja-JP', known)).toBe('ja');
    expect(localeFromLanguageTag('zh-TW', known)).toBe('zh-hant');
    expect(localeFromLanguageTag('zh-CN', known)).toBe('zh-hans');
    expect(localeFromLanguageTag('tl', known)).toBe('fil');
    expect(localeFromLanguageTag('xx', known)).toBeUndefined();
  });

  it('server-renders the static list as single stretched links (no personalization on the server)', () => {
    const html = renderToStaticMarkup(
      <RecommendedForYou
        locale="ko"
        hrefBase="/ko/columns"
        items={[
          { slug: 'one', title: 'One', featuredImage: '/x.webp', topic: 'family' },
          { slug: 'two', title: 'Two', featuredImage: '/y.webp', topic: 'visa' },
          { slug: 'three', title: 'Three', featuredImage: '/z.webp' },
          { slug: 'four', title: 'Four', featuredImage: '/w.webp' },
        ]}
      />,
    );
    expect(html).toContain('data-recommended-for-you="home"');
    expect(html).toContain('data-personalized="false"');
    expect(html).toContain('함께 읽을 글');
    expect(html.match(/<a /g)).toHaveLength(3);
    expect(html.match(/card-stretched-link/g)).toHaveLength(3);
    expect(html).not.toContain('/ko/columns/four');
  });
});

describe('AI-written columns', () => {
  it('covers 019–040 and not the attorney columns 001–018', () => {
    expect(AI_AUTHORED_COLUMN_SLUGS.size).toBe(23);
    expect(isAiAuthoredColumn('taiwan-semiconductor-market-entry')).toBe(false);
    expect(isAiAuthoredColumn('taiwan-divorce-lawsuit-qna')).toBe(false);
    expect(isAiAuthoredColumn('taiwan-exit-ban-foreigners')).toBe(true);
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'zh-hans', 'vi', 'id', 'th', 'fil'] as const) {
      const slugs = new Set(getAllColumnPosts(locale).map((post) => post.slug));
      const ai = [...AI_AUTHORED_COLUMN_SLUGS].filter((slug) => slugs.has(slug));
      expect(ai.length, locale).toBeGreaterThan(0);
    }
  });

  it('retains a localized general-information notice without author attribution', () => {
    for (const locale of ['ko', 'en', 'ja', 'zh-hant', 'zh-hans', 'vi', 'id', 'th', 'fil']) {
      const html = renderToStaticMarkup(<AiAuthorBox locale={locale} />);
      expect(html).toContain('data-column-disclaimer="true"');
      expect(html).toContain(getColumnDisclaimer(locale));
      expect(html).not.toMatch(/<img|data-column-ai-author|AI|증준외|曾雋崴|Wei Tseng/);
    }
    expect(getColumnDisclaimer('xx')).toBe(getColumnDisclaimer('en'));
  });

  it('omits the article author instead of inventing an attorney attribution', () => {
    const jsonLd = buildArticleJsonLd({
      locale: 'en',
      title: 't',
      description: 'd',
      path: '/en/columns/taiwan-exit-ban-foreigners',
    });
    expect(jsonLd).not.toHaveProperty('author');
    expect(JSON.stringify(jsonLd)).not.toMatch(/Wei Tseng|reviewedBy|Legal AI Assistant/);
    expect(jsonLd).toHaveProperty('publisher');
  });

  it('omits authors for the original attorney columns too', () => {
    const jsonLd = buildArticleJsonLd({
      locale: 'en',
      title: 't',
      description: 'd',
      path: '/en/columns/taiwan-divorce-lawsuit-qna',
    });
    expect(jsonLd).not.toHaveProperty('author');
    expect(jsonLd.publisher['@type']).toBe('Organization');
  });
});
