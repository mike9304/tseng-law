import { get, put } from '@vercel/blob';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  readBuilderDynamicTemplateDetail,
  type BuilderDynamicTemplateDetail,
  type BuilderDynamicTemplateId,
} from '@/lib/builder/dynamic-templates';
import { normalizeLocale, type Locale } from '@/lib/locales';

const BUILDER_DYNAMIC_TEMPLATE_STORAGE_ROOT = 'builder-dynamic-templates';
const BUILDER_DYNAMIC_TEMPLATE_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data', 'builder');
const BUILDER_DYNAMIC_TEMPLATE_UPDATED_BY = 'builder-dynamic-template-api';

export type BuilderDynamicTemplateDraftBackend = 'blob' | 'file';
export type BuilderDynamicTemplateSnapshotKind = 'draft' | 'published';

export interface BuilderDynamicTemplateDraftState {
  version: 1;
  visibleBlockIds: string[];
  selectedRecordId: string | null;
}

export interface BuilderDynamicTemplateDraftSnapshot {
  version: 1;
  templateId: BuilderDynamicTemplateId;
  locale: Locale;
  revision: number;
  savedAt: string | null;
  updatedBy: string | null;
  state: BuilderDynamicTemplateDraftState;
}

export interface BuilderDynamicTemplateDraftReadResult {
  backend: BuilderDynamicTemplateDraftBackend;
  persisted: boolean;
  snapshot: BuilderDynamicTemplateDraftSnapshot;
}

export interface BuilderDynamicTemplateDraftWriteInput {
  templateId: BuilderDynamicTemplateId;
  locale: Locale;
  state: unknown;
  updatedBy?: string;
}

export interface BuilderDynamicTemplateDraftWriteResult {
  backend: BuilderDynamicTemplateDraftBackend;
  snapshot: BuilderDynamicTemplateDraftSnapshot;
}

export interface BuilderDynamicTemplateBlockVisibility {
  persisted: boolean;
  revision: number;
  savedAt: string | null;
  visibleBlockIds: string[];
}

export interface BuilderDynamicTemplateDraftPublishInput {
  templateId: BuilderDynamicTemplateId;
  locale: Locale;
  updatedBy?: string;
}

export class BuilderDynamicTemplateDraftMissingError extends Error {
  constructor(templateId: BuilderDynamicTemplateId, locale: Locale) {
    super(`No dynamic template draft exists for ${templateId} (${locale}).`);
    this.name = 'BuilderDynamicTemplateDraftMissingError';
  }
}

interface BuilderDynamicTemplateDraftStore {
  backend: BuilderDynamicTemplateDraftBackend;
  read(pathname: string): Promise<string | null>;
  write(pathname: string, content: string): Promise<void>;
}

export function createDefaultBuilderDynamicTemplateDraftState(
  detail: BuilderDynamicTemplateDetail
): BuilderDynamicTemplateDraftState {
  return {
    version: 1,
    visibleBlockIds: detail.editableBlocks
      .filter((block) => block.defaultVisible)
      .map((block) => block.blockId),
    selectedRecordId: detail.previewRecords[0]?.recordId ?? null,
  };
}

export function normalizeBuilderDynamicTemplateDraftState(
  detail: BuilderDynamicTemplateDetail,
  input: unknown
): BuilderDynamicTemplateDraftState {
  const fallback = createDefaultBuilderDynamicTemplateDraftState(detail);
  if (!isPlainObject(input)) return fallback;

  const validBlockIds = new Set(detail.editableBlocks.map((block) => block.blockId));
  const visibleBlockIds = Array.isArray(input.visibleBlockIds)
    ? dedupeStrings(input.visibleBlockIds).filter((blockId) => validBlockIds.has(blockId))
    : fallback.visibleBlockIds;

  const validRecordIds = new Set(detail.previewRecords.map((record) => record.recordId));
  const selectedRecordId =
    typeof input.selectedRecordId === 'string' && validRecordIds.has(input.selectedRecordId)
      ? input.selectedRecordId
      : fallback.selectedRecordId;

  return {
    version: 1,
    visibleBlockIds,
    selectedRecordId: validRecordIds.size > 0 ? selectedRecordId : null,
  };
}

export async function readBuilderDynamicTemplateDraft(
  templateId: BuilderDynamicTemplateId,
  localeInput: string | null | undefined,
  previewRecordId?: string | null
): Promise<BuilderDynamicTemplateDraftReadResult> {
  return readBuilderDynamicTemplateSnapshot('draft', templateId, localeInput, previewRecordId);
}

