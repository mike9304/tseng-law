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
    delete process.env.BUILDER_ALLOWED_ORIGINS;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    if (ORIGINAL_ALLOWED) process.env.BUILDER_ALLOWED_ORIGINS = ORIGINAL_ALLOWED;
    else delete process.env.BUILDER_ALLOWED_ORIGINS;
    if (ORIGINAL_VERCEL) process.env.VERCEL_URL = ORIGINAL_VERCEL;
    else delete process.env.VERCEL_URL;
  });

  it.each([
    'https://tseng-law.com',
    'https://www.tseng-law.com',
    'https://sejong-law.vercel.app',
  ])('allows the server-owned official origin %s', (origin) => {
    const result = validateCsrf(request(`${origin}/api/builder/site/pages`, {
      method: 'POST',
      headers: { origin },
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

  it.each(['host', 'x-forwarded-host'])(
    'does not allow a forged %s header to expand the allowlist',
    async (headerName) => {
      const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
        method: 'POST',
        headers: {
          origin: 'https://evil.example',
          [headerName]: 'evil.example',
        },
      }));

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(403);
    },
  );

  it.each(['host', 'x-forwarded-host'])(
    'does not allow a forged localhost %s header to bypass a missing Origin',
    async (headerName) => {
      const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
        method: 'POST',
        headers: { [headerName]: 'localhost:3000' },
      }));

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(403);
    },
  );

  it('allows an explicitly configured preview or custom origin', () => {
    process.env.BUILDER_ALLOWED_ORIGINS = 'https://preview.example.com, https://builder.example.org/path';

    expect(validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'PUT',
      headers: { origin: 'https://preview.example.com' },
    }))).toBeNull();
    expect(validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'PUT',
      headers: { origin: 'https://builder.example.org' },
    }))).toBeNull();
  });

  it('allows the deployment origin configured by VERCEL_URL', () => {
    process.env.VERCEL_URL = 'preview-tseng-law.vercel.app';

    const result = validateCsrf(request('https://tseng-law.com/api/builder/site/pages', {
      method: 'PATCH',
      headers: { origin: 'https://preview-tseng-law.vercel.app' },
    }));

    expect(result).toBeNull();
  });

  it('allows local review requests without browser Origin headers', () => {
    const result = validateCsrf(request('http://localhost:3000/api/builder/site/pages', {
      method: 'POST',
      headers: { host: 'forged.example' },
    }));
    expect(result).toBeNull();
  });

  it('allows localhost origins on a localhost request across development ports', () => {
    const result = validateCsrf(request('http://127.0.0.1:4173/api/builder/site/pages', {
      method: 'POST',
      headers: { origin: 'http://localhost:5173' },
    }));
    expect(result).toBeNull();
  });

  it('includes VERCEL_URL but not a request-derived host in the allowlist', () => {
    process.env.VERCEL_URL = 'preview-tseng-law.vercel.app';
    const result = resolveAllowedCsrfOrigins();
    expect(result.has('https://preview-tseng-law.vercel.app')).toBe(true);
    expect(result.has('https://branch.vercel.app')).toBe(false);
  });
});
