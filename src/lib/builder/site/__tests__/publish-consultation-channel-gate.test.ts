import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import {
  ensureSiteDocument,
  readPageCanvasRecordState,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { PublishError, publishPage } from '@/lib/builder/site/publish';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/publish-gate/gate-runner', () => ({
  runAllChecks: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  ensureSiteDocument: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
  readSiteDocument: vi.fn(),
  writePageCanvas: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const draft: BuilderCanvasDocument = {
  version: 1,
  locale: 'ko',
  updatedAt: '2026-07-30T00:00:00.000Z',
  updatedBy: 'publish-channel-gate-test',
  stageWidth: 1280,
  stageHeight: 720,
  nodes: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readPageCanvasRecordState).mockResolvedValue({
    isEnvelope: true,
    record: {
      revision: 3,
      savedAt: '2026-07-30T00:00:00.000Z',
      updatedBy: 'publish-channel-gate-test',
      document: draft,
    },
  });
  vi.mocked(readSiteDocument).mockResolvedValue({
    siteId: DEFAULT_BUILDER_SITE_ID,
    pages: [],
  } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
  vi.mocked(runAllChecks).mockResolvedValue({
    results: [{
      id: 'disabled-consultation-channel-cta',
      severity: 'blocker',
      category: 'links',
      message: 'Disabled channel',
      affectedNodeIds: ['cta'],
    }],
    hasBlocker: true,
    blockerCount: 1,
    warningCount: 0,
    infoCount: 0,
    checkedAt: '2026-07-30T00:00:00.000Z',
  });
});

describe('core publish disabled consultation channel gate', () => {
  it('passes the concrete site id into the shared gate and performs no write', async () => {
    await expect(publishPage(DEFAULT_BUILDER_SITE_ID, 'home')).rejects.toMatchObject({
      name: 'PublishError',
      code: 'publish_blocked',
      status: 422,
      body: {
        blockers: [
          expect.objectContaining({ id: 'disabled-consultation-channel-cta' }),
        ],
      },
    } satisfies Partial<PublishError>);

    expect(runAllChecks).toHaveBeenCalledWith(
      draft,
      null,
      expect.objectContaining({ siteId: DEFAULT_BUILDER_SITE_ID }),
      DEFAULT_BUILDER_SITE_ID,
    );
    expect(ensureSiteDocument).not.toHaveBeenCalled();
    expect(writePageCanvas).not.toHaveBeenCalled();
    expect(writeSiteDocument).not.toHaveBeenCalled();
  });
});
