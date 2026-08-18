import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, sortColumnPostsNewestFirst, type ColumnPost } from '@/lib/columns';

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
};

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

const EXPECTED_ARCHIVE_ORDER = [
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
      date: '2026-07-26',
      dateDisplay: '2025년 9월 13일',
    });
  });

  it('sorts newest-first and keeps equal-date posts in source order', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts.map((post) => post.slug)).toEqual(EXPECTED_ARCHIVE_ORDER);
    expect(posts.slice(1).every((post) => post.dateDisplay === '2025년 9월 13일')).toBe(true);
  });

  it('formats every Korean archive date as YYYY년 M월 D일', () => {
    const posts = getAllColumnPosts('ko');

    expect(posts).toHaveLength(17);
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

      expect(files).toHaveLength(17);
      for (const file of files) {
        const prefix = file.slice(0, 3);
        const verifiedDate = VERIFIED_PUBLICATION_DATES[prefix];
        const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));

        expect(data.date_display, file).toBe(expectedDisplay(locale, verifiedDate));
      }
    },
  );

  it.each([
    ['ko', '2026년 2월 4일'],
    ['zh-hant', '2026年2月4日'],
    ['en', 'February 4, 2026'],
    ['ja', '2026年2月4日'],
  ] as const)('uses the verified publication date in %s', (locale, expectedDateDisplay) => {
    const posts = getAllColumnPosts(locale);

    expect(posts[0]).toMatchObject({
      slug: COSMETICS_SLUG,
      publicationDate: '2026-02-04',
      dateDisplay: expectedDateDisplay,
    });
    expect(posts.slice(1).every((post) => post.publicationDate === '2025-09-13')).toBe(true);
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
