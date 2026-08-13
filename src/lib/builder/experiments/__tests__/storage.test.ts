import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __setExperimentMetricClaimRootForTests,
  claimExperimentMetricOnce,
} from '@/lib/builder/experiments/metric-idempotency';
import {
  getExperiment,
  incrementExperimentMetric,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';

const experiment: Experiment = {
  experimentId: 'exp_cas_metric',
  name: 'CAS metrics',
  targetPath: '/ko',
  variants: [
    { variantId: 'control', label: 'Control', weight: 50 },
    { variantId: 'variant', label: 'Variant', weight: 50 },
  ],
  goalEvent: 'cta-click',
  status: 'running',
  metrics: emptyMetrics(),
  createdAt: '2026-07-31T00:00:00.000Z',
  updatedAt: '2026-07-31T00:00:00.000Z',
};

describe('experiment metric CAS storage', () => {
  let root = '';

  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'experiment-cas-storage-'));
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('EXPERIMENTS_FILE_STORE_ROOT', path.join(root, 'records'));
    __setExperimentMetricClaimRootForTests(path.join(root, 'claims'));
    await saveExperiment(structuredClone(experiment));
  });

  afterEach(async () => {
    __setExperimentMetricClaimRootForTests(null);
    vi.unstubAllEnvs();
    await rm(root, { recursive: true, force: true });
  });

  it('persists every distinct concurrent metric increment without an RMW loss', async () => {
    // All calls are released together. File CAS may serialize a winner at its
    // lock, or retry a stale read; either way every independently claimed
    // session contributes exactly once to the durable final record.
    const sessions = ['session-a', 'session-b'];
    await Promise.all(sessions.map(async (sessionId) => {
      const claim = await claimExperimentMetricOnce({
        experimentId: experiment.experimentId,
        kind: 'exposure',
        sessionId,
      });
      expect(claim.claimed).toBe(true);
      await incrementExperimentMetric({
        experimentId: experiment.experimentId,
        variantId: 'variant',
        kind: 'exposure',
      });
    }));

    await expect(getExperiment(experiment.experimentId)).resolves.toMatchObject({
      metrics: { exposures: { variant: sessions.length } },
    });
  });

  it('keeps the persistent idempotency marker as a same-session dedupe guard', async () => {
    const input = {
      experimentId: experiment.experimentId,
      kind: 'conversion' as const,
      sessionId: 'same-session',
      scope: 'cta-click:2026-07-31',
    };
    const [first, second] = await Promise.all([
      claimExperimentMetricOnce(input),
      claimExperimentMetricOnce(input),
    ]);

    const claimed = [first, second].filter((result) => result.claimed);
    expect(claimed).toHaveLength(1);
    await incrementExperimentMetric({
      experimentId: experiment.experimentId,
      variantId: 'variant',
      kind: 'conversion',
    });
    await expect(getExperiment(experiment.experimentId)).resolves.toMatchObject({
      metrics: { conversions: { variant: 1 } },
    });
  });

  it('fails closed for a production metric mutation without Blob storage', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(incrementExperimentMetric({
      experimentId: experiment.experimentId,
      variantId: 'variant',
      kind: 'exposure',
    })).rejects.toThrow('Blob token is required for production experiment metrics');
  });
});
