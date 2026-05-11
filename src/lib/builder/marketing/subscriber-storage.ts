import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { Subscriber, SubscriberStatus } from './subscriber-types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'marketing-subscribers');
const BLOB_PREFIX = 'marketing/subscribers/';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}
function filePath(id: string): string {
  return path.join(ROOT, `${id}.json`);
}

async function writeJson(id: string, data: Subscriber): Promise<void> {
  if (backend() === 'blob') {
    await put(blobPath(id), JSON.stringify(data, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const target = filePath(id);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), 'utf8');
}

async function readJson(id: string): Promise<Subscriber | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as Subscriber;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(id), 'utf8');
    return JSON.parse(raw) as Subscriber;
  } catch {
    return null;
  }
}

async function listJson(): Promise<Subscriber[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: BLOB_PREFIX });
      const out: Subscriber[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            out.push(JSON.parse(await new Response(item.stream).text()) as Subscriber);
          }
        } catch {
          /* skip */
        }
      }
      return out;
    }
    const files = await fs.readdir(ROOT).catch(() => []);
    const out: Subscriber[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(ROOT, file), 'utf8');
        out.push(JSON.parse(raw) as Subscriber);
      } catch {
        /* skip */
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function makeSubscriberId(): string {
  return `sub_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export function makeToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function getSubscriber(subscriberId: string): Promise<Subscriber | null> {
  return readJson(subscriberId);
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const normalized = email.trim().toLowerCase();
  const all = await listJson();
  return all.find((s) => s.email === normalized) ?? null;
}

export async function getSubscriberByDoubleOptInToken(token: string): Promise<Subscriber | null> {
  const all = await listJson();
  return all.find((s) => s.doubleOptInToken === token) ?? null;
}

export async function getSubscriberByUnsubscribeToken(token: string): Promise<Subscriber | null> {
  const all = await listJson();
  return all.find((s) => s.unsubscribeToken === token) ?? null;
}

export async function saveSubscriber(subscriber: Subscriber): Promise<void> {
  await writeJson(subscriber.subscriberId, { ...subscriber, updatedAt: new Date().toISOString() });
}

export async function listSubscribers(options: {
  status?: SubscriberStatus;
  tag?: string;
  search?: string;
} = {}): Promise<Subscriber[]> {
  const all = await listJson();
  const searchTerm = options.search?.trim().toLowerCase();
  return all
    .filter((s) => !options.status || s.status === options.status)
    .filter((s) => !options.tag || s.tags.includes(options.tag))
    .filter((s) => !searchTerm || s.email.includes(searchTerm))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listActiveSubscribersForTags(tags: string[]): Promise<Subscriber[]> {
  const all = await listJson();
  const filterTags = tags.filter((t) => t.length > 0);
  return all.filter((s) => {
    if (s.status !== 'subscribed') return false;
    if (filterTags.length === 0) return true;
    return filterTags.some((tag) => s.tags.includes(tag));
  });
}
