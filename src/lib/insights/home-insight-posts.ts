import type { ColumnPost } from '@/lib/columns';

/** Column posts → home archive cards (only dated posts, with topic for the mix). */
export function mapColumnPostsToHomeInsights(posts: readonly ColumnPost[]) {
  return posts
    .filter((post) => Boolean(post.date) && Boolean(post.dateDisplay))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      dateDisplay: post.dateDisplay,
      readTime: post.readTime,
      categoryLabel: post.categoryLabel,
      featuredImage: post.featuredImage,
      summary: post.summary,
      topic: post.topic,
    }));
}