export async function readBuilderDynamicTemplatePublished(
  templateId: BuilderDynamicTemplateId,
  localeInput: string | null | undefined,
  previewRecordId?: string | null
): Promise<BuilderDynamicTemplateDraftReadResult> {
  return readBuilderDynamicTemplateSnapshot('published', templateId, localeInput, previewRecordId);
}

export async function readBuilderDynamicTemplatePublishedBlockVisibility(
  templateId: BuilderDynamicTemplateId,
  localeInput: string | null | undefined
): Promise<BuilderDynamicTemplateBlockVisibility> {
  const published = await readBuilderDynamicTemplatePublished(templateId, localeInput);
  return {
    persisted: published.persisted,
    revision: published.snapshot.revision,
    savedAt: published.snapshot.savedAt,
    visibleBlockIds: [...published.snapshot.state.visibleBlockIds],
  };
}

export function isBuilderDynamicTemplateBlockVisible(
  visibility: Pick<BuilderDynamicTemplateBlockVisibility, 'visibleBlockIds'>,
  blockId: string
): boolean {
  return visibility.visibleBlockIds.includes(blockId);
}

export async function readBuilderDynamicTemplateSnapshot(
  kind: BuilderDynamicTemplateSnapshotKind,
  templateId: BuilderDynamicTemplateId,
  localeInput: string | null | undefined,
  previewRecordId?: string | null
): Promise<BuilderDynamicTemplateDraftReadResult> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const store = resolveBuilderDynamicTemplateDraftStore();
  const raw = await store.read(getBuilderDynamicTemplateSnapshotPath(templateId, locale, kind));
  const detail = readBuilderDynamicTemplateDetail(
    templateId,
    locale,
    parseBuilderDynamicTemplateDraftSelectedRecordId(raw) ?? previewRecordId
  );

  if (!raw) {
    return {
      backend: store.backend,
      persisted: false,
      snapshot: materializeDefaultDraftSnapshot(detail, locale),
    };
  }

  const snapshot = parseBuilderDynamicTemplateDraftSnapshot(raw, detail, locale);
  if (!snapshot) {
    return {
      backend: store.backend,
      persisted: false,
      snapshot: materializeDefaultDraftSnapshot(detail, locale),
    };
  }

  return {
    backend: store.backend,
    persisted: true,
    snapshot,
  };
}

export async function writeBuilderDynamicTemplateDraft(
  input: BuilderDynamicTemplateDraftWriteInput
): Promise<BuilderDynamicTemplateDraftWriteResult> {
  const locale = normalizeLocale(input.locale);
  const detail = readBuilderDynamicTemplateDetail(
    input.templateId,
    locale,
    extractBuilderDynamicTemplateDraftSelectedRecordId(input.state)
  );
  const store = resolveBuilderDynamicTemplateDraftStore();
  const current = await readBuilderDynamicTemplateDraft(
    input.templateId,
    locale,
    extractBuilderDynamicTemplateDraftSelectedRecordId(input.state)
  );
  const snapshot: BuilderDynamicTemplateDraftSnapshot = {
    version: 1,
    templateId: input.templateId,
    locale,
    revision: current.snapshot.revision + 1,
    savedAt: new Date().toISOString(),
    updatedBy: sanitizeUpdatedBy(input.updatedBy),
    state: normalizeBuilderDynamicTemplateDraftState(detail, input.state),
  };

  await store.write(
    getBuilderDynamicTemplateSnapshotPath(input.templateId, locale, 'draft'),
    JSON.stringify(snapshot, null, 2)
  );

  return {
    backend: store.backend,
    snapshot,
  };
}

export async function publishBuilderDynamicTemplateDraft(
  input: BuilderDynamicTemplateDraftPublishInput
): Promise<BuilderDynamicTemplateDraftWriteResult> {
  const locale = normalizeLocale(input.locale);
  const store = resolveBuilderDynamicTemplateDraftStore();
  const draft = await readBuilderDynamicTemplateDraft(input.templateId, locale);
  if (!draft.persisted) {
    throw new BuilderDynamicTemplateDraftMissingError(input.templateId, locale);
  }

  const published = await readBuilderDynamicTemplatePublished(input.templateId, locale);
  const snapshot = buildPublishedBuilderDynamicTemplateSnapshot({
    draftSnapshot: draft.snapshot,
    currentPublishedSnapshot: published.snapshot,
    updatedBy: input.updatedBy,
  });

  await store.write(
    getBuilderDynamicTemplateSnapshotPath(input.templateId, locale, 'published'),
    JSON.stringify(snapshot, null, 2)
  );

  return {
    backend: store.backend,
    snapshot,
  };
}

