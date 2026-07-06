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
import {
  getBuilderMarketingApiErrorPayload,
  type BuilderMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { buildMarketingConsentRecord } from '@/lib/builder/marketing/subscriber-consent';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  rows: z.array(subscriberImportRowSchema).max(2000),
  defaultStatus: z.enum(['pending', 'subscribed']).default('pending'),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderMarketingApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMarketingApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-subscribers' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_import_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }

  // Hard cap on cumulative payload size — 2000 rows × ~1KB worst case is
  // already large enough to trip Vercel's body limit. Reject early instead
  // of OOMing mid-import.
  let cumulativeChars = 0;
  for (const row of parsed.data.rows) {
    cumulativeChars += row.email.length + (row.tags?.join('').length ?? 0);
    if (cumulativeChars > 256 * 1024) {
      return errorResponse(locale, 'import_payload_too_large', 413);
    }
  }

  const now = new Date().toISOString();
  const userAgent = request.headers.get('user-agent') ?? undefined;
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
      const marketingConsent = parsed.data.defaultStatus === 'subscribed'
        ? buildMarketingConsentRecord({
          acceptedAt: now,
          source: 'csv-import',
          preferredLocale: row.preferredLocale,
          ipAddress: clientIp(request),
          acceptedBy: auth.username,
          ...(userAgent ? { userAgent } : {}),
          ...(row.consentEvidence ? { text: row.consentEvidence } : {}),
        })
        : existing?.marketingConsent;
      const subscriber = {
        subscriberId: existing?.subscriberId ?? makeSubscriberId(),
        email: row.email,
        ...(existing?.contactId ? { contactId: existing.contactId } : {}),
        status: parsed.data.defaultStatus,
        tags: Array.from(new Set([...(existing?.tags ?? []), ...row.tags])),
        preferredLocale: row.preferredLocale,
        unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
        source: 'csv-import',
        ...(marketingConsent ? { marketingConsent } : {}),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await saveSubscriber(subscriber);
      if (existing) updated += 1;
      else created += 1;
    } catch (error) {
      console.error('[builder/marketing/subscribers/import] row failed:', error);
      errors.push({
        email: row.email,
        reason: getBuilderMarketingApiErrorPayload(locale, 'subscriber_import_row_failed').error,
      });
    }
  }

  return NextResponse.json({ ok: true, created, updated, skipped, errors, total: parsed.data.rows.length });
}
