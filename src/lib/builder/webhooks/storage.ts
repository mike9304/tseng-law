import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { WebhookDelivery, WebhookSubscription } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'webhooks');
const BLOB_PREFIX = 'webhooks/';

type Collection = 'subscriptions' | 'deliveries';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(c: Collection, id: string): string {
  return `${BLOB_PREFIX}${c}/${id}.json`;
}
function filePath(c: Collection, id: string): string {
  return path.join(ROOT, c, `${id}.json`);
}

async function writeJson<T>(c: Collection, id: string, data: T): Promise<void> {
  if (backend() === 'blob') {
    await put(blobPath(c, id), JSON.stringify(data, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const target = filePath(c, id);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), 'utf8');
}

async function readJson<T>(c: Collection, id: string): Promise<T | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(c, id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(c, id), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listJson<T>(c: Collection): Promise<T[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: `${BLOB_PREFIX}${c}/` });
      const out: T[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            out.push(JSON.parse(await new Response(item.stream).text()) as T);
          }
        } catch {
          /* skip */
        }
      }
      return out;
    }
    const dir = path.join(ROOT, c);
    const files = await fs.readdir(dir).catch(() => []);
    const out: T[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(dir, file), 'utf8');
        out.push(JSON.parse(raw) as T);
      } catch {
        /* skip */
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function makeWebhookId(): string {
  return `wh_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}
export function makeDeliveryId(): string {
  return `dlv_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}
export function makeWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString('hex')}`;
}

export async function listSubscriptions(): Promise<WebhookSubscription[]> {
  const all = await listJson<WebhookSubscription>('subscriptions');
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function getSubscription(id: string): Promise<WebhookSubscription | null> {
  return readJson<WebhookSubscription>('subscriptions', id);
}
export async function saveSubscription(subscription: WebhookSubscription): Promise<void> {
  await writeJson('subscriptions', subscription.webhookId, {
    ...subscription,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveDelivery(delivery: WebhookDelivery): Promise<void> {
  await writeJson('deliveries', delivery.deliveryId, delivery);
}
export async function getDelivery(id: string): Promise<WebhookDelivery | null> {
  return readJson<WebhookDelivery>('deliveries', id);
}
export async function listDeliveriesForWebhook(webhookId: string): Promise<WebhookDelivery[]> {
  const all = await listJson<WebhookDelivery>('deliveries');
  return all.filter((d) => d.webhookId === webhookId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
