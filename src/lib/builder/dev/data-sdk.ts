/**
 * F108 — Data SDK: a thin, typed, permission-checked SERVER-SIDE facade over
 * the existing CMS data layer (`@/lib/builder/cms-editable` + `cms-record-query`).
 *
 * Purpose: let server code (serverless functions, app hooks) query/mutate CMS
 * data without hand-rolling HTTP calls. It reuses the same store functions the
 * `/api/builder/sites/[siteId]/collections/**` routes use — it does NOT duplicate
 * any storage/query logic.
 *
 * Permission model: every call first runs the same RBAC gate the HTTP routes
 * run — `userHasPermission(actor, permission)` from the security layer. The
 * permission keys mirror the CMS collection/record routes exactly (those routes
 * gate both reads and mutations with `'edit-pages'`, so this facade does too).
 * A denied actor throws `DataSdkPermissionError` before touching the store.
 *
 * The CMS collection's own per-actor permissions (read/create/update/delete on
 * `BuilderCmsPermissions`) remain enforced inside the store as a secondary
 * defense; the facade passes the elevated `'admin'` CMS actor (with the calling
 * username as the audit label) since the SDK runs server-side once the user-level
 * RBAC gate has already passed.
 *
 * Dependency-light: imports only store + security + locale helpers, no Next.js /
 * HTTP surface, so a serverless function sandbox can bind it later.
 */

import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  createEditableBuilderCmsRecord,
  deleteEditableBuilderCmsRecord,
  listEditableBuilderCmsCollections,
  readEditableBuilderCmsCollection,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import {
  queryBuilderCmsRecords,
  type BuilderCmsRecordQueryOptions,
} from '@/lib/builder/cms-record-query';
import type {
  BuilderCmsCollectionSummary,
  BuilderCmsPermissionActor,
  BuilderCmsRecord,
} from '@/lib/builder/cms-types';
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import { defaultLocale, type Locale } from '@/lib/locales';

// ─── Permission keys (mirror the CMS collection/record routes exactly) ───────
//
// The HTTP routes in src/app/api/builder/sites/[siteId]/collections/**/route.ts
// call `guardMutation(request, { permission: 'edit-pages' })` for BOTH reads
// (GET) and mutations (POST/PATCH/DELETE). To stay a faithful facade, the SDK
// copies that same key for both classes. They are kept as separate constants so
// a future read/manage split (e.g. a dedicated `'view-cms'` read gate) only has
// to change one place, and so the intent is explicit at every call site.
const READ_PERMISSION: BuilderPermission = 'edit-pages';
const MUTATE_PERMISSION: BuilderPermission = 'edit-pages';

// The SDK runs with elevated CMS privilege once the user-level RBAC gate passes,
// so every store call is made as the collection-admin actor. The username is
// carried through as the audit label exactly like the route's authenticated-admin
// branch (`resolveBuilderCmsRouteActor`).
const SDK_CMS_ACTOR: BuilderCmsPermissionActor = 'admin';

// ─── Errors ──────────────────────────────────────────────────────────────────

export interface DataSdkPermissionErrorContext {
  actor: string;
  permission: BuilderPermission;
  action: string;
}

export class DataSdkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataSdkError';
  }
}

export class DataSdkPermissionError extends DataSdkError {
  readonly actor: string;
  readonly permission: BuilderPermission;
  readonly action: string;

