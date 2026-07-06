import type { BuilderCmsRecord, BuilderCmsRecordStatus } from '@/lib/builder/cms-types';

export interface BuilderCmsPublishReadinessSummary {
  total: number;
  published: number;
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
  archived: number;
  publishable: number;
}

export function summarizeBuilderCmsPublishReadiness(
  records: Pick<BuilderCmsRecord, 'status'>[],
): BuilderCmsPublishReadinessSummary {
  const summary: BuilderCmsPublishReadinessSummary = {
    total: records.length,
    published: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
    publishable: 0,
  };

  for (const record of records) {
    summary[record.status] += 1;
  }

  summary.publishable =
    summary.draft +
    summary.pending +
    summary.approved +
    summary.rejected;

  return summary;
}

export function getBuilderCmsPublishCandidateRecordIds(
  records: Pick<BuilderCmsRecord, 'recordId' | 'status'>[],
  options: {
    recordIds?: string[];
  } = {},
): string[] {
  const recordIdSet = options.recordIds ? new Set(options.recordIds) : null;
  return records
    .filter((record) => (recordIdSet ? recordIdSet.has(record.recordId) : true))
    .filter((record) => isPublishCandidateStatus(record.status))
    .map((record) => record.recordId);
}

export function isPublishCandidateStatus(status: BuilderCmsRecordStatus): boolean {
  return status !== 'published' && status !== 'archived';
}
