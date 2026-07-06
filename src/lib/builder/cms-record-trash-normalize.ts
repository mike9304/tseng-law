import {
  builderCmsRecordStatuses,
  type BuilderCmsRecord,
  type BuilderCmsTrashedRecord,
} from '@/lib/builder/cms-types';

export function normalizeBuilderCmsTrashedRecords(input: unknown): BuilderCmsTrashedRecord[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((entry) => {
    const normalized = normalizeBuilderCmsTrashedRecord(entry);
    return normalized ? [normalized] : [];
  });
}

function normalizeBuilderCmsTrashedRecord(input: unknown): BuilderCmsTrashedRecord | null {
  if (!isObjectRecord(input) || !isBuilderCmsRecord(input.record)) return null;
  const deletedAt = typeof input.deletedAt === 'string' && input.deletedAt.trim()
    ? input.deletedAt
    : input.record.updatedAt;
  const deletedBy = typeof input.deletedBy === 'string' && input.deletedBy.trim()
    ? input.deletedBy.trim().slice(0, 120)
    : 'Admin';
  return {
    record: input.record,
    deletedAt,
    deletedBy,
  };
}

function isBuilderCmsRecord(input: unknown): input is BuilderCmsRecord {
  if (!isObjectRecord(input)) return false;
  return typeof input.recordId === 'string'
    && typeof input.status === 'string'
    && builderCmsRecordStatuses.some((status) => status === input.status)
    && isObjectRecord(input.fields)
    && typeof input.createdAt === 'string'
    && typeof input.updatedAt === 'string';
}

function isObjectRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}
