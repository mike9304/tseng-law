import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';

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

describe('Traditional Chinese full column corpus', () => {
  it('has one ZH-Hant file per KO file with identical filenames', () => {
    expect(fs.existsSync(zhDir)).toBe(true);
    const zhFiles = fs.readdirSync(zhDir).filter((name) => name.endsWith('.md')).sort();
    expect(zhFiles).toEqual(koFiles);
  });

  it('loads all 17 Traditional Chinese posts', () => {
    expect(getAllColumnPosts('zh-hant')).toHaveLength(17);
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

  it('uses the correct Traditional Chinese registrant term in column 011 FAQ', () => {
    const post = getAllColumnPosts('zh-hant').find(
      ({ slug }) =>
        slug === 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );

    expect(post).toBeDefined();
    expect(post?.faq?.[1]?.a).toContain('產品登錄者');
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
