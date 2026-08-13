import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { detachDomain } from '@/lib/builder/domains/vercel-api';
import type { DomainBinding } from '@/lib/builder/domains/types';
import { DELETE, GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/domains/storage', () => ({
  getDomain: vi.fn(),
  makeDomainId: vi.fn((domain: string) => `dom_${domain}`),
  saveDomain: vi.fn(),
}));

vi.mock('@/lib/builder/domains/vercel-api', () => ({
  detachDomain: vi.fn(),
}));

const binding: DomainBinding = {
  domainId: 'dom_example.com',
  domain: 'example.com',
  verificationToken: 'verify-token',
  cnameTarget: 'cname.vercel-dns.com',
  status: 'active',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const detachDomainMock = vi.mocked(detachDomain);
const getDomainMock = vi.mocked(getDomain);
const makeDomainIdMock = vi.mocked(makeDomainId);
const saveDomainMock = vi.mocked(saveDomain);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/domains/example.com${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

const params = { params: Promise.resolve({ domain: 'example.com' }) };

describe('/api/builder/domains/[domain]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    detachDomainMock.mockResolvedValue({ ok: true } as never);
    getDomainMock.mockResolvedValue(binding as never);
    makeDomainIdMock.mockImplementation((domain: string) => `dom_${domain}`);
    saveDomainMock.mockResolvedValue(undefined as never);
  });

  it('returns a domain while preserving detail success shape', async () => {
    const response = await GET(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, domain: binding });
  });

  it('returns localized not-found errors', async () => {
    getDomainMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到網域。',
      errorCode: 'domain_not_found',
    });
  });

  it('deletes domains while preserving success response shape', async () => {
    const response = await DELETE(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(detachDomainMock).toHaveBeenCalledWith('example.com');
    expect(saveDomainMock).toHaveBeenCalledWith({
      ...binding,
      status: 'removed',
      lastError: undefined,
    });
    expect(payload).toEqual({
      ok: true,
      detached: true,
    });
  });

  it('returns localized detach failures without leaking provider details', async () => {
    detachDomainMock.mockResolvedValueOnce({ ok: false, error: 'vercel detach token leaked' } as never);

    const response = await DELETE(request('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveDomainMock).toHaveBeenCalledWith({
      ...binding,
      status: 'removed',
      lastError: 'Unable to detach the Vercel domain.',
    });
    expect(payload).toEqual({
      ok: true,
      detached: false,
      error: 'Unable to detach the Vercel domain.',
      errorCode: 'domain_detach_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('vercel detach token leaked');
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveDomainMock.mockRejectedValueOnce(new Error('domain delete secret leaked'));

    const response = await DELETE(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '도메인을 제거하지 못했습니다.',
      errorCode: 'domain_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('domain delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/domains/:domain] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
