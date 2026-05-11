import { z } from 'zod';

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface ExperimentVariant {
  variantId: string;
  label: string;
  /** Integer weight; the runtime allocates traffic proportional to weight. */
  weight: number;
  /** Optional override pageId. When set, the page renderer can swap doc. */
  pageId?: string;
  /** Free-form data the page renderer can read (e.g. CTA copy override). */
  overrides?: Record<string, unknown>;
}

export interface ExperimentMetrics {
  /** sessionId hits per variant. */
  exposures: Record<string, number>;
  /** Conversion events per variant. */
  conversions: Record<string, number>;
}

export interface Experiment {
  experimentId: string;
  name: string;
  description?: string;
  /** Target site path (e.g. '/ko/services'). Empty string = site-wide. */
  targetPath: string;
  variants: ExperimentVariant[];
  /** Free-form conversion goal name; emitted via /api/experiments/event. */
  goalEvent: string;
  status: ExperimentStatus;
  startedAt?: string;
  endedAt?: string;
  metrics: ExperimentMetrics;
  createdAt: string;
  updatedAt: string;
}

export const variantSchema = z.object({
  variantId: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  weight: z.number().int().min(1).max(100),
  pageId: z.string().trim().min(1).max(160).optional(),
  overrides: z.record(z.string(), z.unknown()).optional(),
});

export const experimentCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  targetPath: z.string().trim().max(500).default(''),
  variants: z.array(variantSchema).min(2).max(6),
  goalEvent: z.string().trim().min(1).max(80),
});

export const experimentUpdateSchema = experimentCreateSchema.partial().extend({
  status: z.enum(['draft', 'running', 'paused', 'completed']).optional(),
});

export function emptyMetrics(): ExperimentMetrics {
  return { exposures: {}, conversions: {} };
}
