import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export interface BuilderAdminAuthResult {
  username: string;
}

type BuilderBasicAuthCredential = {
  readonly username: string;
  readonly password: string;
};

type BuilderAuthConfig =
  | { readonly status: 'ready'; readonly credentials: readonly BuilderBasicAuthCredential[] }
  | { readonly status: 'misconfigured'; readonly message: string };

export const BUILDER_ADMIN_SESSION_COOKIE = 'builder_admin_session';
const BUILDER_ADMIN_SESSION_VERSION = 'v1';
const BUILDER_ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header) return null;
  if (!header.toLowerCase().startsWith('basic ')) return null;
  const encoded = header.slice(6).trim();
  if (!encoded) return null;
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separator = decoded.indexOf(':');
  if (separator < 0) return null;
  return {
    user: decoded.slice(0, separator),
    pass: decoded.slice(separator + 1),
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

function sessionSecretMaterial(): string {
  const explicitSecret = process.env.BUILDER_ADMIN_SESSION_SECRET?.trim();
  if (explicitSecret) return explicitSecret;
  return [
    process.env.CMS_ADMIN_USERNAME?.trim() ?? '',
    process.env.CMS_ADMIN_PASSWORD ?? '',
    process.env.BUILDER_BASIC_AUTH_USERS ?? '',
  ].join('\0');
}

function signSessionPayload(payload: string): string {
  return createHmac('sha256', sessionSecretMaterial()).update(payload).digest('hex');
}

function encodePayload(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodePayload(encoded: string): unknown {
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
}

export function createBuilderAdminSessionToken(
  username: string,
  expiresAt = Date.now() + BUILDER_ADMIN_SESSION_TTL_MS,
): string {
  const payload = `${BUILDER_ADMIN_SESSION_VERSION}.${encodePayload({ username, expiresAt })}`;
  const signature = signSessionPayload(payload);
  return `${payload}.${signature}`;
}

function readBuilderAdminSessionCookie(request: NextRequest): string | null {
  const cookieValue = request.cookies.get(BUILDER_ADMIN_SESSION_COOKIE)?.value;
  if (cookieValue) return cookieValue;
  const header = request.headers.get('cookie');
  if (!header) return null;
  const cookies = header.split(';');
  for (const cookie of cookies) {
    const separator = cookie.indexOf('=');
    if (separator < 0) continue;
    const name = cookie.slice(0, separator).trim();
    if (name !== BUILDER_ADMIN_SESSION_COOKIE) continue;
    return cookie.slice(separator + 1).trim();
  }
  return null;
}

function isConfiguredUsername(config: BuilderAuthConfig, username: string): boolean {
  if (config.status !== 'ready') return false;
  return config.credentials.some((credential) => constantTimeEquals(credential.username, username));
}

function authenticateSessionCookie(
  request: NextRequest,
  config: BuilderAuthConfig,
): BuilderAdminAuthResult | null {
  const token = readBuilderAdminSessionCookie(request);
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [version, encodedPayload, signature] = parts;
  if (version !== BUILDER_ADMIN_SESSION_VERSION || !encodedPayload || !signature) return null;

  const payload = `${version}.${encodedPayload}`;
  const expectedSignature = signSessionPayload(payload);
  if (!constantTimeEquals(signature, expectedSignature)) return null;

  let parsed: unknown;
  try {
    parsed = decodePayload(encodedPayload);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  const username = typeof parsed.username === 'string' ? parsed.username.trim() : '';
  const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : 0;
  if (!username || expiresAt <= Date.now()) return null;
  if (!isConfiguredUsername(config, username)) return null;
  return { username };
}

function buildUnauthorizedResponse(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: {
      'WWW-Authenticate': 'Basic realm="Hojeong builder admin", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCredential(value: unknown): BuilderBasicAuthCredential | null {
  if (!isRecord(value)) return null;
  const username = typeof value.username === 'string' ? value.username.trim() : '';
  const password = typeof value.password === 'string' ? value.password : '';
  if (!username || !password) return null;
  return { username, password };
}

function parseAdditionalCredentials(raw: string | undefined): BuilderAuthConfig {
  if (!raw?.trim()) return { status: 'ready', credentials: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        status: 'misconfigured',
        message: 'Builder admin API is not configured. BUILDER_BASIC_AUTH_USERS must be a JSON array.',
      };
    }
    throw error;
  }
  if (!Array.isArray(parsed)) {
    return {
      status: 'misconfigured',
      message: 'Builder admin API is not configured. BUILDER_BASIC_AUTH_USERS must be a JSON array.',
    };
  }
  const credentials: BuilderBasicAuthCredential[] = [];
  for (const entry of parsed) {
    const credential = parseCredential(entry);
    if (!credential) {
      return {
        status: 'misconfigured',
        message: 'Builder admin API is not configured. BUILDER_BASIC_AUTH_USERS entries need username and password.',
      };
    }
    credentials.push(credential);
  }
  return { status: 'ready', credentials };
}

function configuredCredentials(): BuilderAuthConfig {
  const additional = parseAdditionalCredentials(process.env.BUILDER_BASIC_AUTH_USERS);
  if (additional.status === 'misconfigured') return additional;
  const legacyUsername = process.env.CMS_ADMIN_USERNAME?.trim() ?? '';
  const legacyPassword = process.env.CMS_ADMIN_PASSWORD ?? '';
  const legacyCredentials = legacyUsername && legacyPassword
    ? [{ username: legacyUsername, password: legacyPassword }]
    : [];
  const credentials = [...legacyCredentials, ...additional.credentials];
  if (credentials.length === 0) {
    return {
      status: 'misconfigured',
      message: 'Builder admin API is not configured. Set CMS_ADMIN_USERNAME/CMS_ADMIN_PASSWORD or BUILDER_BASIC_AUTH_USERS.',
    };
  }
  return { status: 'ready', credentials };
}

export function requireBuilderAdminAuth(
  request: NextRequest,
): BuilderAdminAuthResult | NextResponse {
  const config = configuredCredentials();

  if (config.status === 'misconfigured') {
    return buildUnauthorizedResponse(config.message, 503);
  }

  const credentials = parseBasicAuth(request.headers.get('authorization'));
  if (!credentials) {
    const session = authenticateSessionCookie(request, config);
    if (session) return session;
    return buildUnauthorizedResponse('Authentication required', 401);
  }

  let matchedUsername: string | null = null;
  for (const expected of config.credentials) {
    const userMatches = constantTimeEquals(credentials.user, expected.username);
    const passMatches = constantTimeEquals(credentials.pass, expected.password);
    if (userMatches && passMatches) matchedUsername = expected.username;
  }
  if (!matchedUsername) return buildUnauthorizedResponse('Authentication required', 401);

  return { username: matchedUsername };
}
