import crypto from 'node:crypto';
import type { Experiment, ExperimentVariant } from './types';

/**
 * PR #10 — Deterministic variant assignment.
 *
 * A user's variant is decided by hashing `${experimentId}:${sessionId}`,
 * mapping the first 6 hex digits into [0, totalWeight), and walking the
 * variant list. The same `sessionId` always lands on the same variant for
 * a given experiment, so users see a consistent UI across requests.
 */
export function assignVariant(experiment: Experiment, sessionId: string): ExperimentVariant | null {
  if (experiment.variants.length === 0) return null;
  const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight <= 0) return null;
  const digest = crypto.createHash('sha256').update(`${experiment.experimentId}:${sessionId}`).digest('hex');
  const bucket = parseInt(digest.slice(0, 8), 16) % totalWeight;
  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) return variant;
  }
  return experiment.variants[experiment.variants.length - 1];
}
