import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';
import { PUBLIC_LOCALES_8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { DOMESTIC_ZH_COLUMN_FILES_20261001 } from './native-locale-columns';

/**
 * Domestic-interest columns 060–062 (2026-10-01): written natively for Taiwanese
 * readers, zh-hant only. They must carry the AI-author byline, the email/address
 * contact block (no phone), official source links, and no bold markers.
 */
const EXPECTED_TOPIC: Record<string, string> = {
  'taiwan-inheritance-renunciation-debt': 'inheritance',
  'taiwan-defamation-public-insult-complaint': 'litigation',
  'taiwan-unpaid-overtime-pay': 'labor',
};

const cases = DOMESTIC_ZH_COLUMN_FILES_20261001['zh-hant'].map((file) => ({
  file,
  num: file.slice(0, 3),
  slug: file.replace(/\.md$/, '').replace(/^\d{3}-/, ''),
}));

const PHONE_PATTERNS = [/\b0\d{1,2}-\d{3,4}-\d{3,4}\b/, /\(0\d{1,2}\)\s*\d{3,4}/, /(電話|專線|傳真)[:：]/, /\+886/, /tel:/i];
const STATUTE_LINK = /https:\/\/law\.moj\.gov\.tw\/LawClass\/LawSingle\.aspx\?pcode=[A-Z]\d{7}&flno=[\d-]+/g;

describe('domestic zh-hant columns 2026-10-01', () => {
  it('covers three zh-hant-only columns', () => {
    expect(cases).toHaveLength(3);
    expect(cases.map(({ slug }) => slug).sort()).toEqual(Object.keys(EXPECTED_TOPIC).sort());
  });

  it.each(cases)('$file has the house frontmatter and a hero image on disk', ({ file, num, slug }) => {
    const filePath = path.join(process.cwd(), 'src/content/columns-zh', file);
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));

    expect(data.published).toBe('2026-10-01');
    expect(data.lastmod).toBe('2026-10-01');
    expect(data.date_display).toBe('2026年10月1日');
    expect(data.categories).toEqual(['台灣法律資訊']);
    expect(data.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(data.audience).toEqual(['zh-hant']);
    expect(data.author).toBe('legal-ai-assistant');
    expect(data.faq).toHaveLength(3);
    expect(data.featured_image).toBe(`../images/${num}-${slug}/featured-01.webp`);
    expect(fs.existsSync(path.join(process.cwd(), 'public/images/blog', `${num}-${slug}`, 'featured-01.webp'))).toBe(true);
  });

  it.each(cases)('$slug loads as an AI-authored zh-hant article with email and address only', ({ slug }) => {
    const post = getColumnPost(slug, 'zh-hant');
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-10-01');
    expect(post?.topic).toBe(EXPECTED_TOPIC[slug]);
    expect(isAiAuthoredColumn(post)).toBe(true);
    expect(post?.content).toContain('mailto:wei@hoveringlaw.com.tw');
    expect(post?.content).toContain('103 臺北市大同區承德路一段35號7樓之2');
    const copy = [post?.title, post?.summary, post?.content, ...(post?.faq ?? []).flatMap(({ q, a }) => [q, a])].join('\n');
    for (const pattern of PHONE_PATTERNS) expect(copy).not.toMatch(pattern);
  });

  it.each(cases)('$file has no bold markers, no review claims, and cites statutes with official links', ({ file }) => {
    const raw = fs.readFileSync(path.join(process.cwd(), 'src/content/columns-zh', file), 'utf8');
    expect(raw).not.toMatch(/\*\*|__[^_\s]|<strong|<b>/);
    expect(raw).not.toMatch(/律師(審閱|審核|檢閱|校閱)|母語人士|經律師確認/);
    expect(raw).toContain('## 官方參考資料');
    expect(raw).toContain('確認日期：2026年10月1日');
    expect((raw.match(STATUTE_LINK) ?? []).length).toBeGreaterThan(10);
  });

  it.each(cases)('$slug exists only in zh-hant and its sitemap alternates stay zh-hant', ({ slug }) => {
    for (const other of PUBLIC_LOCALES_8) {
      const present = getAllColumnPosts(other).some((post) => post.slug === slug);
      expect(present, `${other}/${slug}`).toBe(other === 'zh-hant');
    }
    const records = collectColumnSitemapRecords({
      postsForLocale: (locale) => getAllColumnPosts(locale).filter((post) => post.slug === slug),
    });
    expect(records.map((record) => record.locale)).toEqual(['zh-hant']);
    for (const record of records) expect(record.alternateLocales).toEqual(['zh-hant']);
  });
});
