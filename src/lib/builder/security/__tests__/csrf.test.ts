import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  CSRF_ORIGIN_MISMATCH,
  resolveAllowedCsrfOrigins,
  validateCsrf,
} from '@/lib/builder/security/csrf';

const ORIGINAL_ALLOWED = process.env.BUILDER_ALLOWED_ORIGINS;
const ORIGINAL_VERCEL = process.env.VERCEL_URL;

function request(url: string, init?: ConstructorParameters<typeof NextRequest>[1]): NextRequest {
  return new NextRequest(url, init);
}

describe('builder CSRF origin guard', () => {
  beforeEach(() => {
    process.env.BUILDER_ALLOWED_ORIGINS = 'https://tseng-law.com,http://localhost:3000';
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    if (ORIGINAL_ALLOWED) process.env.BUILDER_ALLOWED_ORIGINS = ORIGINAL_ALLOWED;
    else delete process.env.BUILDER_ALLOWED_ORIGINS;
    if (ORIGINAL_VERCEL) process.env.VERCEL_URL = ORIGINAL_VERCEL;
    else delete process.env.VERCEL_URL;
  });

  it('allows same-site Origin headers', () => {
    const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'POST',
      headers: { origin: 'https://tseng-law.com' },
    }));
    expect(result).toBeNull();
  });

  it('allows same-site Referer when Origin is absent', () => {
    const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'PATCH',
      headers: { referer: 'https://tseng-law.com/ko/admin-builder' },
    }));
    expect(result).toBeNull();
  });

  it('rejects cross-site mutation origins with csrf_origin_mismatch', async () => {
    const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    }));
    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(403);
    await expect(result?.json()).resolves.toMatchObject({
      code: CSRF_ORIGIN_MISMATCH,
      error: CSRF_ORIGIN_MISMATCH,
    });
  });

  it('rejects production-like mutations with no Origin or Referer', async () => {
    const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'DELETE',
    }));
    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(403);
  });

  it('allows local review requests without browser Origin headers', () => {
    const result = validateCsrf(request('http://localhost:3000/api/builder/site/pages', {
      method: 'POST',
      headers: { host: 'localhost:3000' },
    }));
    expect(result).toBeNull();
  });

  it('includes VERCEL_URL and the current host in the allowlist', () => {
    process.env.VERCEL_URL = 'preview-tseng-law.vercel.app';
    const result = resolveAllowedCsrfOrigins(request('https://branch.vercel.app/api/builder/site/pages', {
      method: 'POST',
      headers: { host: 'branch.vercel.app' },
    }));
    expect(result.has('https://preview-tseng-law.vercel.app')).toBe(true);
    expect(result.has('https://branch.vercel.app')).toBe(true);
  });
});
