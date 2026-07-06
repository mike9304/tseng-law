import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { config, middleware } from './middleware';

const ORIGINAL_CMS_ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME;
const ORIGINAL_CMS_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;
const ORIGINAL_BUILDER_BASIC_AUTH_USERS = process.env.BUILDER_BASIC_AUTH_USERS;

function basic(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

function adminRequest(pathname: string, authorization?: string): NextRequest {
  const headers = new Headers();
  if (authorization) headers.set('authorization', authorization);
  return new NextRequest(`https://law.example.test${pathname}`, { headers });
}

function restoreEnv(): void {
  if (ORIGINAL_CMS_ADMIN_USERNAME === undefined) delete process.env.CMS_ADMIN_USERNAME;
  else process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS_ADMIN_USERNAME;

  if (ORIGINAL_CMS_ADMIN_PASSWORD === undefined) delete process.env.CMS_ADMIN_PASSWORD;
  else process.env.CMS_ADMIN_PASSWORD = ORIGINAL_CMS_ADMIN_PASSWORD;

  if (ORIGINAL_BUILDER_BASIC_AUTH_USERS === undefined) delete process.env.BUILDER_BASIC_AUTH_USERS;
  else process.env.BUILDER_BASIC_AUTH_USERS = ORIGINAL_BUILDER_BASIC_AUTH_USERS;
}

describe('admin middleware auth split', () => {
  beforeEach(() => {
    process.env.CMS_ADMIN_USERNAME = 'admin';
    process.env.CMS_ADMIN_PASSWORD = 'admin-pass';
    delete process.env.BUILDER_BASIC_AUTH_USERS;
  });

  afterEach(() => {
    restoreEnv();
  });

  it('allows a builder-only secondary credential into admin-builder', async () => {
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'reviewer', password: 'reviewer-pass' },
    ]);

    const response = await middleware(
      adminRequest('/ko/admin-builder', basic('reviewer', 'reviewer-pass')),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('www-authenticate')).toBeNull();
  });

  it('keeps builder-only secondary credentials out of admin-consultation', async () => {
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'reviewer', password: 'reviewer-pass' },
    ]);

    const response = await middleware(
      adminRequest('/ko/admin-consultation', basic('reviewer', 'reviewer-pass')),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toBe(
      'Basic realm="Hojeong consultation admin", charset="UTF-8"',
    );
  });

  it('still allows the legacy CMS credential into admin-builder', async () => {
    const authorization = basic('admin', 'admin-pass');

    const response = await middleware(adminRequest('/ko/admin-builder', authorization));

    expect(response.status).toBe(200);
    expect(response.headers.get('www-authenticate')).toBeNull();
  });

  it('sets a builder admin session cookie after successful admin-builder basic auth', async () => {
    const response = await middleware(
      adminRequest('/ko/admin-builder', basic('admin', 'admin-pass')),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('builder_admin_session=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=lax');
  });

  it('fails admin-builder closed when secondary credential config is malformed', async () => {
    process.env.BUILDER_BASIC_AUTH_USERS = '{"username":"reviewer"}';

    const response = await middleware(
      adminRequest('/ko/admin-builder', basic('admin', 'admin-pass')),
    );
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(body).toContain('BUILDER_BASIC_AUTH_USERS must be a JSON array');
  });

  it('does not let malformed builder-only config break admin-consultation', async () => {
    process.env.BUILDER_BASIC_AUTH_USERS = 'not-json';

    const response = await middleware(
      adminRequest('/ko/admin-consultation', basic('admin', 'admin-pass')),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('www-authenticate')).toBeNull();
  });

  it('matches admin paths before the public dotted-asset exclusion can skip them', () => {
    const expectedAdminMatchers = [
      '/:locale(ko|zh-hant|en)/admin-consultation/:path*',
      '/:locale(ko|zh-hant|en)/admin-builder/:path*',
    ];

    expect(config.matcher).toEqual(expect.arrayContaining(expectedAdminMatchers));
  });

  it('challenges unauthenticated dotted admin-builder subpaths', async () => {
    const response = await middleware(adminRequest('/ko/admin-builder/review.v2'));

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toBe(
      'Basic realm="Hojeong builder admin", charset="UTF-8"',
    );
  });

  it('challenges unauthenticated dotted admin-consultation subpaths', async () => {
    const response = await middleware(adminRequest('/ko/admin-consultation/export.csv'));

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toBe(
      'Basic realm="Hojeong consultation admin", charset="UTF-8"',
    );
  });
});
