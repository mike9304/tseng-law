import { expect, it } from 'vitest';
import { columnToBlogPost } from '../column-adapter';
import { columnDocumentSchema } from '../../columns/types';

it('removes column emphasis from public blog copy and SEO without altering links or stored documents', () => {
  const column = columnDocumentSchema.parse({
    version: 1, slug: 'column-example', locale: 'ko', title: '**제목**', summary: '**요약**',
    bodyMarkdown: '**본문** [출처](https://example.com/?q=**)',
    bodyHtml: '<p><strong>본문</strong> <a href="https://example.com/?q=**">출처</a></p>',
    frontmatter: {
      lastmod: '2026-10-01T00:00:00.000Z', attorneyReviewStatus: 'pending', freshness: 'fresh',
      seo: { title: '**검색 제목**', description: '**검색 설명**' },
    },
    linkedSlugs: {}, draft: false, revision: 1, updatedAt: '2026-10-01T00:00:00.000Z', updatedBy: 'test',
  });
  expect(columnToBlogPost(column)).toMatchObject({
    title: '제목', excerpt: '요약', bodyMarkdown: '본문 [출처](https://example.com/?q=**)',
    bodyHtml: '<p>본문 <a href="https://example.com/?q=**">출처</a></p>',
    seo: { title: '검색 제목', description: '검색 설명' },
  });
  expect(column.title).toBe('**제목**');
});
