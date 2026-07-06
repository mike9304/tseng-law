import { randomBytes } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { isBlobBlockedForDeployEnv } from '@/lib/builder/storage/blob-env-guard';
import type { GeneratedSiteDraft } from './orchestrator';
import { siteSpecSchema, type SiteSpec } from './site-spec';

export const AI_INTAKE_VERSION_CAP = 24;
export const DEFAULT_AI_INTAKE_SITE_ID = DEFAULT_BUILDER_SITE_ID;

export interface AiIntakeVersionRecord {
  readonly id: string;
  readonly siteId: string;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly promptVersion: string;
  readonly spec: SiteSpec;
  readonly draft: GeneratedSiteDraft;
}

export interface AiIntakeVersionSummary {
  readonly id: string;
  readonly siteId: string;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly companyName: string;
  readonly industry: SiteSpec['industry'];
  readonly locale: SiteSpec['locale'];
  readonly promptVersion: string;
  readonly pageCount: number;
  readonly sectionCount: number;
  readonly heroHeadline: string;
}

export type AiIntakeDiffValue = string | number | readonly string[] | null;

export interface AiIntakeDiffChange {
  readonly field: string;
  readonly before: AiIntakeDiffValue;
  readonly after: AiIntakeDiffValue;
}

export interface AiIntakeVersionDiff {
  readonly isEmpty: boolean;
  readonly specChanges: readonly AiIntakeDiffChange[];
  readonly draftChanges: readonly AiIntakeDiffChange[];
}

interface AppendAiIntakeVersionInput {
  readonly siteId?: string;
  readonly createdBy: string;
  readonly spec: SiteSpec;
  readonly draft: GeneratedSiteDraft;
  readonly promptVersion: string;
}

interface AppendAiIntakeVersionOptions {
  readonly cap?: number;
  readonly now?: () => string;
}

interface ListAiIntakeVersionsFilter {
  readonly locale?: SiteSpec['locale'];
}

interface AiIntakeVersionFile {
  readonly version: 1;
  readonly versions: readonly AiIntakeVersionRecord[];
}

type AiIntakeStorageBackend = 'blob' | 'file';

const BLOB_PREFIX = 'builder-ai-intake';
const siteIdSchema = z.string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_-]+$/);
const generatedDraftShapeSchema = z.object({
  spec: siteSpecSchema,
  content: z.object({
    hero: z.object({
      headline: z.string(),
      body: z.string(),
    }).passthrough(),
    sections: z.array(z.object({
      sectionId: z.string(),
    }).passthrough()),
  }).passthrough(),
  plan: z.object({
    sitemap: z.array(z.object({
      title: z.string(),
      slug: z.string(),
    }).passthrough()),
  }).passthrough(),
  generatedAt: z.string(),
  promptVersion: z.string(),
}).passthrough();

const generatedDraftSchema = z.custom<GeneratedSiteDraft>((value) => (
  generatedDraftShapeSchema.safeParse(value).success
));

const intakeVersionRecordSchema: z.ZodType<AiIntakeVersionRecord> = z.object({
  id: z.string().trim().min(1),
  siteId: siteIdSchema,
  createdAt: z.string().trim().min(1),
  createdBy: z.string().trim().min(1),
  promptVersion: z.string().trim().min(1),
  spec: siteSpecSchema,
  draft: generatedDraftSchema,
});

const intakeVersionFileSchema: z.ZodType<AiIntakeVersionFile> = z.object({
  version: z.literal(1),
  versions: z.array(intakeVersionRecordSchema),
});

const SPEC_DIFF_FIELDS = [
  'companyName',
  'industry',
  'tone',
  'colorPreference',
  'locale',
  'slogan',
  'audience',
  'goals',
  'desiredPages',
  'brandKeywords',
  'constraints',
  'visualDirection',
] as const;

type SpecDiffField = (typeof SPEC_DIFF_FIELDS)[number];

const siteQueues = new Map<string, Promise<void>>();

function storageRoot(): string {
  return process.env.BUILDER_AI_INTAKE_ROOT
    ? path.resolve(process.env.BUILDER_AI_INTAKE_ROOT)
    : path.join(process.cwd(), 'runtime-data', 'ai-intake');
}

function storageBackend(): AiIntakeStorageBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.BUILDER_AI_INTAKE_BACKEND === 'local') return 'file';
  if (isBlobBlockedForDeployEnv()) return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function normalizeSiteId(siteId?: string): string {
  const parsed = siteIdSchema.safeParse(normalizeBuilderSiteId(siteId));
  return parsed.success ? parsed.data : DEFAULT_AI_INTAKE_SITE_ID;
}

function fileForSite(siteId: string): string {
  return path.join(storageRoot(), siteId, 'versions.json');
}

function blobForSite(siteId: string): string {
  return `${BLOB_PREFIX}/${siteId}/versions.json`;
}

function isErrorWithCode(error: unknown, code: string): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === code;
}

function emptyVersionFile(): AiIntakeVersionFile {
  return { version: 1, versions: [] };
}

function parseVersionFile(raw: string, siteId: string): AiIntakeVersionFile {
  try {
    return intakeVersionFileSchema.parse(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof z.ZodError) {
      const ledgerError: Error & { cause?: unknown } = new Error(`AI intake version ledger for ${siteId} is unreadable`);
      ledgerError.cause = error;
      throw ledgerError;
    }
    throw error;
  }
}

async function withSiteLock<T>(siteId: string, task: () => Promise<T>): Promise<T> {
  const previous = siteQueues.get(siteId) ?? Promise.resolve();
  let release: () => void = () => {};
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const next = previous.catch(() => undefined).then(() => current);
  siteQueues.set(siteId, next);
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
    if (siteQueues.get(siteId) === next) siteQueues.delete(siteId);
  }
}

