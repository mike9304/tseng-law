import type { Experiment, ExperimentVariant } from './types';

/**
 * PR #10 — Two-proportion z-test for conversion-rate differences.
 *
 * Computes pairwise comparisons between every non-control variant and the
 * first variant in the list (treated as control). Two-sided p-value is
 * approximated via the standard normal CDF using a numerically stable
 * erf approximation. Returns absolute uplift, p-value, and a confidence
 * label ('significant' | 'inconclusive' | 'insufficient').
 */

function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26 — max error ~1.5e-7.
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1
    - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
      * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

export interface VariantStats {
  variantId: string;
  label: string;
  exposures: number;
  conversions: number;
  rate: number;
  uplift?: number;
  pValue?: number;
  confidence: 'control' | 'significant' | 'inconclusive' | 'insufficient';
}

function rateOf(variant: ExperimentVariant, experiment: Experiment): { rate: number; n: number; conv: number } {
  const n = experiment.metrics.exposures[variant.variantId] ?? 0;
  const conv = experiment.metrics.conversions[variant.variantId] ?? 0;
  return { rate: n > 0 ? conv / n : 0, n, conv };
}

export function computeExperimentStats(experiment: Experiment): VariantStats[] {
  if (experiment.variants.length === 0) return [];
  const control = experiment.variants[0];
  const controlStats = rateOf(control, experiment);
  const out: VariantStats[] = [
    {
      variantId: control.variantId,
      label: control.label,
      exposures: controlStats.n,
      conversions: controlStats.conv,
      rate: controlStats.rate,
      confidence: 'control',
    },
  ];

  for (const variant of experiment.variants.slice(1)) {
    const stats = rateOf(variant, experiment);
    const n1 = controlStats.n;
    const n2 = stats.n;
    if (n1 < 30 || n2 < 30) {
      out.push({
        variantId: variant.variantId,
        label: variant.label,
        exposures: stats.n,
        conversions: stats.conv,
        rate: stats.rate,
        confidence: 'insufficient',
        uplift: stats.rate - controlStats.rate,
      });
      continue;
    }
    const p1 = controlStats.rate;
    const p2 = stats.rate;
    const pPool = (controlStats.conv + stats.conv) / (n1 + n2);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
    const z = se > 0 ? (p2 - p1) / se : 0;
    const pValue = 2 * (1 - normalCdf(Math.abs(z)));
    out.push({
      variantId: variant.variantId,
      label: variant.label,
      exposures: stats.n,
      conversions: stats.conv,
      rate: stats.rate,
      uplift: p2 - p1,
      pValue,
      confidence: pValue < 0.05 ? 'significant' : 'inconclusive',
    });
  }

  return out;
}
