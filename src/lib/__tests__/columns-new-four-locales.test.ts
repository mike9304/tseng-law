import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  COLUMN_CONTENT_DIR_BY_LOCALE,
  OPTIONAL_COLUMN_LOCALES,
  collectColumnSitemapRecords,
  getColumnAlternateLocales,
} from '@/lib/column-locales';
import { getAllColumnPosts, getColumnPost, hasColumnTranslation } from '@/lib/columns';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import { getLanguageAlternates } from '@/lib/seo';

const GYM_SLUG = 'taiwan-gym-injury-lawsuit';
const GYM_FILENAME = '010-taiwan-gym-injury-lawsuit.md';

const MINIMAL_VI_COLUMN = `---
title: "Vụ kiện chấn thương phòng gym Đài Loan"
lastmod: "2026-07-25"
date_display: "13 tháng 9, 2025"
published: "2025-09-13"
read_time: "10 phút"
categories:
  - "Case Study Analysis"
featured_image: "../images/010-taiwan-gym-injury-lawsuit/featured-01.jpg"
---

# Vụ kiện chấn thương phòng gym Đài Loan

Đây là bản dịch kiểm thử tạm thời. Nội dung đủ dài để loader không coi là stub.
`;

const tmpDirs: string[] = [];

function makeTempColumnsDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'g19-columns-'));
  tmpDirs.push(dir);
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, 'utf8');
  }
  return dir;
}

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('new-four column directory mapping', () => {
  it('maps each public locale to its content directory and does not fold vi into ko', () => {
    expect(COLUMN_CONTENT_DIR_BY_LOCALE).toEqual({
      ko: 'src/content/columns',
      'zh-hant': 'src/content/columns-zh',
      en: 'src/content/columns-en',
      ja: 'src/content/columns-ja',
      vi: 'src/content/columns-vi',
      id: 'src/content/columns-id',
      th: 'src/content/columns-th',
      fil: 'src/content/columns-fil',
    });
    expect(OPTIONAL_COLUMN_LOCALES).toEqual(GUIDANCE_LOCALES_4);
    expect(COLUMN_CONTENT_DIR_BY_LOCALE.vi).not.toBe(COLUMN_CONTENT_DIR_BY_LOCALE.ko);
  });
});

describe('new-four column loader (temp dir, no repo fixtures)', () => {
  it('returns an empty list when the optional locale directory is missing', () => {
    const missing = path.join(os.tmpdir(), 'g19-columns-missing-does-not-exist');
    expect(fs.existsSync(missing)).toBe(false);
    expect(getAllColumnPosts('vi', { columnsDir: missing })).toEqual([]);
    expect(getColumnPost(GYM_SLUG, 'vi', { columnsDir: missing })).toBeUndefined();
    expect(hasColumnTranslation('vi', GYM_SLUG, { columnsDir: missing })).toBe(false);
  });

  it('returns an empty list for an existing but empty optional directory', () => {
    const empty = makeTempColumnsDir({});
    expect(getAllColumnPosts('id', { columnsDir: empty })).toEqual([]);
    expect(hasColumnTranslation('id', GYM_SLUG, { columnsDir: empty })).toBe(false);
  });

  it('loads only slugs that have a markdown file in the optional directory', () => {
    const present = makeTempColumnsDir({ [GYM_FILENAME]: MINIMAL_VI_COLUMN });
    const posts = getAllColumnPosts('vi', { columnsDir: present });
    expect(posts.map((post) => post.slug)).toEqual([GYM_SLUG]);
    expect(posts[0]?.title).toContain('phòng gym');
    expect(getColumnPost(GYM_SLUG, 'vi', { columnsDir: present })?.slug).toBe(GYM_SLUG);
    expect(getColumnPost('taiwan-company-establishment-basics', 'vi', { columnsDir: present })).toBeUndefined();
    expect(hasColumnTranslation('vi', GYM_SLUG, { columnsDir: present })).toBe(true);
    expect(hasColumnTranslation('vi', 'taiwan-company-establishment-basics', { columnsDir: present })).toBe(false);
  });

  it('does not leak the Korean corpus when no new-four files exist in the repo', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/content/columns-vi'))).toBe(false);
    const viPosts = getAllColumnPosts('vi');
    expect(viPosts).toEqual([]);
    expect(viPosts).not.toHaveLength(getAllColumnPosts('ko').length);
  });
});

describe('new-four column hreflang + sitemap include/exclude', () => {
  it('omits vi/id/th/fil from detail alternates when those translations are absent', () => {
    const missing = path.join(os.tmpdir(), 'g19-columns-missing-does-not-exist');
    const locales = getColumnAlternateLocales(GYM_SLUG, {
      hasTranslation: (locale, slug) => {
        if (locale === 'vi' || locale === 'id' || locale === 'th' || locale === 'fil') {
          return hasColumnTranslation(locale, slug, { columnsDir: missing });
        }
        return true;
      },
    });
    expect(locales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
    expect(locales).not.toContain('vi');

    const languages = getLanguageAlternates(`/columns/${GYM_SLUG}`, locales);
    expect(languages).toMatchObject({
      ko: `https://tseng-law.com/ko/columns/${GYM_SLUG}`,
      'zh-Hant': `https://tseng-law.com/zh-hant/columns/${GYM_SLUG}`,
      en: `https://tseng-law.com/en/columns/${GYM_SLUG}`,
      ja: `https://tseng-law.com/ja/columns/${GYM_SLUG}`,
    });
    expect(languages).not.toHaveProperty('vi');
    expect(languages).not.toHaveProperty('id');
    expect(languages).not.toHaveProperty('th');
    expect(languages).not.toHaveProperty('fil');
  });

  it('includes a new-four locale in hreflang and sitemap records only when a file exists', () => {
    const present = makeTempColumnsDir({ [GYM_FILENAME]: MINIMAL_VI_COLUMN });
    const locales = getColumnAlternateLocales(GYM_SLUG, {
      hasTranslation: (locale, slug) => {
        if (locale === 'vi') return hasColumnTranslation('vi', slug, { columnsDir: present });
        if (locale === 'id' || locale === 'th' || locale === 'fil') return false;
        return true;
      },
    });
    expect(locales).toEqual(['ko', 'zh-hant', 'en', 'ja', 'vi']);

    const languages = getLanguageAlternates(`/columns/${GYM_SLUG}`, locales);
    expect(languages.vi).toBe(`https://tseng-law.com/vi/columns/${GYM_SLUG}`);
    expect(languages).not.toHaveProperty('th');

    const records = collectColumnSitemapRecords({
      postsForLocale: (locale) => {
        if (locale === 'vi') {
          return getAllColumnPosts('vi', { columnsDir: present }).map((post) => ({
            slug: post.slug,
            date: post.date,
          }));
        }
        if (locale === 'id' || locale === 'th' || locale === 'fil') return [];
        return [{ slug: GYM_SLUG, date: '2026-07-25' }];
      },
    });

    expect(records.some((row) => row.locale === 'vi' && row.path === `/columns/${GYM_SLUG}`)).toBe(true);
    expect(records.some((row) => row.locale === 'th' && row.path === `/columns/${GYM_SLUG}`)).toBe(false);
    const koRow = records.find((row) => row.locale === 'ko' && row.path === `/columns/${GYM_SLUG}`);
    expect(koRow?.alternateLocales).toContain('vi');
    expect(koRow?.alternateLocales).not.toContain('th');
  });
});
