import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import matter from 'gray-matter';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { insightsArchive } from '@/data/insights-archive';
import { serviceAreas } from '@/data/service-details';
import { siteContent } from '@/data/site-content';
import { getColumnPost } from '@/lib/columns';
import { filterSearchIndex, getSearchIndex } from '@/lib/search';
import { buildArticleJsonLd, buildFaqJsonLd } from '@/lib/seo';
import type { BuilderSitemapEntry } from '@/lib/builder/seo/sitemap-builder';
import { generateMetadata } from '@/app/[locale]/columns/[slug]/page';

const slug = 'taiwan-divorce-lawsuit-qna';
const aliasSlug = 'divorce-qna';
const archiveId = 'divorce-qna';
const searchId = 'insight-post-divorce-qna';
const siteUrl = 'https://tseng-law.com';
const locales = ['ko', 'zh-hant', 'en'] as const;
const siteLocales = [...locales, 'ja'] as const;

const sourceMocks = vi.hoisted(() => ({
  readAttorneyProfileSourceRecords: vi.fn(async () => []),
  readServiceAreaSourceRecords: vi.fn(async () => []),
  collectAllBuilderSitemapEntries: vi.fn<() => Promise<BuilderSitemapEntry[]>>(
    async () => [],
  ),
}));

vi.mock('@/lib/builder/lawyers/source', () => ({
  readAttorneyProfileSourceRecords: sourceMocks.readAttorneyProfileSourceRecords,
}));

vi.mock('@/lib/builder/services/source', () => ({
  readServiceAreaSourceRecords: sourceMocks.readServiceAreaSourceRecords,
}));

vi.mock('@/lib/builder/seo/sitemap-builder', () => ({
  collectAllBuilderSitemapEntries: sourceMocks.collectAllBuilderSitemapEntries,
}));

const expectedTitles = {
  ko: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
  'zh-hant': '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
  en: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
  ja: '台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども',
} as const;

const expectedArchiveRecords = {
  ko: {
    id: archiveId,
    title: expectedTitles.ko,
    summary:
      '대만의 협의·조정·재판이혼 절차, 국제결혼·외국 이혼의 호적·승인 문제, 부부재산, 이혼 후 청구와 미성년 자녀 문제를 결과 보장 없이 정리합니다.',
    href: '/ko/insights/divorce-qna',
    category: 'legal',
    readTime: '18분 분량',
    image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    keywords: [
      '대만 이혼 절차',
      '국제이혼',
      '부부재산',
      '이혼 후 청구',
      '미성년 자녀',
    ],
  },
  'zh-hant': {
    id: archiveId,
    title: expectedTitles['zh-hant'],
    summary:
      '整理台灣協議、調解與裁判離婚程序、跨國婚姻與外國離婚的戶籍及承認問題、夫妻財產、離婚後請求與未成年子女事項，不保證個案結果。',
    href: '/zh-hant/insights/divorce-qna',
    category: 'legal',
    readTime: '20分鐘閱讀',
    image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    keywords: [
      '台灣離婚程序',
      '跨國離婚',
      '夫妻財產',
      '離婚後請求',
      '未成年子女',
    ],
  },
  en: {
    id: archiveId,
    title: expectedTitles.en,
    summary:
      'A guide to Taiwan divorce by agreement, court mediation or judgment, cross-border marriage and divorce records, matrimonial property, post-divorce claims, and minor-child issues, without promising an outcome.',
    href: '/en/insights/divorce-qna',
    category: 'legal',
    readTime: '25 min read',
    image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    keywords: [
      'Taiwan divorce procedure',
      'cross-border divorce',
      'matrimonial property',
      'post-divorce claims',
      'minor children',
    ],
  },
} as const;

const expectedCategoryLabels = {
  ko: '대만 법률정보',
  'zh-hant': '台灣法律資訊',
  en: 'Legal Information',
} as const;

const expectedNativeQueries = {
  ko: '대만 이혼',
  'zh-hant': '台灣 離婚',
  en: 'Taiwan divorce',
} as const;

