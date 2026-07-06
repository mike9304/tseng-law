/**
 * Combined security guard for builder mutation APIs.
 * Runs auth + CSRF + rate limiting in one call.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { validateCsrf } from '@/lib/builder/security/csrf';
import {
  checkAssetUploadRateLimit,
  checkDraftSaveRateLimit,
  checkMutationRateLimit,
  checkPublishRateLimit,
  type RateLimitResult,
} from '@/lib/builder/security/rate-limit';
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';

export interface GuardResult {
  username: string;
  /** PR #6 — granular permission used for this request (for audit). */
  permission?: BuilderPermission;
}

type GuardBucket = 'mutation' | 'publish' | 'asset' | 'draft';

interface GuardOptions {
  bucket?: GuardBucket;
  allowReadOnly?: boolean;
  /** PR #6 — required granular permission. Defaults to 'edit-pages'. */
  permission?: BuilderPermission;
}

function rateLimitForBucket(bucket: GuardBucket, ip: string): Promise<RateLimitResult> {
  switch (bucket) {
    case 'publish':
      return checkPublishRateLimit(ip);
    case 'asset':
      return checkAssetUploadRateLimit(ip);
    case 'draft':
      return checkDraftSaveRateLimit(ip);
    case 'mutation':
    default:
      return checkMutationRateLimit(ip);
  }
}

function missingPermissionResponse(permission: BuilderPermission): NextResponse {
  return NextResponse.json({ error: `Missing permission: ${permission}` }, { status: 403 });
}

export async function guardMutation(
  request: NextRequest,
  options: GuardOptions = {},
): Promise<GuardResult | NextResponse> {
  // 1. Auth
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  // 2. CSRF
  const csrf = validateCsrf(request);
  if (csrf) return csrf;

  // 3. Permission gate
  if (options.permission) {
    if (!(await userHasPermission(auth.username, options.permission))) {
      return missingPermissionResponse(options.permission);
    }
  }

  // 4. Rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rl = await rateLimitForBucket(options.bucket ?? 'mutation', ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  return { username: auth.username, permission: options.permission };
}

export function guardBuilderRead(request: NextRequest): GuardResult | NextResponse {
  return requireBuilderAdminAuth(request);
}

export async function guardBuilderReadWithPermission(
  request: NextRequest,
  permission: BuilderPermission,
): Promise<GuardResult | NextResponse> {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  if (!(await userHasPermission(auth.username, permission))) return missingPermissionResponse(permission);
  return { username: auth.username, permission };
}
