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
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import { hasBuilderPermission } from '@/lib/builder/security/permissions';
import type { UserRole } from '@/lib/builder/collab/collab-engine';

export interface GuardResult {
  username: string;
  /** PR #6 — granular permission used for this request (for audit). */
  permission?: BuilderPermission;
}

type GuardBucket = 'mutation' | 'publish' | 'asset';

interface GuardOptions {
  bucket?: GuardBucket;
  allowReadOnly?: boolean;
  /** PR #6 — required granular permission. Defaults to 'edit-pages'. */
  permission?: BuilderPermission;
}

/**
 * Until a real per-user role store lands, the single admin user behind
 * basic-auth is treated as the implicit `owner` role. Keeping this
 * indirection lets us swap in real RBAC without rewriting route call sites.
 */
function resolveRoleForAdmin(): UserRole {
  return 'owner';
}

function rateLimitForBucket(bucket: GuardBucket, ip: string): Promise<RateLimitResult> {
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
): Promise<GuardResult | NextResponse> {
  // 1. Auth
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return Promise.resolve(auth);

  // 2. CSRF
  const csrf = validateCsrf(request);
  if (csrf) return Promise.resolve(csrf);

  // 3. Permission gate
  if (options.permission) {
    const role = resolveRoleForAdmin();
    if (!hasBuilderPermission(role, options.permission)) {
      return Promise.resolve(
        NextResponse.json(
          { error: `Missing permission: ${options.permission}` },
          { status: 403 },
        ),
      );
    }
  }

  // 4. Rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return rateLimitForBucket(options.bucket ?? 'mutation', ip).then((rl) => {
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }

    return { username: auth.username, permission: options.permission };
  });
}

export function guardBuilderRead(request: NextRequest): GuardResult | NextResponse {
  return requireBuilderAdminAuth(request);
}
