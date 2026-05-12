import { get, list, put } from '@vercel/blob';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { faqContent } from '@/data/faq-content';
import { siteContent } from '@/data/site-content';
import {
  createDefaultHomeDocumentState,
  createDefaultStaticDocumentState,
  getDefaultBuilderDocument,
  normalizeBuilderDocument,
  normalizeBuilderPageState,
} from '@/lib/builder/content';
import { validateBuilderSnapshotForPublish } from '@/lib/builder/validation';
import type {
  BuilderHomeDocumentState,
  BuilderPageDocument,
  BuilderPageKey,
  BuilderPageState,
  BuilderPageSnapshot,
  BuilderSnapshotExpectation,
  BuilderSnapshotKind,
} from '@/lib/builder/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

const BUILDER_UPDATED_BY = 'builder-api';
const BUILDER_STORAGE_ROOT = 'builder';
const BUILDER_HISTORY_ROOT = 'builder-history';
const BUILDER_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data', 'builder');

export type BuilderSnapshotBackend = 'blob' | 'file';

export interface BuilderSnapshotReadResult<TState extends BuilderPageState = BuilderPageState> {
  backend: BuilderSnapshotBackend;
  persisted: boolean;
  snapshot: BuilderPageSnapshot<TState>;
}

export interface BuilderSnapshotWriteInput {
  pageKey: BuilderPageKey;
  kind: BuilderSnapshotKind;
  locale: Locale;
  document: BuilderPageDocument;
  state: BuilderPageState;
  updatedBy?: string;
  expectedRevision?: number;
  expectedSavedAt?: string;
  history?: BuilderSnapshotHistoryWriteInput;
}

export interface BuilderPublishExpectation {
  draft?: BuilderSnapshotExpectation;
  published?: BuilderSnapshotExpectation;
}

export interface BuilderSnapshotWriteResult<TState extends BuilderPageState = BuilderPageState> {
  backend: BuilderSnapshotBackend;
  snapshot: BuilderPageSnapshot<TState>;
}

export interface BuilderSnapshotHistoryWriteInput {
  action: 'publish';
  sourceDraftRevision?: number;
  sourceDraftSavedAt?: string;
  previousPublishedRevisionId?: string | null;
}

export interface BuilderSnapshotHistoryRecord {
  version: 1;
  revisionId: string;
  kind: BuilderSnapshotKind;
  locale: Locale;
  action: 'publish';
  revision: number;
  savedAt: string;
  updatedBy: string;
  sourceDraftRevision?: number;
  sourceDraftSavedAt?: string;
  previousPublishedRevisionId?: string | null;
  snapshot: BuilderPageSnapshot;
}

export interface BuilderSnapshotHistorySummary {
  revisionId: string;
  kind: BuilderSnapshotKind;
  locale: Locale;
  action: 'publish';
  revision: number;
  savedAt: string;
  updatedBy: string;
  sourceDraftRevision?: number;
  sourceDraftSavedAt?: string;
  previousPublishedRevisionId?: string | null;
  sectionCount: number;
  hiddenSectionCount: number;
  overrideCount: number;
  faqCount: number;
  serviceCount: number;
  sceneNodeCount: number;
  sceneAuthorityNodeCount: number;
  sceneSeedNodeCount: number;
}

export interface BuilderSnapshotHistoryListResult {
  backend: BuilderSnapshotBackend;
  records: BuilderSnapshotHistorySummary[];
}

export interface BuilderSnapshotHistoryDetailResult {
  backend: BuilderSnapshotBackend;
  record: BuilderSnapshotHistorySummary | null;
  snapshot: BuilderPageSnapshot | null;
}

export interface BuilderSnapshotConflict {
  kind: BuilderSnapshotKind;
  locale: Locale;
  expectedRevision?: number;
  expectedSavedAt?: string;
  currentSnapshot: BuilderPageSnapshot;
}

export class BuilderSnapshotConflictError extends Error {
  readonly conflict: BuilderSnapshotConflict;

  constructor(conflict: BuilderSnapshotConflict) {
    super('Builder snapshot conflict');
    this.name = 'BuilderSnapshotConflictError';
    this.conflict = conflict;
  }
}

export interface BuilderHomeSnapshotDefaults {
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
}

export interface BuilderPageSnapshotDefaults {
  document: BuilderPageDocument;
  state: BuilderPageState;
}

