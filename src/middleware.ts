import { NextRequest, NextResponse } from 'next/server';
import {
  findMatchingRedirect,
  loadActiveRedirects,
} from '@/lib/builder/seo/redirects-edge';

type BasicCredential = {
  readonly username: string;
  readonly password: string;
};

type AdminAuthConfig =
  | { readonly status: 'ready'; readonly credentials: readonly BasicCredential[] }
  | { readonly status: 'misconfigured'; readonly message: string };

const BUILDER_ADMIN_SESSION_COOKIE = 'builder_admin_session';
const BUILDER_ADMIN_SESSION_VERSION = 'v1';
const BUILDER_ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60;

/**
 * Edge middleware — two responsibilities:
 *
 *   1. Basic Auth guard for `/{locale}/admin-consultation` and
 *      `/{locale}/admin-builder`. Consultation admin stays on the
 *      legacy CMS_ADMIN_USERNAME / CMS_ADMIN_PASSWORD pair, while the
 *      builder also accepts optional BUILDER_BASIC_AUTH_USERS entries.
 *      Missing env means we fail closed with 503 so a mis-configured
 *      production deployment can't leak operator data.
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
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
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

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function sessionSecretMaterial(): string {
  const explicitSecret = process.env.BUILDER_ADMIN_SESSION_SECRET?.trim();
  if (explicitSecret) return explicitSecret;
  return [
    process.env.CMS_ADMIN_USERNAME?.trim() ?? '',
    process.env.CMS_ADMIN_PASSWORD ?? '',
    process.env.BUILDER_BASIC_AUTH_USERS ?? '',
  ].join('\0');
}

async function signSessionPayload(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecretMaterial()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return bytesToHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
}

async function createBuilderAdminSessionToken(username: string): Promise<string> {
  const payload = `${BUILDER_ADMIN_SESSION_VERSION}.${base64UrlEncode(JSON.stringify({
    username,
    expiresAt: Date.now() + (BUILDER_ADMIN_SESSION_TTL_SECONDS * 1000),
  }))}`;
  return `${payload}.${await signSessionPayload(payload)}`;
}

const CONSULTATION_ADMIN_PATH_RE = /^\/(?:ko|zh-hant|en)\/admin-consultation(?:\/|$)/;
const BUILDER_ADMIN_PATH_RE = /^\/(?:ko|zh-hant|en)\/admin-builder(?:\/|$)/;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function legacyCmsCredential(): BasicCredential | null {
  const username = process.env.CMS_ADMIN_USERNAME?.trim() ?? '';
  const password = process.env.CMS_ADMIN_PASSWORD ?? '';
  return username && password ? { username, password } : null;
}

function parseBuilderCredential(value: unknown): BasicCredential | null {
  if (!isObjectRecord(value)) return null;
  const username = typeof value.username === 'string' ? value.username.trim() : '';
  const password = typeof value.password === 'string' ? value.password : '';
  return username && password ? { username, password } : null;
}

function parseBuilderCredentials(raw: string | undefined): AdminAuthConfig {
  if (!raw?.trim()) return { status: 'ready', credentials: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        status: 'misconfigured',
        message: 'Builder admin is not configured. BUILDER_BASIC_AUTH_USERS must be a JSON array.',
      };
    }
    throw error;
  }
  if (!Array.isArray(parsed)) {
    return {
      status: 'misconfigured',
      message: 'Builder admin is not configured. BUILDER_BASIC_AUTH_USERS must be a JSON array.',
    };
  }
  const credentials: BasicCredential[] = [];
  for (const entry of parsed) {
    const credential = parseBuilderCredential(entry);
    if (!credential) {
      return {
        status: 'misconfigured',
        message: 'Builder admin is not configured. BUILDER_BASIC_AUTH_USERS entries need username and password.',
      };
    }
    credentials.push(credential);
  }
  return { status: 'ready', credentials };
}

function consultationAuthConfig(): AdminAuthConfig {
  const legacy = legacyCmsCredential();
  if (legacy) return { status: 'ready', credentials: [legacy] };
  return {
    status: 'misconfigured',
    message: 'Admin dashboard is not configured. Set CMS_ADMIN_USERNAME and CMS_ADMIN_PASSWORD.',
  };
}

function builderAuthConfig(): AdminAuthConfig {
  const additional = parseBuilderCredentials(process.env.BUILDER_BASIC_AUTH_USERS);
  if (additional.status === 'misconfigured') return additional;
  const legacy = legacyCmsCredential();
  const credentials = legacy
    ? [legacy, ...additional.credentials]
    : additional.credentials;
  if (credentials.length > 0) return { status: 'ready', credentials };
  return {
    status: 'misconfigured',
    message: 'Builder admin is not configured. Set CMS_ADMIN_USERNAME/CMS_ADMIN_PASSWORD or BUILDER_BASIC_AUTH_USERS.',
  };
}

function handleAdminAuth(
  request: NextRequest,
  config: AdminAuthConfig,
  realm: string,
  options: { issueBuilderSession?: boolean } = {},
): Promise<NextResponse> | NextResponse {
  if (config.status === 'misconfigured') {
    return new NextResponse(config.message, {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const creds = parseBasicAuth(request.headers.get('authorization'));
  let matchedUsername: string | null = null;
  if (creds) {
    for (const credential of config.credentials) {
      if (
        constantTimeEquals(creds.user, credential.username)
        && constantTimeEquals(creds.pass, credential.password)
      ) {
        matchedUsername = credential.username;
      }
    }
  }
  if (!matchedUsername) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tseng-pathname', request.nextUrl.pathname);
  const nextOptions = { request: { headers: requestHeaders } };

  if (!options.issueBuilderSession) return NextResponse.next(nextOptions);

  return createBuilderAdminSessionToken(matchedUsername).then((token) => {
    const response = NextResponse.next(nextOptions);
    response.cookies.set(BUILDER_ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
      path: '/',
      maxAge: BUILDER_ADMIN_SESSION_TTL_SECONDS,
    });
    return response;
  });
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

  if (CONSULTATION_ADMIN_PATH_RE.test(pathname)) {
    return handleAdminAuth(request, consultationAuthConfig(), 'Hojeong consultation admin');
  }
  if (BUILDER_ADMIN_PATH_RE.test(pathname)) {
    return handleAdminAuth(request, builderAuthConfig(), 'Hojeong builder admin', {
      issueBuilderSession: true,
    });
  }

  // Public path — try a redirect lookup. If anything blows up, fall
  // through to NextResponse.next() so the site keeps working.
  try {
    const redirect = await handlePublicRedirect(request);
    if (redirect) return redirect;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tseng-pathname', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Admin routes are listed before the public asset exclusion so dotted
  // admin subpaths still reach the Basic Auth checks inside `middleware()`.
  matcher: [
    '/:locale(ko|zh-hant|en)/admin-consultation/:path*',
    '/:locale(ko|zh-hant|en)/admin-builder/:path*',
    '/((?!_next/static|_next/image|api/|favicon.ico|robots.txt|sitemap.xml|images/|fonts/|.*\\..*).*)',
  ],
};
