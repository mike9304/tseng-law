/**
 * Combined security guard for builder mutation APIs.
 * Runs auth + CSRF + rate limiting in one call.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkMutationRateLimit } from '@/lib/builder/security/rate-limit';

export interface GuardResult {
  username: string;
}

export function guardMutation(request: NextRequest): GuardResult | NextResponse {
  // 1. Auth
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  // 2. CSRF
  const csrf = validateCsrf(request);
  if (csrf) return csrf;

  // 3. Rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rl = checkMutationRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  return { username: auth.username };
}
