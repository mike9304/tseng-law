import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, sortColumnPostsNewestFirst, type ColumnPost } from '@/lib/columns';
import {
  NATIVE_LOCALE_COLUMN_FILES,
  archiveLeadPublicationDate,
  archiveLeadSlugsFor,
  expertiseSlugsFor,
  isNativeLocaleColumnSlug,
} from './native-locale-columns';

const COSMETICS_SLUG = 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide';

const VERIFIED_PUBLICATION_DATES: Record<string, string> = {
  '001': '2025-09-13',
  '002': '2025-09-13',
  '003': '2025-09-13',
  '004': '2025-09-13',
  '005': '2025-09-13',
  '006': '2025-09-13',
  '007': '2025-09-13',
  '008': '2025-09-13',
  '009': '2025-09-13',
  '010': '2025-09-13',
  '011': '2026-02-04',
  '012': '2025-09-13',
  '013': '2025-09-13',
  '014': '2025-09-13',
  '015': '2025-09-13',
  '016': '2025-09-13',
  '017': '2025-09-13',
  '018': '2026-09-17',
  '019': '2026-09-27',
  '020': '2026-09-27',
  '021': '2026-09-27',
  '022': '2026-09-27',
  '023': '2026-09-27',
  '024': '2026-09-29',
  '025': '2026-09-29',
  '026': '2026-09-29',
  '027': '2026-09-29',
  '028': '2026-09-29',
  '029': '2026-09-29',
  '030': '2026-09-29',
  '031': '2026-09-29',
  // Native en/ja/vi columns (one locale each), published 2026-09-29.
  '032': '2026-09-29',
  '033': '2026-09-29',
  '034': '2026-09-29',
  '035': '2026-09-29',
  '036': '2026-09-29',
  '037': '2026-09-29',
  '038': '2026-09-29',
  '039': '2026-09-29',
  '040': '2026-09-29',
  // Locale-specific expertise columns (ko/en/ja/zh-hant subsets), published 2026-09-30.
  '041': '2026-09-30',
  '042': '2026-09-30',
  '043': '2026-09-30',
  '044': '2026-09-30',
  '045': '2026-09-30',
  '046': '2026-09-30',
  '047': '2026-09-30',
  '048': '2026-09-30',
  '050': '2026-09-30', // traffic police-records column (049 in its lane)
  '052': '2026-10-01',
  '053': '2026-10-01',
  '054': '2026-10-01',
  '055': '2026-10-01',
  '056': '2026-10-01',
  '057': '2026-10-01',
  '058': '2026-10-01',
  '059': '2026-10-01',
  // zh-hant-only domestic columns (inheritance renunciation, defamation, overtime pay).
  '060': '2026-10-01',
  '061': '2026-10-01',
  '062': '2026-10-01',
  '051': '2026-10-01', // Korean-first traffic column (left turn vs straight motorcycle)
  // Expertise columns 063–069 (2026-10-02 weekday routine).
  '063': '2026-10-02',
  '064': '2026-10-02',
  '065': '2026-10-02',
  '066': '2026-10-02',
  '067': '2026-10-02',
  '068': '2026-10-02',
  '069': '2026-10-02',
  '070': '2026-10-02', // Vietnamese document-return column
  '071': '2026-10-02', // Japanese heated-tobacco entry column
  '072': '2026-10-02', // Taiwan domestic lane-change column
  '074': '2026-10-02',
  '075': '2026-10-02',
  '073': '2026-10-02', // Taiwan domestic right-turn evidence column
};

// Columns revised after the 2026-09-28 Fable review were re-dated to that day (user
// decision 2026-09-28); these locales derive the publication date from date_display.
// The review's unchanged PASS files (ja 021-023) keep 2026-09-27.
const REDATED_20260928: Record<string, readonly string[]> = {
  ko: ['019', '020', '021', '022', '023'],
  'zh-hant': ['019', '020', '021', '022', '023'],
  en: ['019', '020', '021', '022', '023'],
  ja: ['019', '020'],
};

function verifiedPublicationDate(locale: string, prefix: string): string {
  return REDATED_20260928[locale]?.includes(prefix) ? '2026-09-28' : VERIFIED_PUBLICATION_DATES[prefix];
}

