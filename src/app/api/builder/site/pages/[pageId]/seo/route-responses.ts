import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';
import { getSeoRouteErrorCopy } from '@/lib/builder/seo/route-copy';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { Locale } from '@/lib/locales';

export function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
  errorOverride?: string,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, errorCode),
      ...(errorOverride ? { error: errorOverride } : {}),
      ...extra,
    },
    { status },
  );
}

export function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export function unknownErrorResponse(locale: Locale): NextResponse {
  return errorResponse(locale, 'page_seo_request_failed', 500);
}

export function pageNotFoundResponse(pageId: string, locale: Locale): NextResponse {
  const copy = getSeoRouteErrorCopy(locale, 'page-seo');
  return errorResponse(locale, 'page_not_found', 404, { pageId }, copy.pageNotFound(pageId));
}

export function invalidJsonPayloadResponse(locale: Locale): NextResponse {
  const copy = getSeoRouteErrorCopy(locale, 'page-seo');
  return errorResponse(locale, 'invalid_json', 400, {}, copy.invalidJsonPayload);
}