  constructor(context: DataSdkPermissionErrorContext) {
    super(
      `Data SDK permission denied: actor "${context.actor}" lacks "${context.permission}" for ${context.action}.`,
    );
    this.name = 'DataSdkPermissionError';
    this.actor = context.actor;
    this.permission = context.permission;
    this.action = context.action;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DataSdkContext {
  /** Authenticated username resolved through the RBAC layer (guardMutation parity). */
  actor: string;
  /** Builder site to operate on. Defaults to the single default builder site. */
  siteId?: string;
  /** Locale scope. Defaults to the site's default locale. */
  locale?: Locale;
}

export type DataSdkRecordQuery = BuilderCmsRecordQueryOptions;

export interface DataSdkRecordListResult {
  records: BuilderCmsRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface DataSdkCollections {
  list(): Promise<BuilderCmsCollectionSummary[]>;
}

export interface DataSdkRecords {
  list(
    collectionId: string,
    query?: DataSdkRecordQuery,
  ): Promise<DataSdkRecordListResult>;
  get(collectionId: string, recordId: string): Promise<BuilderCmsRecord | null>;
  create(
    collectionId: string,
    fields: Record<string, unknown>,
  ): Promise<BuilderCmsRecord>;
  update(
    collectionId: string,
    recordId: string,
    fields: Record<string, unknown>,
  ): Promise<BuilderCmsRecord>;
  delete(collectionId: string, recordId: string): Promise<boolean>;
}

export interface DataSdk {
  readonly actor: string;
  readonly siteId: string;
  readonly locale: Locale;
  collections: DataSdkCollections;
  records: DataSdkRecords;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createDataSdk(context: DataSdkContext): DataSdk {
  const actor = context.actor.trim();
  if (!actor) {
    throw new DataSdkError('Data SDK requires a non-empty actor username.');
  }
  const siteId = context.siteId?.trim() || DEFAULT_BUILDER_SITE_ID;
  const locale: Locale = context.locale ?? defaultLocale;

  const accessOptions = { actor: SDK_CMS_ACTOR, actorLabel: actor };

  async function assertRead(action: string): Promise<void> {
    if (!(await userHasPermission(actor, READ_PERMISSION))) {
      throw new DataSdkPermissionError({ actor, permission: READ_PERMISSION, action });
    }
  }

  async function assertMutate(action: string): Promise<void> {
    if (!(await userHasPermission(actor, MUTATE_PERMISSION))) {
      throw new DataSdkPermissionError({ actor, permission: MUTATE_PERMISSION, action });
    }
  }

  const collections: DataSdkCollections = {
    async list() {
      await assertRead('collections.list');
      return listEditableBuilderCmsCollections(siteId, locale);
    },
  };

  const records: DataSdkRecords = {
    async list(collectionId, query) {
      await assertRead('records.list');
      const detail = await readEditableBuilderCmsCollection(siteId, locale, collectionId, accessOptions);
      if (!detail) {
        return { records: [], total: 0, page: 1, pageSize: 0, pageCount: 0 };
      }
      const result = queryBuilderCmsRecords(detail.records, detail.fields, query ?? {});
      return {
        records: result.records,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        pageCount: result.pageCount,
      };
    },

    async get(collectionId, recordId) {
      await assertRead('records.get');
      const detail = await readEditableBuilderCmsCollection(siteId, locale, collectionId, accessOptions);
      if (!detail) return null;
      return detail.records.find((candidate) => candidate.recordId === recordId) ?? null;
    },

    async create(collectionId, fields) {
      await assertMutate('records.create');
      const record = await createEditableBuilderCmsRecord(
        siteId,
        locale,
        collectionId,
        { fields },
        accessOptions,
      );
      if (!record) {
        throw new DataSdkError(`Unknown CMS collection: ${collectionId}`);
      }
      return record;
    },

    async update(collectionId, recordId, fields) {
      await assertMutate('records.update');
      const updated = await updateEditableBuilderCmsRecord(
        siteId,
        locale,
        collectionId,
        recordId,
        { fields },
        accessOptions,
      );
      if (!updated) {
        throw new DataSdkError(`Unknown CMS record: ${collectionId}/${recordId}`);
      }
      return updated;
    },

    async delete(collectionId, recordId) {
      await assertMutate('records.delete');
      return deleteEditableBuilderCmsRecord(siteId, locale, collectionId, recordId, accessOptions);
    },
  };

  return { actor, siteId, locale, collections, records };
}