interface BuilderSnapshotStore {
  backend: BuilderSnapshotBackend;
  read(pathname: string): Promise<string | null>;
  write(pathname: string, content: string): Promise<void>;
  list(prefix: string, limit: number): Promise<string[]>;
}

export function isBuilderSnapshotKind(value: string | null | undefined): value is BuilderSnapshotKind {
  return value === 'draft' || value === 'published';
}

export function normalizeBuilderHomeLocale(value?: string | null): Locale {
  return normalizeLocale(value ?? undefined);
}

export function createBuilderHomeDefaults(locale: Locale): BuilderHomeSnapshotDefaults {
  return {
    document: getDefaultBuilderDocument('home', locale),
    state: createDefaultHomeDocumentState({
      faqItems: faqContent[locale],
      serviceItems: siteContent[locale].services.items,
    }),
  };
}

export function createBuilderPageDefaults(
  pageKey: BuilderPageKey,
  locale: Locale
): BuilderPageSnapshotDefaults {
  switch (pageKey) {
    case 'home':
      return createBuilderHomeDefaults(locale);
    case 'about':
    case 'contact':
      return {
        document: getDefaultBuilderDocument(pageKey, locale),
        state: createDefaultStaticDocumentState(),
      };
    default:
      return assertNever(pageKey);
  }
}

export async function readBuilderPageSnapshot(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale
): Promise<BuilderSnapshotReadResult> {
  const store = resolveBuilderSnapshotStore();
  const defaults = createBuilderPageDefaults(pageKey, locale);
  const pathname = getBuilderSnapshotPath(pageKey, kind, locale);
  const raw = await store.read(pathname);

  if (!raw) {
    return {
      backend: store.backend,
      persisted: false,
      snapshot: materializeBuilderSnapshot({
        pageKey,
        kind,
        locale,
        document: defaults.document,
        state: defaults.state,
        updatedBy: BUILDER_UPDATED_BY,
        revision: 0,
        savedAt: defaults.document.updatedAt,
      }),
    };
  }

  const parsed = parseBuilderSnapshot(raw, pageKey, kind, locale, defaults);
  if (!parsed) {
    console.warn('[builder] invalid snapshot payload; falling back to defaults', {
      pageKey,
      kind,
      locale,
      pathname,
    });

    return {
      backend: store.backend,
      persisted: false,
      snapshot: materializeBuilderSnapshot({
        pageKey,
        kind,
        locale,
        document: defaults.document,
        state: defaults.state,
        updatedBy: BUILDER_UPDATED_BY,
        revision: 0,
        savedAt: defaults.document.updatedAt,
      }),
    };
  }

  return {
    backend: store.backend,
    persisted: true,
    snapshot: parsed,
  };
}

export async function readBuilderHomeSnapshot(
  kind: BuilderSnapshotKind,
  locale: Locale
): Promise<BuilderSnapshotReadResult<BuilderHomeDocumentState>> {
  return (await readBuilderPageSnapshot('home', kind, locale)) as BuilderSnapshotReadResult<BuilderHomeDocumentState>;
}

export async function writeBuilderPageSnapshot(
  input: BuilderSnapshotWriteInput
): Promise<BuilderSnapshotWriteResult> {
  const store = resolveBuilderSnapshotStore();
  const defaults = createBuilderPageDefaults(input.pageKey, input.locale);
  const current = await readBuilderPageSnapshot(input.pageKey, input.kind, input.locale);
  const currentSnapshot = current.snapshot;
  const normalizedExpectedRevision = normalizeExpectedRevision(input.expectedRevision);
  const normalizedExpectedSavedAt = normalizeExpectedSavedAt(input.expectedSavedAt);

  if (
    (normalizedExpectedRevision !== null && normalizedExpectedRevision !== currentSnapshot.revision) ||
    (normalizedExpectedSavedAt !== null && normalizedExpectedSavedAt !== currentSnapshot.savedAt)
  ) {
    throw new BuilderSnapshotConflictError({
      kind: input.kind,
      locale: input.locale,
      expectedRevision: normalizedExpectedRevision ?? undefined,
      expectedSavedAt: normalizedExpectedSavedAt ?? undefined,
      currentSnapshot,
    });
  }

  const snapshot = materializeBuilderSnapshot({
    pageKey: input.pageKey,
    kind: input.kind,
    locale: input.locale,
    document: input.document,
    state: input.state,
    updatedBy: sanitizeUpdatedBy(input.updatedBy),
    defaults,
    revision: currentSnapshot.revision + 1,
  });

  await store.write(
    getBuilderSnapshotPath(input.pageKey, input.kind, input.locale),
    JSON.stringify(snapshot, null, 2)
  );

  if (input.history) {
    const historyRecord = materializeBuilderSnapshotHistoryRecord({
      snapshot,
      locale: input.locale,
      history: input.history,
    });
    await store.write(
      getBuilderSnapshotHistoryPath(
        input.pageKey,
        input.kind,
        input.locale,
        historyRecord.revisionId
      ),
      JSON.stringify(historyRecord, null, 2)
    );
  }

  return {
    backend: store.backend,
    snapshot,
  };
}

