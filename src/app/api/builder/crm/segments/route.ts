import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { createSegment, readSegments } from '@/lib/builder/crm/segments-store';
import {
  type CrmSegment,
  matchSegment,
  selectContactsBySegment,
  validateSegmentInput,
} from '@/lib/builder/crm/segments-model';
import { readCrmContacts } from '@/lib/builder/crm/contact-model';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderCrmApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCrmApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    allowReadOnly: true,
    permission: 'view-contacts',
  });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  try {
    const segments = await readSegments();
    const includeCounts = request.nextUrl.searchParams.get('counts') === '1';
    if (!includeCounts) {
      return NextResponse.json({ ok: true, segments, total: segments.length });
    }

    const contacts = await readCrmContacts();
    const enriched = segments.map((segment) => ({
      ...segment,
      contactCount: contacts.reduce(
        (acc, contact) => acc + (matchSegment(segment, contact) ? 1 : 0),
        0,
      ),
    }));
    return NextResponse.json({
      ok: true,
      segments: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error('[builder/crm/segments] list failed:', error);
    return errorResponse(locale, 'segments_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = validateSegmentInput(raw);
  if (!parsed.ok || !parsed.value) {
    return errorResponse(locale, 'invalid_segment_payload', 400, {
      details: parsed.errors.slice(0, 5),
    });
  }

  let segment: CrmSegment;
  try {
    segment = await createSegment(parsed.value);
  } catch (error) {
    console.error('[builder/crm/segments] create failed:', error);
    return errorResponse(locale, 'segment_create_failed', 500);
  }

  // Optional preview: ?preview=1 returns matching contact ids alongside the
  // freshly-created segment so the admin UI can show "X contacts targeted"
  // without a second roundtrip.
  if (request.nextUrl.searchParams.get('preview') === '1') {
    try {
      const contacts = await readCrmContacts();
      const matched = selectContactsBySegment(segment, contacts);
      return NextResponse.json(
        {
          ok: true,
          segment,
          preview: {
            contactCount: matched.length,
            contactIds: matched.slice(0, 100).map((c) => c.id),
          },
        },
        { status: 201 },
      );
    } catch (error) {
      console.error('[builder/crm/segments] preview failed:', error);
      return errorResponse(locale, 'segment_preview_failed', 500);
    }
  }

  return NextResponse.json({ ok: true, segment }, { status: 201 });
}
