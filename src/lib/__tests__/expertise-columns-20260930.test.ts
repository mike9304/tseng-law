import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { COLUMN_CONTENT_DIR_BY_LOCALE, collectColumnSitemapRecords } from '@/lib/column-locales';
import { PUBLIC_LOCALES_8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import {
  EXPERTISE_COLUMN_FILES_20260930,
  type ExpertiseColumnLocale,
} from './native-locale-columns';

/**
 * Expertise columns 041–048 (2026-09-30): written for specific audiences, so each
 * exists only in the locales below (no machine-translated fallbacks). They must not
 * leak into other locales or hreflang alternates.
 */
const EXPECTED_TOPIC: Record<string, string> = {
  'taiwan-crypto-exchange-vasp-dispute': 'litigation',
  'taiwan-investment-scam-recovery': 'litigation',
  'korea-crypto-tax-2027-taiwan-residents': 'tax',
  'taiwan-payment-order-provisional-attachment': 'litigation',
  'taiwan-overseas-income-us-stocks-crypto-amt': 'tax',
  'taiwan-marital-property-regime-international-couples': 'family',
  'foreigner-buy-sell-taiwan-real-estate-tax': 'tax',
  'taiwan-stocks-direct-investment-tax': 'tax',
};

const CATEGORY_PHRASE: Record<ExpertiseColumnLocale, string> = {
  ko: '대만 법률정보',
  en: 'Taiwan Legal Information',
  ja: '台湾法律情報',
  'zh-hant': '台灣法律資訊',
};

const DATE_DISPLAY: Record<ExpertiseColumnLocale, string> = {
  ko: '2026년 9월 30일',
  en: 'September 30, 2026',
  ja: '2026年9月30日',
  'zh-hant': '2026年9月30日',
};

const LOCALES = Object.keys(EXPERTISE_COLUMN_FILES_20260930) as ExpertiseColumnLocale[];

const cases = LOCALES.flatMap((locale) =>
  EXPERTISE_COLUMN_FILES_20260930[locale].map((file) => ({
    locale,
    file,
    num: file.slice(0, 3),
    slug: file.replace(/\.md$/, '').replace(/^\d{3}-/, ''),
  })),
);

const localesBySlug = new Map<string, ExpertiseColumnLocale[]>();
for (const { locale, slug } of cases) {
  localesBySlug.set(slug, [...(localesBySlug.get(slug) ?? []), locale]);
}

describe('expertise columns 2026-09-30', () => {
  it('covers eight columns across fourteen locale files', () => {
    expect(localesBySlug.size).toBe(8);
    expect(cases).toHaveLength(14);
    expect([...localesBySlug.keys()].sort()).toEqual(Object.keys(EXPECTED_TOPIC).sort());
  });

  it.each(cases)('$locale/$file has the house frontmatter and a hero image on disk', ({ locale, file, num, slug }) => {
    const filePath = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale], file);
    expect(fs.existsSync(filePath), filePath).toBe(true);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));

    expect(data.published).toBe('2026-09-30');
    expect(data.lastmod).toBe('2026-09-30');
    expect(data.date_display).toBe(DATE_DISPLAY[locale]);
    expect(data.categories).toEqual([CATEGORY_PHRASE[locale]]);
    expect(data.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(data.featured_image).toBe(`../images/${num}-${slug}/featured-01.webp`);
    expect(
      fs.existsSync(path.join(process.cwd(), 'public/images/blog', `${num}-${slug}`, 'featured-01.webp')),
    ).toBe(true);
  });

  it.each(cases)('$locale/$slug loads as a dated AI-authored article with the firm contact block', ({ locale, slug }) => {
    const post = getColumnPost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-09-30');
    expect(post?.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(post?.audience).toEqual([locale]);
    expect(isAiAuthoredColumn(post)).toBe(true);
    expect(post?.content).toContain('mailto:wei@hoveringlaw.com.tw');
    expect(post?.content).not.toContain('02-2992-9304');
    expect(post?.content).not.toContain('<!--');
  });

  it.each([...localesBySlug.entries()])('%s exists only in its own locales and alternates match', (slug, own) => {
    for (const other of PUBLIC_LOCALES_8) {
      const present = getAllColumnPosts(other).some((post) => post.slug === slug);
      expect(present, `${other}/${slug}`).toBe(own.includes(other as ExpertiseColumnLocale));
    }
    const records = collectColumnSitemapRecords({
      postsForLocale: (l) => getAllColumnPosts(l).filter((post) => post.slug === slug),
    });
    expect(records.map((record) => record.locale).sort()).toEqual([...own].sort());
    for (const record of records) {
      expect(record.alternateLocales.slice().sort()).toEqual([...own].sort());
    }
  });
});
