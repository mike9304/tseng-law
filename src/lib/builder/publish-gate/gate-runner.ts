/**
 * Publish gate — orchestrator.
 *
 * Runs every check in `checks.ts` against the supplied canvas/page/site,
 * aggregates results, and returns a `PublishCheckSuite` that callers can
 * render or use to gate the publish action.
 */
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  checkBrokenLinks,
  checkEmptyContent,
  checkFormTarget,
  checkH1Count,
  checkImageAlt,
  checkResponsiveOverflow,
  checkSeoMeta,
  type CheckResult,
  type PublishCheckSuite,
} from './checks';

export type { CheckResult, PublishCheckSuite, CheckSeverity, CheckCategory } from './checks';

export async function runAllChecks(
  canvas: BuilderCanvasDocument,
  page?: BuilderPageMeta | null,
  site?: BuilderSiteDocument | null,
): Promise<PublishCheckSuite> {
  const all: CheckResult[] = [
    ...checkEmptyContent(canvas),
    ...checkBrokenLinks(canvas, site),
    ...checkImageAlt(canvas),
    ...checkSeoMeta(page, site),
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
