import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { Campaign, CampaignRecipient, CampaignStats } from './campaign-types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'marketing-campaigns');
const BLOB_PREFIX = 'marketing/campaigns/';

type Collection = 'campaigns' | 'recipients';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(collection: Collection, id: string): string {
  return `${BLOB_PREFIX}${collection}/${id}.json`;
}
function filePath(collection: Collection, id: string): string {
  return path.join(ROOT, collection, `${id}.json`);
}

async function writeJson<T>(collection: Collection, id: string, data: T): Promise<void> {
  if (backend() === 'blob') {
    await put(blobPath(collection, id), JSON.stringify(data, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const target = filePath(collection, id);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), 'utf8');
}

async function readJson<T>(collection: Collection, id: string): Promise<T | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(collection, id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(collection, id), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listJson<T>(collection: Collection): Promise<T[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: `${BLOB_PREFIX}${collection}/` });
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
    const dir = path.join(ROOT, collection);
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

export function makeCampaignId(): string {
  return `camp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export function makeRecipientId(campaignId: string, subscriberId: string): string {
  return `${campaignId}__${subscriberId}`;
}

export function makeTrackingToken(): string {
  return crypto.randomBytes(20).toString('hex');
}

export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  return readJson<Campaign>('campaigns', campaignId);
}

export async function saveCampaign(campaign: Campaign): Promise<void> {
  await writeJson('campaigns', campaign.campaignId, {
    ...campaign,
    updatedAt: new Date().toISOString(),
  });
}

export async function listCampaigns(): Promise<Campaign[]> {
  const all = await listJson<Campaign>('campaigns');
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getRecipient(
  campaignId: string,
  subscriberId: string,
): Promise<CampaignRecipient | null> {
  return readJson<CampaignRecipient>('recipients', makeRecipientId(campaignId, subscriberId));
}

export async function saveRecipient(recipient: CampaignRecipient): Promise<void> {
  await writeJson(
    'recipients',
    makeRecipientId(recipient.campaignId, recipient.subscriberId),
    recipient,
  );
}

export async function listRecipientsForCampaign(campaignId: string): Promise<CampaignRecipient[]> {
  const all = await listJson<CampaignRecipient>('recipients');
  return all.filter((r) => r.campaignId === campaignId);
}

export async function getRecipientByToken(
  trackingToken: string,
): Promise<CampaignRecipient | null> {
  const all = await listJson<CampaignRecipient>('recipients');
  return all.find((r) => r.trackingToken === trackingToken) ?? null;
}

export function aggregateStats(recipients: CampaignRecipient[]): CampaignStats {
  const stats = { recipients: recipients.length, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 };
  for (const recipient of recipients) {
    if (recipient.openedAt) stats.opens += 1;
    if (recipient.clickedAt) stats.clicks += 1;
    if (recipient.unsubscribedAt) stats.unsubscribes += 1;
    if (recipient.status === 'bounced') stats.bounces += 1;
  }
  return stats;
}
