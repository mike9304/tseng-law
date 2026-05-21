import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { createSegment, readSegments } from '@/lib/builder/crm/segments-store';
import {
  matchSegment,
  selectContactsBySegment,
  validateSegmentInput,
} from '@/lib/builder/crm/segments-model';
import { readCrmContacts } from '@/lib/builder/crm/contact-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    allowReadOnly: true,
    permission: 'view-contacts',
  });
  if (auth instanceof NextResponse) return auth;

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
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = validateSegmentInput(raw);
  if (!parsed.ok || !parsed.value) {
    return NextResponse.json(
      { error: 'Invalid segment payload', details: parsed.errors.slice(0, 5) },
      { status: 400 },
    );
  }

  const segment = await createSegment(parsed.value);

  // Optional preview: ?preview=1 returns matching contact ids alongside the
  // freshly-created segment so the admin UI can show "X contacts targeted"
  // without a second roundtrip.
  if (request.nextUrl.searchParams.get('preview') === '1') {
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
  }

  return NextResponse.json({ ok: true, segment }, { status: 201 });
}