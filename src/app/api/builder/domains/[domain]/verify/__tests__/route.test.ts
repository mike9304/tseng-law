import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { verifyDomainDns } from '@/lib/builder/domains/dns-verifier';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { attachDomain, getDomainStatus } from '@/lib/builder/domains/vercel-api';
import type { DnsCheckResult } from '@/lib/builder/domains/dns-verifier';
import type { DomainBinding } from '@/lib/builder/domains/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/domains/storage', () => ({
  getDomain: vi.fn(),
  makeDomainId: vi.fn((domain: string) => `dom_${domain}`),
  saveDomain: vi.fn(),
}));

vi.mock('@/lib/builder/domains/dns-verifier', () => ({
  verifyDomainDns: vi.fn(),
}));

vi.mock('@/lib/builder/domains/vercel-api', () => ({
  attachDomain: vi.fn(),
  getDomainStatus: vi.fn(),
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

const dnsPending: DnsCheckResult = {
  txtMatched: false,
  cnameMatched: true,
  txtValues: [],
  cnameValues: ['cname.vercel-dns.com'],
  aValues: [],
  verified: false,
};

const dnsVerified: DnsCheckResult = {
  txtMatched: true,
  cnameMatched: true,
  txtValues: ['verify-token'],
  cnameValues: ['cname.vercel-dns.com'],
  aValues: [],
  verified: true,
};

const guardMutationMock = vi.mocked(guardMutation);
const attachDomainMock = vi.mocked(attachDomain);
const getDomainStatusMock = vi.mocked(getDomainStatus);
const getDomainMock = vi.mocked(getDomain);
const makeDomainIdMock = vi.mocked(makeDomainId);
const saveDomainMock = vi.mocked(saveDomain);
const verifyDomainDnsMock = vi.mocked(verifyDomainDns);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/domains/example.com/verify${query ? `?${query}` : ''}`, {
    method: 'POST',
  });
}

const params = { params: Promise.resolve({ domain: 'example.com' }) };

describe('/api/builder/domains/[domain]/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    attachDomainMock.mockResolvedValue({ ok: true, data: { name: 'example.com' } } as never);
    getDomainStatusMock.mockResolvedValue({ ok: true, data: { name: 'example.com', verified: true } } as never);
    getDomainMock.mockResolvedValue(binding as never);
    makeDomainIdMock.mockImplementation((domain: string) => `dom_${domain}`);
    saveDomainMock.mockResolvedValue(undefined as never);
    verifyDomainDnsMock.mockResolvedValue(dnsVerified);
  });

  it('returns localized not-found errors', async () => {
    getDomainMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到網域。',
      errorCode: 'domain_not_found',
    });
  });

  it('returns active domain status while preserving success response shape', async () => {
    getDomainMock.mockResolvedValueOnce({ ...binding, status: 'active' } as never);

    const response = await POST(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      domain: { ...binding, status: 'active' },
      vercel: { ok: true, data: { name: 'example.com', verified: true } },
    });
  });

  it('returns localized DNS pending states without raw DNS strings', async () => {
    verifyDomainDnsMock.mockResolvedValueOnce(dnsPending);

    const response = await POST(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveDomainMock).toHaveBeenCalledWith({
      ...binding,
      status: 'pending-dns',
      lastError: 'DNS 레코드를 아직 확인하지 못했습니다.',
    });
    expect(payload).toEqual({
      ok: false,
      error: 'DNS 레코드를 아직 확인하지 못했습니다.',
      errorCode: 'domain_dns_pending',
      domain: {
        ...binding,
        status: 'pending-dns',
        lastError: 'DNS 레코드를 아직 확인하지 못했습니다.',
      },
      dns: dnsPending,
    });
    expect(JSON.stringify(payload)).not.toContain('TXT record missing');
  });

  it('returns localized attach failures without leaking provider details', async () => {
    attachDomainMock.mockResolvedValueOnce({ ok: false, error: 'vercel attach token leaked' } as never);

    const response = await POST(request('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(saveDomainMock).toHaveBeenCalledWith(expect.objectContaining({
      ...binding,
      status: 'error',
      lastError: 'Unable to attach the Vercel domain.',
      lastVerifiedAt: expect.any(String),
    }));
    expect(payload).toMatchObject({
      ok: false,
      error: 'Unable to attach the Vercel domain.',
      errorCode: 'domain_attach_failed',
      attachError: 'Unable to attach the Vercel domain.',
      dns: dnsVerified,
    });
    expect(JSON.stringify(payload)).not.toContain('vercel attach token leaked');
  });

  it('activates verified domains while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveDomainMock).toHaveBeenCalledWith(expect.objectContaining({
      ...binding,
      status: 'active',
      lastVerifiedAt: expect.any(String),
      lastError: undefined,
      vercelDomainId: 'example.com',
    }));
    expect(payload).toMatchObject({
      ok: true,
      domain: {
        ...binding,
        status: 'active',
        vercelDomainId: 'example.com',
      },
      dns: dnsVerified,
    });
  });

  it('returns localized verify failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    verifyDomainDnsMock.mockRejectedValueOnce(new Error('domain verify secret leaked'));

    const response = await POST(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '도메인 검증을 완료하지 못했습니다.',
      errorCode: 'domain_verify_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('domain verify secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/domains/:domain/verify] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
