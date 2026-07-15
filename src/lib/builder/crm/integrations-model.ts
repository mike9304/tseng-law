/**
 * Outbound integration channels: Slack webhook, generic webhook, and
 * Mailchimp. Single-file storage at `runtime-data/crm/integrations.json` to
 * match the other CRM artifacts.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { get, put } from '@vercel/blob';
import { z } from 'zod';

export type CrmIntegrationKind = 'slack-webhook' | 'generic-webhook' | 'mailchimp';

type LegacyCrmIntegrationKind = 'mailchimp-stub';

export interface CrmIntegration {
  id: string;
  kind: CrmIntegrationKind;
  webhookUrl?: string;
  settings?: Record<string, unknown>;
  enabled: boolean;
  createdAt: string;
}

export interface CrmIntegrationsFile {
  version: 1;
  updatedAt: string;
  integrations: CrmIntegration[];
}

type StoredCrmIntegration = Omit<CrmIntegration, 'kind'> & {
  kind: CrmIntegrationKind | LegacyCrmIntegrationKind;
};

type StoredCrmIntegrationsFile = Omit<CrmIntegrationsFile, 'integrations'> & {
  integrations: StoredCrmIntegration[];
};

type CrmIntegrationWriteInput = Omit<CrmIntegration, 'kind'> & {
  kind: CrmIntegrationKind | LegacyCrmIntegrationKind;
};

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function integrationsPath(): string {
  return path.join(rootDir(), 'integrations.json');
}
const BLOB_PATH = 'crm/integrations.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

export const integrationCreateSchema = z.object({
  kind: z.enum(['slack-webhook', 'generic-webhook', 'mailchimp']),
  webhookUrl: z.string().trim().url().max(2000).optional(),
  settings: z.record(z.string().max(80), z.unknown()).optional(),
  enabled: z.boolean().default(true),
});

export const integrationPatchSchema = z.object({
  enabled: z.boolean(),
});

function emptyFile(): CrmIntegrationsFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), integrations: [] };
}

let queue: Promise<void> = Promise.resolve();

async function withLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = queue;
  let release!: () => void;
  queue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

async function readBackend(): Promise<StoredCrmIntegrationsFile> {
  if (isBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as StoredCrmIntegrationsFile;
      }
    } catch {
      /* fallthrough */
    }
    return emptyFile();
  }
  try {
    return JSON.parse(await fs.readFile(integrationsPath(), 'utf8')) as StoredCrmIntegrationsFile;
  } catch {
    return emptyFile();
  }
}

async function writeBackend(file: CrmIntegrationsFile): Promise<void> {
  const body = JSON.stringify(file, null, 2);
  if (isBlobBackend()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(integrationsPath(), body, 'utf8');
}

export async function readIntegrations(): Promise<CrmIntegration[]> {
  const file = await readBackend();
  return Array.isArray(file.integrations) ? file.integrations.map(normalizeStoredIntegration) : [];
}

function normalizeStoredIntegration(integration: StoredCrmIntegration): CrmIntegration {
  return {
    ...integration,
    kind: integration.kind === 'mailchimp-stub' ? 'mailchimp' : integration.kind,
  };
}

export async function mutateIntegrations<T>(
  updater: (current: CrmIntegration[]) => { next: CrmIntegrationWriteInput[]; result: T },
): Promise<T> {
  return withLock(async () => {
    const current = await readIntegrations();
    const { next, result } = updater(current);
    await writeBackend({
      version: 1,
      updatedAt: new Date().toISOString(),
      integrations: next.map(normalizeStoredIntegration),
    });
    return result;
  });
}

export function makeIntegrationId(): string {
  return `int_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}
