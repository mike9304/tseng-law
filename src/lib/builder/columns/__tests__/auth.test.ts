import { NextRequest, NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  BUILDER_ADMIN_SESSION_COOKIE,
  createBuilderAdminSessionToken,
  requireBuilderAdminAuth,
} from '@/lib/builder/columns/auth';

const ORIGINAL_ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME;
const ORIGINAL_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;
const ORIGINAL_BUILDER_BASIC_AUTH_USERS = process.env.BUILDER_BASIC_AUTH_USERS;

function requestFor(username: string, password: string): NextRequest {
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  return new NextRequest('https://law.example.test/api/builder/site/settings', {
    headers: { authorization: `Basic ${token}` },
  });
}

function requestWithCookie(cookie: string): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages?locale=ko', {
    headers: { cookie },
  });
}

describe('requireBuilderAdminAuth', () => {
  beforeEach(() => {
    process.env.CMS_ADMIN_USERNAME = 'admin';
    process.env.CMS_ADMIN_PASSWORD = 'admin-pass';
    delete process.env.BUILDER_BASIC_AUTH_USERS;
  });

  afterEach(() => {
    if (ORIGINAL_ADMIN_USERNAME) process.env.CMS_ADMIN_USERNAME = ORIGINAL_ADMIN_USERNAME;
    else delete process.env.CMS_ADMIN_USERNAME;
    if (ORIGINAL_ADMIN_PASSWORD) process.env.CMS_ADMIN_PASSWORD = ORIGINAL_ADMIN_PASSWORD;
    else delete process.env.CMS_ADMIN_PASSWORD;
    if (ORIGINAL_BUILDER_BASIC_AUTH_USERS) {
      process.env.BUILDER_BASIC_AUTH_USERS = ORIGINAL_BUILDER_BASIC_AUTH_USERS;
    } else {
      delete process.env.BUILDER_BASIC_AUTH_USERS;
    }
  });

  it('accepts configured secondary builder credentials for separate reviewer sessions', () => {
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'reviewer', password: 'reviewer-pass' },
    ]);

    const result = requireBuilderAdminAuth(requestFor('reviewer', 'reviewer-pass'));

    expect(result).toEqual({ username: 'reviewer' });
  });

  it('still accepts the legacy CMS admin credential', () => {
    const result = requireBuilderAdminAuth(requestFor('admin', 'admin-pass'));

    expect(result).toEqual({ username: 'admin' });
  });

  it('accepts a signed builder admin session cookie for browser API fetches', () => {
    const token = createBuilderAdminSessionToken('admin');

    const result = requireBuilderAdminAuth(
      requestWithCookie(`${BUILDER_ADMIN_SESSION_COOKIE}=${token}`),
    );

    expect(result).toEqual({ username: 'admin' });
  });

  it('rejects tampered builder admin session cookies', () => {
    const token = createBuilderAdminSessionToken('admin');

    const result = requireBuilderAdminAuth(
      requestWithCookie(`${BUILDER_ADMIN_SESSION_COOKIE}=${token}x`),
    );

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected unauthorized response.');
    expect(result.status).toBe(401);
  });

  it('rejects unknown secondary credentials', () => {
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'reviewer', password: 'reviewer-pass' },
    ]);

    const result = requireBuilderAdminAuth(requestFor('reviewer', 'wrong-pass'));

    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) throw new Error('Expected unauthorized response.');
    expect(result.status).toBe(401);
  });
});
