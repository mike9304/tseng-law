import type { ColumnPost } from '@/lib/column-post';
import type { ColumnListItem } from '@/components/ColumnsGrid';

/**
 * Card fields only. The columns index is a client component, so whatever it
 * receives is serialized into the page payload; full article bodies (`content`,
 * FAQ, typography) were being shipped for every column and never used.
 */
export function toColumnListItems(posts: readonly ColumnPost[]): ColumnListItem[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    dateDisplay: post.dateDisplay,
    readTime: post.readTime,
    category: post.category,
    categoryLabel: post.categoryLabel,
    topic: post.topic,
    blogCategory: post.blogCategory,
    authorName: post.authorName,
    tags: post.tags,
    featuredImage: post.featuredImage,
    ...(post.featuredImageAlt ? { featuredImageAlt: post.featuredImageAlt } : {}),
    summary: post.summary,
    publicationDate: post.publicationDate,
    audience: post.audience,
    aiAuthored: post.aiAuthored,
      columnNumber: post.columnNumber,
  }));
}