const CONTENT_DIR_BY_LOCALE = {
  ko: 'columns',
  'zh-hant': 'columns-zh',
  en: 'columns-en',
  ja: 'columns-ja',
} as const;

function expectedDisplay(locale: keyof typeof CONTENT_DIR_BY_LOCALE, publicationDate: string): string {
  const [year, month, day] = publicationDate.split('-').map(Number);
  if (locale === 'ko') return `${year}년 ${month}월 ${day}일`;
  if (locale === 'zh-hant' || locale === 'ja') return `${year}年${month}月${day}日`;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const SEMICONDUCTOR_SLUG = 'taiwan-semiconductor-market-entry';

const NEW_DIVORCE_SLUGS = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
];

// 2026-09-29 gap columns (024-031): newest in the archive, in source order.
const GAP_COLUMN_SLUGS = [
  'taiwan-income-tax-residency',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
  'taiwan-employment-gold-card',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'hire-taiwan-lawyer-from-abroad',
];
const GAP = GAP_COLUMN_SLUGS.length;

// 2026-09-30 expertise columns in the Korean archive (043, 046, 048): newest, in source order.
const KO_EXPERTISE_SLUGS = archiveLeadSlugsFor('ko'); // 051…059 (2026-10-01, source order) then the 2026-09-30 batch
const KO_LEAD = KO_EXPERTISE_SLUGS.length;

const EXPECTED_ARCHIVE_ORDER = [
  ...KO_EXPERTISE_SLUGS,
  ...GAP_COLUMN_SLUGS,
  ...NEW_DIVORCE_SLUGS,
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
  SEMICONDUCTOR_SLUG,
  COSMETICS_SLUG,
  'taiwan-company-establishment-basics',
  'withdraw-capital-taiwan-company',
  'taiwan-traffic-accident-procedure',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-company-establishment-advanced-2',
  'taiwan-massage-history-law',
  'taiwan-divorce-lawsuit-qna',
  'taiwan-labor-severance-law',
  'taiwan-voluntary-resignation-severance',
  'taiwan-gym-injury-lawsuit',
  'taiwan-overtaking-accident-liability',
  'taiwan-company-establishment-advanced-1',
  'taiwan-mandatory-employment-period',
  'taiwan-company-setup-pitch-location',
  'taiwan-inheritance-custody-analysis',
  'taiwan-logistics-business-setup',
];

describe('Korean column publication dates', () => {
  it('keeps later lastmod metadata while displaying the original publication date', () => {
    const posts = getAllColumnPosts('ko');
    const cosmetics = posts.find((post) => post.slug === COSMETICS_SLUG);
    const updatedTrafficGuide = posts.find((post) => post.slug === 'taiwan-traffic-accident-procedure');

    expect(cosmetics).toMatchObject({
      publicationDate: '2026-02-04',
      date: '2026-07-25',
      dateDisplay: '2026년 2월 4일',
    });
    expect(updatedTrafficGuide).toMatchObject({
      publicationDate: '2025-09-13',
      date: '2026-09-30',
      dateDisplay: '2025년 9월 13일',
    });
  });

  it('sorts newest-first and keeps equal-date posts in source order', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts.map((post) => post.slug)).toEqual(EXPECTED_ARCHIVE_ORDER);
    expect(posts.slice(0, KO_LEAD).map((post) => post.slug)).toEqual(KO_EXPERTISE_SLUGS);
    expect(posts.slice(KO_LEAD, KO_LEAD + GAP).map((post) => post.slug)).toEqual(GAP_COLUMN_SLUGS);
    expect(posts.slice(KO_LEAD + GAP, KO_LEAD + GAP + 3).map((post) => post.slug)).toEqual(NEW_DIVORCE_SLUGS);
    expect(posts[KO_LEAD + GAP + 5]?.slug).toBe(SEMICONDUCTOR_SLUG);
    expect(posts[KO_LEAD + GAP + 6]?.slug).toBe(COSMETICS_SLUG);
    expect(posts.slice(KO_LEAD + GAP + 7).every((post) => post.dateDisplay === '2025년 9월 13일')).toBe(true);
  });

  it('formats every Korean archive date as YYYY년 M월 D일', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts).toHaveLength(31 + KO_LEAD);
    expect(posts.every((post) => /^\d{4}년 \d{1,2}월 \d{1,2}일$/.test(post.dateDisplay))).toBe(true);
  });
});

