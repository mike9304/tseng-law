import { createHash } from 'node:crypto';
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
import { buildArticleJsonLd } from '@/lib/seo';
import type { BuilderSitemapEntry } from '@/lib/builder/seo/sitemap-builder';
import { generateMetadata } from '@/app/[locale]/columns/[slug]/page';

const slug = 'taiwan-overtaking-accident-liability';
const aliasSlug = 'overtaking-accident';
const archiveId = 'overtaking-accident';
const searchId = 'insight-post-overtaking-accident';
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
  ko: '대만 추월 사고의 책임은 어떻게 판단하나요?',
  'zh-hant': '台灣超車事故的責任如何判斷？',
  en: 'How Is Liability Assessed After an Overtaking Accident in Taiwan?',
  ja: '台湾の追い越し事故、責任はどう判断されるか',
} as const;

const expectedArchiveRecords = {
  ko: {
    id: archiveId,
    title: expectedTitles.ko,
    summary:
      '대만 도로교통안전규칙 제101조의 추월 금지 조건과 같은 차로에서의 추월 절차, 익명 사고 사례를 통한 과실 판단 요소를 결과 보장 없이 정리합니다.',
    href: '/ko/insights/overtaking-accident',
    category: 'legal',
    readTime: '4분 분량',
    image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    keywords: [
      '대만 추월 사고',
      '도로교통안전규칙 제101조',
      '교통사고 과실',
      '사고 감정',
    ],
  },
  'zh-hant': {
    id: archiveId,
    title: expectedTitles['zh-hant'],
    summary:
      '整理台灣《道路交通安全規則》第101條的禁止超車條件、同車道程序及匿名事故案例的責任判斷因素，不保證個案結果。',
    href: '/zh-hant/insights/overtaking-accident',
    category: 'legal',
    readTime: '3分鐘閱讀',
    image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    keywords: [
      '台灣超車事故',
      '道路交通安全規則第101條',
      '交通事故過失',
      '事故鑑定',
    ],
  },
  en: {
    id: archiveId,
    title: expectedTitles.en,
    summary:
      "A guide to Article 101's overtaking prohibitions and same-lane procedure, plus the fact-specific factors used to assess fault in an anonymized Taiwan collision, without guaranteeing an outcome.",
    href: '/en/insights/overtaking-accident',
    category: 'legal',
    readTime: '4 min read',
    image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    keywords: [
      'Taiwan overtaking accident',
      'Road Traffic Safety Regulations Article 101',
      'traffic accident fault',
      'accident appraisal',
    ],
  },
} as const;

const expectedCategoryLabels = {
  ko: '대만 법률정보',
  'zh-hant': '台灣法律資訊',
  en: 'Legal Information',
} as const;

const expectedNativeQueries = {
  ko: '대만 추월 사고',
  'zh-hant': '台灣 超車',
  en: 'Taiwan overtaking',
} as const;

const expectedInLanguage = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
} as const;

const articlePaths = {
  ko: 'src/content/columns/012-taiwan-overtaking-accident-liability.md',
  'zh-hant': 'src/content/columns-zh/012-taiwan-overtaking-accident-liability.md',
  en: 'src/content/columns-en/012-taiwan-overtaking-accident-liability.md',
  ja: 'src/content/columns-ja/012-taiwan-overtaking-accident-liability.md',
} as const;

const expectedCanonicalAlternates = {
  ko: `${siteUrl}/ko/columns/${slug}`,
  'zh-Hant': `${siteUrl}/zh-hant/columns/${slug}`,
  en: `${siteUrl}/en/columns/${slug}`,
  ja: `${siteUrl}/ja/columns/${slug}`,
  'x-default': `${siteUrl}/ko/columns/${slug}`,
} as const;

const expectedCivilColumnSlugs = [
  'taiwan-gym-injury-lawsuit',
  'taiwan-traffic-accident-procedure',
  'taiwan-overtaking-accident-liability',
  'taiwan-massage-history-law',
] as const;

