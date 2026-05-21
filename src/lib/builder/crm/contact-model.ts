/**
 * Wix-class CRM (M171) — first slice.
 *
 * Single-file storage at `runtime-data/crm/contacts.json` (or Blob mirror)
 * serialized through a write queue, mirroring the `siteWriteQueue` pattern
 * in `src/lib/builder/site/persistence.ts`. The single-file shape makes
 * filter/merge cheap for the MVP; per-contact files can come later when the
 * list grows past a few thousand rows.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { get, put } from '@vercel/blob';

export type CrmContactSource = 'form' | 'manual' | 'booking';

export interface CrmContact {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: CrmContactSource;
  tags: string[];
  notes?: string;
  createdAt: string;
  lastActivityAt: string;
  customFields?: Record<string, string>;
}

export interface CrmContactsFile {
  version: 1;
  updatedAt: string;
  contacts: CrmContact[];
}

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function contactsFile(): string {
  return path.join(rootDir(), 'contacts.json');
}
const BLOB_PATH = 'crm/contacts.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function emptyFile(): CrmContactsFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), contacts: [] };
}

function normalizeContact(value: unknown): CrmContact | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<CrmContact>;
  if (typeof v.id !== 'string' || !v.id) return null;
  if (typeof v.email !== 'string' || !v.email) return null;
  const source: CrmContactSource = v.source === 'form' || v.source === 'manual' || v.source === 'booking'
    ? v.source
    : 'manual';
  const tags = Array.isArray(v.tags) ? v.tags.filter((t): t is string => typeof t === 'string').slice(0, 64) : [];
  return {
    id: v.id,
    email: v.email.toLowerCase(),
    name: typeof v.name === 'string' ? v.name : undefined,
    phone: typeof v.phone === 'string' ? v.phone : undefined,
    source,
    tags,
    notes: typeof v.notes === 'string' ? v.notes : undefined,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt : new Date().toISOString(),
    lastActivityAt: typeof v.lastActivityAt === 'string' ? v.lastActivityAt : new Date().toISOString(),
    customFields:
      v.customFields && typeof v.customFields === 'object'
        ? Object.fromEntries(
            Object.entries(v.customFields as Record<string, unknown>).filter(
              (entry): entry is [string, string] => typeof entry[1] === 'string',
            ),
          )
        : undefined,
  };
}

function normalizeFile(value: unknown): CrmContactsFile {
  if (!value || typeof value !== 'object') return emptyFile();
  const v = value as Partial<CrmContactsFile>;
  const contacts = Array.isArray(v.contacts)
    ? v.contacts.map(normalizeContact).filter((c): c is CrmContact => c !== null)
    : [];
  return {
    version: 1,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString(),
    contacts,
  };
}

async function readFromBackend(): Promise<CrmContactsFile> {
  if (isBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeFile(JSON.parse(text));
      }
    } catch {
      /* fallthrough */
    }
    return emptyFile();
  }
  try {
    const text = await fs.readFile(contactsFile(), 'utf8');
    return normalizeFile(JSON.parse(text));
  } catch {
    return emptyFile();
  }
}

async function writeToBackend(data: CrmContactsFile): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (isBlobBackend()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(contactsFile(), body, 'utf8');
}

// ─── Serialized write queue (avoid lost-update on concurrent form submits) ─

let writeQueue: Promise<void> = Promise.resolve();

export async function readCrmContacts(): Promise<CrmContact[]> {
  const file = await readFromBackend();
  return file.contacts;
}

export async function saveCrmContacts(contacts: CrmContact[]): Promise<void> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    const next: CrmContactsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      contacts: contacts.map((c) => ({ ...c, email: c.email.toLowerCase() })),
    };
    await writeToBackend(next);
  } finally {
    release();
  }
}

/**
 * Read-modify-write under the serialized queue. The updater receives the
 * latest contacts list from disk and returns the next list. Used by callers
 * that need merge-on-write semantics (form submission, automation actions).
 */
export async function mutateCrmContacts<T>(
  updater: (current: CrmContact[]) => { next: CrmContact[]; result: T },
): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    const current = (await readFromBackend()).contacts;
    const { next, result } = updater(current);
    const file: CrmContactsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      contacts: next.map((c) => ({ ...c, email: c.email.toLowerCase() })),
    };
    await writeToBackend(file);
    return result;
  } finally {
    release();
  }
}

export function makeContactId(): string {
  return `ct_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

export function normalizeContactEmail(email: string): string {
  return email.trim().toLowerCase();
}