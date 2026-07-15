import { randomBytes } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { isBlobBlockedForDeployEnv } from '@/lib/builder/storage/blob-env-guard';
import type { GeneratedSiteDraft } from './orchestrator';
import {
  INDUSTRIES,
  siteSpecSchema,
  type SiteSpec,
} from './site-spec';

export const AI_INTAKE_VERSION_CAP = 24;
export const DEFAULT_AI_INTAKE_SITE_ID = DEFAULT_BUILDER_SITE_ID;

export type AiIntakeProvenance = 'openai-verified' | 'local-demo' | 'legacy-unverified';

export const AI_INTAKE_UNTRUSTED_APPEND_ERROR = 'AI intake version ledger rejected an untrusted draft';

export const AI_INTAKE_RESTORE_ERROR_CODE = 'intake_version_untrusted';

export const AI_INTAKE_RESTORE_BLOCKED_MESSAGE =
  '출처가 검증된 OpenAI 생성 결과만 복원할 수 있습니다. 이 기록은 미리보기/이력 용도입니다.';

const AI_INTAKE_PROVENANCE_WARNINGS: Record<AiIntakeProvenance, string> = {
  'openai-verified': 'OpenAI 생성 결과로 신뢰할 수 있습니다.',
  'local-demo':
    '로컬 데모/미리보기 생성안입니다. 실제 AI 출력이 아니므로 복원·적용할 수 없습니다.',
  'legacy-unverified':
    '과거 생성 이력으로 출처가 검증되지 않았습니다. 미리보기/이력 용도이며 복원·적용할 수 없습니다.',
};

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
  readonly provenance: AiIntakeProvenance;
  readonly restorable: boolean;
  readonly provenanceWarning: string;
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
const canonicalIsoInstantSchema = z.string().refine((value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}, 'Expected a canonical ISO-8601 UTC instant');
const calendarDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Expected a valid calendar date');
const paletteSchema = z.object({
  primary: z.string().trim().min(1),
  secondary: z.string().trim().min(1),
  accent: z.string().trim().min(1),
  background: z.string().trim().min(1),
}).passthrough();
const blueprintSectionSchema = z.enum([
  'hero',
  'about',
  'services',
  'expertise',
  'team',
  'reviews',
  'process',
  'gallery',
  'pricing',
  'faq',
  'contact',
  'cta',
]);
const generatedSectionSchema = z.object({
  sectionId: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  body: z.string(),
  ctaLabel: z.string().optional(),
  bullets: z.array(z.string()).optional(),
}).passthrough();
const strictGeneratedDraftSchema = z.object({
  spec: siteSpecSchema,
  blueprint: z.object({
    industry: z.enum(INDUSTRIES),
    sections: z.array(blueprintSectionSchema),
    heroHeadlineHint: z.string().trim().min(1),
    palettes: z.object({
      warm: paletteSchema,
      cool: paletteSchema,
      neutral: paletteSchema,
      'high-contrast': paletteSchema,
      pastel: paletteSchema,
    }),
  }).passthrough(),
  palette: paletteSchema,
  content: z.object({
    hero: generatedSectionSchema,
    sections: z.array(generatedSectionSchema),
    metaDescription: z.string(),
    source: z.literal('openai'),
    stub: z.literal(false),
  }).passthrough(),
  plan: z.object({
    sitemap: z.array(z.object({
      title: z.string().trim().min(1),
      slug: z.string(),
      purpose: z.string(),
      sections: z.array(z.string()),
    }).passthrough()),
    contentPlan: z.array(z.object({
      sectionId: z.string().trim().min(1),
      title: z.string(),
      intent: z.string(),
    }).passthrough()),
    visualBrief: z.object({
      direction: z.string(),
      imagePrompt: z.string(),
      treatment: z.string(),
      composition: z.string(),
    }).passthrough(),
    brandBrief: z.object({
      audience: z.string(),
      goals: z.array(z.string()),
      keywords: z.array(z.string()),
      constraints: z.string(),
    }).passthrough(),
  }).passthrough(),
  generatedAt: canonicalIsoInstantSchema,
  promptVersion: z.string().trim().min(1),
  blueprintVersion: z.string().trim().min(1),
  contentVersion: z.string().trim().min(1),
  promptChangelog: z.array(z.object({
    version: z.string().trim().min(1),
    label: z.string(),
    summary: z.string(),
    createdAt: calendarDateSchema,
    changes: z.array(z.string()),
  }).passthrough()),
}).passthrough().superRefine((draft, context) => {
  if (draft.blueprint.industry !== draft.spec.industry) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['blueprint', 'industry'],
      message: 'Blueprint industry must match draft spec industry',
    });
  }
  if (!draft.promptChangelog.some((entry) => entry.version === draft.promptVersion)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['promptChangelog'],
      message: 'Prompt changelog must contain the active prompt version',
    });
  }
});

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const legacySpecSchema = z.custom<SiteSpec>(isPlainRecord);
const legacyDraftSchema = z.custom<GeneratedSiteDraft>(isPlainRecord);

