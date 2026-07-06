import { NextResponse } from 'next/server';
import type { Locale } from '@/lib/locales';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export type { BuilderSiteApiErrorCode };

const MAX_ERROR_CAUSE_LENGTH = 400;
const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
const SENSITIVE_ASSIGNMENT_PATTERN =
  /\b(?:authorization|access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|token|signature|sig)\b\s*[:=]\s*(?:Bearer\s+)?["']?[^"',\s&]+/gi;
const SENSITIVE_QUERY_PATTERN =
  /([?&](?:access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|token|signature|sig)=)[^&\s]+/gi;
const URL_PATTERN = /https?:\/\/[^\s"']+/gi;

type JsonObject = {
  readonly [key: string]: unknown;
};

function redactSensitiveErrorText(value: string): string {
  return value
    .replace(SENSITIVE_QUERY_PATTERN, '$1[redacted]')
    .replace(SENSITIVE_ASSIGNMENT_PATTERN, (match) => {
      const equalsIndex = match.indexOf('=');
      const colonIndex = match.indexOf(':');
      const separatorIndex = equalsIndex >= 0
        ? equalsIndex
        : colonIndex;
      if (separatorIndex < 0) return '[redacted]';
      return `${match.slice(0, separatorIndex + 1).trimEnd()}[redacted]`;
    })
    .replace(URL_PATTERN, '[url]');
}

export function getSafeBuilderRouteErrorCause(error: unknown): string | undefined {
  if (error === null || error === undefined) return undefined;

  const rawMessage = error instanceof Error
    ? error.message || error.name
    : typeof error === 'string'
      ? error
      : 'unknown_error';
  const redacted = redactSensitiveErrorText(rawMessage.trim());
  if (!redacted) return undefined;
  return redacted.slice(0, MAX_ERROR_CAUSE_LENGTH);
}

export function builderJsonResponse(payload: JsonObject, init: ResponseInit = {}): NextResponse {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) {
    headers.set('content-type', JSON_CONTENT_TYPE);
  }
  return new NextResponse(JSON.stringify(payload), { ...init, headers });
}

export function builderSiteErrorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  cause?: unknown,
): NextResponse {
  const errorCause = getSafeBuilderRouteErrorCause(cause);
  return builderJsonResponse(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, errorCode),
      ...(errorCause ? { errorCause } : {}),
    },
    { status },
  );
}
