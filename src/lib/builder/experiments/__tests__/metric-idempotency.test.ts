import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __setExperimentMetricClaimRootForTests,
  claimExperimentMetricOnce,
} from '@/lib/builder/experiments/metric-idempotency';

describe('experiment metric idempotency claims', () => {
  let root = '';

  beforeEach(async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    root = await mkdtemp(path.join(os.tmpdir(), 'experiment-metric-claims-'));
    __setExperimentMetricClaimRootForTests(root);
  });

  afterEach(async () => {
    __setExperimentMetricClaimRootForTests(null);
    vi.unstubAllEnvs();
    await rm(root, { recursive: true, force: true });
  });

  it('atomically grants exactly one concurrent claim for the same metric', async () => {
    const input = {
      experimentId: 'exp-1',
      kind: 'exposure' as const,
      sessionId: 'session-a',
    };

    const claims = await Promise.all(
      Array.from({ length: 12 }, () => claimExperimentMetricOnce(input)),
    );

    expect(claims.filter((claim) => claim.claimed)).toHaveLength(1);
    expect(claims.filter((claim) => !claim.claimed)).toHaveLength(11);
  });

  it('allows a failed metric write to release its claim for retry', async () => {
    const input = {
      experimentId: 'exp-1',
      kind: 'conversion' as const,
      sessionId: 'session-a',
      scope: 'cta-click:2026-07-30',
    };
    const first = await claimExperimentMetricOnce(input);
    expect(first.claimed).toBe(true);

    await first.release();

    await expect(claimExperimentMetricOnce(input)).resolves.toMatchObject({
      claimed: true,
    });
  });

  it('fails closed in production without a durable Blob backend', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(claimExperimentMetricOnce({
      experimentId: 'exp-1',
      kind: 'exposure',
      sessionId: 'session-a',
    })).rejects.toThrow(
      'BLOB_READ_WRITE_TOKEN is required for durable experiment metric claims',
    );
  });
});