export async function writeBuilderHomeSnapshot(
  input: Omit<BuilderSnapshotWriteInput, 'pageKey'>
): Promise<BuilderSnapshotWriteResult<BuilderHomeDocumentState>> {
  return (await writeBuilderPageSnapshot({
    ...input,
    pageKey: 'home',
  })) as BuilderSnapshotWriteResult<BuilderHomeDocumentState>;
}

export async function publishBuilderPageSnapshot(
  pageKey: BuilderPageKey,
  locale: Locale,
  input?: {
    updatedBy?: string;
    expectedDraft?: BuilderSnapshotExpectation;
    expectedPublished?: BuilderSnapshotExpectation;
  }
): Promise<BuilderSnapshotWriteResult | null> {
  const draft = await readBuilderPageSnapshot(pageKey, 'draft', locale);
  const published = await readBuilderPageSnapshot(pageKey, 'published', locale);
  const previousPublishedRevisionId = published.persisted
    ? createBuilderSnapshotHistoryRevisionId(published.snapshot)
    : null;
  if (!draft.persisted) return null;

  const expectedDraftRevision = normalizeExpectedRevision(input?.expectedDraft?.revision);
  const expectedDraftSavedAt = normalizeExpectedSavedAt(input?.expectedDraft?.savedAt);
  if (
    (expectedDraftRevision !== null && expectedDraftRevision !== draft.snapshot.revision) ||
    (expectedDraftSavedAt !== null && expectedDraftSavedAt !== draft.snapshot.savedAt)
  ) {
    throw new BuilderSnapshotConflictError({
      kind: 'draft',
      locale,
      expectedRevision: expectedDraftRevision ?? undefined,
      expectedSavedAt: expectedDraftSavedAt ?? undefined,
      currentSnapshot: draft.snapshot,
    });
  }

  const expectedPublishedRevision = normalizeExpectedRevision(input?.expectedPublished?.revision);
  const expectedPublishedSavedAt = normalizeExpectedSavedAt(input?.expectedPublished?.savedAt);
  if (
    (expectedPublishedRevision !== null && expectedPublishedRevision !== published.snapshot.revision) ||
    (expectedPublishedSavedAt !== null && expectedPublishedSavedAt !== published.snapshot.savedAt)
  ) {
    throw new BuilderSnapshotConflictError({
      kind: 'published',
      locale,
      expectedRevision: expectedPublishedRevision ?? undefined,
      expectedSavedAt: expectedPublishedSavedAt ?? undefined,
      currentSnapshot: published.snapshot,
    });
  }

  await validateBuilderSnapshotForPublish(draft.snapshot);

  return writeBuilderPageSnapshot({
    pageKey,
    kind: 'published',
    locale,
    document: draft.snapshot.document,
    state: draft.snapshot.state,
    updatedBy: input?.updatedBy,
    expectedRevision: published.snapshot.revision,
    expectedSavedAt: published.snapshot.savedAt,
    history: {
      action: 'publish',
      sourceDraftRevision: draft.snapshot.revision,
      sourceDraftSavedAt: draft.snapshot.savedAt,
      previousPublishedRevisionId,
    },
  });
}

export async function publishBuilderHomeSnapshot(
  locale: Locale,
  input?: {
    updatedBy?: string;
    expectedDraft?: BuilderSnapshotExpectation;
    expectedPublished?: BuilderSnapshotExpectation;
  }
): Promise<BuilderSnapshotWriteResult<BuilderHomeDocumentState> | null> {
  return (await publishBuilderPageSnapshot('home', locale, input)) as
    | BuilderSnapshotWriteResult<BuilderHomeDocumentState>
    | null;
}

