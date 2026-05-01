/**
 * Combined security guard for builder mutation APIs.
 * Runs auth + CSRF + rate limiting in one call.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { validateCsrf } from '@/lib/builder/security/csrf';
import {
  checkAssetUploadRateLimit,
  checkMutationRateLimit,
  checkPublishRateLimit,
  type RateLimitResult,
} from '@/lib/builder/security/rate-limit';

export interface GuardResult {
  username: string;
}

type GuardBucket = 'mutation' | 'publish' | 'asset';

interface GuardOptions {
  bucket?: GuardBucket;
  allowReadOnly?: boolean;
}

function rateLimitForBucket(bucket: GuardBucket, ip: string): RateLimitResult {
  switch (bucket) {
    case 'publish':
      return checkPublishRateLimit(ip);
    case 'asset':
      return checkAssetUploadRateLimit(ip);
    case 'mutation':
    default:
      return checkMutationRateLimit(ip);
  }
}

export function guardMutation(
  request: NextRequest,
  options: GuardOptions = {},
): GuardResult | NextResponse {
  // 1. Auth
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  // 2. CSRF
  const csrf = validateCsrf(request);
  if (csrf) return csrf;

  // 3. Rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rl = rateLimitForBucket(options.bucket ?? 'mutation', ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  return { username: auth.username };
}

export function guardBuilderRead(request: NextRequest): GuardResult | NextResponse {
  return requireBuilderAdminAuth(request);
}
