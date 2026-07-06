'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CmsDynamicItemLifecyclePolicyPresets } from '@/components/builder/cms/CmsDynamicItemLifecyclePolicyPresets';
import { CmsDynamicItemRouteMutationButton } from '@/components/builder/cms/CmsDynamicItemRouteMutationButton';
import { resolveCmsDynamicItemReusablePolicyTemplates } from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';
import type {
  LinkedDynamicItemPage,
  LinkedDynamicItemRouteCoverage,
} from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import { listBuilderCmsSlugSourceFields } from '@/lib/builder/cms-slug-source-fields';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemRouteActionsProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collection: BuilderCmsCollectionDetail;
  readonly page: LinkedDynamicItemPage;
  readonly coverage: LinkedDynamicItemRouteCoverage;
};

export function CmsDynamicItemRouteActions({
  locale,
  siteId,
  collection,
  page,
  coverage,
}: CmsDynamicItemRouteActionsProps) {
  const publishableHeldBackCount = coverage.publishableHeldBackRecordIds.length;
  const archivableHeldBackCount = coverage.archivableHeldBackRecordIds.length;
  const restorableArchivedCount = coverage.restorableArchivedRecordIds.length;
  const deletableArchivedCount = coverage.deletableArchivedRecordIds.length;
  const restorableDeletedRecordIds = (collection.trashedRecords ?? []).map((entry) => entry.record.recordId);
  const restorableDeletedCount = restorableDeletedRecordIds.length;
  const missingSlugCount = coverage.missingSlugRecordIds.length;
  const slugConflictCount = coverage.slugConflictRecordIds.length;
  const routePolicies = collection.dynamicItemRoutePolicies ?? [];
  const initialPolicyOptions = routePolicies.find((policy) => policy.pageId === page.pageId);
  const reusablePolicyTemplates = resolveCmsDynamicItemReusablePolicyTemplates(routePolicies, page.pageId);
  const hasReviewLink = Boolean(
    coverage.draftReviewLink || coverage.missingSlugReviewLink || coverage.slugConflictReviewLink,
  );
  const hasRouteAction = hasReviewLink
    || missingSlugCount > 0
    || slugConflictCount > 0
    || publishableHeldBackCount > 0
    || archivableHeldBackCount > 0
    || restorableArchivedCount > 0
    || deletableArchivedCount > 0
    || restorableDeletedCount > 0
    || Boolean(initialPolicyOptions)
    || reusablePolicyTemplates.length > 0;
  if (!hasRouteAction) return null;

  const slugSourceFields = listBuilderCmsSlugSourceFields(collection, coverage.slugField);
  const missingSlugPreviewRecord = findRouteMutationPreviewRecord(collection, coverage.missingSlugRecordIds);
  const slugConflictPreviewRecord = findRouteMutationPreviewRecord(collection, coverage.slugConflictRecordIds);
  const preparePolicyPreviewRecord = missingSlugPreviewRecord ?? slugConflictPreviewRecord;
  const hasPreparePolicy = missingSlugCount > 0 || slugConflictCount > 0 || publishableHeldBackCount > 0;

  return (
    <div style={repairActionsStyle} data-cms-dynamic-item-route-repair={page.pageId}>
      <CmsDynamicItemLifecyclePolicyPresets
        collectionId={collection.collectionId}
        coverage={coverage}
        initialPolicyOptions={initialPolicyOptions}
        locale={locale}
        pageId={page.pageId}
        previewFields={preparePolicyPreviewRecord?.fields}
        previewRecordId={preparePolicyPreviewRecord?.recordId}
        reusablePolicyTemplates={reusablePolicyTemplates}
        siteId={siteId}
        sourceFields={slugSourceFields}
      />
      {missingSlugCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="generate-missing-slugs"
          locale={locale}
          pageId={page.pageId}
          previewFields={missingSlugPreviewRecord?.fields}
          previewRecordId={missingSlugPreviewRecord?.recordId}
          recordIds={coverage.missingSlugRecordIds}
          showSlugOptions={!hasPreparePolicy}
          siteId={siteId}
          slugField={coverage.slugField}
          sourceFields={slugSourceFields}
        />
      ) : null}
      {slugConflictCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="repair-slug-conflicts"
          locale={locale}
          pageId={page.pageId}
          previewFields={slugConflictPreviewRecord?.fields}
          previewRecordId={slugConflictPreviewRecord?.recordId}
          recordIds={coverage.slugConflictRecordIds}
          showSlugOptions={!hasPreparePolicy}
          siteId={siteId}
          slugField={coverage.slugField}
          sourceFields={slugSourceFields}
        />
      ) : null}
      {publishableHeldBackCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="publish-held-back"
          locale={locale}
          pageId={page.pageId}
          recordIds={coverage.publishableHeldBackRecordIds}
          siteId={siteId}
          slugField={coverage.slugField}
        />
      ) : null}
      {archivableHeldBackCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="archive-held-back"
          locale={locale}
          pageId={page.pageId}
          recordIds={coverage.archivableHeldBackRecordIds}
          siteId={siteId}
          slugField={coverage.slugField}
        />
      ) : null}
      {restorableArchivedCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="restore-archived"
          locale={locale}
          pageId={page.pageId}
          recordIds={coverage.restorableArchivedRecordIds}
          siteId={siteId}
          slugField={coverage.slugField}
        />
      ) : null}
      {deletableArchivedCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="delete-archived"
          locale={locale}
          pageId={page.pageId}
          recordIds={coverage.deletableArchivedRecordIds}
          siteId={siteId}
          slugField={coverage.slugField}
        />
      ) : null}
      {restorableDeletedCount ? (
        <CmsDynamicItemRouteMutationButton
          collectionId={collection.collectionId}
          kind="restore-deleted"
          locale={locale}
          pageId={page.pageId}
          recordIds={restorableDeletedRecordIds}
          siteId={siteId}
          slugField={coverage.slugField}
        />
      ) : null}
      {coverage.draftReviewLink ? (
        <Link
          href={coverage.draftReviewLink.href}
          className="builder-link-inline"
          data-cms-dynamic-item-draft-review={page.pageId}
        >
          Review first draft record
        </Link>
      ) : null}
      {coverage.missingSlugReviewLink ? (
        <Link
          href={coverage.missingSlugReviewLink.href}
          className="builder-link-inline"
          data-cms-dynamic-item-missing-slug-review={page.pageId}
        >
          Fix first missing slug
        </Link>
      ) : null}
      {coverage.slugConflictReviewLink ? (
        <Link
          href={coverage.slugConflictReviewLink.href}
          className="builder-link-inline"
          data-cms-dynamic-item-slug-conflict-review={page.pageId}
        >
          Review first slug conflict
        </Link>
      ) : null}
    </div>
  );
}

function findRouteMutationPreviewRecord(
  collection: BuilderCmsCollectionDetail,
  recordIds: readonly string[],
) {
  const targetRecordIds = new Set(recordIds);
  return collection.records.find((record) => targetRecordIds.has(record.recordId));
}

const repairActionsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  marginTop: 6,
  maxWidth: '100%',
} satisfies CSSProperties;
