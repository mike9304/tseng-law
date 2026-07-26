import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { isSiteLocale, siteLocales } from '@/lib/locales';

const HANGUL = /[\uac00-\ud7af]/;
const KANA = /[\u3040-\u30ff]/;
const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const jaDir = path.join(root, 'src/content/columns-ja');
const jaIdentityFiles = [
  '001-taiwan-company-establishment-basics.md',
  '004-taiwan-company-subsidiary-vs-branch.md',
  '007-taiwan-divorce-lawsuit-qna.md',
  '008-taiwan-labor-severance-law.md',
  '010-taiwan-gym-injury-lawsuit.md',
];

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

describe('Japanese full column corpus + site locale', () => {
  it('recognizes ja as a public site locale', () => {
    expect(siteLocales).toContain('ja');
    expect(isSiteLocale('ja')).toBe(true);
  });

  it('has one JA file per KO file', () => {
    expect(fs.existsSync(jaDir)).toBe(true);
    const jaFiles = fs.readdirSync(jaDir).filter((name) => name.endsWith('.md')).sort();
    expect(jaFiles).toEqual(koFiles);
  });

  it('loads 17 Japanese posts with full bodies and kana', () => {
    const posts = getAllColumnPosts('ja');
    expect(posts).toHaveLength(17);
    for (const post of posts) {
      expect(post.content.length).toBeGreaterThan(600);
      expect(KANA.test(post.title + post.content)).toBe(true);
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.content)).toBe(false);
      expect(post.dateDisplay).toMatch(/年.*月.*日/);
      expect(post.readTime).toMatch(/^約[1-9][0-9]*分$/);
    }
  });

  it('preserves FAQ count for known sources', () => {
    for (const slug of [
      'taiwan-company-establishment-basics',
      'withdraw-capital-taiwan-company',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-labor-severance-law',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    ]) {
      const ko = getColumnPost(slug, 'ko');
      const ja = getColumnPost(slug, 'ja');
      expect(ja?.faq?.length ?? 0).toBe(ko?.faq?.length ?? 0);
    }
  });

  it('does not name 구준엽 as Harlem Yu in JA inheritance column', () => {
    const post = getColumnPost('taiwan-inheritance-custody-analysis', 'ja');
    expect(post?.content ?? '').not.toMatch(/Harlem\s*Yu/i);
  });

  it('uses the official attorney name throughout the Japanese column corpus', () => {
    const jaFiles = fs.readdirSync(jaDir).filter((name) => name.endsWith('.md'));
    const corpus = jaFiles.map((name) => fs.readFileSync(path.join(jaDir, name), 'utf8')).join('\n');

    expect(corpus).not.toContain('曾俊瑋');
    for (const file of jaIdentityFiles) {
      const content = fs.readFileSync(path.join(jaDir, file), 'utf8');
      expect(content).toContain('曾雋崴');
    }
  });
});
