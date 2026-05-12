import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { publishPage } from '@/lib/builder/site/publish';
import {
  getActiveScheduledPublish,
  listScheduledPublishes,
  runDueScheduledPublishes,
  schedulePagePublish,
} from '@/lib/builder/site/scheduled-publish';

vi.mock('@/lib/builder/site/publish', () => ({
  publishPage: vi.fn(),
}));

let root: string | null = null;

beforeEach(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'scheduled-publish-'));
  process.env.BUILDER_SCHEDULED_PUBLISH_ROOT = root;
  process.env.BUILDER_SITE_BACKEND = 'local';
  vi.mocked(publishPage).mockReset();
});

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = null;
  delete process.env.BUILDER_SCHEDULED_PUBLISH_ROOT;
  delete process.env.BUILDER_SITE_BACKEND;
});

describe('scheduled publish store and runner', () => {
  it('keeps one active schedule per page by cancelling the previous job', async () => {
    const first = await schedulePagePublish({
      siteId: 'default',
      pageId: 'home',
      locale: 'ko',
      scheduledAt: '2026-05-12T10:00:00.000Z',
      expectedDraftRevision: 2,
    });
    const second = await schedulePagePublish({
      siteId: 'default',
      pageId: 'home',
      locale: 'ko',
      scheduledAt: '2026-05-12T11:00:00.000Z',
      expectedDraftRevision: 3,
    });

    const jobs = await listScheduledPublishes('default', 'home');
    expect(jobs).toHaveLength(2);
    expect(jobs.find((job) => job.jobId === first.jobId)?.status).toBe('cancelled');
    expect(await getActiveScheduledPublish('default', 'home')).toMatchObject({
      jobId: second.jobId,
      status: 'scheduled',
      expectedDraftRevision: 3,
    });
  });

  it('publishes due jobs through the normal publish pipeline', async () => {
    vi.mocked(publishPage).mockResolvedValue({
      ok: true,
      revisionId: 'rev-7',
      revision: 7,
      publishedRevisionId: 'rev-7',
      publishedRevision: 7,
      publishedSavedAt: '2026-05-12T10:05:00.000Z',
      cacheInvalidatedAt: '2026-05-12T10:05:01.000Z',
      revalidatedPaths: ['/ko'],
      slug: '',
      warnings: [],
      checks: { passed: true, warnings: [], errors: [] },
    });

    await schedulePagePublish({
      siteId: 'default',
      pageId: 'home',
      locale: 'ko',
      scheduledAt: '2026-05-12T10:00:00.000Z',
      expectedDraftRevision: 6,
    });

    const result = await runDueScheduledPublishes({
      now: new Date('2026-05-12T10:00:30.000Z'),
    });

    expect(publishPage).toHaveBeenCalledWith('default', 'home', {
      expectedDraftRevision: 6,
    });
    expect(result).toMatchObject({ due: 1, published: 1, failed: 0 });
    expect(result.jobs[0]).toMatchObject({
      status: 'published',
      publishedRevisionId: 'rev-7',
      publishedRevision: 7,
    });
  });

  it('marks due jobs failed when publish validation rejects them', async () => {
    vi.mocked(publishPage).mockRejectedValue(new Error('publish_blocked'));

    await schedulePagePublish({
      siteId: 'default',
      pageId: 'home',
      locale: 'ko',
      scheduledAt: '2026-05-12T10:00:00.000Z',
      expectedDraftRevision: 6,
    });

    const result = await runDueScheduledPublishes({
      now: new Date('2026-05-12T10:00:30.000Z'),
    });

    expect(result).toMatchObject({ due: 1, published: 0, failed: 1 });
    expect(result.jobs[0]).toMatchObject({
      status: 'failed',
      lastError: 'publish_blocked',
    });
  });
});