const expectedCivilTitles = {
  ko: '민사소송·손해배상',
  'zh-hant': '民事訴訟·損害賠償',
  en: 'Civil Litigation & Damages',
} as const;

const expectedCivilIntros = {
  ko: '법무법인 호정은 계약 분쟁, 손해배상, 소비자 피해 등 민사 사건 전반을 대응합니다. 한국 유학생 헬스장 부상 사건에서 1심 157만 TWD 손해배상 판결을 이끌어낸 실적이 있으며, 외국인 의뢰인의 대만 소송 절차를 한국어로 밀착 지원합니다.',
  'zh-hant':
    '昊鼎處理契約爭議、損害賠償及消費者權益等民事案件，曾代理韓國留學生健身房受傷案，於一審獲判新臺幣157萬元賠償，並以中韓雙語支援外國當事人在台灣的訴訟程序。',
  en: 'We handle civil disputes including breach of contract, tort, and consumer claims. In a Korean student gym injury case, we obtained a TWD 1.57 million first-instance damages award and provide multilingual support throughout Taiwan litigation.',
} as const;

const expectedCivilKeyPoints = {
  ko: [
    '배상 항목에는 의료비, 필요한 간호·돌봄비와 교통비, 회복 기간 중 입증된 소득 상실, 지속적 장해와 자료가 확인되는 경우의 노동능력 상실, 개별 사정에 따라 산정되는 비재산적 손해가 포함될 수 있으며, 소비자보호법 제51조의 징벌적 손해배상은 해당 법률과 법정 요건이 적용되는 경우 법원의 판단에 따라 고의는 손해액의 최대 5배, 중과실은 최대 3배, 과실은 최대 1배 범위에서 청구할 수 있습니다.',
    'CCTV, 의무기록, 영수증, 대화 기록, 목격자 진술과 트레이닝 기록은 원본과 작성 시점을 확인할 수 있는 형태로 확보하는 것이 중요하며, 정식 서면 보전요청이나 변호사 명의의 요청서는 무엇을 언제 요청했는지 남기는 수단일 뿐 보전을 강제하거나 삭제를 막거나 자동으로 불리한 추정을 발생시키지 않고, 범죄 가능성이 있으면 신속한 신고를 통해 수사기관이 적법한 확보·보전 근거를 판단하게 할 수 있으나 경찰의 CCTV 확보를 단정할 수 없습니다.',
    '소비자보호법 제7조는 사업자가 서비스를 제공할 때 당시의 전문·기술 수준에서 합리적으로 기대되는 안전성을 갖추도록 요구하지만 모든 헬스장 부상이 곧바로 책임으로 이어지는 것은 아니며, 구체적 책임은 안전의무, 위반, 인과관계, 손해, 항변과 증거를 종합해 판단하고 초기분석이나 과실감정 의견도 최종 책임을 자동으로 결정하지 않습니다.',
    '형법 제287조에 따라 제284조의 과실상해는 고소가 있어야 공소를 제기할 수 있고 형사소송법 제237조상 고소는 원칙적으로 범인을 안 날부터 6개월 안에 해야 하며, 민법 제197조상 불법행위 손해배상청구권은 손해와 배상의무자를 안 날부터 2년 또는 불법행위 시점부터 10년이 지나면 원칙적으로 소멸하고, 다른 청구원인과 기간 규칙은 사실관계에 따라 달라지며 형사부대민사소송도 형사사건과 청구의 관련성 등 요건과 절차 단계가 맞는 경우에만 이용할 수 있어 비용 취급까지 개별 확인해야 합니다.',
    '화해 전에는 대상 청구, 권리포기 범위, 지급 조건과 불이행 시 조치를 확인해야 하며, 치료가 계속되거나 장래 손해가 아직 확정되지 않았다면 그 범위까지 검토해야 하고 서명 뒤에는 합의 내용을 번복하기 어려울 수 있습니다.',
    '대만 타이중지방법원 109年度消字第7號 판결은 트레이너의 지도로 데드리프트를 하던 한국인 유학생이 다친 사건에서 1심이 TWD 1,579,589의 배상을 명한 사례이고 공식 판결문에는 曾雋崴 변호사가 원고 소송대리인으로 기재되어 있으며, 이후 항소심에서 당사자들이 화해했다는 내용은 언론 보도에 따른 것입니다.',
  ],
  'zh-hant': [
    '可能主張的損害項目包括醫療費用、必要的看護或照護費用、必要交通費用、復原期間有證明的收入損失、持續性障礙及相關證據成立時的勞動能力減損，以及依個案情形酌定的非財產上損害；消費者保護法第51條的懲罰性賠償，則須以該法及法定要件適用為前提，並由法院依個案判斷，故意為損害額五倍以下、重大過失為三倍以下、過失為一倍以下。',
    'CCTV、病歷、收據、通訊紀錄、證人陳述及訓練紀錄宜以可確認原始來源與時間的形式保存；正式書面保全請求或律師函只能記錄請求內容與時間，不能強制對方保存、阻止刪除或當然產生不利推定，如事實可能涉及犯罪，及時報案可由偵查機關判斷是否具備合法調取或保全影像的依據，但不能斷定警方一定會取得CCTV。',
    '消費者保護法第7條要求提供服務的企業經營者確保其服務符合當時科技或專業水準可合理期待的安全性，但健身房發生受傷事故不當然成立責任，仍須綜合判斷安全義務、違反情形、因果關係、損害、抗辯與證據，初步研判或過失鑑定意見也不會自動決定最終責任。',
    '依刑法第287條，第284條過失傷害罪屬告訴乃論，刑事訴訟法第237條原則上要求告訴權人自知悉犯人時起六個月內提出告訴；依民法第197條，侵權行為損害賠償請求權原則上自知有損害及賠償義務人時起二年、最長自侵權行為時起十年不行使而消滅，其他請求權基礎與期間規則須依個案確認，而刑事附帶民事訴訟也僅能在與刑事案件的關聯性等法定要件及程序階段均符合時利用，費用效果亦應個別確認。',
    '和解前應確認納入的請求、權利拋棄範圍、付款條件及違約處理方式；如治療仍在進行或將來損害尚未明確，亦應一併評估，因簽署後可能難以推翻或另行主張已納入和解範圍的權利。',
    '臺灣臺中地方法院109年度消字第7號判決涉及一名韓國留學生在教練指導下進行硬舉訓練時受傷，一審判命賠償新臺幣1,579,589元，官方判決並記載曾雋崴律師為原告訴訟代理人；其後雙方於上訴程序成立和解之說法則僅依媒體報導。',
  ],
  en: [
    'Potential damages may include medical expenses, necessary nursing or care costs, necessary transportation, documented earnings lost during recovery, loss of earning capacity where lasting impairment and supporting evidence are established, and non-pecuniary loss assessed from the individual circumstances; punitive damages under Consumer Protection Act Article 51 require the Act and its statutory conditions to apply and remain subject to court assessment, with ceilings of five times the proven loss for intent, three times for gross negligence, and one time for negligence.',
    'CCTV, medical records, receipts, communications, witness accounts, and training records should be retained in a form that preserves their source and timing; a formal written preservation request or counsel’s letter records what was requested and when but does not compel preservation, prevent deletion, or automatically create an adverse inference, and although a prompt report of potentially criminal conduct allows investigators to assess whether lawful grounds exist to obtain or preserve footage, police acquisition of CCTV cannot be assumed.',
    'Consumer Protection Act Article 7 requires a business operator providing services to ensure that the service meets the safety reasonably expected under the professional or technical standard prevailing at the time, but a gym injury does not by itself establish liability, which depends on the applicable duty, breach, causation, damage, defenses, and evidence, while a preliminary assessment or fault-appraisal opinion does not automatically determine final responsibility.',
    'Under Criminal Code Article 287, negligent injury under Article 284 is prosecutable only upon complaint, and Code of Criminal Procedure Article 237 generally requires the complaint within six months after the entitled complainant learns the offender’s identity; under Civil Code Article 197, a tort claim generally expires two years after the claimant learns both of the injury and the person liable, subject to a ten-year longstop from the wrongful act, while other causes of action and timing rules remain fact-dependent and an ancillary civil action is available only when its relationship to the criminal case and other procedural requirements are satisfied, with its cost treatment requiring individual review.',
    'Before settling, the parties should identify the claims covered, the scope of any release, payment terms, and remedies for breach, and ongoing treatment or unresolved future loss should be considered because undoing the agreement or pursuing rights already released may be difficult after signature.',
    'In Taichung District Court case 109年度消字第7號, a Korean student was injured while performing a trainer-led deadlift, and the first-instance court awarded exactly TWD 1,579,589; the official judgment identifies Attorney 曾雋崴 as the plaintiff’s litigation representative, while the statement that the parties later settled on appeal is attributable only to media reports.',
  ],
} as const;

