import { describe, expect, it } from 'vitest';
import { assignVariant } from '@/lib/builder/experiments/assign';
import { emptyMetrics } from '@/lib/builder/experiments/types';
import type { Experiment } from '@/lib/builder/experiments/types';

function makeExperiment(weights: Array<{ id: string; weight: number }>): Experiment {
  return {
    experimentId: 'exp-test',
    name: 'test',
    targetPath: '',
    variants: weights.map((w) => ({ variantId: w.id, label: w.id, weight: w.weight })),
    goalEvent: 'goal',
    status: 'running',
    metrics: emptyMetrics(),
    createdAt: '2026-05-11T00:00:00Z',
    updatedAt: '2026-05-11T00:00:00Z',
  };
}

describe('assignVariant', () => {
  it('produces a sticky assignment for the same sessionId', () => {
    const exp = makeExperiment([
      { id: 'a', weight: 50 },
      { id: 'b', weight: 50 },
    ]);
    const a = assignVariant(exp, 'session-1');
    const b = assignVariant(exp, 'session-1');
    expect(a?.variantId).toBe(b?.variantId);
  });

  it('distributes proportional to weight over many sessions', () => {
    const exp = makeExperiment([
      { id: 'control', weight: 80 },
      { id: 'test', weight: 20 },
    ]);
    let control = 0;
    for (let i = 0; i < 2000; i++) {
      const variant = assignVariant(exp, `sess-${i}`);
      if (variant?.variantId === 'control') control += 1;
    }
    const controlRatio = control / 2000;
    expect(controlRatio).toBeGreaterThan(0.7);
    expect(controlRatio).toBeLessThan(0.9);
  });

  it('returns null when there are no variants', () => {
    const exp = makeExperiment([]);
    expect(assignVariant(exp, 'session-1')).toBeNull();
  });

  it('returns null when total weight is zero', () => {
    const exp = makeExperiment([{ id: 'a', weight: 0 }, { id: 'b', weight: 0 }]);
    expect(assignVariant(exp, 'session-1')).toBeNull();
  });
});
