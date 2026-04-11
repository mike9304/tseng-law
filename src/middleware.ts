import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge middleware — Basic Auth guard for the consultation operator
 * dashboard at /[locale]/admin-consultation.
 *
 * Runs before the Server Component, which means we can actually set
 * an HTTP 401 + WWW-Authenticate challenge (something page-level
 * code in the App Router can't do). Credentials come from the
 * CMS_ADMIN_USERNAME / CMS_ADMIN_PASSWORD environment variables that
 * already exist in the Vercel project.
 *
 * If the env vars are missing, the middleware fails closed (503) so
 * a mis-configured production deployment can't leak operator data.
 *
 * Everything else is untouched: this middleware only matches paths
 * starting with /{locale}/admin-consultation, so no other routes pay
 * the edge cost.
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

export function middleware(request: NextRequest) {
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

export const config = {
  // Guard the admin dashboard under every supported locale. The `(ko|zh-hant|en)`
  // group is a Next.js matcher pattern — it's translated into a regex behind
  // the scenes so other paths like `/ko/contact` or `/en/columns` are NOT
  // affected by this middleware.
  matcher: ['/(ko|zh-hant|en)/admin-consultation/:path*'],
};
