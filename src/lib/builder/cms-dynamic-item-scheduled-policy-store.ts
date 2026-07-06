import crypto from 'crypto';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import {
  normalizeCmsDynamicItemScheduledPolicyJob,
  type CmsDynamicItemScheduledPolicyJob,
  type ScheduleCmsDynamicItemPolicyInput,
} from '@/lib/builder/cms-dynamic-item-scheduled-policy-types';

const BLOB_PREFIX = 'builder-cms-dynamic-item-policy-schedules';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localRoot(): string {
  return process.env.BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT
    || path.join(process.cwd(), 'runtime-data', 'builder-cms-dynamic-item-policy-schedules');
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function blobPath(job: Pick<CmsDynamicItemScheduledPolicyJob, 'siteId' | 'jobId'>): string {
  return `${BLOB_PREFIX}/${safeSegment(job.siteId)}/${safeSegment(job.jobId)}.json`;
}

function localPath(job: Pick<CmsDynamicItemScheduledPolicyJob, 'siteId' | 'jobId'>): string {
  return path.join(localRoot(), safeSegment(job.siteId), `${safeSegment(job.jobId)}.json`);
}

function parseJob(raw: string): CmsDynamicItemScheduledPolicyJob | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return normalizeCmsDynamicItemScheduledPolicyJob(parsed);
  } catch {
    return null;
  }
}

export async function writeCmsDynamicItemScheduledPolicyJob(
  job: CmsDynamicItemScheduledPolicyJob,
): Promise<CmsDynamicItemScheduledPolicyJob> {
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

async function readJobsFromBlob(siteId?: string): Promise<CmsDynamicItemScheduledPolicyJob[]> {
  const prefix = siteId ? `${BLOB_PREFIX}/${safeSegment(siteId)}/` : `${BLOB_PREFIX}/`;
  const result = await list({ prefix });
  const jobs: CmsDynamicItemScheduledPolicyJob[] = [];
  for (const blob of result.blobs) {
    try {
      const entry = await get(blob.pathname, { access: 'private', useCache: false });
      if (!entry?.stream || entry.statusCode !== 200) continue;
      const parsed = parseJob(await new Response(entry.stream).text());
      if (parsed) jobs.push(parsed);
    } catch {
      continue;
    }
  }
  return jobs;
}

async function readJobsFromLocal(siteId?: string): Promise<CmsDynamicItemScheduledPolicyJob[]> {
  const root = siteId ? path.join(localRoot(), safeSegment(siteId)) : localRoot();
  const jobs: CmsDynamicItemScheduledPolicyJob[] = [];
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

export async function listCmsDynamicItemScheduledPolicies(
  siteId?: string,
  pageId?: string,
): Promise<CmsDynamicItemScheduledPolicyJob[]> {
  const jobs = isBlobBackend() ? await readJobsFromBlob(siteId) : await readJobsFromLocal(siteId);
  return jobs
    .filter((job) => !pageId || job.pageId === pageId)
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}

export async function cancelScheduledCmsDynamicItemPolicies(
  siteId: string,
  collectionId: string,
  pageId: string,
  reason: string = 'replaced by newer schedule',
): Promise<CmsDynamicItemScheduledPolicyJob[]> {
  const now = new Date().toISOString();
  const cancelled: CmsDynamicItemScheduledPolicyJob[] = [];
  for (const job of await listCmsDynamicItemScheduledPolicies(siteId, pageId)) {
    if (job.status !== 'scheduled' || job.collectionId !== collectionId) continue;
    cancelled.push(await writeCmsDynamicItemScheduledPolicyJob({
      ...job,
      status: 'cancelled',
      updatedAt: now,
      lastError: reason,
    }));
  }
  return cancelled;
}

export async function scheduleCmsDynamicItemPolicy(
  input: ScheduleCmsDynamicItemPolicyInput,
): Promise<CmsDynamicItemScheduledPolicyJob> {
  const scheduledMs = Date.parse(input.scheduledAt);
  if (!Number.isFinite(scheduledMs)) {
    throw new Error('Invalid scheduledAt timestamp.');
  }
  await cancelScheduledCmsDynamicItemPolicies(input.siteId, input.collectionId, input.pageId);
  const now = new Date().toISOString();
  return writeCmsDynamicItemScheduledPolicyJob({
    jobId: crypto.randomUUID(),
    siteId: input.siteId,
    locale: input.locale,
    collectionId: input.collectionId,
    pageId: input.pageId,
    kind: input.kind,
    scheduledAt: new Date(scheduledMs).toISOString(),
    status: 'scheduled',
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    ...(input.requestedBy === undefined ? {} : { requestedBy: input.requestedBy }),
    policy: input.policy,
  });
}