export async function rollbackBuilderPageDraftToPublishedRevision(
  pageKey: BuilderPageKey,
  locale: Locale,
  input: {
    revisionId: string;
    updatedBy?: string;
    expectedDraft?: BuilderSnapshotExpectation;
  }
): Promise<
  | (BuilderSnapshotWriteResult & {
      sourceRevisionId: string;
      sourceRevision: number;
      sourceSavedAt: string;
      sourceUpdatedBy: string;
    })
  | null
> {
  const source = await readBuilderPageSnapshotHistoryDetail(
    pageKey,
    'published',
    locale,
    input.revisionId
  );
  if (!source.record || !source.snapshot) {
    return null;
  }

  const draft = await readBuilderPageSnapshot(pageKey, 'draft', locale);
  if (!draft.persisted) {
    throw new Error('Shared draft must exist before rollback can run.');
  }

  const result = await writeBuilderPageSnapshot({
    pageKey,
    kind: 'draft',
    locale,
    document: source.snapshot.document,
    state: source.snapshot.state,
    updatedBy: input.updatedBy,
    expectedRevision: input.expectedDraft?.revision,
    expectedSavedAt: input.expectedDraft?.savedAt,
  });

  return {
    ...result,
    sourceRevisionId: source.record.revisionId,
    sourceRevision: source.record.revision,
    sourceSavedAt: source.record.savedAt,
    sourceUpdatedBy: source.record.updatedBy,
  };
}

export async function rollbackBuilderHomeDraftToPublishedRevision(
  locale: Locale,
  input: {
    revisionId: string;
    updatedBy?: string;
    expectedDraft?: BuilderSnapshotExpectation;
  }
): Promise<
  | (BuilderSnapshotWriteResult<BuilderHomeDocumentState> & {
      sourceRevisionId: string;
      sourceRevision: number;
      sourceSavedAt: string;
      sourceUpdatedBy: string;
    })
  | null
> {
  return (await rollbackBuilderPageDraftToPublishedRevision('home', locale, input)) as
    | (BuilderSnapshotWriteResult<BuilderHomeDocumentState> & {
        sourceRevisionId: string;
        sourceRevision: number;
        sourceSavedAt: string;
        sourceUpdatedBy: string;
      })
    | null;
}

export function buildBuilderSnapshotResponse(
  result: BuilderSnapshotReadResult | BuilderSnapshotWriteResult
) {
  return {
    ok: true,
    storage: result.backend,
    persisted: 'persisted' in result ? result.persisted : true,
    snapshot: result.snapshot,
  };
}

export function buildBuilderHomeSnapshotResponse(
  result: BuilderSnapshotReadResult | BuilderSnapshotWriteResult
) {
  return buildBuilderSnapshotResponse(result);
}

export function buildBuilderSnapshotHistoryListResponse(
  result: BuilderSnapshotHistoryListResult
) {
  return {
    ok: true,
    storage: result.backend,
    records: result.records,
  };
}

export function buildBuilderHomeSnapshotHistoryListResponse(
  result: BuilderSnapshotHistoryListResult
) {
  return buildBuilderSnapshotHistoryListResponse(result);
}

export function buildBuilderSnapshotHistoryDetailResponse(
  result: BuilderSnapshotHistoryDetailResult
) {
  return {
    ok: true,
    storage: result.backend,
    record: result.record,
    snapshot: result.snapshot,
  };
}

export function buildBuilderHomeSnapshotHistoryDetailResponse(
  result: BuilderSnapshotHistoryDetailResult
) {
  return buildBuilderSnapshotHistoryDetailResponse(result);
}

