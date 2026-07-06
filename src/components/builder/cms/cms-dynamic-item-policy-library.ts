import type { LinkedDynamicItemPage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type {
  CmsDynamicItemLifecyclePolicyTemplate,
  CmsDynamicItemLifecyclePolicyTemplateSource,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';

export type CmsDynamicItemPolicyLibraryEntry = CmsDynamicItemLifecyclePolicyTemplate & {
  readonly sourceTitle: string;
  readonly usageCount: number;
  readonly updatedAt?: string;
  readonly updatedBy?: string;
};

export type ResolveCmsDynamicItemPolicyLibraryEntriesInput = {
  readonly pages: readonly LinkedDynamicItemPage[];
  readonly policies: readonly CmsDynamicItemLifecyclePolicyTemplateSource[];
};

export function resolveCmsDynamicItemPolicyLibraryEntries({
  pages,
  policies,
}: ResolveCmsDynamicItemPolicyLibraryEntriesInput): readonly CmsDynamicItemPolicyLibraryEntry[] {
  const pagesById = new Map(pages.map((page) => [page.pageId, page]));
  const reusablePolicies = policies.flatMap((policy) => {
    const pageId = policy.pageId?.trim();
    const policyName = policy.policyName?.trim();
    const sourceFieldKey = policy.sourceFieldKey?.trim();
    const slugPattern = policy.slugPattern?.trim();
    const slugConflictRule = policy.slugConflictRule;
    const page = pageId ? pagesById.get(pageId) : undefined;
    if (!page || !pageId || !policyName || !sourceFieldKey || !slugPattern || !slugConflictRule) return [];
    return [{
      pageId,
      policyName,
      sourceFieldKey,
      slugPattern,
      slugConflictRule,
      sourceTitle: page.title,
      updatedAt: policy.updatedAt,
      updatedBy: policy.updatedBy,
    }];
  });

  return reusablePolicies.map((policy) => ({
    ...policy,
    usageCount: countMatchingPolicies(reusablePolicies, policy),
  }));
}

function countMatchingPolicies(
  policies: readonly Omit<CmsDynamicItemPolicyLibraryEntry, 'usageCount'>[],
  target: Omit<CmsDynamicItemPolicyLibraryEntry, 'usageCount'>,
): number {
  return policies.filter((policy) => (
    policy.policyName === target.policyName
    && policy.sourceFieldKey === target.sourceFieldKey
    && policy.slugPattern === target.slugPattern
    && policy.slugConflictRule === target.slugConflictRule
  )).length;
}