const stalePublicCopy = [
  '추월하다 사고 나면 누구 책임?',
  '추월 사고 책임 분석',
  '超車事故責任如何判斷',
  '超車事故責任分析',
  'Overtaking Accident Liability',
  '追越し事故の責任',
  '대만 추월 규칙과 사고 발생 시 과실·책임 판단 기준을 정리했습니다.',
  "['교통사고', '추월', '과실책임']",
  '整理台灣超車規則與事故責任判斷實務。',
  "['交通事故', '超車', '過失責任']",
  'Practical standards for overtaking rules and fault allocation in Taiwan traffic accidents.',
  "['traffic accident', 'overtaking', 'fault allocation']",
] as const;

const expectedPostCount = 17;
const expectedOrderedPostIds = [
  'gym-injury-lawsuit',
  'cosmetics-market-entry',
  'company-advanced-2',
  'withdraw-capital',
  'logistics-business',
  'company-location',
  'company-advanced-1',
  'subsidiary-vs-branch',
  'company-basics',
  'inheritance-custody',
  'overtaking-accident',
  'severance-exception',
  'divorce-qna',
  'massage-law',
  'mandatory-employment',
  'labor-severance',
  'traffic-accident-procedure',
];
const expectedHomeFeaturedIds = [
  'gym-injury-lawsuit',
  'cosmetics-market-entry',
  'company-advanced-2',
];
const expectedOtherPostsSha256 = {
  ko: 'fc42b51d1ecbf394dd7e7ee86334374b011be378f0c583f821f6a33b0fb12f85',
  'zh-hant':
    'cbd3cf753735844ce84c66fb403885d8e7af6a7279ac1bc06a294ea6248cf9ea',
  en: 'c71c5448518e86fab5b7518678202fc402175f8496450c082996f5652c4204f7',
} as const;

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