export function buildPublishedBuilderDynamicTemplateSnapshot({
  draftSnapshot,
  currentPublishedSnapshot,
  updatedBy,
  savedAt = new Date().toISOString(),
}: {
  draftSnapshot: BuilderDynamicTemplateDraftSnapshot;
  currentPublishedSnapshot: BuilderDynamicTemplateDraftSnapshot;
  updatedBy?: string;
  savedAt?: string;
}): BuilderDynamicTemplateDraftSnapshot {
  return {
    version: 1,
    templateId: draftSnapshot.templateId,
    locale: draftSnapshot.locale,
    revision: currentPublishedSnapshot.revision + 1,
    savedAt,
    updatedBy: sanitizeUpdatedBy(updatedBy),
    state: {
      version: 1,
      visibleBlockIds: [...draftSnapshot.state.visibleBlockIds],
      selectedRecordId: draftSnapshot.state.selectedRecordId,
    },
  };
}

function materializeDefaultDraftSnapshot(
  detail: BuilderDynamicTemplateDetail,
  locale: Locale
): BuilderDynamicTemplateDraftSnapshot {
  return {
    version: 1,
    templateId: detail.templateId,
    locale,
    revision: 0,
    savedAt: null,
    updatedBy: null,
    state: createDefaultBuilderDynamicTemplateDraftState(detail),
  };
}

function parseBuilderDynamicTemplateDraftSnapshot(
  raw: string,
  detail: BuilderDynamicTemplateDetail,
  locale: Locale
): BuilderDynamicTemplateDraftSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) return null;
    if (parsed.version !== 1 || parsed.templateId !== detail.templateId || parsed.locale !== locale) {
      return null;
    }

    return {
      version: 1,
      templateId: detail.templateId,
      locale,
      revision: normalizeRevision(parsed.revision),
      savedAt: typeof parsed.savedAt === 'string' && parsed.savedAt.trim() ? parsed.savedAt : null,
      updatedBy:
        typeof parsed.updatedBy === 'string' && parsed.updatedBy.trim()
          ? parsed.updatedBy.trim().slice(0, 120)
          : null,
      state: normalizeBuilderDynamicTemplateDraftState(detail, parsed.state),
    };
  } catch {
    return null;
  }
}

function parseBuilderDynamicTemplateDraftSelectedRecordId(raw: string | null): string | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) return null;
    return extractBuilderDynamicTemplateDraftSelectedRecordId(parsed.state);
  } catch {
    return null;
  }
}

function extractBuilderDynamicTemplateDraftSelectedRecordId(input: unknown): string | null {
  if (!isPlainObject(input) || typeof input.selectedRecordId !== 'string') {
    return null;
  }

  const selectedRecordId = input.selectedRecordId.trim();
  return selectedRecordId || null;
}

function resolveBuilderDynamicTemplateDraftStore(): BuilderDynamicTemplateDraftStore {
  // Honor the same local-backend override as the site document store so QA
  // harnesses never write template drafts to the production Blob store.
  if (
    process.env.BLOB_READ_WRITE_TOKEN?.trim()
    && process.env.BUILDER_SITE_BACKEND !== 'local'
  ) {
    return createBlobBuilderDynamicTemplateDraftStore();
  }

  return createFileBuilderDynamicTemplateDraftStore();
}

function createBlobBuilderDynamicTemplateDraftStore(): BuilderDynamicTemplateDraftStore {
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
        if (isBlobNotFoundError(error)) return null;
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
  };
}

function createFileBuilderDynamicTemplateDraftStore(): BuilderDynamicTemplateDraftStore {
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
  };
}

function getBuilderDynamicTemplateSnapshotPath(
  templateId: BuilderDynamicTemplateId,
  locale: Locale,
  kind: BuilderDynamicTemplateSnapshotKind
): string {
  return `${BUILDER_DYNAMIC_TEMPLATE_STORAGE_ROOT}/${templateId}/${locale}/${kind}.json`;
}

function resolveRuntimePath(pathname: string): string {
  return path.join(BUILDER_DYNAMIC_TEMPLATE_RUNTIME_ROOT, pathname);
}

function normalizeRevision(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0;
  return Math.trunc(value);
}

function sanitizeUpdatedBy(value?: string): string {
  const trimmed = value?.trim() || BUILDER_DYNAMIC_TEMPLATE_UPDATED_BY;
  return trimmed.slice(0, 120);
}

function dedupeStrings(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== 'string' || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }

  return result;
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