const expectedFamilyKeyPoints = {
  ko: [
    '대만 이혼은 민법 제1050조의 서면, 당사자 쌍방의 진정한 이혼 의사를 직접 확인한 2명 이상 증인의 서명, 호정기관 등기를 모두 갖추는 협의이혼과 법원 조정·화해에 의한 이혼, 재판이혼을 구분해 검토합니다.',
    '국제결혼·외국 이혼은 대만의 재판관할·행정권한, 준거법, 외국 신분행위·재판의 대만 내 승인과 효력, 대만 호적 절차, 다른 국가·지역의 절차를 각각 확인해야 합니다.',
    '특정 재산의 등기·소유권과 증여·차명등기·대여·반환 등 개별 청구는 민법 제1030조의1 잔여재산 차액분배와 구분하며, 해당 청구의 2년·5년 행사기간을 손해배상·이혼 후 부양·양육비 등에 일률 적용하지 않습니다.',
    '배우자는 다른 상속인이 있으면 대만 민법상 해당 순위의 상속인과 공동상속하고, 다른 상속인이 없으면 전부를 상속합니다. 상속분은 상속인 구성에 따라 달라지며, 상속과 배우자의 잔여재산 관련 청구는 별도로 계산합니다.',
    '미성년 자녀에 대한 권리·의무의 행사·부담과 면접교섭은 자녀의 최선의 이익을 기준으로 판단하며, 혼인 파탄 책임이나 한 가지 요소가 결과를 자동으로 정하지 않습니다.',
    '법원이 본인 출석을 명령한 경우 정당한 이유 없는 불출석에는 첫 과태료가 3만 대만달러 이하이고 강제구인할 수 없으며, 이혼판결 확정일 또는 법원 조정·화해 성립일부터 일반적으로 30일 안에 호적 신고하되 기간 후 신청도 수리되고 요건을 갖추면 서면 최고 후 호정기관이 직접 등기할 수 있습니다.',
  ],
  'zh-hant': [
    '台灣離婚應區分：依民法第1050條具備書面、兩名以上親自見聞並確認雙方真實離婚意思之證人簽名及戶政登記的協議離婚；法院調解或和解離婚；以及裁判離婚。',
    '跨國婚姻或外國離婚應分別確認台灣的司法管轄與行政權限、準據法、外國身分行為或裁判在台灣的承認及效力、台灣戶籍程序，以及其他國家或地區的程序。',
    '特定財產的登記與所有權，以及贈與、借名登記、借貸、返還等個別請求，應與民法第1030條之1夫妻剩餘財產差額分配分開分析；該請求的二年及五年期間不得一律套用於損害賠償、離婚後扶養或子女扶養費。',
    '配偶在有其他繼承人時，與民法所定相應順位的繼承人共同繼承；四個順序均無繼承人時，由配偶繼承全部遺產。應繼分依繼承人組成而異，繼承與配偶的剩餘財產相關請求也應分別計算。',
    '未成年子女權利義務之行使或負擔及會面交往，應以子女最佳利益判斷，不因婚姻破綻責任或單一因素而自動決定。',
    '法院命本人到場而無正當理由不到場時，首次罰鍰為新臺幣3萬元以下且不得拘提；離婚判決確定日或法院調解、和解成立日起一般應於30日內申請戶籍登記，逾期申請仍會受理，符合要件時戶政機關得於書面催告後逕為登記。',
  ],
  en: [
    'Taiwan divorce analysis must distinguish a mutual-consent divorce satisfying Civil Code Article 1050’s writing requirement, signatures by at least two witnesses who personally perceived and confirmed both spouses’ genuine intent to divorce, and household registration; divorce by court mediation or settlement; and judicial divorce.',
    'A cross-border marriage or foreign divorce requires separate analysis of Taiwan judicial jurisdiction and administrative authority, applicable law, Taiwan recognition and effect of the foreign status act or judgment, Taiwan household-registration procedure, and any procedure in another country or region.',
    'Registered title and ownership of a specific asset, and claims based on gift, nominee registration, loan, or restitution, must be separated from Civil Code Article 1030-1 residual-property distribution; its two-year and five-year periods do not apply wholesale to damages, post-divorce support, or child support.',
    'When other heirs exist, a spouse inherits concurrently with the heirs in the applicable Civil Code rank; if no heir exists in any of the four ranks, the spouse inherits the entire estate. The share varies with the composition of the heirs, and inheritance and the spouse’s separate residual-property claim must also be calculated separately.',
    'The exercise and assumption of rights and duties concerning a minor child, and contact or visitation, are determined under the child’s best interests rather than marital fault or any single automatic factor.',
    'When a court orders personal appearance, the first fine for unjustified nonappearance is up to NTD 30,000 and arrest is unavailable; household registration is generally sought within 30 days after a divorce judgment becomes final or court mediation or settlement is established, late applications remain accepted, and the office may register directly after written demand when statutory conditions are met.',
  ],
} as const;

