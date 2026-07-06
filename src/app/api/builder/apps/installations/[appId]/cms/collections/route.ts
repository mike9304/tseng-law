import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { listEditableBuilderCmsCollections } from '@/lib/builder/cms-editable';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale } from '@/lib/locales';
import {
  authorizeBuilderAppScope,
  BuilderAppScopeError,
} from '@/lib/builder/apps/scopes';
import { getBuilderAppsApiErrorPayload, type BuilderAppsApiErrorCode } from '@/lib/builder/apps/apps-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    appId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    await authorizeBuilderAppScope(DEFAULT_BUILDER_SITE_ID, locale, params.appId, 'cms:read');
    const editableCollections = await listEditableBuilderCmsCollections(DEFAULT_BUILDER_SITE_ID, locale);
    return NextResponse.json({
      ok: true,
      appId: params.appId,
      scope: 'cms:read',
      editableCollections,
    });
  } catch (error) {
    if (error instanceof BuilderAppScopeError) {
      const errorCode = error.code === 'app_scope_unknown'
        ? 'app_scope_check_failed'
        : error.code as BuilderAppsApiErrorCode;
      return NextResponse.json(
        { ok: false, ...getBuilderAppsApiErrorPayload(locale, errorCode) },
        { status: error.code === 'app_not_found' || error.code === 'app_not_installed' ? 404 : 403 },
      );
    }
    console.error('[builder-app-cms-collections] failed', error);
    return NextResponse.json(
      { ok: false, ...getBuilderAppsApiErrorPayload(locale, 'app_scope_check_failed') },
      { status: 500 },
    );
  }
}