export async function listBuilderPageSnapshotHistory(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  limit = 8
): Promise<BuilderSnapshotHistoryListResult> {
  const store = resolveBuilderSnapshotStore();
  const defaults = createBuilderPageDefaults(pageKey, locale);
  const prefix = getBuilderSnapshotHistoryPrefix(pageKey, kind, locale);
  const pathnames = await store.list(prefix, Math.max(limit, 1) * 4);
  const records = await Promise.all(
    pathnames.map(async (pathname) => {
      const raw = await store.read(pathname);
      if (!raw) return null;
      return parseBuilderSnapshotHistoryRecord(raw, pageKey, kind, locale, defaults);
    })
  );

  return {
    backend: store.backend,
    records: records
      .filter((record): record is BuilderSnapshotHistoryRecord => Boolean(record))
      .sort((left, right) => {
        if (left.savedAt === right.savedAt) {
          return right.revision - left.revision;
        }
        return right.savedAt.localeCompare(left.savedAt);
      })
      .slice(0, Math.max(limit, 1))
      .map(summarizeBuilderSnapshotHistoryRecord),
  };
}

export async function listBuilderHomeSnapshotHistory(
  kind: BuilderSnapshotKind,
  locale: Locale,
  limit = 8
): Promise<BuilderSnapshotHistoryListResult> {
  return listBuilderPageSnapshotHistory('home', kind, locale, limit);
}

export async function readBuilderPageSnapshotHistoryDetail(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  revisionId: string
): Promise<BuilderSnapshotHistoryDetailResult> {
  const store = resolveBuilderSnapshotStore();
  const defaults = createBuilderPageDefaults(pageKey, locale);
  const raw = await store.read(getBuilderSnapshotHistoryPath(pageKey, kind, locale, revisionId));
  if (!raw) {
    return {
      backend: store.backend,
      record: null,
      snapshot: null,
    };
  }

  const record = parseBuilderSnapshotHistoryRecord(raw, pageKey, kind, locale, defaults);
  return {
    backend: store.backend,
    record: record ? summarizeBuilderSnapshotHistoryRecord(record) : null,
    snapshot: record?.snapshot ?? null,
  };
}

export async function readBuilderHomeSnapshotHistoryDetail(
  kind: BuilderSnapshotKind,
  locale: Locale,
  revisionId: string
): Promise<BuilderSnapshotHistoryDetailResult> {
  return readBuilderPageSnapshotHistoryDetail('home', kind, locale, revisionId);
}

function parseBuilderSnapshot(
  raw: string,
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  defaults: BuilderPageSnapshotDefaults
): BuilderPageSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parseBuilderSnapshotValue(parsed, pageKey, kind, locale, defaults);
  } catch (err) {
    // Surface corruption so an admin notices the page can't be parsed,
    // rather than silently returning null and rendering an empty page.
    console.warn('[persistence] failed to parse snapshot', {
      pageKey,
      kind,
      locale,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

function parseBuilderSnapshotValue(
  value: unknown,
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  defaults: BuilderPageSnapshotDefaults
): BuilderPageSnapshot | null {
  if (!isPlainObject(value)) return null;
  if (value.version !== 1) return null;
  if (value.kind !== kind) return null;
  if (value.pageKey !== pageKey) return null;
  if (value.locale !== locale) return null;
  if (typeof value.savedAt !== 'string' || !value.savedAt) return null;

  const normalizedDocument = normalizeBuilderDocument(
    value.document as Partial<BuilderPageDocument> | null | undefined,
    defaults.document
  );
  const normalizedState = normalizeBuilderPageState(
    pageKey,
    value.state as Partial<BuilderPageState> | null | undefined,
    defaults.state
  );

  return {
    version: 1,
    kind,
    pageKey,
    locale,
    revision: typeof value.revision === 'number' && value.revision >= 0 ? value.revision : 1,
    savedAt: value.savedAt,
    updatedBy:
      typeof value.updatedBy === 'string' && value.updatedBy ? value.updatedBy : normalizedDocument.updatedBy,
    document: normalizedDocument,
    state: normalizedState,
  };
}

function materializeBuilderSnapshot({
  pageKey,
  kind,
  locale,
  document,
  state,
  updatedBy,
  defaults,
  revision,
  savedAt: nextSavedAt,
}: {
  pageKey: BuilderPageKey;
  kind: BuilderSnapshotKind;
  locale: Locale;
  document: BuilderPageDocument;
  state: BuilderPageState;
  updatedBy: string;
  revision: number;
  savedAt?: string;
  defaults?: BuilderPageSnapshotDefaults;
}): BuilderPageSnapshot {
  const fallback = defaults ?? createBuilderPageDefaults(pageKey, locale);
  const normalizedDocument = normalizeBuilderDocument(document, fallback.document);
  const normalizedState = normalizeBuilderPageState(pageKey, state, fallback.state);
  const resolvedSavedAt = inputSavedAtOrNow(nextSavedAt);

  return {
    version: 1,
    kind,
    pageKey,
    locale,
    revision,
    savedAt: resolvedSavedAt,
    updatedBy,
    document: {
      ...normalizedDocument,
      updatedAt: resolvedSavedAt,
      updatedBy,
    },
    state: normalizedState,
  };
}

function parseBuilderSnapshotHistoryRecord(
  raw: string,
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  defaults: BuilderPageSnapshotDefaults
): BuilderSnapshotHistoryRecord | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) return null;
    if (parsed.version !== 1) return null;
    if (parsed.kind !== kind) return null;
    if (parsed.locale !== locale) return null;
    if (parsed.action !== 'publish') return null;
    if (typeof parsed.revisionId !== 'string' || !parsed.revisionId.trim()) return null;

    const snapshot = parseBuilderSnapshotValue(parsed.snapshot, pageKey, kind, locale, defaults);
    if (!snapshot) return null;

    return {
      version: 1,
      revisionId: parsed.revisionId.trim(),
      kind,
      locale,
      action: 'publish',
      revision: snapshot.revision,
      savedAt: snapshot.savedAt,
      updatedBy: snapshot.updatedBy,
      sourceDraftRevision:
        typeof parsed.sourceDraftRevision === 'number' && parsed.sourceDraftRevision >= 0
          ? Math.trunc(parsed.sourceDraftRevision)
          : undefined,
      sourceDraftSavedAt:
        typeof parsed.sourceDraftSavedAt === 'string' && parsed.sourceDraftSavedAt.trim()
          ? parsed.sourceDraftSavedAt.trim()
          : undefined,
      previousPublishedRevisionId:
        typeof parsed.previousPublishedRevisionId === 'string' && parsed.previousPublishedRevisionId.trim()
          ? parsed.previousPublishedRevisionId.trim()
          : null,
      snapshot,
    };
  } catch {
    return null;
  }
}

