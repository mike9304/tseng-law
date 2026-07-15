/**
 * Public column surfaces must never expose records created by builder E2E
 * workflows. The admin column manager still reads the unfiltered storage so a
 * failed test run can be inspected and deleted there.
 */

export type PublicColumnCandidate = {
  readonly slug?: string | null;
  readonly title?: string | null;
};

const INTERNAL_COLUMN_SLUG_PATTERNS: readonly RegExp[] = [
  /^visual-load-more(?:-|$)/i,
];

const INTERNAL_COLUMN_TITLE_PATTERNS: readonly RegExp[] = [
  /^G(?:-|\s)Editor UI(?:\s|$)/i,
];

export function isInternalColumnPost(post: PublicColumnCandidate): boolean {
  const slug = (post.slug ?? '').trim();
  const title = (post.title ?? '').trim();
  return INTERNAL_COLUMN_SLUG_PATTERNS.some((pattern) => pattern.test(slug))
    || INTERNAL_COLUMN_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

export function filterPublicColumnPosts<T extends PublicColumnCandidate>(
  posts: readonly T[],
): T[] {
  return posts.filter((post) => !isInternalColumnPost(post));
}
