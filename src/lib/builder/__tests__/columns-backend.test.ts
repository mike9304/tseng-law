import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getColumnsStorageBackend } from '@/lib/builder/columns/storage';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';

describe('builder column storage backend', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses file storage in local development even when a Blob token is present', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
    vi.stubEnv('BUILDER_COLUMNS_BACKEND', '');
    vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
    vi.stubEnv('NODE_ENV', 'development');

    expect(getColumnsStorageBackend()).toBe('file');
    await expect(getAllColumnPostsIncludingBlob('ko')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: expect.any(String) }),
      ]),
    );
  });

  it('honors the column-local backend override when Blob is explicitly enabled', () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
    vi.stubEnv('NODE_ENV', 'development');

    expect(getColumnsStorageBackend()).toBe('file');
  });

  it('merges locally published consultation columns into the public reader', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      const localeDir = path.join(root, 'ko');
      await mkdir(localeDir, { recursive: true });
      await writeFile(
        path.join(localeDir, 'local-runtime-column.published.json'),
        JSON.stringify({
          version: 1,
          slug: 'local-runtime-column',
          locale: 'ko',
          title: '로컬 런타임 칼럼',
          summary: 'runtime-data consultation-columns에서 온 칼럼',
          bodyMarkdown: '로컬 런타임 본문',
          bodyHtml: '<p>로컬 런타임 본문</p>',
          linkedSlugs: {},
          frontmatter: {
            lastmod: '2030-01-01T00:00:00.000Z',
            attorneyReviewStatus: 'reviewed',
            freshness: 'fresh',
            category: 'case',
            blogCategory: 'general',
            tags: ['로컬'],
            author: { name: '증준외 변호사' },
            featuredImage: '/images/placeholder-article-hero.jpg',
            publishedAt: '2030-01-01T00:00:00.000Z',
          },
          draft: false,
          revision: 1,
          updatedAt: '2030-01-01T00:00:00.000Z',
          updatedBy: 'columns-backend-test',
        }),
        'utf8',
      );

      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob('ko');

      expect(posts[0]).toMatchObject({
        slug: 'local-runtime-column',
        title: '로컬 런타임 칼럼',
        category: 'case',
        categoryLabel: '소송사례',
        featuredImage: '/images/placeholder-article-hero.jpg',
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('filters mirrored visual load-more test columns from the public reader', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      const localeDir = path.join(root, 'ko');
      await mkdir(localeDir, { recursive: true });
      const documents = [
        {
          slug: 'visual-load-more-mps7blct-01',
          title: 'Visual Load More 1',
          summary: '테스트 정크 칼럼',
          updatedAt: '2031-01-01T00:00:00.000Z',
        },
        {
          slug: 'local-real-column',
          title: '실제 로컬 칼럼',
          summary: '실제 칼럼 요약',
          updatedAt: '2030-01-01T00:00:00.000Z',
        },
      ];
      for (const document of documents) {
        await writeFile(
          path.join(localeDir, `${document.slug}.published.json`),
          JSON.stringify({
            version: 1,
            slug: document.slug,
            locale: 'ko',
            title: document.title,
            summary: document.summary,
            bodyMarkdown: document.summary,
            bodyHtml: `<p>${document.summary}</p>`,
            linkedSlugs: {},
            frontmatter: {
              lastmod: document.updatedAt,
              attorneyReviewStatus: 'reviewed',
              freshness: 'fresh',
              category: 'legal',
              blogCategory: 'general',
              tags: [],
              author: { name: '증준외 변호사' },
              featuredImage: '/images/placeholder-article-hero.jpg',
              publishedAt: document.updatedAt,
            },
            draft: false,
            revision: 1,
            updatedAt: document.updatedAt,
            updatedBy: 'columns-backend-test',
          }),
          'utf8',
        );
      }

      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob('ko');

      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: 'local-real-column',
            title: '실제 로컬 칼럼',
          }),
        ]),
      );
      expect(posts.some((post) => post.slug.startsWith('visual-load-more'))).toBe(false);
      expect(posts.some((post) => post.title.startsWith('Visual Load More'))).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