const expectedFamilyIntros = {
  ko: '한국-대만 국제결혼 증가에 따라 이혼·친권·상속 관련 분쟁이 늘고 있습니다. 법무법인 호정은 대만 가사소송법과 국제사법을 함께 검토하여, 한국인 의뢰인에게 최적의 전략을 제공합니다.',
  'zh-hant':
    '因應韓台跨國婚姻增加，協助協議離婚、調解離婚、裁判離婚程序，以及法定繼承順位與剩餘財產分配請求。',
  en: 'As Korea-Taiwan marriages increase, disputes on divorce, custody, and inheritance are growing. We combine Taiwan family procedure and private international law analysis to build practical strategies for cross-border clients.',
} as const;

const expectedFaqQuestions = {
  ko: [
    '대만에서 협의이혼은 합의서에 서명하면 바로 효력이 생기나요?',
    '대만 법원의 이혼 조정에는 부부가 반드시 함께 출석해야 하나요?',
    '혼인파탄에 책임이 있는 배우자도 대만에서 재판상 이혼을 청구할 수 있나요?',
    '혼전 자금으로 집값을 냈거나 한쪽 명의로 등기하면 소유권과 재산분할이 결정되나요?',
    '잔여재산 분배, 이혼 손해배상, 배우자 부양과 양육비는 같은 청구인가요?',
    '대만 법원은 미성년 자녀에 관한 사항을 어떤 기준으로 판단하나요?',
  ],
  'zh-hant': [
    '台灣兩願離婚只要簽署協議書就立刻生效嗎？',
    '台灣法院的離婚調解，夫妻是否必須一起出庭？',
    '對婚姻破綻應負責任的配偶，能否在台灣請求裁判離婚？',
    '以婚前資金支付房價，或以一方名義登記，是否就決定所有權與財產分配？',
    '剩餘財產分配、離婚損害賠償、離婚後贍養費與子女扶養費是同一請求嗎？',
    '台灣法院以何種標準判斷未成年子女相關事項？',
  ],
  en: [
    'Does signing a divorce agreement make a mutual-consent divorce in Taiwan immediately effective?',
    'Must both spouses always appear together in court mediation?',
    'Can the spouse responsible for marital breakdown petition for judicial divorce?',
    'Does paying for a house or holding title decide ownership and residual-property distribution?',
    'Are residual-property distribution, divorce damages, and post-divorce support the same claim or subject to one five-year period?',
    'How does a Taiwan court decide issues concerning a minor child?',
  ],
  ja: [
    '台湾の協議離婚は、合意書に署名すれば直ちに効力が生じますか？',
    '裁判所の調停では、必ず双方が同じ場に出頭しなければなりませんか？',
    '婚姻破綻について有責な配偶者は、裁判離婚を請求できますか？',
    '住宅の購入資金を負担したことや登記名義だけで、所有権や夫婦残余財産差額分配は決まりますか？',
    '夫婦残余財産差額分配、離婚に伴う損害賠償、配偶者扶養および養育費は同じ請求ですか？',
    '台湾の裁判所は、未成年の子に関する事項をどのように判断しますか？',
  ],
} as const;

