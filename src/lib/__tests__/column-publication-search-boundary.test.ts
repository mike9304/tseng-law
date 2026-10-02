import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readColumnVariant, listColumnBundles } from '@/lib/builder/columns/storage';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import { parseColumnPublicationDate } from '@/lib/column-post';

vi.mock('@/lib/builder/site/persistence', () => ({ readExistingSiteDocument: vi.fn(async () => null) }));
vi.mock('@/lib/builder/faq/faq-engine', () => ({ listFaqSearchDocs: vi.fn(async () => []) }));
vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({ listPortfolioSearchDocs: vi.fn(async () => []) }));

const slug = 'taiwan-truck-blocking-multiple-dashcam-evidence';
let root: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'column-publication-boundary-'));
  vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-02T22:48:22Z'));
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

describe('calendar publication dates in the public search collector', () => {
  it('keeps publication metadata unchanged and identifies the file calendar date', async () => {
    const post = await readColumnVariant('zh-hant', slug, 'published');
    expect(post?.frontmatter.publishedAt).toBe('2026-10-03T00:00:00.000Z');
    expect((await listColumnBundles('zh-hant')).find(bundle => bundle.slug === slug)).toMatchObject({ filePublicationDate: '2026-10-03' });
    expect(parseColumnPublicationDate(post?.frontmatter.publishedAt)).toBe('2026-10-03');
    expect(post?.frontmatter.dateDisplay).toBe('2026年10月3日');
  });

  it.each([
    ['2026-10-02T15:59:59.999Z', false],
    ['2026-10-02T16:00:00.000Z', true],
    ['2026-10-02T22:48:22.000Z', true],
    ['2026-10-03T00:00:00.000Z', true],
  ])('honors the publication-day boundary at %s', async (now, visible) => {
    vi.setSystemTime(new Date(now));
    expect((await listBlogPosts('zh-hant')).some(post => post.slug === slug)).toBe(visible);
  });

  it('finds the published article through the real collector and query engine before UTC midnight', async () => {
    const post = await readColumnVariant('zh-hant', slug, 'published');
    const index = buildSearchIndex(await collectAllSearchDocs());
    const hits = runSearchQuery({ index, query: post!.title, locale: 'zh-hant', kinds: ['blog'], limit: 50 });
    expect(hits.some(hit => hit.doc.url === `/zh-hant/columns/${slug}`)).toBe(true);
  });

  it('keeps explicit CMS schedules and drafts hidden until their actual instant', async () => {
    const localeDir = path.join(root, 'zh-hant');
    await mkdir(localeDir, { recursive: true });
    const document = {
      version: 1, slug: 'scheduled-search-fixture', locale: 'zh-hant',
      title: '排程測試', summary: '排程測試摘要', bodyMarkdown: '排程測試正文', bodyHtml: '<p>排程測試正文</p>',
      frontmatter: {
        lastmod: '2026-10-02T10:00:00.000Z', dateDisplay: '2026年10月3日',
        publishedAt: '2026-10-03T07:00:00+08:00', attorneyReviewStatus: 'pending', freshness: 'fresh',
      },
      linkedSlugs: {}, draft: false, revision: 1, updatedAt: '2026-10-02T10:00:00.000Z', updatedBy: 'test',
    };
    await writeFile(path.join(localeDir, `${document.slug}.published.json`), JSON.stringify(document));
    await writeFile(path.join(localeDir, 'draft-search-fixture.json'), JSON.stringify({ ...document, slug: 'draft-search-fixture', draft: true }));
    const stored = await readColumnVariant('zh-hant', document.slug, 'published');
    expect(stored?.frontmatter.publishedAt).toBe(document.frontmatter.publishedAt);
    const slugs = (await listBlogPosts('zh-hant')).map(post => post.slug);
    expect(slugs).toContain(slug);
    expect(slugs).not.toContain(document.slug);
    expect(slugs).not.toContain('draft-search-fixture');
    vi.setSystemTime(new Date('2026-10-02T23:00:00.000Z'));
    const after = (await listBlogPosts('zh-hant')).map(post => post.slug);
    expect(after).toContain(document.slug);
    expect(after).not.toContain('draft-search-fixture');
  });

  it('does not inherit the file calendar date when a stored CMS schedule overrides the same slug', async () => {
    const published = await readColumnVariant('zh-hant', slug, 'published');
    const localeDir = path.join(root, 'zh-hant');
    await mkdir(localeDir, { recursive: true });
    await writeFile(path.join(localeDir, `${slug}.published.json`), JSON.stringify({
      ...published, updatedBy: 'cms-fixture',
      frontmatter: { ...published!.frontmatter, publishedAt: '2026-10-03T03:00:00.000Z' },
    }));
    const bundle = (await listColumnBundles('zh-hant')).find(item => item.slug === slug);
    expect(bundle).not.toHaveProperty('filePublicationDate');
    expect((await listBlogPosts('zh-hant')).some(post => post.slug === slug)).toBe(false);
  });

});
