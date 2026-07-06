/**
 * Publish gate — orchestrator.
 *
 * Runs every publish-gate check against the supplied canvas/page/site,
 * aggregates results, and returns a `PublishCheckSuite` that callers can
 * render or use to gate the publish action.
 */
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { readBuilderFunctions } from '@/lib/builder/dev/functions-model';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { checkCodeSlotDeployReadiness } from './code-slot-checks';
import type { CheckResult, PublishCheckSuite } from './check-types';
import {
  checkBrokenLinks,
  checkEmptyContent,
  checkFormTarget,
  checkH1Count,
  checkImageAlt,
  checkPrerenderReadiness,
  checkResponsiveOverflow,
  checkSeoMeta,
  checkStaleDatasetBindings,
} from './checks';
import { checkTranslationPublishWarnings } from './translation-checks';

export type { CheckCategory, CheckResult, CheckSeverity, PublishCheckSuite } from './check-types';

export async function runAllChecks(
  canvas: BuilderCanvasDocument,
  page?: BuilderPageMeta | null,
  site?: BuilderSiteDocument | null,
): Promise<PublishCheckSuite> {
  const functions = await readBuilderFunctions();
  const all: CheckResult[] = [
    ...checkEmptyContent(canvas),
    ...checkBrokenLinks(canvas, site),
    ...checkImageAlt(canvas),
    ...checkSeoMeta(page, site),
    ...checkStaleDatasetBindings(canvas),
    ...checkCodeSlotDeployReadiness(canvas, functions),
    ...checkTranslationPublishWarnings(page, site),
    ...checkPrerenderReadiness(page),
    ...checkFormTarget(canvas),
    ...checkResponsiveOverflow(canvas),
    ...checkH1Count(canvas),
  ];

  const blockerCount = all.filter((r) => r.severity === 'blocker').length;
  const warningCount = all.filter((r) => r.severity === 'warning').length;
  const infoCount = all.filter((r) => r.severity === 'info').length;

  return {
    results: all,
    hasBlocker: blockerCount > 0,
    blockerCount,
    warningCount,
    infoCount,
    checkedAt: new Date().toISOString(),
  };
}

export function groupBySeverity(suite: PublishCheckSuite): {
  blockers: CheckResult[];
  warnings: CheckResult[];
  infos: CheckResult[];
} {
  return {
    blockers: suite.results.filter((r) => r.severity === 'blocker'),
    warnings: suite.results.filter((r) => r.severity === 'warning'),
    infos: suite.results.filter((r) => r.severity === 'info'),
  };
}
