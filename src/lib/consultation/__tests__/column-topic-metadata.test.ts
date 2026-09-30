import { afterEach, describe, expect, it, vi } from 'vitest';

const cms = vi.hoisted(() => ({ topic: undefined as string | undefined }));
vi.mock('@/lib/builder/columns/storage', () => ({
  estimateColumnReadTimeLabel: () => '4분 분량',
  listColumnBundles: async () => [{ published: {
    slug: 'taiwan-accident-police-records', locale: 'ko', title: 'Police records',
    summary: 'Summary', bodyMarkdown: 'Body', updatedAt: '2026-09-30',
    frontmatter: { category: 'legal', topic: cms.topic },
  } }],
}));
import { getAllColumnPostsIncludingBlob } from '../columns-blob-reader';

afterEach(() => { cms.topic = undefined; });
describe('published column subject metadata', () => {
  it('retains the authored topic when a legacy CMS copy has no topic', async () => {
    const posts = await getAllColumnPostsIncludingBlob('ko');
    expect(posts.find(p => p.slug === 'taiwan-accident-police-records')?.topic).toBe('litigation');
  });
  it('keeps an explicitly edited CMS topic', async () => {
    cms.topic = 'tax';
    const posts = await getAllColumnPostsIncludingBlob('ko');
    expect(posts.find(p => p.slug === 'taiwan-accident-police-records')?.topic).toBe('tax');
  });
});
