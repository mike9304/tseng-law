import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { afterEach, describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost, resolveColumnSummary } from '@/lib/columns';
import { buildLocaleLlmsTxt } from '@/lib/llms-txt';
import { buildArticleJsonLd, buildSeoMetadata } from '@/lib/seo';
import { isExpertiseColumnFile20260930, isNativeLocaleColumnFile } from './native-locale-columns';

const AUTHORED_SUMMARY =
  'Foreign companies may enter Taiwan through a subsidiary, branch, or representative office. Company setup does not grant a work permit or ARC.';

const FALLBACK_PARAGRAPH =
  'The ways in which Korean companies and sole proprietors enter the Taiwan market vary with the nature of their business, including manufacturing, distribution, information and communications technology, and professional services.';

const tmpDirs: string[] = [];

function makeTempColumnsDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'g4-column-summary-'));
  tmpDirs.push(dir);
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, 'utf8');
  }
  return dir;
}

function columnMarkdown(options: { summary?: string | number | null; body?: string }): string {
  const lines = [
    '---',
    'title: "Fixture Company Setup Column"',
    'lastmod: "2026-09-14"',
    'date_display: "September 14, 2025"',
    'read_time: "3 min read"',
    'categories:',
    '  - "Taiwan Company Formation"',
    'featured_image: "../images/fixture.jpg"',
  ];
  if (options.summary === null) {
    lines.push('summary: null');
  } else if (typeof options.summary === 'number') {
    lines.push(`summary: ${options.summary}`);
  } else if (typeof options.summary === 'string') {
    lines.push(`summary: "${options.summary}"`);
  }
  lines.push('---', '', '# Fixture Company Setup Column', '', options.body ?? FALLBACK_PARAGRAPH, '');
  return lines.join('\n');
}

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('resolveColumnSummary', () => {
  it('returns a trimmed frontmatter summary when it is a non-empty string', () => {
    expect(resolveColumnSummary(`  ${AUTHORED_SUMMARY}  `, FALLBACK_PARAGRAPH)).toBe(AUTHORED_SUMMARY);
  });

  it('falls back to the truncated first paragraphs when summary is missing, empty, or not a string', () => {
    const expected = `${FALLBACK_PARAGRAPH.slice(0, 150)}...`;
    expect(resolveColumnSummary(undefined, FALLBACK_PARAGRAPH)).toBe(expected);
    expect(resolveColumnSummary('   ', FALLBACK_PARAGRAPH)).toBe(expected);
    expect(resolveColumnSummary('', FALLBACK_PARAGRAPH)).toBe(expected);
    expect(resolveColumnSummary(12, FALLBACK_PARAGRAPH)).toBe(expected);
    expect(resolveColumnSummary(null, FALLBACK_PARAGRAPH)).toBe(expected);
    expect(expected.endsWith('...')).toBe(true);
  });
});

describe('column loader summary frontmatter', () => {
  it('uses the authored summary for description, Article JSON-LD, and llms annotations without an ellipsis', () => {
    const dir = makeTempColumnsDir({
      '001-fixture-company-setup.md': columnMarkdown({ summary: AUTHORED_SUMMARY }),
    });
    const post = getColumnPost('fixture-company-setup', 'en', { columnsDir: dir });
    expect(post?.summary).toBe(AUTHORED_SUMMARY);
    expect(post?.summary.endsWith('...')).toBe(false);
    expect(post?.summary).not.toContain('Korean companies');

    const metadata = buildSeoMetadata({
      locale: 'en',
      title: post!.title,
      description: post!.summary,
      path: `/columns/${post!.slug}`,
    });
    expect(metadata.description).toBe(AUTHORED_SUMMARY);
    expect(String(metadata.description).endsWith('...')).toBe(false);

    const article = buildArticleJsonLd({
      locale: 'en',
      title: post!.title,
      description: post!.summary,
      path: `/en/columns/${post!.slug}`,
      authorName: 'Attorney Wei Tseng',
    });
    expect(article.description).toBe(AUTHORED_SUMMARY);
    expect(String(article.description).endsWith('...')).toBe(false);
  });

  it('falls back to extractSummary when frontmatter has no usable summary', () => {
    const expected = `${FALLBACK_PARAGRAPH.slice(0, 150)}...`;
    const missingDir = makeTempColumnsDir({
      '002-fixture-fallback-missing.md': columnMarkdown({}),
    });
    const emptyDir = makeTempColumnsDir({
      '003-fixture-fallback-empty.md': columnMarkdown({ summary: '   ' }),
    });

    expect(getColumnPost('fixture-fallback-missing', 'ko', { columnsDir: missingDir })?.summary).toBe(expected);
    expect(getColumnPost('fixture-fallback-empty', 'zh-hant', { columnsDir: emptyDir })?.summary).toBe(expected);
  });
});

