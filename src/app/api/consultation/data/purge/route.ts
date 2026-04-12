import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/consultation/data/purge
 *
 * Wave 10 (PDPA compliance) — deletes consultation log blobs older
 * than a configurable retention window (default 90 days). Designed
 * to be called by Vercel Cron or a manual operator trigger.
 *
 * Only runs when CONSULTATION_PURGE_SECRET matches the request
 * body's `secret` field, preventing unauthorized purge. In dev
 * (NODE_ENV !== 'production'), the secret check is skipped.
 */
const RETENTION_DAYS = Number(process.env.CONSULTATION_RETENTION_DAYS || '90');
const PURGE_SECRET = process.env.CONSULTATION_PURGE_SECRET || '';
const LOG_PREFIXES = ['consultation-logs/events/', 'consultation-logs/feedback/'];

function isOlderThan(pathname: string, cutoffDate: string): boolean {
  const match = pathname.match(/(\d{4}-\d{2}-\d{2})\.jsonl$/);
  if (!match || !match[1]) return false;
  return match[1] < cutoffDate;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    try {
      const body = (await request.json()) as { secret?: string };
      if (!PURGE_SECRET || body.secret !== PURGE_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob backend not configured' }, { status: 503 });
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  let totalDeleted = 0;
  const deletedPaths: string[] = [];

  for (const prefix of LOG_PREFIXES) {
    try {
      const result = await list({ prefix });
      for (const blob of result.blobs) {
        if (isOlderThan(blob.pathname, cutoffDate)) {
          await del(blob.url);
          deletedPaths.push(blob.pathname);
          totalDeleted += 1;
        }
      }
    } catch (error) {
      console.error(`[purge] failed to list/delete prefix ${prefix}:`, error);
    }
  }

  console.log(`[purge] deleted ${totalDeleted} blobs older than ${cutoffDate} (${RETENTION_DAYS} days)`);

  return NextResponse.json({
    success: true,
    retentionDays: RETENTION_DAYS,
    cutoffDate,
    totalDeleted,
    deletedPaths,
  });
}
