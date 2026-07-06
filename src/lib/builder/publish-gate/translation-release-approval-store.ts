import { mkdir, readFile, writeFile, readdir } from 'fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'path';
import { z } from 'zod';
import {
  isBuilderRoleNameValue,
  type BuilderRoleName,
} from '@/lib/builder/security/user-role-store';
import { locales, type Locale } from '@/lib/locales';
import {
  TRANSLATION_RELEASE_APPROVAL_STATUSES,
  type TranslationReleaseApprovalContext,
  type TranslationReleaseApprovalRequest,
  type TranslationReleaseApprovalStatus,
} from './translation-release-approval-model';
import type { TranslationSiteWarningSummary } from './translation-site-summary';

const builderRoleNameSchema: z.ZodType<BuilderRoleName> = z.custom<BuilderRoleName>(
  isBuilderRoleNameValue,
  'Invalid builder role.',
);

const translationSiteWarningSummarySchema = z.object({
  sourceLocale: z.enum(locales),
  syncedAt: z.string().datetime({ offset: true }),
  totalCount: z.number().int().nonnegative(),
  currentPageCount: z.number().int().nonnegative(),
  otherPageCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  reviewHref: z.string().trim().min(1).max(320),
  warningFingerprint: z.string().trim().min(1).max(80),
}).strict() satisfies z.ZodType<TranslationSiteWarningSummary>;

const approvalRequestSchema = z.object({
  id: z.string().trim().min(1).max(120),
  siteId: z.string().trim().min(1).max(120),
  pageId: z.string().trim().min(1).max(180),
  locale: z.enum(locales),
  warningFingerprint: z.string().trim().min(1).max(80),
  summary: translationSiteWarningSummarySchema,
  requestedBy: z.string().trim().min(1).max(180),
  requestedRole: builderRoleNameSchema,
  requestedAt: z.string().datetime({ offset: true }),
  status: z.enum(TRANSLATION_RELEASE_APPROVAL_STATUSES),
  reviewedBy: z.string().trim().min(1).max(180).optional(),
  reviewedAt: z.string().datetime({ offset: true }).optional(),
  comment: z.string().trim().max(500).optional(),
}).strict() satisfies z.ZodType<TranslationReleaseApprovalRequest>;

const writeQueues = new Map<string, Promise<void>>();

function createDeferred(): {
  readonly promise: Promise<void>;
  readonly resolve: () => void;
} {
  let resolveDeferred = (): void => undefined;
  const promise = new Promise<void>((resolve) => {
    resolveDeferred = resolve;
  });
  return { promise, resolve: resolveDeferred };
}

function rootDir(): string {
  return process.env.BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT
    || path.join(process.cwd(), 'runtime-data', 'translation-release-approvals');
}

function fileFor(id: string): string {
  return path.join(rootDir(), `${id}.json`);
}

function makeApprovalId(): string {
  return `trapv_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

async function withLock<T>(id: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(id) ?? Promise.resolve();
  const deferred = createDeferred();
  const current = deferred.promise;
  writeQueues.set(id, previous.catch(() => undefined).then(() => current));
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    deferred.resolve();
    if (writeQueues.get(id) === current) writeQueues.delete(id);
  }
}

async function readApprovalFile(id: string): Promise<TranslationReleaseApprovalRequest | null> {
  try {
    const text = await readFile(fileFor(id), 'utf8');
    return approvalRequestSchema.parse(JSON.parse(text));
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

async function writeApprovalFile(request: TranslationReleaseApprovalRequest): Promise<void> {
  await mkdir(rootDir(), { recursive: true });
  await writeFile(fileFor(request.id), JSON.stringify(request, null, 2), 'utf8');
}

export async function requestTranslationReleaseApproval(input: {
  readonly siteId: string;
  readonly pageId: string;
  readonly locale: Locale;
  readonly summary: TranslationSiteWarningSummary;
  readonly requestedBy: string;
  readonly requestedRole: BuilderRoleName;
  readonly comment?: string;
}): Promise<TranslationReleaseApprovalRequest> {
  const request: TranslationReleaseApprovalRequest = {
    id: makeApprovalId(),
    siteId: input.siteId,
    pageId: input.pageId,
    locale: input.locale,
    warningFingerprint: input.summary.warningFingerprint,
    summary: input.summary,
    requestedBy: input.requestedBy,
    requestedRole: input.requestedRole,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    ...(input.comment ? { comment: input.comment.slice(0, 500) } : {}),
  };
  await withLock(request.id, () => writeApprovalFile(request));
  return request;
}

export async function listTranslationReleaseApprovals(filter?: {
  readonly context?: TranslationReleaseApprovalContext;
  readonly status?: TranslationReleaseApprovalStatus;
}): Promise<TranslationReleaseApprovalRequest[]> {
  let files: string[];
  try {
    files = await readdir(rootDir());
  } catch (error) {
    if (error instanceof Error) return [];
    throw error;
  }

  const results: TranslationReleaseApprovalRequest[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const id = file.slice(0, -5);
    const approval = await readApprovalFile(id);
    if (!approval) continue;
    if (filter?.status && approval.status !== filter.status) continue;
    if (filter?.context && !matchesContext(approval, filter.context)) continue;
    results.push(approval);
  }
  return results.sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
}

export async function getTranslationReleaseApproval(
  id: string,
): Promise<TranslationReleaseApprovalRequest | null> {
  return readApprovalFile(id);
}

export async function getLatestTranslationReleaseApprovalForContext(
  context: TranslationReleaseApprovalContext,
): Promise<TranslationReleaseApprovalRequest | null> {
  const approvals = await listTranslationReleaseApprovals({ context });
  return approvals[0] ?? null;
}

export async function approveTranslationReleaseApproval(
  id: string,
  reviewer: string,
  comment?: string,
): Promise<TranslationReleaseApprovalRequest | null> {
  return transitionTranslationReleaseApproval(id, 'approved', reviewer, comment);
}

export async function rejectTranslationReleaseApproval(
  id: string,
  reviewer: string,
  comment?: string,
): Promise<TranslationReleaseApprovalRequest | null> {
  return transitionTranslationReleaseApproval(id, 'rejected', reviewer, comment);
}

function sameReviewer(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

async function transitionTranslationReleaseApproval(
  id: string,
  next: 'approved' | 'rejected',
  reviewer: string,
  comment?: string,
): Promise<TranslationReleaseApprovalRequest | null> {
  return withLock(id, async () => {
    const current = await readApprovalFile(id);
    if (!current) return null;
    if (current.status !== 'pending') throw new Error('approval_already_resolved');
    if (sameReviewer(current.requestedBy, reviewer)) {
      throw new Error('approval_self_review_forbidden');
    }
    const updated: TranslationReleaseApprovalRequest = {
      ...current,
      status: next,
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString(),
      ...(comment ? { comment: comment.slice(0, 500) } : {}),
    };
    await writeApprovalFile(updated);
    return updated;
  });
}

function matchesContext(
  approval: TranslationReleaseApprovalRequest,
  context: TranslationReleaseApprovalContext,
): boolean {
  return approval.siteId === context.siteId
    && approval.pageId === context.pageId
    && approval.locale === context.locale
    && approval.warningFingerprint === context.warningFingerprint;
}
