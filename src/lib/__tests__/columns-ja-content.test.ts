import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { allNativeFiles, isNativeOrExpertiseNativeSlug, koFilesAbsentFromLocale } from './native-locale-columns';
import { isSiteLocale, siteLocales } from '@/lib/locales';

const HANGUL = /[\uac00-\ud7af]/;
const KANA = /[\u3040-\u30ff]/;
const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const jaDir = path.join(root, 'src/content/columns-ja');
const jaIdentityFiles = [
  '001-taiwan-company-establishment-basics.md',
  '002-withdraw-capital-taiwan-company.md',
  '004-taiwan-company-subsidiary-vs-branch.md',
  '007-taiwan-divorce-lawsuit-qna.md',
  '008-taiwan-labor-severance-law.md',
];

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

// Korean files the 2026-09-30 batch never carried into Japanese (see native-locale-columns.ts).
const koFilesInJa = koFiles.filter((name) => !koFilesAbsentFromLocale('ja').includes(name));

describe('Japanese full column corpus + site locale', () => {
  it('recognizes ja as a public site locale', () => {
    expect(siteLocales).toContain('ja');
    expect(isSiteLocale('ja')).toBe(true);
  });

  it('has one JA file per KO file (except the Korean-only 2026-09-30 columns), plus the Japanese-only native columns', () => {
    expect(fs.existsSync(jaDir)).toBe(true);
    const jaFiles = fs.readdirSync(jaDir).filter((name) => name.endsWith('.md')).sort();
    const nativeFiles = allNativeFiles('ja');
    expect(jaFiles.filter((name) => !nativeFiles.includes(name))).toEqual(koFilesInJa);
    expect(jaFiles.filter((name) => nativeFiles.includes(name))).toEqual(nativeFiles);
  });

  it('loads translated KO twins plus native Japanese posts with full bodies and kana', () => {
    const posts = getAllColumnPosts('ja');
    const twinCount = koFilesInJa.length;
    expect(posts.filter((post) => !isNativeOrExpertiseNativeSlug('ja', post.slug))).toHaveLength(twinCount);
    expect(posts).toHaveLength(twinCount + allNativeFiles('ja').length);
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

  it('states the corrected Labor Pension Act coverage in the ja 270 setup-cost column', () => {
    const raw = fs.readFileSync(
      path.join(jaDir, '270-taiwan-company-setup-costs-japanese.md'),
      'utf8',
    );

    expect(raw).toContain(
      '2026年1月1日からは、就業許可を受けて専門的な仕事に従事する外国人も含まれます（[外國專業人才延攬及僱用法第24条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)）。',
    );
    expect(raw).toContain(
      '日本人社員も、経理人やエンジニアとして就業許可を受けていれば対象です。',
    );
    expect(raw).not.toContain(
      '永久居留の許可や台湾人の配偶者としての居留がない日本人社員は含まれません。',
    );
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
