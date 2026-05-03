import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';

const ORIGINAL_USER = process.env.CMS_ADMIN_USERNAME;
const ORIGINAL_PASS = process.env.CMS_ADMIN_PASSWORD;

function requestWithAuth(value?: string): NextRequest {
  const headers = new Headers();
  if (value) headers.set('authorization', value);
  return new NextRequest('http://localhost/api/consultation/data/export', { headers });
}

function basic(user: string, pass: string): string {
  return `Basic ${Buffer.from(`${user}:${pass}`, 'utf8').toString('base64')}`;
}

describe('consultation admin api auth', () => {
  beforeEach(() => {
    process.env.CMS_ADMIN_USERNAME = 'admin';
    process.env.CMS_ADMIN_PASSWORD = 'secret';
  });

  afterEach(() => {
    if (ORIGINAL_USER) process.env.CMS_ADMIN_USERNAME = ORIGINAL_USER;
    else delete process.env.CMS_ADMIN_USERNAME;
    if (ORIGINAL_PASS) process.env.CMS_ADMIN_PASSWORD = ORIGINAL_PASS;
    else delete process.env.CMS_ADMIN_PASSWORD;
  });

  it('rejects missing credentials', () => {
    const result = requireConsultationAdminAuth(requestWithAuth());
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(401);
  });

  it('rejects invalid credentials', () => {
    const result = requireConsultationAdminAuth(requestWithAuth(basic('admin', 'wrong')));
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(401);
  });

  it('accepts configured credentials', () => {
    const result = requireConsultationAdminAuth(requestWithAuth(basic('admin', 'secret')));
    expect(result).toEqual({ username: 'admin' });
  });

  it('fails closed when env credentials are not configured', () => {
    delete process.env.CMS_ADMIN_USERNAME;
    delete process.env.CMS_ADMIN_PASSWORD;
    const result = requireConsultationAdminAuth(requestWithAuth(basic('admin', 'secret')));
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(503);
  });
});
