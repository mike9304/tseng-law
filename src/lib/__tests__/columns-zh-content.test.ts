import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import { allNativeFiles, koFilesAbsentFromLocale } from './native-locale-columns';

const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const zhDir = path.join(root, 'src/content/columns-zh');
const zhIdentityFiles = [
  '001-taiwan-company-establishment-basics.md',
  '003-taiwan-traffic-accident-procedure.md',
  '004-taiwan-company-subsidiary-vs-branch.md',
  '007-taiwan-divorce-lawsuit-qna.md',
  '008-taiwan-labor-severance-law.md',
  '010-taiwan-gym-injury-lawsuit.md',
];

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

// Korean files the 2026-09-30 batch never carried into zh-hant, and zh-hant files with no Korean twin.
const koFilesInZh = koFiles.filter((name) => !koFilesAbsentFromLocale('zh-hant').includes(name));

describe('Traditional Chinese full column corpus', () => {
  it('has one ZH-Hant file per KO file with identical filenames (except the Korean-only 2026-09-30 columns), plus the zh-hant-only native columns', () => {
    expect(fs.existsSync(zhDir)).toBe(true);
    const zhFiles = fs.readdirSync(zhDir).filter((name) => name.endsWith('.md')).sort();
    const nativeFiles = allNativeFiles('zh-hant');
    expect(zhFiles.filter((name) => !nativeFiles.includes(name))).toEqual(koFilesInZh);
    expect(zhFiles.filter((name) => nativeFiles.includes(name))).toEqual(nativeFiles);
  });

  it('loads all Traditional Chinese posts (KO twins plus native zh-hant)', () => {
    const twinCount = koFilesInZh.length;
    const nativeCount = allNativeFiles('zh-hant').length;
    expect(getAllColumnPosts('zh-hant')).toHaveLength(twinCount + nativeCount);
  });

  it('contains no Hangul in public Traditional Chinese column copy', () => {
    const hangul = /\p{Script=Hangul}/u;
    const posts = getAllColumnPosts('zh-hant');

    for (const post of posts) {
      expect(post.title).not.toMatch(hangul);
      expect(post.content).not.toMatch(hangul);
      for (const item of post.faq ?? []) {
        expect(item.q).not.toMatch(hangul);
        expect(item.a).not.toMatch(hangul);
      }
    }
  });

  it('uses the current Traditional Chinese responsible-party term in column 011 FAQ', () => {
    const post = getAllColumnPosts('zh-hant').find(
      ({ slug }) =>
        slug === 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );

    expect(post).toBeDefined();
    expect(post?.faq?.[1]?.a).toContain('化粧品製造或輸入業者');
    expect(post?.faq?.[1]?.a).not.toContain('產品登錄者');
    expect(post?.faq?.[1]?.a).not.toContain('產品登록者');
  });

  it('uses the official attorney name throughout the Traditional Chinese column corpus', () => {
    const zhFiles = fs.readdirSync(zhDir).filter((name) => name.endsWith('.md'));
    const corpus = zhFiles.map((name) => fs.readFileSync(path.join(zhDir, name), 'utf8')).join('\n');

    expect(corpus).not.toContain('曾俊瑋');
    for (const file of zhIdentityFiles) {
      const content = fs.readFileSync(path.join(zhDir, file), 'utf8');
      expect(content).toContain('曾雋崴');
    }
  });
});
