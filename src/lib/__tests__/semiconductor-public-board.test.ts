import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';
import {
  PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS,
  UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS,
  listPublicSemiconductorColumns,
} from '@/lib/semiconductor-public';

describe('public semiconductor board', () => {
  it('lists only the reviewed market-entry column', () => {
    const posts = listPublicSemiconductorColumns('ko');
    expect(posts).toHaveLength(1);
    expect(posts[0]?.slug).toBe('taiwan-semiconductor-market-entry');
  });

  it('does not expose unpaid-invoice or supply-contract drafts as public columns', () => {
    for (const slug of UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS) {
      expect(getColumnPost(slug, 'ko')).toBeUndefined();
      expect(getColumnPost(slug, 'en')).toBeUndefined();
      expect(getColumnPost(slug, 'ja')).toBeUndefined();
    }
  });

  it('has a public file-backed article for each published semiconductor slug', () => {
    for (const slug of PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS) {
      expect(getColumnPost(slug, 'ko')?.title).toBeTruthy();
      expect(getColumnPost(slug, 'zh-hant')?.title).toBeTruthy();
      expect(getColumnPost(slug, 'en')?.title).toBeTruthy();
      expect(getColumnPost(slug, 'ja')?.title).toBeTruthy();
    }
  });
});