function hashOtherPosts(locale: (typeof locales)[number]) {
  const otherPosts = insightsArchive[locale].posts.filter(
    (post) => post.id !== archiveId,
  );
  return createHash('sha256').update(JSON.stringify(otherPosts)).digest('hex');
}

describe('column 012 public reference synchronization', () => {
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

  it('uses the four exact civil related-column titles', () => {
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
    expect(JSON.stringify(insightsArchive)).not.toContain(
      '/ja/insights/overtaking-accident',
    );
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

  it('discovers the overtaking archive through native filterSearchIndex queries', () => {
    for (const locale of locales) {
      const hits = filterSearchIndex(
        getSearchIndex(locale),
        expectedNativeQueries[locale],
      );
      const match = hits.find((item) => item.id === searchId);

      expect(match, locale).toBeDefined();
      expect(match?.title, locale).toBe(expectedArchiveRecords[locale].title);
      expect(match?.href, locale).toBe(`/${locale}/columns/${slug}`);
      expect(match?.description, locale).toBe(expectedArchiveRecords[locale].summary);
      expect(match?.tags, locale).toEqual([
        ...expectedArchiveRecords[locale].keywords,
        expectedCategoryLabels[locale],
      ]);
    }
  });

  it('resolves canonical and overtaking-accident alias slugs to the same loader title and slug for all four locales', () => {
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

  it('builds article JSON-LD with accepted headline, canonical page, and locale language tags', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost(slug, locale);
      expect(post, locale).toBeDefined();

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
    }
  });

  it('keeps civil columnSlugs including the canonical slug without mutating other civil service data', () => {
    const civil = serviceAreas.find((area) => area.slug === 'civil');
    expect(civil).toBeDefined();
    expect(civil?.columnSlugs).toEqual([...expectedCivilColumnSlugs]);
    expect(civil?.columnSlugs).toContain(slug);
    expect(civil?.title).toEqual(expectedCivilTitles);

    for (const locale of locales) {
      expect(civil?.intro[locale], locale).toBe(expectedCivilIntros[locale]);
      expect(civil?.keyPoints[locale], locale).toEqual(expectedCivilKeyPoints[locale]);
      expect(civil?.keyPoints[locale], locale).toHaveLength(6);
    }
  });

  it('removes stale public titles and old archive copy from synchronized data and search results', () => {
    const runtimeFiles = [
      'src/data/insights-archive.ts',
      'src/data/site-content.ts',
      'src/lib/search.ts',
    ].map((relativePath) => fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));
    const synchronizedRuntime = runtimeFiles.join('\n');

    for (const formerReference of stalePublicCopy) {
      expect(synchronizedRuntime).not.toContain(formerReference);
    }

    const serializedPublicSurface = JSON.stringify({
      related: siteLocales.map((locale) => getRelatedColumn(locale)),
      archives: locales.map((locale) => getArchiveRecord(locale)),
      search: locales.map((locale) => getSearchRecord(locale)),
    });

    for (const formerReference of stalePublicCopy) {
      expect(serializedPublicSurface).not.toContain(formerReference);
    }
  });

  it('freezes archive post counts, ordered ids, home-featured ids, and non-target post hashes', () => {
    for (const locale of locales) {
      const archive = insightsArchive[locale];

      expect(archive.posts, locale).toHaveLength(expectedPostCount);
      expect(
        archive.posts.map((post) => post.id),
        locale,
      ).toEqual(expectedOrderedPostIds);
      expect(archive.homeFeaturedIds, locale).toEqual(expectedHomeFeaturedIds);
      expect(hashOtherPosts(locale), locale).toBe(expectedOtherPostsSha256[locale]);
    }
  });

  it('ko search keeps divorce-qna canonical columns href and gym-injury generic transform', () => {
    const locale = 'ko';
    const index = getSearchIndex(locale);
    const divorce = index.find((item) => item.id === 'insight-post-divorce-qna');
    const gym = index.find((item) => item.id === 'insight-post-gym-injury-lawsuit');

    expect(divorce).toBeDefined();
    expect(divorce?.href).toBe(`/${locale}/columns/taiwan-divorce-lawsuit-qna`);
    expect(gym).toBeDefined();
    expect(gym?.href).toBe(`/${locale}/columns/gym-injury-lawsuit`);
  });

  it('zh-hant search keeps divorce-qna canonical columns href and gym-injury generic transform', () => {
    const locale = 'zh-hant';
    const index = getSearchIndex(locale);
    const divorce = index.find((item) => item.id === 'insight-post-divorce-qna');
    const gym = index.find((item) => item.id === 'insight-post-gym-injury-lawsuit');

    expect(divorce).toBeDefined();
    expect(divorce?.href).toBe(`/${locale}/columns/taiwan-divorce-lawsuit-qna`);
    expect(gym).toBeDefined();
    expect(gym?.href).toBe(`/${locale}/columns/gym-injury-lawsuit`);
  });

  it('en search keeps divorce-qna canonical columns href and gym-injury generic transform', () => {
    const locale = 'en';
    const index = getSearchIndex(locale);
    const divorce = index.find((item) => item.id === 'insight-post-divorce-qna');
    const gym = index.find((item) => item.id === 'insight-post-gym-injury-lawsuit');

    expect(divorce).toBeDefined();
    expect(divorce?.href).toBe(`/${locale}/columns/taiwan-divorce-lawsuit-qna`);
    expect(gym).toBeDefined();
    expect(gym?.href).toBe(`/${locale}/columns/gym-injury-lawsuit`);
  });
});
