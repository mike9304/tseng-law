import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadTrafficCollection } from '../traffic-collection-server';

vi.mock('../columns', async (importOriginal) => ({
  ...await importOriginal<typeof import('../columns')>(),
  getAllColumnPosts: () => [{
    slug: 'new-tagged-police-records', title: 'New records article',
    publicationDate: '2026-10-02', date: '2026-10-02', dateDisplay: 'October 2, 2026',
    readTime: '3 min read', category: 'legal', categoryLabel: 'Legal information',
    tags: ['traffic-accidents', 'traffic-evidence'], featuredImage: '',
    content: 'Public article fixture.', summary: 'Records after a road accident.',
  }],
  getAllIssuePosts: () => [],
}));

afterEach(() => vi.unstubAllEnvs());

describe('traffic tags across the actual file → CMS adapter → public collection', () => {
  it('retains a newly tagged file when the public CMS reader overlays its legacy bundle', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'traffic-cms-tags-'));
    vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
    vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    try {
      const posts = await loadTrafficCollection('en');
      expect(posts.map(({ slug, subject }) => ({ slug, subject }))).toEqual([
        { slug: 'new-tagged-police-records', subject: 'evidence' },
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
