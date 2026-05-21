import { describe, expect, it } from 'vitest';
import type { ColumnDocument, ColumnDocumentBundle } from '@/lib/builder/columns/types';
import {
  buildNativeBlogAdminModel,
  columnBundleToNativeBlogAdminPost,
  resolveNativeBlogPostStatus,
} from '@/lib/builder/blog/admin-model';

const NOW = new Date('2026-05-19T00:00:00.000Z');

type ColumnDocumentTestOverrides = Omit<Partial<ColumnDocument>, 'frontmatter'> & {
  frontmatter?: Partial<ColumnDocument['frontmatter']>;
};

function doc(overrides: ColumnDocumentTestOverrides = {}): ColumnDocument {
  const base: ColumnDocument = {
    version: 1,
    slug: 'sample-post',
    locale: 'ko',
    title: 'Sample post',
    summary: 'Summary',
    bodyMarkdown: 'Body text',
    bodyHtml: '<p>Body text</p>',
    linkedSlugs: {},
    frontmatter: {
      lastmod: '2026-05-18T00:00:00.000Z',
      attorneyReviewStatus: 'pending',
      freshness: 'fresh',
      blogCategory: 'labor-law',
      tags: ['labor', 'taiwan'],
      author: {
        name: '대만 비즈니스 법무팀',
        title: 'Cross-border business counsel',
      },
      featured: true,
      publishedAt: '2026-05-18T00:00:00.000Z',
    },
    draft: true,
    revision: 1,
    updatedAt: '2026-05-18T00:00:00.000Z',
    updatedBy: 'admin',
  };
  return {
    ...base,
    ...overrides,
    frontmatter: {
      ...base.frontmatter,
      ...(overrides.frontmatter ?? {}),
    },
  };
}

function bundle(overrides: {
  slug?: string;
  draft?: ColumnDocument | null;
  published?: ColumnDocument | null;
  preferred?: ColumnDocument | null;
}): ColumnDocumentBundle {
  const preferred = overrides.preferred ?? overrides.draft ?? overrides.published ?? null;
  return {
    slug: overrides.slug ?? preferred?.slug ?? 'sample-post',
    locale: 'ko',
    draft: overrides.draft ?? null,
    published: overrides.published ?? null,
    preferred,
    backend: 'file',
  };
}

describe('native blog admin model', () => {
  it('resolves draft, scheduled, and published post states', () => {
    expect(resolveNativeBlogPostStatus(doc().frontmatter, true, false, NOW)).toBe('draft');
    expect(resolveNativeBlogPostStatus(
      doc({ frontmatter: { publishedAt: '2026-06-01T00:00:00.000Z' } }).frontmatter,
      true,
      false,
      NOW,
    )).toBe('scheduled');
    expect(resolveNativeBlogPostStatus(doc().frontmatter, false, true, NOW)).toBe('published');
  });

  it('projects column bundles into admin blog posts with taxonomy and schedule metadata', () => {
    const scheduledDoc = doc({
      slug: 'scheduled-post',
      title: 'Scheduled post',
      frontmatter: {
        publishedAt: '2026-06-01T00:00:00.000Z',
      },
    });

    const post = columnBundleToNativeBlogAdminPost(bundle({ slug: 'scheduled-post', draft: scheduledDoc }), NOW);

    expect(post).toMatchObject({
      postId: 'ko:scheduled-post',
      slug: 'scheduled-post',
      status: 'scheduled',
      category: 'labor-law',
      tags: ['labor', 'taiwan'],
      authorName: '대만 비즈니스 법무팀',
      scheduledFor: '2026-06-01T00:00:00.000Z',
      hasDraft: true,
      hasPublished: false,
    });
  });

  it('builds admin counts for posts, authors, categories, and tags', () => {
    const draftDoc = doc({ slug: 'draft-post', title: 'Draft post' });
    const publishedDoc = doc({
      slug: 'published-post',
      title: 'Published post',
      draft: false,
      frontmatter: {
        blogCategory: 'company-formation',
        tags: ['company'],
        author: { name: '호정국제 법률사무소' },
      },
    });
    const scheduledDoc = doc({
      slug: 'scheduled-post',
      title: 'Scheduled post',
      frontmatter: { publishedAt: '2026-06-01T00:00:00.000Z' },
    });

    const model = buildNativeBlogAdminModel('ko', [
      bundle({ slug: 'draft-post', draft: draftDoc }),
      bundle({ slug: 'published-post', published: publishedDoc, preferred: publishedDoc }),
      bundle({ slug: 'scheduled-post', draft: scheduledDoc }),
    ], NOW);

    expect(model.counts).toEqual({
      total: 3,
      draft: 1,
      scheduled: 1,
      published: 1,
    });
    expect(model.authors.map((author) => author.id)).toEqual([
      '대만 비즈니스 법무팀',
      '호정국제 법률사무소',
    ]);
    expect(model.categories.map((category) => category.id)).toContain('labor-law');
    expect(model.tags.map((tag) => tag.id)).toEqual(expect.arrayContaining(['labor', 'taiwan', 'company']));
  });
});
