import { describe, expect, it } from 'vitest';
import { computeExperimentStats } from '@/lib/builder/experiments/stats';
import { emptyMetrics } from '@/lib/builder/experiments/types';
import type { Experiment } from '@/lib/builder/experiments/types';

function makeExperiment(metrics: { variants: Array<{ id: string; n: number; conv: number }> }): Experiment {
  const exp: Experiment = {
    experimentId: 'exp-stats',
    name: 'stats',
    targetPath: '',
    variants: metrics.variants.map((v) => ({ variantId: v.id, label: v.id, weight: 50 })),
    goalEvent: 'goal',
    status: 'running',
    metrics: emptyMetrics(),
    createdAt: '2026-05-11T00:00:00Z',
    updatedAt: '2026-05-11T00:00:00Z',
  };
  for (const v of metrics.variants) {
    exp.metrics.exposures[v.id] = v.n;
    exp.metrics.conversions[v.id] = v.conv;
  }
  return exp;
}

describe('computeExperimentStats', () => {
  it('marks control row with confidence=control', () => {
    const exp = makeExperiment({
      variants: [
        { id: 'a', n: 100, conv: 5 },
        { id: 'b', n: 100, conv: 10 },
      ],
    });
    const rows = computeExperimentStats(exp);
    expect(rows[0].confidence).toBe('control');
  });

  it('reports significance when conversion gap is large with enough samples', () => {
    const exp = makeExperiment({
      variants: [
        { id: 'control', n: 1000, conv: 50 },
        { id: 'test', n: 1000, conv: 120 },
      ],
    });
    const rows = computeExperimentStats(exp);
    expect(rows[1].confidence).toBe('significant');
    expect(rows[1].pValue).toBeLessThan(0.05);
    expect(rows[1].uplift).toBeGreaterThan(0.05);
  });

  it('reports insufficient when sample size below threshold', () => {
    const exp = makeExperiment({
      variants: [
        { id: 'control', n: 10, conv: 1 },
        { id: 'test', n: 10, conv: 5 },
      ],
    });
    const rows = computeExperimentStats(exp);
    expect(rows[1].confidence).toBe('insufficient');
  });

  it('reports inconclusive when uplift is small relative to noise', () => {
    const exp = makeExperiment({
      variants: [
        { id: 'control', n: 1000, conv: 100 },
        { id: 'test', n: 1000, conv: 102 },
      ],
    });
    const rows = computeExperimentStats(exp);
    expect(rows[1].confidence).toBe('inconclusive');
    expect(rows[1].pValue).toBeGreaterThan(0.05);
  });
});
