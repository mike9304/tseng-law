import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getDomainByName,
  listDomains,
  makeDomainId,
  makeVerificationToken,
  saveDomain,
} from '@/lib/builder/domains/storage';
import type { DomainBinding } from '@/lib/builder/domains/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/domains/storage', () => ({
  getDomainByName: vi.fn(),
  listDomains: vi.fn(),
  makeDomainId: vi.fn((domain: string) => `dom_${domain}`),
  makeVerificationToken: vi.fn(() => 'verify-token'),
  saveDomain: vi.fn(),
}));

const binding: DomainBinding = {
  domainId: 'dom_example.com',
  domain: 'example.com',
  verificationToken: 'verify-token',
  cnameTarget: 'cname.vercel-dns.com',
  status: 'pending-dns',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const getDomainByNameMock = vi.mocked(getDomainByName);
const listDomainsMock = vi.mocked(listDomains);
const makeDomainIdMock = vi.mocked(makeDomainId);
const makeVerificationTokenMock = vi.mocked(makeVerificationToken);
const saveDomainMock = vi.mocked(saveDomain);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/domains${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: string | unknown = { domain: 'example.com' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/domains${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/domains', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getDomainByNameMock.mockResolvedValue(null);
    listDomainsMock.mockResolvedValue([binding] as never);
    makeDomainIdMock.mockImplementation((domain: string) => `dom_${domain}`);
    makeVerificationTokenMock.mockReturnValue('verify-token');
    saveDomainMock.mockResolvedValue(undefined as never);
  });

  it('returns domains while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'settings',
    });
    expect(payload).toEqual({
      ok: true,
      domains: [binding],
      total: 1,
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listDomainsMock.mockRejectedValueOnce(new Error('domain list secret leaked'));

    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load domains.',
      errorCode: 'domains_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('domain list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/domains] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the domain request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(postRequest('locale=zh-hant', { domain: 'not a domain' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認網域請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
    expect(saveDomainMock).not.toHaveBeenCalled();
  });

  it('returns existing active bindings while preserving already-registered shape', async () => {
    getDomainByNameMock.mockResolvedValueOnce({ ...binding, status: 'active' } as never);

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      domain: { ...binding, status: 'active' },
      alreadyRegistered: true,
    });
    expect(saveDomainMock).not.toHaveBeenCalled();
  });

  it('creates domains while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko', { domain: 'Example.COM' }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveDomainMock).toHaveBeenCalledWith(expect.objectContaining({
      domainId: 'dom_example.com',
      domain: 'example.com',
      verificationToken: 'verify-token',
      cnameTarget: 'cname.vercel-dns.com',
      status: 'pending-dns',
    }));
    expect(payload).toMatchObject({
      ok: true,
      domain: {
        domainId: 'dom_example.com',
        domain: 'example.com',
        verificationToken: 'verify-token',
      },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveDomainMock.mockRejectedValueOnce(new Error('domain create secret leaked'));

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '도메인을 등록하지 못했습니다.',
      errorCode: 'domain_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('domain create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/domains] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