async function readFileForSite(siteId: string): Promise<AiIntakeVersionFile> {
  if (storageBackend() === 'blob') {
    const result = await get(blobForSite(siteId), { access: 'private', useCache: false });
    if (!result) return emptyVersionFile();
    if (result.statusCode !== 200) return emptyVersionFile();
    return parseVersionFile(await new Response(result.stream).text(), siteId);
  }

  try {
    const raw = await fs.readFile(fileForSite(siteId), 'utf8');
    return parseVersionFile(raw, siteId);
  } catch (error) {
    if (isErrorWithCode(error, 'ENOENT')) return emptyVersionFile();
    throw error;
  }
}

async function writeFileForSite(siteId: string, file: AiIntakeVersionFile): Promise<void> {
  const body = JSON.stringify(file, null, 2);
  if (storageBackend() === 'blob') {
    await put(blobForSite(siteId), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  const target = fileForSite(siteId);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, 'utf8');
}

function makeVersionId(): string {
  return `ver_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

function summaryFromRecord(record: AiIntakeVersionRecord): AiIntakeVersionSummary {
  return {
    id: record.id,
    siteId: record.siteId,
    createdAt: record.createdAt,
    createdBy: record.createdBy,
    companyName: record.spec.companyName,
    industry: record.spec.industry,
    locale: record.spec.locale,
    promptVersion: record.promptVersion,
    pageCount: record.draft.plan.sitemap.length,
    sectionCount: record.draft.content.sections.length,
    heroHeadline: record.draft.content.hero.headline,
  };
}

function specValue(spec: SiteSpec, field: SpecDiffField): AiIntakeDiffValue {
  switch (field) {
    case 'companyName':
      return spec.companyName;
    case 'industry':
      return spec.industry;
    case 'tone':
      return spec.tone;
    case 'colorPreference':
      return spec.colorPreference;
    case 'locale':
      return spec.locale;
    case 'slogan':
      return spec.slogan ?? null;
    case 'audience':
      return spec.audience ?? null;
    case 'goals':
      return spec.goals ?? [];
    case 'desiredPages':
      return spec.desiredPages ?? [];
    case 'brandKeywords':
      return spec.brandKeywords ?? [];
    case 'constraints':
      return spec.constraints ?? null;
    case 'visualDirection':
      return spec.visualDirection ?? null;
  }
}

function equalDiffValue(left: AiIntakeDiffValue, right: AiIntakeDiffValue): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function changeFor(field: string, before: AiIntakeDiffValue, after: AiIntakeDiffValue): AiIntakeDiffChange | null {
  if (equalDiffValue(before, after)) return null;
  return { field, before, after };
}

export async function appendAiIntakeVersion(
  input: AppendAiIntakeVersionInput,
  options: AppendAiIntakeVersionOptions = {},
): Promise<AiIntakeVersionRecord> {
  const siteId = normalizeSiteId(input.siteId);
  return withSiteLock(siteId, async () => {
    const file = await readFileForSite(siteId);
    const record: AiIntakeVersionRecord = {
      id: makeVersionId(),
      siteId,
      createdAt: options.now?.() ?? new Date().toISOString(),
      createdBy: input.createdBy,
      promptVersion: input.promptVersion,
      spec: input.spec,
      draft: input.draft,
    };
    const cap = options.cap ?? AI_INTAKE_VERSION_CAP;
    const versions = [record, ...file.versions].slice(0, cap);
    await writeFileForSite(siteId, { version: 1, versions });
    return record;
  });
}

export async function listAiIntakeVersions(
  siteIdInput = DEFAULT_AI_INTAKE_SITE_ID,
  filter: ListAiIntakeVersionsFilter = {},
): Promise<AiIntakeVersionSummary[]> {
  const siteId = normalizeSiteId(siteIdInput);
  const file = await readFileForSite(siteId);
  return file.versions
    .filter((version) => !filter.locale || version.spec.locale === filter.locale)
    .map(summaryFromRecord)
    .sort((left, right) => (left.createdAt < right.createdAt ? 1 : -1));
}

export async function getAiIntakeVersion(
  siteIdInput: string,
  versionId: string,
): Promise<AiIntakeVersionRecord | null> {
  const siteId = normalizeSiteId(siteIdInput);
  const file = await readFileForSite(siteId);
  return file.versions.find((version) => version.id === versionId) ?? null;
}

export function diffAiIntakeVersions(
  before: AiIntakeVersionRecord,
  after: AiIntakeVersionRecord,
): AiIntakeVersionDiff {
  const specChanges = SPEC_DIFF_FIELDS
    .map((field) => changeFor(field, specValue(before.spec, field), specValue(after.spec, field)))
    .filter((change): change is AiIntakeDiffChange => Boolean(change));
  const draftChanges = [
    changeFor('pageCount', before.draft.plan.sitemap.length, after.draft.plan.sitemap.length),
    changeFor('sectionCount', before.draft.content.sections.length, after.draft.content.sections.length),
    changeFor('heroHeadline', before.draft.content.hero.headline, after.draft.content.hero.headline),
    changeFor('promptVersion', before.promptVersion, after.promptVersion),
  ].filter((change): change is AiIntakeDiffChange => Boolean(change));
  return {
    isEmpty: specChanges.length === 0 && draftChanges.length === 0,
    specChanges,
    draftChanges,
  };
}

export function aiIntakeVersionSummary(record: AiIntakeVersionRecord): AiIntakeVersionSummary {
  return summaryFromRecord(record);
}

export function normalizeAiIntakeSiteId(siteId?: string): string {
  return normalizeSiteId(siteId);
}
