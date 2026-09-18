import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { afterEach, describe, expect, it } from 'vitest';
import { getColumnPost, resolveColumnSeoTitle } from '@/lib/columns';
import { buildSeoMetadata } from '@/lib/seo';

const FALLBACK_TITLE = 'Fixture Company Setup Column With An Intentionally Long Display Title';
const AUTHORED_SEO_TITLE = 'Taiwan Company Setup: Subsidiary, Branch, Work Permits';

const tmpDirs: string[] = [];

function makeTempColumnsDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'g5-column-seo-title-'));
  tmpDirs.push(dir);
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, 'utf8');
  }
  return dir;
}

function columnMarkdown(options: { seoTitle?: string | number | null; title?: string }): string {
  const title = options.title ?? FALLBACK_TITLE;
  const lines = [
    '---',
    `title: "${title}"`,
    'lastmod: "2026-09-14"',
    'date_display: "September 14, 2025"',
    'read_time: "3 min read"',
    'categories:',
    '  - "Taiwan Company Formation"',
    'featured_image: "../images/fixture.jpg"',
  ];
  if (options.seoTitle === null) {
    lines.push('seoTitle: null');
  } else if (typeof options.seoTitle === 'number') {
    lines.push(`seoTitle: ${options.seoTitle}`);
  } else if (typeof options.seoTitle === 'string') {
    lines.push(`seoTitle: "${options.seoTitle}"`);
  }
  lines.push('---', '', `# ${title}`, '', 'Fixture body.', '');
  return lines.join('\n');
}

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('resolveColumnSeoTitle', () => {
  it('returns a trimmed frontmatter seoTitle when it is a non-empty string', () => {
    expect(resolveColumnSeoTitle(`  ${AUTHORED_SEO_TITLE}  `, FALLBACK_TITLE)).toBe(AUTHORED_SEO_TITLE);
  });

  it('falls back to the display title when seoTitle is missing, empty, or not a string', () => {
    expect(resolveColumnSeoTitle(undefined, FALLBACK_TITLE)).toBe(FALLBACK_TITLE);
    expect(resolveColumnSeoTitle('   ', FALLBACK_TITLE)).toBe(FALLBACK_TITLE);
    expect(resolveColumnSeoTitle('', FALLBACK_TITLE)).toBe(FALLBACK_TITLE);
    expect(resolveColumnSeoTitle(12, FALLBACK_TITLE)).toBe(FALLBACK_TITLE);
    expect(resolveColumnSeoTitle(null, FALLBACK_TITLE)).toBe(FALLBACK_TITLE);
  });
});

describe('column loader seoTitle frontmatter', () => {
  it('uses authored seoTitle for <title> and og:title while keeping the H1 title', () => {
    const dir = makeTempColumnsDir({
      '001-fixture-company-setup.md': columnMarkdown({ seoTitle: AUTHORED_SEO_TITLE }),
    });
    const post = getColumnPost('fixture-company-setup', 'en', { columnsDir: dir });

    expect(post?.title).toBe(FALLBACK_TITLE);
    expect(post?.seoTitle).toBe(AUTHORED_SEO_TITLE);

    const metadata = buildSeoMetadata({
      locale: 'en',
      title: post!.seoTitle || post!.title,
      description: 'Fixture description for company setup metadata.',
      path: `/columns/${post!.slug}`,
    });
    expect(metadata.title).toBe(AUTHORED_SEO_TITLE);
    expect(metadata.openGraph).toMatchObject({ title: AUTHORED_SEO_TITLE });
  });

  it('falls back to the display title when frontmatter has no usable seoTitle', () => {
    const missingDir = makeTempColumnsDir({
      '002-fixture-fallback-missing.md': columnMarkdown({}),
    });
    const emptyDir = makeTempColumnsDir({
      '003-fixture-fallback-empty.md': columnMarkdown({ seoTitle: '   ' }),
    });

    expect(getColumnPost('fixture-fallback-missing', 'ko', { columnsDir: missingDir })?.seoTitle).toBe(
      FALLBACK_TITLE,
    );
    expect(getColumnPost('fixture-fallback-empty', 'zh-hant', { columnsDir: emptyDir })?.seoTitle).toBe(
      FALLBACK_TITLE,
    );
    expect(getColumnPost('fixture-fallback-missing', 'ko', { columnsDir: missingDir })?.title).toBe(
      FALLBACK_TITLE,
    );
  });
});

describe('English column corpus seoTitle', () => {
  const enDir = path.join(process.cwd(), 'src/content/columns-en');
  const files = fs.readdirSync(enDir).filter((name) => name.endsWith('.md')).sort();

  it('adds a 60–70 character seoTitle only when the display title exceeds 70 characters', () => {
    expect(files).toHaveLength(18);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(enDir, file), 'utf8');
      const parsed = matter(raw);
      const title = String(parsed.data.title ?? '').trim();
      const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
      const post = getColumnPost(slug, 'en');

      expect(post?.title, file).toBe(title);

      if (title.length > 70) {
        expect(typeof parsed.data.seoTitle, file).toBe('string');
        const seoTitle = String(parsed.data.seoTitle).trim();
        expect(seoTitle.length, file).toBeGreaterThanOrEqual(60);
        expect(seoTitle.length, file).toBeLessThanOrEqual(70);
        expect(seoTitle, file).not.toBe(title);
        expect(post?.seoTitle, file).toBe(seoTitle);
      } else {
        expect(parsed.data.seoTitle, file).toBeUndefined();
        expect(post?.seoTitle, file).toBe(title);
      }
    }
  });
});

describe('seoTitle accessor wiring', () => {
  it('keeps H1 and Article headline on post.title and uses seoTitle for document/og title', () => {
    const pageSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/columns/[slug]/page.tsx'),
      'utf8',
    );

    expect(pageSrc).toMatch(/<h1 className="blog-hero-title">\{post\.title\}<\/h1>/);
    expect(pageSrc).toMatch(/title:\s*post\.title/);
    expect(pageSrc).toMatch(/title:\s*post\.seoTitle\s*\|\|\s*post\.title/);
    const metadataTitleAssignments = pageSrc.match(/title:\s*post\.seoTitle\s*\|\|\s*post\.title/g) ?? [];
    expect(metadataTitleAssignments.length).toBeGreaterThanOrEqual(2);
  });
});
