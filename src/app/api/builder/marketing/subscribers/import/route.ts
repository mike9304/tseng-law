import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscriberByEmail,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { subscriberImportRowSchema } from '@/lib/builder/marketing/subscriber-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  rows: z.array(subscriberImportRowSchema).max(2000),
  defaultStatus: z.enum(['pending', 'subscribed']).default('pending'),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-subscribers' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid import payload' }, { status: 400 });
  }

  // Hard cap on cumulative payload size — 2000 rows × ~1KB worst case is
  // already large enough to trip Vercel's body limit. Reject early instead
  // of OOMing mid-import.
  let cumulativeChars = 0;
  for (const row of parsed.data.rows) {
    cumulativeChars += row.email.length + (row.tags?.join('').length ?? 0);
    if (cumulativeChars > 256 * 1024) {
      return NextResponse.json({ error: 'Import payload exceeds 256KB cumulative.' }, { status: 413 });
    }
  }

  const now = new Date().toISOString();
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ email: string; reason: string }> = [];

  for (const row of parsed.data.rows) {
    try {
      const existing = await getSubscriberByEmail(row.email);
      if (existing && existing.status === 'subscribed') {
        skipped += 1;
        continue;
      }
      const subscriber = {
        subscriberId: existing?.subscriberId ?? makeSubscriberId(),
        email: row.email,
        contactId: existing?.contactId,
        status: parsed.data.defaultStatus,
        tags: Array.from(new Set([...(existing?.tags ?? []), ...row.tags])),
        preferredLocale: row.preferredLocale,
        unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
        source: 'csv-import',
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await saveSubscriber(subscriber);
      if (existing) updated += 1;
      else created += 1;
    } catch (err) {
      errors.push({ email: row.email, reason: err instanceof Error ? err.message : 'unknown' });
    }
  }

  return NextResponse.json({ ok: true, created, updated, skipped, errors, total: parsed.data.rows.length });
}
