import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  type BuilderCmsAccessOptions,
  canAccessBuilderCmsCollection,
  normalizeCmsCollections,
} from '@/lib/builder/cms-editable';
import { normalizeBuilderCmsTrashedRecords } from '@/lib/builder/cms-record-trash-normalize';
import {
  type BuilderCmsCollection,
  type BuilderCmsPermissionActor,
  type BuilderCmsTrashedRecord,
} from '@/lib/builder/cms-types';

export type CmsRecordTrashCollectionState = {
  readonly collection: BuilderCmsCollection;
  readonly rawIndex: number;
  readonly trashedRecords: readonly BuilderCmsTrashedRecord[];
};

export function findCmsRecordTrashCollectionState(
  rawCollections: readonly BuilderCmsCollection[],
  collectionId: string,
): CmsRecordTrashCollectionState | null {
  const collection = normalizeCmsCollections(rawCollections).find(
    (candidate) => candidate.collectionId === collectionId,
  );
  const rawIndex = rawCollections.findIndex((candidate) => candidate.collectionId === collectionId);
  const rawCollection = rawIndex >= 0 ? rawCollections[rawIndex] : undefined;
  if (!collection || !rawCollection) return null;
  return {
    collection,
    rawIndex,
    trashedRecords: normalizeBuilderCmsTrashedRecords(rawCollection.trashedRecords),
  };
}

export function writeCmsRecordTrashCollection(
  site: { cmsCollections?: BuilderCmsCollection[]; updatedAt: string },
  rawCollections: readonly BuilderCmsCollection[],
  rawIndex: number,
  collection: BuilderCmsCollection,
  now: string,
): void {
  site.cmsCollections = rawCollections.map((candidate, candidateIndex) => (
    candidateIndex === rawIndex ? collection : candidate
  ));
  site.updatedAt = now;
}

export function assertCmsRecordTrashAccess(
  collection: BuilderCmsCollection,
  action: 'create' | 'delete',
  actor: BuilderCmsPermissionActor,
): void {
  if (!canAccessBuilderCmsCollection(collection, action, actor)) {
    throw new BuilderCmsPermissionError(action, actor);
  }
}

export function resolveCmsRecordTrashActor(options: BuilderCmsAccessOptions): BuilderCmsPermissionActor {
  return options.actor ?? 'admin';
}

export function resolveCmsRecordTrashActorLabel(options: BuilderCmsAccessOptions): string {
  const label = options.actorLabel?.trim();
  if (label) return label.slice(0, 120);
  switch (options.actor) {
    case 'staff':
      return 'Staff';
    case 'member':
      return 'Member';
    case 'public':
      return 'Public';
    case 'admin':
    case undefined:
      return 'Admin';
    default:
      return assertNever(options.actor);
  }
}

export function normalizeTrashRecordIdList(input: unknown): string[] {
  if (!Array.isArray(input)) {
    throw new BuilderCmsValidationError('recordIds must be an array.');
  }
  const recordIds = input.map((value, index) => normalizeTrashRequiredId(value, `recordIds[${index}]`));
  const uniqueRecordIds = [...new Set(recordIds)];
  if (uniqueRecordIds.length === 0) {
    throw new BuilderCmsValidationError('At least one record ID is required.');
  }
  return uniqueRecordIds;
}

function normalizeTrashRequiredId(input: unknown, label: string): string {
  if (typeof input !== 'string' || !/^[a-z][a-z0-9-]{1,62}$/.test(input.trim())) {
    throw new BuilderCmsValidationError(`${label} must use lowercase letters, numbers, and hyphens.`);
  }
  return input.trim();
}

function assertNever(value: never): never {
  throw new Error(`Unhandled CMS record trash actor: ${String(value)}`);
}
