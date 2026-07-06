import { randomBytes } from 'node:crypto';
import { rmSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { appHookEventSchema, toAppHookEvent } from './hook-event-schema';
import { APP_HOOK_KINDS, type AppHookEvent, type AppHookKind } from './hooks-model';
import type { BuilderFunctionInvocationResult } from '@/lib/builder/dev/function-invoker';

const DELIVERY_FILE_VERSION = 1;
const MAX_DELIVERIES = 500;
const deliveryStatusSchema = z.enum(['succeeded', 'failed']);
const runtimeSchema = z.literal('worker-vm');
let deliveryWriteQueue: Promise<void> = Promise.resolve();

export type AppHookDeliveryStatus = z.infer<typeof deliveryStatusSchema>;

export interface StoredAppHookDeliveryRecord {
  readonly deliveryId: string;
  readonly retryOfDeliveryId?: string;
  readonly appId: string;
  readonly hookId: string;
  readonly kind: AppHookKind;
  readonly status: AppHookDeliveryStatus;
  readonly attempt: number;
  readonly event: AppHookEvent;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly logCount: number;
  readonly runtime?: BuilderFunctionInvocationResult['runtime'];
  readonly durationMs?: number;
  readonly resultPreview?: string;
  readonly error?: string;
  readonly timedOut?: boolean;
}

export interface StoredAppHookDeliveryQuery {
  readonly appId?: string;
  readonly hookId?: string;
  readonly kind?: AppHookKind;
  readonly status?: AppHookDeliveryStatus;
  readonly limit?: number;
}

export type StoredAppHookDeliveryOutcome =
  | {
    readonly ok: true;
    readonly result: unknown;
    readonly logCount: number;
    readonly runtime?: BuilderFunctionInvocationResult['runtime'];
    readonly durationMs?: number;
  }
  | {
    readonly ok: false;
    readonly error: string;
    readonly logCount: number;
    readonly runtime?: BuilderFunctionInvocationResult['runtime'];
    readonly durationMs?: number;
    readonly timedOut?: boolean;
  };

interface RecordDeliveryInput {
  readonly appId: string;
  readonly hookId: string;
  readonly kind: AppHookKind;
  readonly retryOfDeliveryId?: string;
  readonly event: AppHookEvent;
  readonly attempt: number;
  readonly outcome: StoredAppHookDeliveryOutcome;
}

const deliveryRecordSchema = z.object({
  deliveryId: z.string().min(1),
  retryOfDeliveryId: z.string().min(1).optional(),
  appId: z.string().min(1),
  hookId: z.string().min(1),
  kind: z.enum(APP_HOOK_KINDS),
  status: deliveryStatusSchema,
  attempt: z.number().int().min(1),
  event: appHookEventSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  logCount: z.number().int().min(0),
  runtime: runtimeSchema.optional(),
  durationMs: z.number().min(0).optional(),
  resultPreview: z.string().optional(),
  error: z.string().optional(),
  timedOut: z.boolean().optional(),
}).strict();

const deliveriesFileSchema = z.object({
  version: z.literal(DELIVERY_FILE_VERSION),
  deliveries: z.array(deliveryRecordSchema),
}).strict();

type ParsedDeliveryRecord = z.infer<typeof deliveryRecordSchema>;

function deliveriesFilePath(): string {
  return process.env.BUILDER_APP_HOOK_DELIVERIES_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'apps', 'hook-deliveries.json');
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function toDeliveryRecord(record: ParsedDeliveryRecord): StoredAppHookDeliveryRecord {
  return {
    deliveryId: record.deliveryId,
    ...(record.retryOfDeliveryId ? { retryOfDeliveryId: record.retryOfDeliveryId } : {}),
    appId: record.appId,
    hookId: record.hookId,
    kind: record.kind,
    status: record.status,
    attempt: record.attempt,
    event: toAppHookEvent(record.event),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    logCount: record.logCount,
    ...(record.runtime ? { runtime: record.runtime } : {}),
    ...(typeof record.durationMs === 'number' ? { durationMs: record.durationMs } : {}),
    ...(record.resultPreview ? { resultPreview: record.resultPreview } : {}),
    ...(record.error ? { error: record.error } : {}),
    ...(record.timedOut ? { timedOut: true } : {}),
  };
}

async function readDeliveries(): Promise<StoredAppHookDeliveryRecord[]> {
  let text: string;
  try {
    text = await readFile(deliveriesFilePath(), 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }
  const raw: unknown = JSON.parse(text);
  const parsed = deliveriesFileSchema.safeParse(raw);
  if (!parsed.success) return [];
  return parsed.data.deliveries.map(toDeliveryRecord);
}

async function writeDeliveries(deliveries: readonly StoredAppHookDeliveryRecord[]): Promise<void> {
  const filePath = deliveriesFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    JSON.stringify({ version: DELIVERY_FILE_VERSION, deliveries: deliveries.slice(-MAX_DELIVERIES) }, null, 2),
    'utf8',
  );
}

async function appendDelivery(delivery: StoredAppHookDeliveryRecord): Promise<void> {
  const deliveries = await readDeliveries();
  await writeDeliveries([...deliveries, delivery]);
}

function makeDeliveryId(): string {
  return `appdlv-${Date.now()}-${randomBytes(6).toString('hex')}`;
}

function previewValue(value: unknown): string {
  if (typeof value === 'undefined') return 'undefined';
  try {
    const json = JSON.stringify(value);
    return (json ?? String(value)).slice(0, 1000);
  } catch (error) {
    if (error instanceof Error) return `[unserializable result: ${error.message}]`;
    throw error;
  }
}

function normalizeLimit(limit?: number): number {
  if (typeof limit !== 'number' || !Number.isFinite(limit)) return 200;
  return Math.max(1, Math.min(MAX_DELIVERIES, Math.trunc(limit)));
}

export async function recordStoredAppHookDelivery(
  input: RecordDeliveryInput,
): Promise<StoredAppHookDeliveryRecord> {
  const now = new Date().toISOString();
  const delivery: StoredAppHookDeliveryRecord = {
    deliveryId: makeDeliveryId(),
    ...(input.retryOfDeliveryId ? { retryOfDeliveryId: input.retryOfDeliveryId } : {}),
    appId: input.appId,
    hookId: input.hookId,
    kind: input.kind,
    status: input.outcome.ok ? 'succeeded' : 'failed',
    attempt: input.attempt,
    event: input.event,
    createdAt: now,
    updatedAt: now,
    logCount: input.outcome.logCount,
    ...(input.outcome.runtime ? { runtime: input.outcome.runtime } : {}),
    ...(typeof input.outcome.durationMs === 'number' ? { durationMs: input.outcome.durationMs } : {}),
    ...(input.outcome.ok ? { resultPreview: previewValue(input.outcome.result) } : { error: input.outcome.error }),
    ...(!input.outcome.ok && input.outcome.timedOut ? { timedOut: true } : {}),
  };
  const append = () => appendDelivery(delivery);
  deliveryWriteQueue = deliveryWriteQueue.then(append, append);
  await deliveryWriteQueue;
  return delivery;
}

export async function listStoredAppHookDeliveries(
  query: StoredAppHookDeliveryQuery = {},
): Promise<StoredAppHookDeliveryRecord[]> {
  const deliveries = await readDeliveries();
  const filtered = deliveries.filter((delivery) => (
    (!query.appId || delivery.appId === query.appId)
    && (!query.hookId || delivery.hookId === query.hookId)
    && (!query.kind || delivery.kind === query.kind)
    && (!query.status || delivery.status === query.status)
  ));
  return filtered
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, normalizeLimit(query.limit));
}

export async function getStoredAppHookDelivery(deliveryId: string): Promise<StoredAppHookDeliveryRecord | null> {
  const deliveries = await readDeliveries();
  return deliveries.find((delivery) => delivery.deliveryId === deliveryId) ?? null;
}

export function clearAppHookDeliveriesForTests(): void {
  deliveryWriteQueue = Promise.resolve();
  rmSync(deliveriesFilePath(), { force: true });
}