// Ledger reads intentionally retain structurally damaged historical rows so the
// UI can disclose them as legacy/unverified. The strict schemas below are the
// only authority for append and restore decisions.
const intakeVersionRecordSchema: z.ZodType<AiIntakeVersionRecord> = z.object({
  id: z.string().trim().min(1),
  siteId: siteIdSchema,
  createdAt: z.string(),
  createdBy: z.string().trim().min(1),
  promptVersion: z.string(),
  spec: legacySpecSchema,
  draft: legacyDraftSchema,
}).passthrough();

const strictIntakeVersionRecordSchema = z.object({
  id: z.string().trim().min(1),
  siteId: siteIdSchema,
  createdAt: canonicalIsoInstantSchema,
  createdBy: z.string().trim().min(1),
  promptVersion: z.string().trim().min(1),
  spec: siteSpecSchema,
  draft: strictGeneratedDraftSchema,
}).passthrough().superRefine((record, context) => {
  if ('ledgerIntegrity' in record) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['ledgerIntegrity'],
      message: 'Recovered malformed ledger rows are never restorable',
    });
  }
  if (JSON.stringify(record.spec) !== JSON.stringify(record.draft.spec)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['draft', 'spec'],
      message: 'Record and draft specs must match',
    });
  }
  if (record.promptVersion !== record.draft.promptVersion) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['draft', 'promptVersion'],
      message: 'Record and draft prompt versions must match',
    });
  }
  if (new Date(record.createdAt).getTime() < new Date(record.draft.generatedAt).getTime()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['createdAt'],
      message: 'Ledger timestamp cannot precede draft generation',
    });
  }
});

export function isStrictGeneratedSiteDraft(value: unknown): value is GeneratedSiteDraft {
  return strictGeneratedDraftSchema.safeParse(value).success;
}

export function classifyIntakeProvenance(draft: unknown): AiIntakeProvenance {
  if (!isPlainRecord(draft) || !isPlainRecord(draft.content)) return 'legacy-unverified';
  if (draft.content.source === 'local-demo' || draft.content.stub === true) return 'local-demo';
  if (draft.content.source === 'openai'
    && draft.content.stub === false
    && isStrictGeneratedSiteDraft(draft)) {
    return 'openai-verified';
  }
  return 'legacy-unverified';
}

export function isIntakeVersionRestorable(
  record: unknown,
  expectedSiteId?: string,
): record is AiIntakeVersionRecord {
  const parsed = strictIntakeVersionRecordSchema.safeParse(record);
  if (!parsed.success) return false;
  return expectedSiteId === undefined || parsed.data.siteId === normalizeSiteId(expectedSiteId);
}