function materializeBuilderSnapshotHistoryRecord({
  snapshot,
  locale,
  history,
}: {
  snapshot: BuilderPageSnapshot;
  locale: Locale;
  history: BuilderSnapshotHistoryWriteInput;
}): BuilderSnapshotHistoryRecord {
  return {
    version: 1,
    revisionId: createBuilderSnapshotHistoryRevisionId(snapshot),
    kind: snapshot.kind,
    locale,
    action: history.action,
    revision: snapshot.revision,
    savedAt: snapshot.savedAt,
    updatedBy: snapshot.updatedBy,
    sourceDraftRevision: history.sourceDraftRevision,
    sourceDraftSavedAt: history.sourceDraftSavedAt,
    previousPublishedRevisionId: history.previousPublishedRevisionId ?? null,
    snapshot,
  };
}

function summarizeBuilderSnapshotHistoryRecord(
  record: BuilderSnapshotHistoryRecord
): BuilderSnapshotHistorySummary {
  const state = record.snapshot.state as Partial<BuilderPageState>;
  const overrides =
    state && typeof state === 'object' && state.overrides && typeof state.overrides === 'object'
      ? state.overrides
      : {};
  const faqItems =
    state && typeof state === 'object' && Array.isArray((state as BuilderHomeDocumentState).faqItems)
      ? (state as BuilderHomeDocumentState).faqItems
      : [];
  const serviceItems =
    state && typeof state === 'object' && Array.isArray((state as BuilderHomeDocumentState).serviceItems)
      ? (state as BuilderHomeDocumentState).serviceItems
      : [];
  const sceneNodes = Array.isArray(record.snapshot.document.scene?.nodes)
    ? record.snapshot.document.scene?.nodes ?? []
    : [];
  const sceneAuthorityNodeCount = sceneNodes.filter((node) => node.source === 'page-scene').length;

  return {
    revisionId: record.revisionId,
    kind: record.kind,
    locale: record.locale,
    action: record.action,
    revision: record.revision,
    savedAt: record.savedAt,
    updatedBy: record.updatedBy,
    sourceDraftRevision: record.sourceDraftRevision,
    sourceDraftSavedAt: record.sourceDraftSavedAt,
    previousPublishedRevisionId: record.previousPublishedRevisionId ?? null,
    sectionCount: record.snapshot.document.root.children.length,
    hiddenSectionCount: record.snapshot.document.root.children.filter((section) => Boolean(section.hidden)).length,
    overrideCount: Object.keys(overrides).length,
    faqCount: faqItems.length,
    serviceCount: serviceItems.length,
    sceneNodeCount: sceneNodes.length,
    sceneAuthorityNodeCount,
    sceneSeedNodeCount: sceneNodes.length - sceneAuthorityNodeCount,
  };
}

