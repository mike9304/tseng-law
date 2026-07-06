import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ZodError } from 'zod';
import {
  BuilderCmsValidationError,
  createEditableBuilderCmsCollection,
  deleteEditableBuilderCmsCollection,
  updateEditableBuilderCmsCollection,
} from '@/lib/builder/cms-editable';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { ensureDefaultAccount, listWorkspaceSites } from '@/lib/builder/workspace/workspace-store';
import { listAccountCollections } from '@/lib/builder/workspace/shared-cms';
import {
  type BuilderWorkspaceApiErrorCode,
  getBuilderWorkspaceApiErrorPayload,
} from '@/lib/builder/workspace/workspace-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const siteIdSchema = z.string().trim().min(1).max(96);
const collectionIdSchema = z.string().trim().min(1).max(96);
const collectionInputSchema = z.object({
  collectionId: z.unknown().optional(),
  name: z.unknown().optional(),
  slug: z.unknown().optional(),
  description: z.unknown().optional(),
  localized: z.unknown().optional(),
  fields: z.unknown().optional(),
  indexes: z.unknown().optional(),
  permissions: z.unknown().optional(),
}).passthrough();

const postSchema = z.object({
  siteId: siteIdSchema,
  locale: z.string().optional(),
  collection: collectionInputSchema,
});

const patchSchema = z.object({
  siteId: siteIdSchema,
  collectionId: collectionIdSchema,
  locale: z.string().optional(),
  patch: collectionInputSchema.partial(),
});

const deleteSchema = z.object({
  siteId: siteIdSchema,
  collectionId: collectionIdSchema,
  locale: z.string().optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderWorkspaceApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderWorkspaceApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, {
    issues: error.issues.map((issue) => issue.message),
  });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const bodyLocale = payload && typeof payload === 'object' && 'locale' in payload
    ? payload.locale
    : undefined;
  return normalizeLocale(
    typeof bodyLocale === 'string' ? bodyLocale : request.nextUrl.searchParams.get('locale') ?? undefined,
  );
}

async function workspaceHasSite(siteId: string): Promise<boolean> {
  await ensureDefaultAccount();
  const sites = await listWorkspaceSites();
  return sites.some((site) => site.siteId === siteId);
}

function cmsMutationError(
  locale: Locale,
  error: unknown,
  errorCode: BuilderWorkspaceApiErrorCode,
  logLabel: string,
): NextResponse {
  if (error instanceof BuilderCmsValidationError) {
    return errorResponse(locale, 'validation_error', 400, { issues: error.issues });
  }
  if (error instanceof Error) {
    console.error(logLabel, error);
    return errorResponse(locale, errorCode, 500);
  }
  throw error;
}

export async function GET(request: NextRequest) {
  const blocked = await guardBuilderReadWithPermission(request, 'view-cms');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);
  try {
    await ensureDefaultAccount();
    const collections = await listAccountCollections();
    return NextResponse.json({
      ok: true,
      total: collections.length,
      collections,
    });
  } catch (error) {
    console.error('[builder/workspace/cms] GET failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderWorkspaceApiErrorPayload(locale, 'cms_collections_failed') },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(resolveRequestLocale(request), 'invalid_json', 400);
  }

  const locale = resolveRequestLocale(request, payload);
  const input = postSchema.safeParse(payload);
  if (!input.success) return validationError(locale, input.error);
  if (!(await workspaceHasSite(input.data.siteId))) {
    return errorResponse(locale, 'cms_site_not_found', 404);
  }

  try {
    const detail = await createEditableBuilderCmsCollection(
      input.data.siteId,
      locale,
      input.data.collection,
    );
    return NextResponse.json({ ok: true, siteId: input.data.siteId, detail }, { status: 201 });
  } catch (error) {
    return cmsMutationError(locale, error, 'cms_collection_create_failed', '[builder/workspace/cms] POST failed:');
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(resolveRequestLocale(request), 'invalid_json', 400);
  }

  const locale = resolveRequestLocale(request, payload);
  const input = patchSchema.safeParse(payload);
  if (!input.success) return validationError(locale, input.error);
  if (!(await workspaceHasSite(input.data.siteId))) {
    return errorResponse(locale, 'cms_site_not_found', 404);
  }

  try {
    const detail = await updateEditableBuilderCmsCollection(
      input.data.siteId,
      locale,
      input.data.collectionId,
      input.data.patch,
    );
    if (!detail) return errorResponse(locale, 'cms_collection_not_found', 404);
    return NextResponse.json({ ok: true, siteId: input.data.siteId, detail });
  } catch (error) {
    return cmsMutationError(locale, error, 'cms_collection_update_failed', '[builder/workspace/cms] PATCH failed:');
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = resolveRequestLocale(request);
  const input = deleteSchema.safeParse({
    siteId: request.nextUrl.searchParams.get('siteId'),
    collectionId: request.nextUrl.searchParams.get('collectionId'),
    locale: request.nextUrl.searchParams.get('locale') ?? undefined,
  });
  if (!input.success) return validationError(locale, input.error);
  if (!(await workspaceHasSite(input.data.siteId))) {
    return errorResponse(locale, 'cms_site_not_found', 404);
  }

  try {
    const deleted = await deleteEditableBuilderCmsCollection(
      input.data.siteId,
      locale,
      input.data.collectionId,
    );
    if (!deleted) return errorResponse(locale, 'cms_collection_not_found', 404);
    return NextResponse.json({
      ok: true,
      siteId: input.data.siteId,
      collectionId: input.data.collectionId,
    });
  } catch (error) {
    return cmsMutationError(locale, error, 'cms_collection_delete_failed', '[builder/workspace/cms] DELETE failed:');
  }
}
