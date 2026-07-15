import { describe, expect, it } from 'vitest';
import {
  filterPublicColumnPosts,
  isInternalColumnPost,
} from '@/lib/builder/columns/public-post-filter';

describe('public column post filter', () => {
  it.each([
    { slug: 'visual-load-more-mps7blct-01', title: 'Visual Load More 1' },
    { slug: 'post-mrcv6h2k', title: 'G-Editor UI 칼럼 수정 mrcv6gic' },
    { slug: 'post-example', title: 'G Editor UI column example' },
  ])('recognizes builder-only records: $title', (post) => {
    expect(isInternalColumnPost(post)).toBe(true);
  });

  it('keeps ordinary authored columns, including normal post-* slugs', () => {
    const realPost = { slug: 'post-taiwan-litigation', title: '대만 소송 절차 안내' };
    expect(isInternalColumnPost(realPost)).toBe(false);
    expect(filterPublicColumnPosts([realPost])).toEqual([realPost]);
  });
});