function resolveBuilderSnapshotStore(): BuilderSnapshotStore {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return createBlobBuilderSnapshotStore();
  }

  return createFileBuilderSnapshotStore();
}

function createBlobBuilderSnapshotStore(): BuilderSnapshotStore {
  return {
    backend: 'blob',
    async read(pathname: string) {
      try {
        const result = await get(pathname, {
          access: 'private',
          useCache: false,
        });

        if (!result || result.statusCode !== 200 || !result.stream) {
          return null;
        }

        return await new Response(result.stream).text();
      } catch (error) {
        if (isBlobNotFoundError(error)) {
          return null;
        }

        throw error;
      }
    },
    async write(pathname: string, content: string) {
      await put(pathname, content, {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
      });
    },
    async list(prefix: string, limit: number) {
      const result = await list({
        prefix,
        limit: Math.max(limit, 1),
      });
      return result.blobs.map((blob) => blob.pathname);
    },
  };
}

function createFileBuilderSnapshotStore(): BuilderSnapshotStore {
  return {
    backend: 'file',
    async read(pathname: string) {
      try {
        return await readFile(resolveRuntimePath(pathname), 'utf8');
      } catch (error) {
        if (isNodeNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: string) {
      const resolvedPath = resolveRuntimePath(pathname);
      await mkdir(path.dirname(resolvedPath), { recursive: true, mode: 0o700 });
      await writeFile(resolvedPath, content, { encoding: 'utf8', mode: 0o600 });
    },
    async list(prefix: string, limit: number) {
      const resolvedPath = resolveRuntimePath(prefix);
      try {
        const entries = await readdir(resolvedPath, { withFileTypes: true });
        return entries
          .filter((entry) => entry.isFile())
          .map((entry) => `${prefix}${entry.name}`)
          .sort((left, right) => right.localeCompare(left))
          .slice(0, Math.max(limit, 1));
      } catch (error) {
        if (isNodeNotFoundError(error)) return [];
        throw error;
      }
    },
  };
}

function getBuilderSnapshotPath(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale
): string {
  return `${BUILDER_STORAGE_ROOT}/${pageKey}/${locale}/${kind}.json`;
}

function getBuilderSnapshotHistoryPrefix(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale
): string {
  return `${BUILDER_HISTORY_ROOT}/${pageKey}/${locale}/${kind}/`;
}

function getBuilderSnapshotHistoryPath(
  pageKey: BuilderPageKey,
  kind: BuilderSnapshotKind,
  locale: Locale,
  revisionId: string
): string {
  return `${getBuilderSnapshotHistoryPrefix(pageKey, kind, locale)}${revisionId}.json`;
}

function resolveRuntimePath(pathname: string): string {
  return path.join(BUILDER_RUNTIME_ROOT, pathname);
}

function createBuilderSnapshotHistoryRevisionId(snapshot: Pick<BuilderPageSnapshot, 'kind' | 'revision' | 'savedAt'>) {
  return `${snapshot.kind}-r${String(snapshot.revision).padStart(4, '0')}-${sanitizeSavedAtForPath(snapshot.savedAt)}`;
}

function sanitizeSavedAtForPath(value: string) {
  return value.trim().replace(/[:.]/g, '-');
}

function sanitizeUpdatedBy(value?: string): string {
  const trimmed = value?.trim() || BUILDER_UPDATED_BY;
  return trimmed.slice(0, 120);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNodeNotFoundError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('not found') || message.includes('404');
}

function normalizeExpectedRevision(value?: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return value === undefined ? null : null;
  }
  return Math.trunc(value);
}

function normalizeExpectedSavedAt(value?: string): string | null {
  if (typeof value !== 'string') return value === undefined ? null : null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function inputSavedAtOrNow(value?: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return new Date().toISOString();
}

function assertNever(value: never): never {
  throw new Error(`Unsupported builder page key: ${value}`);
}
