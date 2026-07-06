import { isPublishCandidateStatus } from '@/lib/builder/cms-publish-readiness';
import {
  bulkUpdateEditableBuilderCmsRecordStatus,
  normalizeCmsCollections,
} from '@/lib/builder/cms-editable';
import type { BuilderCmsCollection, BuilderCmsRecord } from '@/lib/builder/cms-types';
import { bulkRepairEditableBuilderCmsRecordSlugConflicts } from '@/lib/builder/cms-slug-conflict-repair';
import { bulkGenerateEditableBuilderCmsRecordSlugs, readSlugValue } from '@/lib/builder/cms-slug-repair';
import {
  listCmsDynamicItemScheduledPolicies,
  writeCmsDynamicItemScheduledPolicyJob,
} from '@/lib/builder/cms-dynamic-item-scheduled-policy-store';
import type {
  CmsDynamicItemScheduledPolicyJob,
  CmsDynamicItemScheduledPolicyRunResult,
} from '@/lib/builder/cms-dynamic-item-scheduled-policy-types';
import { readSiteDocument } from '@/lib/builder/site/persistence';

type PrepareRouteCoverage = {
  readonly missingSlugRecordIds: readonly string[];
  readonly slugConflictRecordIds: readonly string[];
  readonly publishableHeldBackRecordIds: readonly string[];
};

type AppliedPolicySummary = {
  readonly generated: number;
  readonly repaired: number;
  readonly published: number;
};

export async function runDueCmsDynamicItemScheduledPolicies(
  options: { readonly now?: Date; readonly limit?: number } = {},
): Promise<CmsDynamicItemScheduledPolicyRunResult> {
  const nowMs = options.now?.getTime() ?? Date.now();
  const limit = Math.max(1, options.limit ?? 20);
  const allJobs = await listCmsDynamicItemScheduledPolicies();
  const dueJobs = allJobs
    .filter((job) => job.status === 'scheduled' && Date.parse(job.scheduledAt) <= nowMs)
    .sort((left, right) => Date.parse(left.scheduledAt) - Date.parse(right.scheduledAt))
    .slice(0, limit);
  const touched: CmsDynamicItemScheduledPolicyJob[] = [];
  let applied = 0;
  let failed = 0;

  for (const job of dueJobs) {
    const startedAt = new Date().toISOString();
    await writeCmsDynamicItemScheduledPolicyJob({
      ...job,
      status: 'running',
      attempts: job.attempts + 1,
      updatedAt: startedAt,
      lastError: undefined,
    });
    try {
      const summary = await applyScheduledPreparePolicy(job);
      const nextJob = await writeCmsDynamicItemScheduledPolicyJob({
        ...job,
        status: 'applied',
        attempts: job.attempts + 1,
        updatedAt: new Date().toISOString(),
        lastError: undefined,
        generated: summary.generated,
        repaired: summary.repaired,
        published: summary.published,
      });
      touched.push(nextJob);
      applied += 1;
    } catch (error) {
      const nextJob = await writeCmsDynamicItemScheduledPolicyJob({
        ...job,
        status: 'failed',
        attempts: job.attempts + 1,
        updatedAt: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : 'Scheduled CMS lifecycle policy failed.',
      });
      touched.push(nextJob);
      failed += 1;
    }
  }

  return {
    checked: allJobs.length,
    due: dueJobs.length,
    applied,
    failed,
    skipped: Math.max(0, allJobs.length - dueJobs.length),
    jobs: touched,
  };
}

async function applyScheduledPreparePolicy(
  job: CmsDynamicItemScheduledPolicyJob,
): Promise<AppliedPolicySummary> {
  const site = await readSiteDocument(job.siteId, job.locale);
  const collection = normalizeCmsCollections(site.cmsCollections)
    .find((candidate) => candidate.collectionId === job.collectionId);
  const page = site.pages.find((candidate) => candidate.pageId === job.pageId);
  const dynamicCollectionId = page?.dynamicItem?.cmsCollectionId ?? page?.dynamicItem?.collectionId;
  if (!collection || !page?.dynamicItem || dynamicCollectionId !== job.collectionId) {
    throw new Error('Scheduled CMS dynamic item policy target no longer exists.');
  }

  const coverage = resolvePrepareRouteCoverage(collection, page.dynamicItem.slugField);
  let generated = 0;
  let repaired = 0;
  let published = 0;
  const access = { actor: 'admin' as const, actorLabel: job.requestedBy ?? 'Scheduled lifecycle policy' };

  if (coverage.missingSlugRecordIds.length) {
    const result = await bulkGenerateEditableBuilderCmsRecordSlugs(
      job.siteId,
      job.locale,
      job.collectionId,
      coverage.missingSlugRecordIds,
      page.dynamicItem.slugField,
      access,
      job.policy.sourceFieldKey,
      job.policy.slugPattern,
    );
    generated = result?.updated ?? 0;
  }
  if (coverage.slugConflictRecordIds.length) {
    const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
      job.siteId,
      job.locale,
      job.collectionId,
      coverage.slugConflictRecordIds,
      page.dynamicItem.slugField,
      access,
      job.policy.sourceFieldKey,
      job.policy.slugPattern,
      job.policy.slugConflictRule,
    );
    repaired = result?.updated ?? 0;
  }
  if (coverage.publishableHeldBackRecordIds.length) {
    const result = await bulkUpdateEditableBuilderCmsRecordStatus(
      job.siteId,
      job.locale,
      job.collectionId,
      coverage.publishableHeldBackRecordIds,
      'published',
      undefined,
      access,
    );
    published = result?.updated ?? 0;
  }
  return { generated, repaired, published };
}

function resolvePrepareRouteCoverage(
  collection: BuilderCmsCollection,
  slugField: string,
): PrepareRouteCoverage {
  const missingSlugRecordIds: string[] = [];
  const slugConflictRecordIds: string[] = [];
  const publishableHeldBackRecordIds: string[] = [];
  const seenSlugs = new Set<string>();
  for (const record of collection.records) {
    if (record.status === 'archived') continue;
    const slug = readRecordSlug(record, slugField);
    if (!slug) {
      missingSlugRecordIds.push(record.recordId);
      continue;
    }
    if (seenSlugs.has(slug)) {
      slugConflictRecordIds.push(record.recordId);
      continue;
    }
    seenSlugs.add(slug);
    if (record.status !== 'published' && isPublishCandidateStatus(record.status)) {
      publishableHeldBackRecordIds.push(record.recordId);
    }
  }
  return { missingSlugRecordIds, slugConflictRecordIds, publishableHeldBackRecordIds };
}

function readRecordSlug(record: BuilderCmsRecord, slugField: string): string {
  return readSlugValue(record.fields[slugField]);
}
