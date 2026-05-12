import { NextRequest, NextResponse } from 'next/server';
import {
  findMatchingRedirect,
  loadActiveRedirects,
} from '@/lib/builder/seo/redirects-edge';

/**
 * Edge middleware — two responsibilities:
 *
 *   1. Basic Auth guard for `/{locale}/admin-consultation` and
 *      `/{locale}/admin-builder`. Credentials come from
 *      CMS_ADMIN_USERNAME / CMS_ADMIN_PASSWORD env vars; missing env
 *      means we fail closed with 503 so a mis-configured production
 *      deployment can't leak operator data. Unchanged from before.
 *
 *   2. SEO maturity — applies site-level redirect rules on public
 *      paths. Rules are loaded from `@vercel/blob` with a short TTL
 *      cache so the per-request cost is one (cached) blob read at
 *      worst. If the blob token isn't set (typical for `next dev`)
 *      the redirect lookup short-circuits — production paths still
 *      route normally.
 *
 * Admin paths are never subject to the redirect lookup; redirect
 * paths never see the auth challenge. Static, _next, image, and api
 * paths are excluded by the matcher below to keep the edge cost low.
 */

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header) return null;
  if (!header.toLowerCase().startsWith('basic ')) return null;
  const encoded = header.slice(6).trim();
  if (!encoded) return null;
  let decoded: string;
  try {
    // Edge runtime has `atob` but not `Buffer`; atob returns a binary
    // string that we still need to decode as UTF-8 for Korean passwords.
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    decoded = new TextDecoder('utf-8').decode(bytes);
  } catch {
    return null;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return null;
  return {
    user: decoded.slice(0, idx),
    pass: decoded.slice(idx + 1),
  };
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const ADMIN_PATH_RE = /^\/(?:ko|zh-hant|en)\/(?:admin-consultation|admin-builder)(?:\/|$)/;

function handleAdminAuth(request: NextRequest): NextResponse {
  const expectedUser = process.env.CMS_ADMIN_USERNAME;
  const expectedPass = process.env.CMS_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new NextResponse(
      'Admin dashboard is not configured. Set CMS_ADMIN_USERNAME and CMS_ADMIN_PASSWORD.',
      {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      },
    );
  }

  const creds = parseBasicAuth(request.headers.get('authorization'));
  if (
    !creds ||
    !constantTimeEquals(creds.user, expectedUser) ||
    !constantTimeEquals(creds.pass, expectedPass)
  ) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Hojeong consultation admin", charset="UTF-8"',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return NextResponse.next();
}

async function handlePublicRedirect(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  const rules = await loadActiveRedirects(request.nextUrl.origin);
  if (rules.length === 0) return null;
  const match = findMatchingRedirect(pathname, rules);
  if (!match) return null;

  const target = match.to.startsWith('/')
    ? new URL(match.to + request.nextUrl.search, request.nextUrl.origin)
    : new URL(match.to);
  return NextResponse.redirect(target, match.type);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (ADMIN_PATH_RE.test(pathname)) {
    return handleAdminAuth(request);
  }

  // Public path — try a redirect lookup. If anything blows up, fall
  // through to NextResponse.next() so the site keeps working.
  try {
    const redirect = await handlePublicRedirect(request);
    if (redirect) return redirect;
  } catch {
    // best-effort
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request that isn't a static asset or API route. The
  // matcher uses Next.js's regex syntax — admin paths are still
  // covered by ADMIN_PATH_RE inside `middleware()`.
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|images/|fonts/|.*\\..*).*)',
  ],
};
