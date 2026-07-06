/**
 * cms-binding-request.ts — pure validation/patch logic for dataset-binding PUT requests,
 * extracted so it can be node-tested without the API route or the 977-line editor component.
 *
 * WIX-PERFECT #6 Slice 3: lets the dataset-binding PUT accept a USER-collection binding
 * (`cmsCollectionId`) in addition to the built-in 3 targets. Built-in bindings validate
 * exactly as before (collectionId must be in the target's approved set); CMS bindings skip
 * that check (their collectionId is the user collection id, not a built-in) and carry
 * `cmsCollectionId` into the patch that `replaceBuilderPageDatasetBinding` persists.
 *
 * This is the correctness oracle for Slice 3 — the route and the editor both funnel through
 * the same shape this produces.
 */
import { isCmsCollectionTargetId } from '@/lib/builder/cms-collection-datasets';

export interface DatasetBindingRequestInput {
  targetId: string;
  collectionId?: string;
  cmsCollectionId?: string;
  mode?: string;
  limit?: number;
  filters?: unknown;
  sort?: unknown;
}

export interface DatasetBindingPatch {
  collectionId: string;
  mode?: string;
  limit?: number;
  filters?: unknown;
  sort?: unknown;
  cmsCollectionId?: string;
}

export type DatasetBindingRequestResult =
  | { ok: true; isCmsCollection: boolean; patch: DatasetBindingPatch }
  | { ok: false; error: string };

export interface BuiltinTargetConstraints {
  collectionIds: readonly string[];
  modeOptions: readonly string[];
}

/**
 * Validate a binding request and produce the patch to persist.
 *
 * - CMS-collection binding (cmsCollectionId set, or a `cms.<id>.list` targetId): the user
 *   collection id is authoritative; built-in collectionId/mode checks are skipped; the patch
 *   carries cmsCollectionId so the render path branches to the user collection.
 * - Built-in binding: collectionId must be in constraints.collectionIds and mode in
 *   constraints.modeOptions (unchanged from the original route behavior).
 */
export function buildDatasetBindingPatch(
  input: DatasetBindingRequestInput,
  builtin: BuiltinTargetConstraints,
): DatasetBindingRequestResult {
  const isCms = Boolean(input.cmsCollectionId) || isCmsCollectionTargetId(input.targetId);

  if (typeof input.limit === 'number' && input.limit < 0) {
    return { ok: false, error: 'Dataset limit must be zero or greater.' };
  }

  if (isCms) {
    const cmsCollectionId = (input.cmsCollectionId ?? '').trim();
    if (!cmsCollectionId) {
      return { ok: false, error: 'Missing CMS collection id for collection binding.' };
    }
    return {
      ok: true,
      isCmsCollection: true,
      patch: {
        // keep a valid built-in collectionId on the binding for type-safety; the render path
        // ignores it when cmsCollectionId is set.
        collectionId: builtin.collectionIds[0] ?? '',
        mode: typeof input.mode === 'string' ? input.mode : undefined,
        limit: input.limit,
        filters: input.filters,
        sort: input.sort,
        cmsCollectionId,
      },
    };
  }

  // Built-in target — original strict validation.
  const collectionId = typeof input.collectionId === 'string' ? input.collectionId : '';
  if (!collectionId || !builtin.collectionIds.includes(collectionId)) {
    return { ok: false, error: 'Dataset collection is not approved for this target.' };
  }
  const mode = typeof input.mode === 'string' ? input.mode : '';
  if (!mode || !builtin.modeOptions.includes(mode)) {
    return { ok: false, error: 'Dataset mode is not approved for this target.' };
  }
  return {
    ok: true,
    isCmsCollection: false,
    patch: { collectionId, mode, limit: input.limit, filters: input.filters, sort: input.sort },
  };
}
