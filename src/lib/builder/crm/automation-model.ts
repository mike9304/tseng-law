/**
 * CRM automation primitives. Persisted as a single JSON document at
 * `runtime-data/crm/automations.json` plus a sibling `outbox.json` for
 * stubbed email sends.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { get, put } from '@vercel/blob';
import { z } from 'zod';

export type CrmAutomationTriggerKind = 'contact-created' | 'tag-added' | 'form-submitted';
export type CrmAutomationActionKind = 'send-email-stub' | 'add-tag' | 'webhook';

export interface CrmAutomationTrigger {
  kind: CrmAutomationTriggerKind;
  matchTag?: string;
  matchFormName?: string;
}

export interface CrmAutomationAction {
  kind: CrmAutomationActionKind;
  templateId?: string;
  webhookUrl?: string;
  addTag?: string;
}

export interface CrmAutomation {
  id: string;
  name: string;
  trigger: CrmAutomationTrigger;
  action: CrmAutomationAction;
  enabled: boolean;
  createdAt: string;
}

export interface CrmAutomationsFile {
  version: 1;
  updatedAt: string;
  automations: CrmAutomation[];
}

export interface CrmEmailStubEntry {
  entryId: string;
  automationId: string;
  contactId: string;
  contactEmail: string;
  templateId?: string;
  triggeredAt: string;
  payload?: Record<string, unknown>;
}

export interface CrmOutboxFile {
  version: 1;
  updatedAt: string;
  entries: CrmEmailStubEntry[];
}

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function automationsFile(): string {
  return path.join(rootDir(), 'automations.json');
}
function outboxFile(): string {
  return path.join(rootDir(), 'outbox.json');
}
const AUTOMATIONS_BLOB = 'crm/automations.json';
const OUTBOX_BLOB = 'crm/outbox.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

export const automationCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  trigger: z.object({
    kind: z.enum(['contact-created', 'tag-added', 'form-submitted']),
    matchTag: z.string().trim().max(64).optional(),
    matchFormName: z.string().trim().max(120).optional(),
  }),
  action: z.object({
    kind: z.enum(['send-email-stub', 'add-tag', 'webhook']),
    templateId: z.string().trim().max(120).optional(),
    webhookUrl: z.string().trim().url().max(2000).optional(),
    addTag: z.string().trim().max(64).optional(),
  }),
  enabled: z.boolean().default(true),
});

export const automationPatchSchema = automationCreateSchema.partial();

function emptyAutomations(): CrmAutomationsFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), automations: [] };
}

function emptyOutbox(): CrmOutboxFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), entries: [] };
}

async function readJson<T>(blobPath: string, filePath: string, fallback: T): Promise<T> {
  if (isBlobBackend()) {
    try {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
    } catch {
      /* fallthrough */
    }
    return fallback;
  }
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (isBlobBackend()) {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

let automationsQueue: Promise<void> = Promise.resolve();
let outboxQueue: Promise<void> = Promise.resolve();

async function withQueue<T>(holder: { current: Promise<void> }, task: () => Promise<T>): Promise<T> {
  const previous = holder.current;
  let release!: () => void;
  holder.current = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

const automationsHolder = { get current() { return automationsQueue; }, set current(value: Promise<void>) { automationsQueue = value; } };
const outboxHolder = { get current() { return outboxQueue; }, set current(value: Promise<void>) { outboxQueue = value; } };

export async function readAutomations(): Promise<CrmAutomation[]> {
  const file = await readJson<CrmAutomationsFile>(AUTOMATIONS_BLOB, automationsFile(), emptyAutomations());
  return Array.isArray(file.automations) ? file.automations : [];
}

export async function saveAutomations(automations: CrmAutomation[]): Promise<void> {
  await withQueue(automationsHolder, async () => {
    const next: CrmAutomationsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      automations,
    };
    await writeJson(AUTOMATIONS_BLOB, automationsFile(), next);
  });
}

export async function mutateAutomations<T>(
  updater: (current: CrmAutomation[]) => { next: CrmAutomation[]; result: T },
): Promise<T> {
  return withQueue(automationsHolder, async () => {
    const current = await readAutomations();
    const { next, result } = updater(current);
    const file: CrmAutomationsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      automations: next,
    };
    await writeJson(AUTOMATIONS_BLOB, automationsFile(), file);
    return result;
  });
}

export async function readOutbox(): Promise<CrmEmailStubEntry[]> {
  const file = await readJson<CrmOutboxFile>(OUTBOX_BLOB, outboxFile(), emptyOutbox());
  return Array.isArray(file.entries) ? file.entries : [];
}

export async function appendOutboxEntry(entry: CrmEmailStubEntry): Promise<void> {
  await withQueue(outboxHolder, async () => {
    const current = await readJson<CrmOutboxFile>(OUTBOX_BLOB, outboxFile(), emptyOutbox());
    const next: CrmOutboxFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      entries: [...(current.entries ?? []), entry],
    };
    await writeJson(OUTBOX_BLOB, outboxFile(), next);
  });
}

export function makeAutomationId(): string {
  return `auto_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

export function makeOutboxEntryId(): string {
  return `out_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}