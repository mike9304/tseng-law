import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { applyRecordSlugRedirect } from '@/lib/builder/dynamic-record-redirect-lifecycle';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BuilderAttorneyProfileSourceError,
  readAttorneyProfileSourceRecordBySlug,
  resetAttorneyProfileSourceRecordOverride,
  updateAttorneyProfileSourceRecord,
} from '@/lib/builder/lawyers/source';
import { normalizeLocale } from '@/lib/locales';

const localizedProfileSchema = z.object({
  name: z.string().trim().min(1).max(180).optional(),
  role: z.string().trim().min(1).max(220).optional(),
  title: z.string().trim().min(1).max(220).optional(),
  description: z.string().trim().min(1).max(1200).optional(),
  summary: z.array(z.string().trim().min(1).max(800)).max(12).optional(),
  languages: z.array(z.string().trim().min(1).max(80)).min(1).max(12).optional(),
  practiceAreas: z.array(z.string().trim().min(1).max(160)).min(1).max(24).optional(),
  internalLinks: z.array(z.object({
    label: z.string().trim().min(1).max(160),
    href: z.string().trim().min(1).max(500),
  }).strict()).max(20).optional(),
}).partial();

const profilePatchSchema = z.object({
  slug: z.string().trim().min(1).max(160).optional(),
  localized: z.object({
    ko: localizedProfileSchema.optional(),
    'zh-hant': localizedProfileSchema.optional(),
    en: localizedProfileSchema.optional(),
  }).partial().optional(),
  email: z.string().trim().email().max(320).optional(),
  image: z.string().trim().min(1).max(500).optional(),
  imageAltText: z.string().trim().min(1).max(180).optional(),
  imageFocalPoint: z.object({
    x: z.number().finite().min(0).max(1),
    y: z.number().finite().min(0).max(1),
  }).strict().optional(),
}).strict();

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
  const record = await readAttorneyProfileSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
  if (!record) {
    return NextResponse.json({ ok: false, error: 'Unknown attorney profile.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, source: 'attorney-profile-source-overrides', record });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const before = await readAttorneyProfileSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    if (!before) {
      return NextResponse.json({ ok: false, error: 'Unknown attorney profile.' }, { status: 404 });
    }

    const patch = profilePatchSchema.parse(await request.json());
    const record = await updateAttorneyProfileSourceRecord(
      DEFAULT_BUILDER_SITE_ID,
      locale,
      params.slug,
      patch,
      auth.username,
    );
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown attorney profile.' }, { status: 404 });
    }

    const slugRedirect = before.slug !== record.slug
      ? await applyRecordSlugRedirect(DEFAULT_BUILDER_SITE_ID, {
          collectionId: 'attorney-profiles',
          locale,
          oldSlug: before.slug,
          newSlug: record.slug,
        })
      : null;

    return NextResponse.json({
      ok: true,
      source: 'attorney-profile-source-overrides',
      record,
      slugRedirect,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid attorney profile payload.', issues: error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }
    if (error instanceof BuilderAttorneyProfileSourceError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 409 },
      );
    }
    console.error('[builder-lawyers] update failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update attorney profile.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const before = await readAttorneyProfileSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    const record = await resetAttorneyProfileSourceRecordOverride(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown attorney profile.' }, { status: 404 });
    }
    const slugRedirect = before && before.slug !== record.slug
      ? await applyRecordSlugRedirect(DEFAULT_BUILDER_SITE_ID, {
          collectionId: 'attorney-profiles',
          locale,
          oldSlug: before.slug,
          newSlug: record.slug,
        })
      : null;

    return NextResponse.json({
      ok: true,
      source: 'attorney-profile-source-overrides',
      record,
      slugRedirect,
    });
  } catch (error) {
    console.error('[builder-lawyers] reset failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to reset attorney profile override.' },
      { status: 500 },
    );
  }
}
