import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscription,
  saveDelivery,
} from '@/lib/builder/webhooks/storage';
import { retryDelivery } from '@/lib/builder/webhooks/dispatcher';
import { promises as fs } from 'fs';
import path from 'path';
import { get, list } from '@vercel/blob';
import type { WebhookDelivery } from '@/lib/builder/webhooks/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RUNTIME_DIR = path.join(process.cwd(), 'runtime-data', 'webhooks', 'deliveries');
const BLOB_PREFIX = 'webhooks/deliveries/';

const MAX_ATTEMPTS = 5;
/** Exponential backoff thresholds (minutes between consecutive retries). */
const BACKOFF_MIN: Record<number, number> = { 1: 1, 2: 5, 3: 30, 4: 240 };

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET ?? '';
  if (!secret) return process.env.NODE_ENV !== 'production';
  const headerSecret =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  return headerSecret === secret;
}

async function listFailedDeliveries(): Promise<WebhookDelivery[]> {
  const out: WebhookDelivery[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const result = await list({ prefix: BLOB_PREFIX });
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            const parsed = JSON.parse(await new Response(item.stream).text()) as WebhookDelivery;
            if (parsed.status === 'failed') out.push(parsed);
          }
        } catch {
          /* skip */
        }
      }
    } catch {
      /* ignore */
    }
    return out;
  }
  try {
    const files = await fs.readdir(RUNTIME_DIR).catch(() => []);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(RUNTIME_DIR, file), 'utf8');
        const parsed = JSON.parse(raw) as WebhookDelivery;
        if (parsed.status === 'failed') out.push(parsed);
      } catch {
        /* skip */
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const failed = await listFailedDeliveries();
  const now = Date.now();
  let retried = 0;
  let skipped = 0;
  let gaveUp = 0;

  for (const delivery of failed) {
    if (delivery.attempts >= MAX_ATTEMPTS) {
      gaveUp += 1;
      continue;
    }
    const lastAt = Date.parse(delivery.lastTriedAt ?? delivery.createdAt);
    const requiredGapMs = (BACKOFF_MIN[delivery.attempts] ?? 240) * 60 * 1000;
    if (now - lastAt < requiredGapMs) {
      skipped += 1;
      continue;
    }
    const subscription = await getSubscription(delivery.webhookId);
    if (!subscription || !subscription.active) {
      // Abandon — mark as failed final.
      await saveDelivery({ ...delivery, attempts: MAX_ATTEMPTS, error: 'subscription removed/inactive' });
      gaveUp += 1;
      continue;
    }
    await retryDelivery(subscription, delivery);
    retried += 1;
  }

  return NextResponse.json({ ok: true, retried, skipped, gaveUp, failedTotal: failed.length });
}

export async function POST(request: NextRequest) {
  return run(request);
}
export async function GET(request: NextRequest) {
  return run(request);
}
