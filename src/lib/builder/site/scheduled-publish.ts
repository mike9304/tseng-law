import crypto from 'crypto';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import { publishPage } from '@/lib/builder/site/publish';

export type ScheduledPublishStatus =
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'cancelled';

export interface ScheduledPublishJob {
  jobId: string;
  siteId: string;
  pageId: string;
  locale: Locale;
  scheduledAt: string;
  expectedDraftRevision?: number;
  status: ScheduledPublishStatus;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  requestedBy?: string;
  lastError?: string;
  publishedRevisionId?: string;
  publishedRevision?: number;
  publishedSavedAt?: string;
}

export interface SchedulePagePublishInput {
  siteId: string;
  pageId: string;
  locale: Locale;
  scheduledAt: string;
  expectedDraftRevision?: number;
  requestedBy?: string;
}

export interface ScheduledPublishRunResult {
  checked: number;
  due: number;
  published: number;
  failed: number;
  skipped: number;
  jobs: ScheduledPublishJob[];
}

const BLOB_PREFIX = 'builder-scheduled-publish';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localRoot(): string {
  return process.env.BUILDER_SCHEDULED_PUBLISH_ROOT
    || path.join(process.cwd(), 'runtime-data', 'builder-scheduled-publish');
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function blobPath(job: Pick<ScheduledPublishJob, 'siteId' | 'jobId'>): string {
  return `${BLOB_PREFIX}/${safeSegment(job.siteId)}/${safeSegment(job.jobId)}.json`;
}

function localPath(job: Pick<ScheduledPublishJob, 'siteId' | 'jobId'>): string {
  return path.join(localRoot(), safeSegment(job.siteId), `${safeSegment(job.jobId)}.json`);
}

function parseJob(raw: string): ScheduledPublishJob | null {
  try {
    const parsed = JSON.parse(raw) as ScheduledPublishJob;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.jobId || !parsed.siteId || !parsed.pageId || !parsed.scheduledAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeJob(job: ScheduledPublishJob): Promise<ScheduledPublishJob> {
  const body = JSON.stringify(job, null, 2);
  if (isBlobBackend()) {
    await put(blobPath(job), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return job;
  }
  const file = localPath(job);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  return job;
}

async function readJobsFromBlob(siteId?: string): Promise<ScheduledPublishJob[]> {
  const prefix = siteId ? `${BLOB_PREFIX}/${safeSegment(siteId)}/` : `${BLOB_PREFIX}/`;
  const result = await list({ prefix });
  const jobs: ScheduledPublishJob[] = [];
  for (const blob of result.blobs) {
    try {
      const entry = await get(blob.pathname, { access: 'private', useCache: false });
      if (!entry?.stream || entry.statusCode !== 200) continue;
      const parsed = parseJob(await new Response(entry.stream).text());
      if (parsed) jobs.push(parsed);
    } catch {
      // Skip unreadable schedule entries instead of blocking all due jobs.
    }
  }
  return jobs;
}

async function readJobsFromLocal(siteId?: string): Promise<ScheduledPublishJob[]> {
  const root = siteId ? path.join(localRoot(), safeSegment(siteId)) : localRoot();
  const jobs: ScheduledPublishJob[] = [];
  const siteDirs = siteId
    ? [root]
    : (await readdir(root, { withFileTypes: true }).catch(() => []))
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(root, entry.name));

  for (const dir of siteDirs) {
    const files = await readdir(dir).catch(() => []);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const parsed = parseJob(await readFile(path.join(dir, file), 'utf8').catch(() => ''));
      if (parsed) jobs.push(parsed);
    }
  }
  return jobs;
}

export async function listScheduledPublishes(
  siteId?: string,
  pageId?: string,
): Promise<ScheduledPublishJob[]> {
  const jobs = isBlobBackend()
    ? await readJobsFromBlob(siteId)
    : await readJobsFromLocal(siteId);
  return jobs
    .filter((job) => !pageId || job.pageId === pageId)
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}

export async function getActiveScheduledPublish(
  siteId: string,
  pageId: string,
): Promise<ScheduledPublishJob | null> {
  const jobs = await listScheduledPublishes(siteId, pageId);
  return jobs.find((job) => job.status === 'scheduled' || job.status === 'publishing') ?? null;
}

export async function cancelScheduledPublishes(
  siteId: string,
  pageId: string,
  reason: string = 'cancelled',
): Promise<ScheduledPublishJob[]> {
  const now = new Date().toISOString();
  const jobs = await listScheduledPublishes(siteId, pageId);
  const cancelled: ScheduledPublishJob[] = [];
  for (const job of jobs) {
    if (job.status !== 'scheduled') continue;
    cancelled.push(await writeJob({
      ...job,
      status: 'cancelled',
      updatedAt: now,
      lastError: reason,
    }));
  }
  return cancelled;
}

export async function schedulePagePublish(input: SchedulePagePublishInput): Promise<ScheduledPublishJob> {
  const scheduledMs = Date.parse(input.scheduledAt);
  if (!Number.isFinite(scheduledMs)) {
    throw new Error('Invalid scheduledAt timestamp.');
  }

  await cancelScheduledPublishes(input.siteId, input.pageId, 'replaced by newer schedule');

  const now = new Date().toISOString();
  const job: ScheduledPublishJob = {
    jobId: crypto.randomUUID(),
    siteId: input.siteId,
    pageId: input.pageId,
    locale: input.locale,
    scheduledAt: new Date(scheduledMs).toISOString(),
    expectedDraftRevision: input.expectedDraftRevision,
    status: 'scheduled',
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    requestedBy: input.requestedBy,
  };
  return writeJob(job);
}

export async function runDueScheduledPublishes(
  options: { now?: Date; limit?: number } = {},
): Promise<ScheduledPublishRunResult> {
  const nowMs = options.now?.getTime() ?? Date.now();
  const limit = Math.max(1, options.limit ?? 20);
  const allJobs = await listScheduledPublishes();
  const dueJobs = allJobs
    .filter((job) => job.status === 'scheduled' && Date.parse(job.scheduledAt) <= nowMs)
    .sort((left, right) => Date.parse(left.scheduledAt) - Date.parse(right.scheduledAt))
    .slice(0, limit);

  const touched: ScheduledPublishJob[] = [];
  let published = 0;
  let failed = 0;

  for (const job of dueJobs) {
    const startedAt = new Date().toISOString();
    await writeJob({
      ...job,
      status: 'publishing',
      attempts: job.attempts + 1,
      updatedAt: startedAt,
      lastError: undefined,
    });

    try {
      const result = await publishPage(job.siteId, job.pageId, {
        expectedDraftRevision: job.expectedDraftRevision,
      });
      const nextJob = await writeJob({
        ...job,
        status: 'published',
        attempts: job.attempts + 1,
        updatedAt: result.publishedSavedAt,
        publishedRevisionId: result.publishedRevisionId,
        publishedRevision: result.publishedRevision,
        publishedSavedAt: result.publishedSavedAt,
        lastError: undefined,
      });
      touched.push(nextJob);
      published += 1;
    } catch (error) {
      const nextJob = await writeJob({
        ...job,
        status: 'failed',
        attempts: job.attempts + 1,
        updatedAt: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : 'Scheduled publish failed.',
      });
      touched.push(nextJob);
      failed += 1;
    }
  }

  return {
    checked: allJobs.length,
    due: dueJobs.length,
    published,
    failed,
    skipped: Math.max(0, allJobs.length - dueJobs.length),
    jobs: touched,
  };
}
