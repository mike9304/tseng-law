import type { LinkedDynamicItemRouteCoverage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import {
  resolveCmsDynamicItemReusablePolicyTemplates,
  type CmsDynamicItemLifecyclePolicyTemplate,
  type CmsDynamicItemLifecyclePolicyTemplateSource,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';

export type CmsDynamicItemPolicyRolloutCandidate = {
  readonly pageId: string;
  readonly title: string;
  readonly coverage: LinkedDynamicItemRouteCoverage;
};

export type CmsDynamicItemPolicyRolloutTarget = {
  readonly pageId: string;
  readonly title: string;
};

export type ResolveCmsDynamicItemPolicyRolloutTargetsInput = {
  readonly candidates: readonly CmsDynamicItemPolicyRolloutCandidate[];
  readonly policies: readonly CmsDynamicItemLifecyclePolicyTemplateSource[];
};

export function resolveCmsDynamicItemPolicyRolloutTemplates(
  policies: readonly CmsDynamicItemLifecyclePolicyTemplateSource[],
): readonly CmsDynamicItemLifecyclePolicyTemplate[] {
  return resolveCmsDynamicItemReusablePolicyTemplates(policies, '');
}

export function resolveCmsDynamicItemPolicyRolloutTargets({
  candidates,
  policies,
}: ResolveCmsDynamicItemPolicyRolloutTargetsInput): readonly CmsDynamicItemPolicyRolloutTarget[] {
  const pageIdsWithPolicy = new Set(policies.flatMap((policy) => {
    const pageId = policy.pageId?.trim();
    return pageId ? [pageId] : [];
  }));
  return candidates.flatMap((candidate) => {
    if (pageIdsWithPolicy.has(candidate.pageId)) return [];
    if (!isCmsDynamicItemPolicyRolloutCoverageClean(candidate.coverage)) return [];
    return [{
      pageId: candidate.pageId,
      title: candidate.title,
    }];
  });
}

export function isCmsDynamicItemPolicyRolloutCoverageClean(
  coverage: LinkedDynamicItemRouteCoverage,
): boolean {
  return coverage.draftRecordCount === 0
    && coverage.archivedRecordCount === 0
    && coverage.missingSlugCount === 0
    && coverage.slugConflictCount === 0
    && coverage.publishableHeldBackRecordIds.length === 0
    && coverage.archivableHeldBackRecordIds.length === 0
    && coverage.restorableArchivedRecordIds.length === 0
    && coverage.deletableArchivedRecordIds.length === 0
    && coverage.missingSlugRecordIds.length === 0
    && coverage.slugConflictRecordIds.length === 0;
}
