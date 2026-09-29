import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { COLUMN_CONTENT_DIR_BY_LOCALE, collectColumnSitemapRecords } from '@/lib/column-locales';
import { PUBLIC_LOCALES_8, type PublicLocale8 } from '@/lib/public-guidance';
import { NATIVE_LOCALE_COLUMN_FILES, type NativeColumnLocale } from './native-locale-columns';

/**
 * Native single-locale columns (2026-09-29): written for English, Japanese and
 * Vietnamese readers respectively, researched against official sources and
 * reviewed (Opus mid-review, Fable final approval). They exist only in their
 * own locale, so they must never show up as alternates of another language.
 */
const EXPECTED_TOPIC: Record<string, string> = {
  'taiwan-exit-ban-foreigners': 'litigation',
  'taiwan-police-questioning-foreigner-rights': 'litigation',
  'foreign-professional-dismissed-taiwan': 'labor',
  'taiwan-unpaid-invoice-debt-collection': 'litigation',
  'taiwan-subsidiary-responsible-person-liability': 'company',
  'taiwan-subsidiary-employee-dismissal': 'labor',
  'taiwan-bank-account-lending-fraud-money-laundering': 'litigation',
  'taiwan-migrant-worker-occupational-injury-compensation': 'labor',
  'vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence': 'visa',
};

const CATEGORY_PHRASE: Record<NativeColumnLocale, string> = {
  en: 'Taiwan Legal Information',
  ja: '台湾法律情報',
  vi: 'Thông tin pháp luật Đài Loan',
};

const DATE_DISPLAY: Record<NativeColumnLocale, string> = {
  en: 'September 29, 2026',
  ja: '2026年9月29日',
  vi: '29 tháng 9 năm 2026',
};

const cases = (Object.keys(NATIVE_LOCALE_COLUMN_FILES) as NativeColumnLocale[]).flatMap((locale) =>
  NATIVE_LOCALE_COLUMN_FILES[locale].map((file) => {
    const num = file.slice(0, 3);
    const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
    return { locale, file, num, slug };
  }),
);

describe('native single-locale columns 2026-09-29', () => {
  it('covers nine columns, three per audience', () => {
    expect(cases).toHaveLength(9);
    expect(Object.keys(EXPECTED_TOPIC).sort()).toEqual(cases.map((c) => c.slug).sort());
  });

  it.each(cases)('$locale/$file has the house frontmatter and a hero image on disk', ({ locale, file, num, slug }) => {
    const filePath = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale], file);
    expect(fs.existsSync(filePath), filePath).toBe(true);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));

    expect(data.published).toBe('2026-09-29');
    expect(data.date_display).toBe(DATE_DISPLAY[locale]);
    expect(data.categories).toEqual([CATEGORY_PHRASE[locale]]);
    expect(data.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(data.featured_image).toBe(`../images/${num}-${slug}/featured-01.webp`);
    expect(
      fs.existsSync(path.join(process.cwd(), 'public/images/blog', `${num}-${slug}`, 'featured-01.webp')),
    ).toBe(true);
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
  });

  it.each(cases)('$locale/$slug loads as a dated legal article with the firm contact block', ({ locale, slug }) => {
    const post = getColumnPost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-09-29');
    expect(post?.category).toBe('legal');
    expect(post?.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(post?.faq).toHaveLength(3);
    expect(post?.content.length).toBeGreaterThan(3000);
    expect(post?.content).toContain('mailto:wei@hoveringlaw.com.tw');
    expect(post?.content).toContain('曾雋崴');
    // Same contact policy as the other columns: no phone number, no raw HTML.
    expect(post?.content).not.toContain('02-2992-9304');
    expect(post?.content).not.toContain('<!--');
  });

  it.each(cases)('$locale/$slug cites official sources and only links to columns that exist', ({ locale, slug }) => {
    const content = getColumnPost(slug, locale)?.content ?? '';
    const external = [...content.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
    expect(external.length).toBeGreaterThanOrEqual(3);
    expect(external.length).toBeLessThanOrEqual(10);
    expect(external.every((url) => url.startsWith('https://'))).toBe(true);

    for (const m of content.matchAll(/\]\(\/([a-z-]+)\/columns\/([a-z0-9-]+)\)/g)) {
      const [, linkLocale, linkSlug] = m;
      expect(getColumnPost(linkSlug, linkLocale as PublicLocale8), `${linkLocale}/${linkSlug}`).toBeDefined();
    }
  });

  it.each(cases)('$locale/$slug exists only in its own locale', ({ locale, slug }) => {
    for (const other of PUBLIC_LOCALES_8) {
      if (other === locale) continue;
      expect(getAllColumnPosts(other).some((post) => post.slug === slug), `${other}/${slug}`).toBe(false);
    }
    const records = collectColumnSitemapRecords({
      postsForLocale: (l) => getAllColumnPosts(l).filter((post) => post.slug === slug),
    });
    expect(records).toHaveLength(1);
    expect(records[0]?.alternateLocales).toEqual([locale]);
  });
});