const intakeVersionFileEnvelopeSchema = z.object({
  version: z.literal(1),
  versions: z.array(z.unknown()),
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
    const envelope = intakeVersionFileEnvelopeSchema.parse(JSON.parse(raw));
    return {
      version: 1,
      versions: envelope.versions.map((value, index) => {
        const parsed = intakeVersionRecordSchema.safeParse(value);
        if (parsed.success) return parsed.data;
        const rawRecord = isPlainRecord(value) ? value : {};
        return {
          id: stringValue(rawRecord.id, `legacy-malformed-${index}`),
          siteId: siteIdSchema.safeParse(rawRecord.siteId).success
            ? rawRecord.siteId as string
            : siteId,
          createdAt: typeof rawRecord.createdAt === 'string' ? rawRecord.createdAt : '',
          createdBy: stringValue(rawRecord.createdBy, 'legacy-unknown'),
          promptVersion: typeof rawRecord.promptVersion === 'string' ? rawRecord.promptVersion : '',
          spec: isPlainRecord(rawRecord.spec) ? rawRecord.spec as SiteSpec : {} as SiteSpec,
          draft: isPlainRecord(rawRecord.draft)
            ? rawRecord.draft as unknown as GeneratedSiteDraft
            : {} as GeneratedSiteDraft,
          ledgerIntegrity: 'malformed',
        } as AiIntakeVersionRecord;
      }),
    };
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

function recordValue(record: unknown, key: string): unknown {
  return isPlainRecord(record) ? record[key] : undefined;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function arrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function summaryFromRecord(
  record: AiIntakeVersionRecord,
  expectedSiteId?: string,
  expectedLocale?: SiteSpec['locale'],
): AiIntakeVersionSummary {
  const restorable = isIntakeVersionRestorable(record, expectedSiteId);
  const draft = recordValue(record, 'draft');
  const spec = recordValue(record, 'spec');
  const content = recordValue(draft, 'content');
  const plan = recordValue(draft, 'plan');
  const hero = recordValue(content, 'hero');
  const rawProvenance = classifyIntakeProvenance(draft);
  const provenance: AiIntakeProvenance = restorable
    ? 'openai-verified'
    : rawProvenance === 'local-demo' ? 'local-demo' : 'legacy-unverified';
  const industry = recordValue(spec, 'industry');
  const locale = recordValue(spec, 'locale');
  return {
    id: record.id,
    siteId: expectedSiteId ?? record.siteId,
    createdAt: record.createdAt,
    createdBy: record.createdBy,
    companyName: stringValue(recordValue(spec, 'companyName'), 'Legacy AI draft'),
    industry: INDUSTRIES.includes(industry as SiteSpec['industry'])
      ? industry as SiteSpec['industry']
      : 'other',
    locale: locale === 'ko' || locale === 'en' || locale === 'zh-hant'
      ? locale
      : expectedLocale ?? 'ko',
    promptVersion: stringValue(record.promptVersion, 'unknown'),
    pageCount: arrayLength(recordValue(plan, 'sitemap')),
    sectionCount: arrayLength(recordValue(content, 'sections')),
    heroHeadline: stringValue(recordValue(hero, 'headline'), 'Unavailable'),
    provenance,
    restorable,
    provenanceWarning: AI_INTAKE_PROVENANCE_WARNINGS[provenance],
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
    if (!isIntakeVersionRestorable(record, siteId)) {
      throw new Error(AI_INTAKE_UNTRUSTED_APPEND_ERROR);
    }
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
    .filter((version) => {
      if (!filter.locale) return true;
      const rawLocale = recordValue(recordValue(version, 'spec'), 'locale');
      return rawLocale === filter.locale || (rawLocale !== 'ko' && rawLocale !== 'en' && rawLocale !== 'zh-hant');
    })
    .map((version) => summaryFromRecord(version, siteId, filter.locale))
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
  const beforeDraft = recordValue(before, 'draft');
  const afterDraft = recordValue(after, 'draft');
  const beforePlan = recordValue(beforeDraft, 'plan');
  const afterPlan = recordValue(afterDraft, 'plan');
  const beforeContent = recordValue(beforeDraft, 'content');
  const afterContent = recordValue(afterDraft, 'content');
  const beforeHero = recordValue(beforeContent, 'hero');
  const afterHero = recordValue(afterContent, 'hero');
  const specChanges = SPEC_DIFF_FIELDS
    .map((field) => changeFor(field, specValue(before.spec, field), specValue(after.spec, field)))
    .filter((change): change is AiIntakeDiffChange => Boolean(change));
  const draftChanges = [
    changeFor('pageCount', arrayLength(recordValue(beforePlan, 'sitemap')), arrayLength(recordValue(afterPlan, 'sitemap'))),
    changeFor('sectionCount', arrayLength(recordValue(beforeContent, 'sections')), arrayLength(recordValue(afterContent, 'sections'))),
    changeFor('heroHeadline', stringValue(recordValue(beforeHero, 'headline'), ''), stringValue(recordValue(afterHero, 'headline'), '')),
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
