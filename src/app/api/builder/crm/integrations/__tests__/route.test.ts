import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { makeIntegrationId, mutateIntegrations, readIntegrations } from '@/lib/builder/crm/integrations-model';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/integrations-model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/crm/integrations-model')>();
  return {
    ...actual,
    makeIntegrationId: vi.fn(() => 'int_1'),
    mutateIntegrations: vi.fn(),
    readIntegrations: vi.fn(),
  };
});

const guardMutationMock = vi.mocked(guardMutation);
const makeIntegrationIdMock = vi.mocked(makeIntegrationId);
const mutateIntegrationsMock = vi.mocked(mutateIntegrations);
const readIntegrationsMock = vi.mocked(readIntegrations);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/integrations${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const integration = {
  id: 'int_1',
  kind: 'generic-webhook',
  webhookUrl: 'https://hooks.example.test/crm',
  enabled: true,
  createdAt: '2026-06-03T00:00:00.000Z',
};

describe('builder CRM integrations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    makeIntegrationIdMock.mockReturnValue('int_1');
    readIntegrationsMock.mockResolvedValue([integration] as never);
    mutateIntegrationsMock.mockImplementation(async (updater) => updater([]).result as never);
  });

  it('lists integrations while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, integrations: [integration], total: 1 });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readIntegrationsMock.mockRejectedValueOnce(new Error('integration list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入外部整合清單。',
      errorCode: 'integrations_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('integration list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/integrations] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid integration payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=ko', { kind: 'generic-webhook', webhookUrl: 'not-url' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '연동 정보를 확인해 주세요.',
      errorCode: 'invalid_integration_payload',
    });
    expect(data.details).toBeTruthy();
    expect(mutateIntegrationsMock).not.toHaveBeenCalled();
  });

  it('creates integrations while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      kind: 'generic-webhook',
      webhookUrl: 'https://hooks.example.test/crm',
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      ok: true,
      integration: {
        id: 'int_1',
        kind: 'generic-webhook',
        webhookUrl: 'https://hooks.example.test/crm',
        enabled: true,
      },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mutateIntegrationsMock.mockRejectedValueOnce(new Error('integration create secret leaked'));

    const response = await POST(request('POST', 'locale=zh-hant', {
      kind: 'generic-webhook',
      webhookUrl: 'https://hooks.example.test/crm',
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法建立外部整合。',
      errorCode: 'integration_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('integration create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/integrations] create failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
