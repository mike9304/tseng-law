import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { DomainBinding } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'domains');
const BLOB_PREFIX = 'domains/';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}
function filePath(id: string): string {
  return path.join(ROOT, `${id}.json`);
}

function safeId(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
}

export function makeDomainId(domain: string): string {
  return `dom_${safeId(domain)}`;
}

export function makeVerificationToken(): string {
  return `vercel-verify=${crypto.randomBytes(24).toString('hex')}`;
}

async function writeJson(binding: DomainBinding): Promise<void> {
  const body = JSON.stringify({ ...binding, updatedAt: new Date().toISOString() }, null, 2);
  if (backend() === 'blob') {
    await put(blobPath(binding.domainId), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(filePath(binding.domainId), body, 'utf8');
}

async function readJson(id: string): Promise<DomainBinding | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as DomainBinding;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(id), 'utf8');
    return JSON.parse(raw) as DomainBinding;
  } catch {
    return null;
  }
}

export async function listDomains(): Promise<DomainBinding[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: BLOB_PREFIX });
      const out: DomainBinding[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            out.push(JSON.parse(await new Response(item.stream).text()) as DomainBinding);
          }
        } catch {
          /* skip */
        }
      }
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    const files = await fs.readdir(ROOT).catch(() => []);
    const out: DomainBinding[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(ROOT, file), 'utf8');
        out.push(JSON.parse(raw) as DomainBinding);
      } catch {
        /* skip */
      }
    }
    return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getDomain(domainId: string): Promise<DomainBinding | null> {
  return readJson(domainId);
}

export async function saveDomain(binding: DomainBinding): Promise<void> {
  await writeJson(binding);
}

export async function getDomainByName(domain: string): Promise<DomainBinding | null> {
  return readJson(makeDomainId(domain));
}
