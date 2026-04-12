/**
 * Phase 4 P4-21 — CSRF protection for builder mutation APIs.
 *
 * Strategy: Origin header validation. All mutation requests (POST,
 * PATCH, PUT, DELETE) must have an Origin or Referer header matching
 * the site's own domain. This is simpler than token-based CSRF and
 * works well with SameSite cookies + Basic Auth.
 *
 * The check is skipped in development (localhost).
 */

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://tseng-law.com',
  'https://www.tseng-law.com',
  'https://sejong-law.vercel.app',
]);

function isLocalhost(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const checkValue = origin || (referer ? new URL(referer).origin : null);

  if (!checkValue) {
    return NextResponse.json(
      { error: 'Missing Origin header' },
      { status: 403 },
    );
  }

  if (isLocalhost(checkValue)) {
    return null;
  }

  if (ALLOWED_ORIGINS.has(checkValue)) {
    return null;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && checkValue === `https://${vercelUrl}`) {
    return null;
  }

  return NextResponse.json(
    { error: 'CSRF validation failed' },
    { status: 403 },
  );
}