const expectedInLanguage = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
} as const;

const articlePaths = {
  ko: 'src/content/columns/007-taiwan-divorce-lawsuit-qna.md',
  'zh-hant': 'src/content/columns-zh/007-taiwan-divorce-lawsuit-qna.md',
  en: 'src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md',
  ja: 'src/content/columns-ja/007-taiwan-divorce-lawsuit-qna.md',
} as const;

const expectedCanonicalAlternates = {
  ko: `${siteUrl}/ko/columns/${slug}`,
  'zh-Hant': `${siteUrl}/zh-hant/columns/${slug}`,
  en: `${siteUrl}/en/columns/${slug}`,
  ja: `${siteUrl}/ja/columns/${slug}`,
  'x-default': `${siteUrl}/ko/columns/${slug}`,
} as const;

const stalePublicCopy = [
  '이혼 조정·소송 Q&A',
  '離婚調解訴訟 Q&A',
  'Taiwan Divorce Litigation Q&A',
  '台湾の離婚調停・訴訟Q&A',
  '대만 이혼 조정, 소송 Q&A',
  '국제결혼 증가 상황에서 대만 이혼 조정·소송 절차를 Q&A로 설명합니다.',
  '台灣離婚調解與訴訟 Q&A',
  '以實務問答整理離婚調解與訴訟流程。',
  'Taiwan Divorce Mediation & Litigation Q&A',
  'A practical Q&A guide to mediation and litigation in Taiwan divorce matters.',
  '3,000 TWD',
  '3,000TWD',
  '국제결혼의 경우, 대만에서 혼인 등록했으면 대만 절차가 적용되고, 해외 등록이면 대만에 혼인 등록 후 진행하거나 직접 법원 소송을 제기합니다.',
  '跨國婚姻在台登記者適用台灣程序；海外登記者須先在台辦理婚姻登記或直接向法院提訴。',
  '재산분할은 법정재산제가 기본이며, 혼인 후 재산이 적은 배우자가 차액의 1/2을 청구(잔여재산분배청구권)할 수 있고, 시효는 5년입니다.',
  '財產分配以法定財產制為基礎，婚後財產較少方可請求差額之1/2（剩餘財產分配請求權），時效5年。',
  '조정 불출석 시 최대 3,000 TWD 벌금, 판결 후 30일 이내에 호적 등록 필수.',
  '調解無故不到場罰3,000TWD，判決後30日內須辦理戶籍登記。',
] as const;

function getRelatedColumn(locale: (typeof siteLocales)[number]) {
  return siteContent[locale].services.items
    .flatMap((item) => item.relatedColumns ?? [])
    .find((column) => column.slug === slug);
}

function getArchiveRecord(locale: (typeof locales)[number]) {
  return insightsArchive[locale].posts.find((post) => post.id === archiveId);
}

function getSearchRecord(locale: (typeof locales)[number]) {
  return getSearchIndex(locale).find((item) => item.id === searchId);
}

