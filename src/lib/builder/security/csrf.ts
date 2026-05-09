/**
 * Phase 4 P4-21 — CSRF protection for builder mutation APIs.
 *
 * Strategy: Origin header validation. All mutation requests (POST,
 * PATCH, PUT, DELETE) must have an Origin or Referer header matching
 * the site's own domain. This is simpler than token-based CSRF and
 * works well with SameSite cookies + Basic Auth.
 *
 * Localhost requests are allowed for local review and Playwright API
 * helpers, but explicit cross-origin headers are still checked.
 */

import { NextRequest, NextResponse } from 'next/server';

export const CSRF_ORIGIN_MISMATCH = 'csrf_origin_mismatch';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://tseng-law.com',
  'https://www.tseng-law.com',
  'https://sejong-law.vercel.app',
] as const;

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

function isLocalhostOrigin(origin: string): boolean {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  const url = new URL(normalized);
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
}

function originFromReferer(value: string | null): string | null {
  return value ? normalizeOrigin(value) : null;
}

function requestOrigin(request: NextRequest): string | null {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return normalizeOrigin(request.nextUrl.origin);
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '') || 'https';
  return normalizeOrigin(`${proto}://${host}`);
}

export function resolveAllowedCsrfOrigins(request?: NextRequest): Set<string> {
  const origins = new Set<string>();
  const configured = process.env.BUILDER_ALLOWED_ORIGINS
    ?.split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin));

  for (const origin of configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS) {
    origins.add(origin);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const vercelOrigin = normalizeOrigin(vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`);
    if (vercelOrigin) origins.add(vercelOrigin);
  }

  const currentOrigin = request ? requestOrigin(request) : null;
  if (currentOrigin) origins.add(currentOrigin);

  return origins;
}

function csrfFailure() {
  return NextResponse.json(
    { ok: false, error: CSRF_ORIGIN_MISMATCH, code: CSRF_ORIGIN_MISMATCH },
    { status: 403 },
  );
}

export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  const origin = request.headers.get('origin');
  const refererOrigin = originFromReferer(request.headers.get('referer'));
  const checkValue = normalizeOrigin(origin ?? '') || refererOrigin;

  if (!checkValue) {
    const currentOrigin = requestOrigin(request);
    return currentOrigin && isLocalhostOrigin(currentOrigin) ? null : csrfFailure();
  }

  if (resolveAllowedCsrfOrigins(request).has(checkValue)) {
    return null;
  }

  if (isLocalhostOrigin(checkValue) && isLocalhostOrigin(requestOrigin(request) ?? '')) {
    return null;
  }

  return csrfFailure();
}
