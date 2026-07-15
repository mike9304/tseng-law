import { describe, expect, it } from 'vitest';
import {
  BASE_FOOTER_LINK_LIMIT,
  getPublishedBaseFooterColumns,
} from '@/components/footer-link-policy';

describe('published footer link policy', () => {
  it('keeps the production three-link rhythm without mutating source content', () => {
    const source = [{
      title: '자주 찾는 주제',
      links: Array.from({ length: 5 }, (_, index) => ({
        label: `링크 ${index + 1}`,
        href: `/link-${index + 1}`,
      })),
    }];

    const result = getPublishedBaseFooterColumns(source);

    expect(result[0]?.links).toHaveLength(BASE_FOOTER_LINK_LIMIT);
    expect(source[0]?.links).toHaveLength(5);
  });
});