describe('column 007 public reference synchronization', () => {
  beforeEach(() => {
    sourceMocks.readAttorneyProfileSourceRecords.mockClear();
    sourceMocks.readServiceAreaSourceRecords.mockClear();
    sourceMocks.collectAllBuilderSitemapEntries.mockReset();
    sourceMocks.collectAllBuilderSitemapEntries.mockImplementation(async () => []);
  });

  it('keeps every accepted Markdown frontmatter title aligned with the four public titles', () => {
    for (const locale of siteLocales) {
      const raw = fs.readFileSync(path.join(process.cwd(), articlePaths[locale]), 'utf8');
      expect(matter(raw).data.title, locale).toBe(expectedTitles[locale]);
    }
  });

  it('uses the four exact family related-column titles', () => {
    for (const locale of siteLocales) {
      expect(getRelatedColumn(locale), locale).toEqual({
        slug,
        title: expectedTitles[locale],
      });
    }
  });

  it('uses exact KO, ZH-Hant, and EN archive records and keeps JA archive absent', () => {
    for (const locale of locales) {
      expect(getArchiveRecord(locale), locale).toEqual(expectedArchiveRecords[locale]);
    }

    expect(Object.keys(insightsArchive).sort()).toEqual(['en', 'ko', 'zh-hant']);
    expect('ja' in insightsArchive).toBe(false);
    expect(JSON.stringify(insightsArchive)).not.toContain('/ja/insights/divorce-qna');
  });

  it('propagates exact archive copy through search with canonical columns href', () => {
    for (const locale of locales) {
      expect(getSearchRecord(locale), locale).toEqual({
        id: searchId,
        title: expectedArchiveRecords[locale].title,
        description: expectedArchiveRecords[locale].summary,
        href: `/${locale}/columns/${slug}`,
        category: 'insights',
        tags: [
          ...expectedArchiveRecords[locale].keywords,
          expectedCategoryLabels[locale],
        ],
      });
    }
  });

  it('discovers the divorce archive through native filterSearchIndex queries', () => {
    for (const locale of locales) {
      const hits = filterSearchIndex(
        getSearchIndex(locale),
        expectedNativeQueries[locale],
      );
      const match = hits.find((item) => item.id === searchId);

      expect(match, locale).toBeDefined();
      expect(match?.title, locale).toBe(expectedArchiveRecords[locale].title);
      expect(match?.href, locale).toBe(`/${locale}/columns/${slug}`);
    }
  });

  it('uses the exact six-point family keyPoints contract for KO, ZH-Hant, and EN', () => {
    const family = serviceAreas.find((area) => area.slug === 'family');
    expect(family).toBeDefined();

    for (const locale of locales) {
      expect(family?.keyPoints[locale], locale).toEqual(expectedFamilyKeyPoints[locale]);
      expect(family?.keyPoints[locale], locale).toHaveLength(6);
    }
  });

  it('resolves canonical and divorce-qna alias slugs to the same loader title and slug for all four locales', () => {
    for (const locale of siteLocales) {
      const canonical = getColumnPost(slug, locale);
      const alias = getColumnPost(aliasSlug, locale);

      expect(canonical, locale).toBeDefined();
      expect(alias, locale).toBeDefined();
      expect(canonical?.slug, locale).toBe(slug);
      expect(alias?.slug, locale).toBe(slug);
      expect(canonical?.title, locale).toBe(expectedTitles[locale]);
      expect(alias?.title, locale).toBe(expectedTitles[locale]);
    }
  });

  it('keeps permanent column and insights aliases in every public locale', async () => {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configModule = await import(pathToFileURL(configPath).href);
    const redirects = await configModule.default.redirects();

    for (const locale of siteLocales) {
      expect(redirects).toContainEqual({
        source: `/${locale}/columns/${aliasSlug}`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `/${locale}/insights/${aliasSlug}`,
        destination: `/${locale}/columns/${slug}`,
        permanent: true,
      });
    }
  });

  it('publishes each canonical column URL once with four-language alternates in the sitemap', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const entries = await sitemap();
    const pathSuffix = `/columns/${slug}`;

    for (const locale of siteLocales) {
      const matches = entries.filter(
        (entry) => entry.url === `${siteUrl}/${locale}${pathSuffix}`,
      );
      expect(matches, locale).toHaveLength(1);
      expect(matches[0]?.alternates?.languages).toEqual(expectedCanonicalAlternates);
    }

    expect(
      entries.some((entry) => entry.url === `${siteUrl}/ja/insights/${aliasSlug}`),
    ).toBe(false);
  });

  it('emits exact generateMetadata title, canonical, and four-language alternates for all locales', async () => {
    for (const locale of siteLocales) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
      });

      expect(metadata.title, locale).toBe(expectedTitles[locale]);
      expect(metadata.alternates?.canonical, locale).toBe(
        `${siteUrl}/${locale}/columns/${slug}`,
      );
      expect(metadata.alternates?.languages, locale).toEqual(expectedCanonicalAlternates);
    }

    for (const locale of siteLocales) {
      const aliasMetadata = await generateMetadata({
        params: Promise.resolve({ locale, slug: aliasSlug }),
      });

      expect(aliasMetadata.title, locale).toBe(expectedTitles[locale]);
      expect(aliasMetadata.alternates?.canonical, locale).toBe(
        `${siteUrl}/${locale}/columns/${slug}`,
      );
      expect(aliasMetadata.alternates?.languages, locale).toEqual(
        expectedCanonicalAlternates,
      );
    }
  });

  it('builds article and FAQ JSON-LD from the four posts with exact headline, page, language, and six FAQ entities', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost(slug, locale);
      expect(post, locale).toBeDefined();
      expect(post?.faq, locale).toHaveLength(6);

      const article = buildArticleJsonLd({
        locale,
        title: post!.title,
        description: post!.summary,
        path: `/${locale}/columns/${post!.slug}`,
        authorName: 'test-author',
      });

      expect(article.headline, locale).toBe(expectedTitles[locale]);
      expect(article.mainEntityOfPage, locale).toBe(
        `${siteUrl}/${locale}/columns/${slug}`,
      );
      expect(article.inLanguage, locale).toBe(expectedInLanguage[locale]);

      const faq = buildFaqJsonLd(post!.faq ?? [], locale);
      expect(faq, locale).not.toBeNull();
      expect(faq?.['@type'], locale).toBe('FAQPage');
      expect(faq?.inLanguage, locale).toBe(expectedInLanguage[locale]);

      const entities = faq?.mainEntity as Array<{ name: string }> | undefined;
      expect(entities, locale).toHaveLength(6);
      expect(
        entities?.map((entity) => entity.name),
        locale,
      ).toEqual([...expectedFaqQuestions[locale]]);
    }
  });

  it('removes stale public titles, old archive copy, and unsafe family claims from synchronized runtime data', () => {
    const runtimeFiles = [
      'src/data/insights-archive.ts',
      'src/data/site-content.ts',
      'src/data/service-details.ts',
    ].map((relativePath) => fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));
    const synchronizedRuntime = runtimeFiles.join('\n');

    for (const formerReference of stalePublicCopy) {
      expect(synchronizedRuntime).not.toContain(formerReference);
    }

    const family = serviceAreas.find((area) => area.slug === 'family');
    const serializedPublicSurface = JSON.stringify({
      related: siteLocales.map((locale) => getRelatedColumn(locale)),
      archives: locales.map((locale) => getArchiveRecord(locale)),
      search: locales.map((locale) => getSearchRecord(locale)),
      familyKeyPoints: locales.map((locale) => family?.keyPoints[locale]),
    });

    for (const formerReference of stalePublicCopy) {
      expect(serializedPublicSurface).not.toContain(formerReference);
    }
  });

  it('keeps neighboring archive and family intro surfaces outside this unit unchanged', () => {
    const family = serviceAreas.find((area) => area.slug === 'family');
    expect(family).toBeDefined();

    for (const locale of locales) {
      expect(family?.intro[locale], locale).toBe(expectedFamilyIntros[locale]);
    }

    expect(family?.title).toEqual({
      ko: '가사소송',
      'zh-hant': '家事訴訟',
      en: 'Family Litigation',
    });
    expect(family?.columnSlugs).toEqual([
      'taiwan-divorce-lawsuit-qna',
      'taiwan-inheritance-custody-analysis',
    ]);

    const massageLawKo = insightsArchive.ko.posts.find((post) => post.id === 'massage-law');
    expect(massageLawKo).toMatchObject({
      id: 'massage-law',
      title: '대만 마사지 역사와 법률정보',
      href: '/ko/insights/massage-law',
      category: 'legal',
    });

    const civil = serviceAreas.find((area) => area.slug === 'civil');
    expect(civil?.title).toEqual({
      ko: '민사소송·손해배상',
      'zh-hant': '民事訴訟·損害賠償',
      en: 'Civil Litigation & Damages',
    });
  });
});