describe('English column corpus summaries', () => {
  const enDir = path.join(process.cwd(), 'src/content/columns-en');
  const files = fs.readdirSync(enDir).filter((name) => name.endsWith('.md')).sort();

  it('gives every EN column a 150–160 character authored summary without Korean-company framing or an ellipsis', () => {
    // 32 translated EN columns plus the English-only native columns (same rules apply).
    expect(files.length).toBeGreaterThan(0);
    expect(files).toHaveLength(getAllColumnPosts('en').length);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(enDir, file), 'utf8');
      const parsed = matter(raw);
      expect(typeof parsed.data.summary, file).toBe('string');

      const summary = String(parsed.data.summary).trim();
      expect(summary.length, file).toBeGreaterThanOrEqual(150);
      expect(summary.length, file).toBeLessThanOrEqual(160);
      expect(summary, file).not.toContain('Korean companies');
      expect(summary, file).not.toContain('...');
      expect(summary, file).not.toContain('…');

      const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
      const post = getColumnPost(slug, 'en');
      expect(post?.summary, file).toBe(summary);
    }
  });

  it('reuses those summaries in EN meta description, Article JSON-LD, and llms.txt annotations', () => {
    const posts = getAllColumnPosts('en');
    expect(posts).toHaveLength(files.length);
    const llms = buildLocaleLlmsTxt('en');

    for (const post of posts) {
      expect(post.summary.endsWith('...')).toBe(false);

      const metadata = buildSeoMetadata({
        locale: 'en',
        title: post.title,
        description: post.summary,
        path: `/columns/${post.slug}`,
      });
      expect(metadata.description).toBe(post.summary);

      const article = buildArticleJsonLd({
        locale: 'en',
        title: post.title,
        description: post.summary,
        path: `/en/columns/${post.slug}`,
        authorName: 'Attorney Wei Tseng',
      });
      expect(article.description).toBe(post.summary);

      expect(llms).toContain(
        `](https://tseng-law.com/en/columns/${post.slug}): ${post.summary}`,
      );
    }
  });

  it('preserves legacy extractSummary and accepts native summaries in the new batch', () => {
    const otherDirs = [
      'src/content/columns',
      'src/content/columns-zh',
      'src/content/columns-ja',
      'src/content/columns-vi',
      'src/content/columns-id',
      'src/content/columns-th',
      'src/content/columns-fil',
    ];
    for (const relativeDir of otherDirs) {
      const dir = path.join(process.cwd(), relativeDir);
      const names = fs.readdirSync(dir).filter((name) => name.endsWith('.md'));
      expect(names.length, relativeDir).toBeGreaterThan(0);
      for (const name of names) {
        const raw = fs.readFileSync(path.join(dir, name), 'utf8');
        // 019–031 (gap batch included), the native single-locale columns (032–040) and the 2026-09-30
        // expertise columns (041–048) author their own summaries.
        if (
          /^(019|020|021|022|023|024|025|026|027|028|029|030|031)-/.test(name) ||
          isNativeLocaleColumnFile(name) ||
          isExpertiseColumnFile20260930(name)
        ) {
          expect(matter(raw).data.summary, `${relativeDir}/${name}`).toBeTruthy();
        } else {
          expect(raw, `${relativeDir}/${name}`).not.toMatch(/^summary\s*:/m);
        }
      }
    }

    const ko = getColumnPost('taiwan-company-establishment-basics', 'ko');
    expect(ko?.summary.endsWith('...')).toBe(true);
  });
});

describe('summary accessor wiring', () => {
  it('keeps column metadata and Article JSON-LD on post.summary and llms.txt on column.summary', () => {
    const pageSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/columns/[slug]/page.tsx'),
      'utf8',
    );
    const llmsSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/llms-txt.ts'), 'utf8');
    const descriptionAssignments = pageSrc.match(/description:\s*post\.summary/g) ?? [];
    expect(descriptionAssignments.length).toBeGreaterThanOrEqual(2);
    expect(llmsSrc).toMatch(/annotation:\s*column\.summary/);
  });
});