describe('localized column publication ordering', () => {
  it.each(Object.entries(CONTENT_DIR_BY_LOCALE))(
    'stores every verified localized publication display in %s frontmatter',
    (localeValue, directory) => {
      const locale = localeValue as keyof typeof CONTENT_DIR_BY_LOCALE;
      const contentDir = path.join(process.cwd(), 'src', 'content', directory);
      const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md'));

      const nativeCount =
        locale in NATIVE_LOCALE_COLUMN_FILES
          ? NATIVE_LOCALE_COLUMN_FILES[locale as keyof typeof NATIVE_LOCALE_COLUMN_FILES].length
          : 0;
      const expertiseCount = expertiseSlugsFor(locale).length; // 041–048 subset + 050 traffic
      expect(files).toHaveLength(31 + nativeCount + expertiseCount);
      for (const file of files) {
        const prefix = file.slice(0, 3);
        const verifiedDate = verifiedPublicationDate(locale, prefix);
        const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));

        expect(data.date_display, file).toBe(expectedDisplay(locale, verifiedDate));
      }
    },
  );

  it.each([
    ['ko', '2026년 9월 17일'],
    ['zh-hant', '2026年9月17日'],
    ['en', 'September 17, 2026'],
    ['ja', '2026年9月17日'],
  ] as const)('uses the verified publication date in %s', (locale, expectedDateDisplay) => {
    const allPosts = getAllColumnPosts(locale);
    // The 2026-09-30 expertise columns (a per-locale subset of 041-048) lead the archive.
    const expertiseSlugs = archiveLeadSlugsFor(locale);
    const lead = expertiseSlugs.length;
    expect(allPosts.slice(0, lead).map((post) => post.slug)).toEqual(expertiseSlugs);
    expect(allPosts.slice(0, lead).map((post) => post.publicationDate)).toEqual(
      expertiseSlugs.map(archiveLeadPublicationDate),
    );
    // Native single-locale columns share the 2026-09-29 date with the gap columns (024-031),
    // so equal-date source order places them right after that batch; the shared corpus follows.
    const natives = allPosts.filter((post) => isNativeLocaleColumnSlug(post.slug));
    expect(allPosts.slice(lead + GAP, lead + GAP + natives.length)).toEqual(natives);
    expect(natives.every((post) => post.publicationDate === '2026-09-29')).toBe(true);
    const posts = allPosts.filter(
      (post) => !isNativeLocaleColumnSlug(post.slug) && !expertiseSlugs.includes(post.slug),
    );

    expect(posts.slice(0, GAP).map((post) => post.publicationDate)).toEqual(
      ['024', '025', '026', '027', '028', '029', '030', '031'].map((prefix) =>
        verifiedPublicationDate(locale, prefix),
      ),
    );
    expect(posts.slice(GAP, GAP + 3).map((post) => post.publicationDate)).toEqual(
      ['019', '020', '021'].map((prefix) => verifiedPublicationDate(locale, prefix)),
    );
    expect(posts[GAP + 5]).toMatchObject({
      slug: SEMICONDUCTOR_SLUG,
      publicationDate: '2026-09-17',
      dateDisplay: expectedDateDisplay,
    });
    expect(posts[GAP + 6]).toMatchObject({
      slug: COSMETICS_SLUG,
      publicationDate: '2026-02-04',
    });
    expect(posts.slice(GAP + 7).every((post) => post.publicationDate === '2025-09-13')).toBe(true);
  });

  it('keeps input order for equal publication dates regardless of lastmod', () => {
    const makePost = (
      slug: string,
      publicationDate: string,
      date: string,
    ): ColumnPost => ({
      slug,
      title: slug,
      publicationDate,
      date,
      dateDisplay: publicationDate,
      readTime: '',
      category: 'legal',
      categoryLabel: '법률정보',
      featuredImage: '',
      content: '',
      summary: '',
    });
    const posts = [
      makePost('first-source', '2025-09-13', '2035-01-01'),
      makePost('newer-publication', '2026-02-04', '2026-02-05'),
      makePost('second-source', '2025-09-13', '2025-09-13'),
    ];

    expect(sortColumnPostsNewestFirst(posts).map((post) => post.slug)).toEqual([
      'newer-publication',
      'first-source',
      'second-source',
    ]);
  });
});
