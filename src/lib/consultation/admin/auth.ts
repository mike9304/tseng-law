import { NextRequest, NextResponse } from 'next/server';

export interface ConsultationAdminAuthResult {
  username: string;
}

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header) return null;
  if (!header.toLowerCase().startsWith('basic ')) return null;
  const encoded = header.slice(6).trim();
  if (!encoded) return null;

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;
    return {
      user: decoded.slice(0, separator),
      pass: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function buildUnauthorizedResponse(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: {
      'WWW-Authenticate': 'Basic realm="Hojeong consultation admin", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export function requireConsultationAdminAuth(
  request: NextRequest,
): ConsultationAdminAuthResult | NextResponse {
  const expectedUser = process.env.CMS_ADMIN_USERNAME;
  const expectedPass = process.env.CMS_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return buildUnauthorizedResponse(
      'Consultation admin API is not configured. Set CMS_ADMIN_USERNAME and CMS_ADMIN_PASSWORD.',
      503,
    );
  }

  const credentials = parseBasicAuth(request.headers.get('authorization'));
  if (
    !credentials ||
    !constantTimeEquals(credentials.user, expectedUser) ||
    !constantTimeEquals(credentials.pass, expectedPass)
  ) {
    return buildUnauthorizedResponse('Authentication required', 401);
  }

  return { username: credentials.user };
}
