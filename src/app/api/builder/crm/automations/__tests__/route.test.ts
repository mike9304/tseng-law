import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { makeAutomationId, mutateAutomations, readAutomations } from '@/lib/builder/crm/automation-model';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/automation-model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/crm/automation-model')>();
  return {
    ...actual,
    makeAutomationId: vi.fn(() => 'auto_1'),
    mutateAutomations: vi.fn(),
    readAutomations: vi.fn(),
  };
});

const guardMutationMock = vi.mocked(guardMutation);
const makeAutomationIdMock = vi.mocked(makeAutomationId);
const mutateAutomationsMock = vi.mocked(mutateAutomations);
const readAutomationsMock = vi.mocked(readAutomations);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/automations${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const automation = {
  id: 'auto_1',
  name: 'Welcome lead',
  trigger: { kind: 'contact-created' },
  action: { kind: 'add-tag', addTag: 'lead' },
  enabled: true,
  createdAt: '2026-06-03T00:00:00.000Z',
};

describe('builder CRM automations API', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    makeAutomationIdMock.mockReturnValue('auto_1');
    readAutomationsMock.mockResolvedValue([automation] as never);
    mutateAutomationsMock.mockImplementation(async (updater) => updater([]).result as never);
  });

  it('lists automations while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, automations: [automation], total: 1 });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readAutomationsMock.mockRejectedValueOnce(new Error('automation list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入自動化清單。',
      errorCode: 'automations_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('automation list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/automations] list failed', {
      errorCode: 'automations_list_failed',
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('automation list secret leaked');
    consoleError.mockRestore();
  });

  it('returns localized invalid automation payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', { name: '' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認自動化資料。',
      errorCode: 'invalid_automation_payload',
    });
    expect(data.details).toBeTruthy();
    expect(mutateAutomationsMock).not.toHaveBeenCalled();
  });

  it('creates automations while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      name: 'Welcome lead',
      trigger: { kind: 'contact-created' },
      action: { kind: 'add-tag', addTag: 'lead' },
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      ok: true,
      automation: {
        id: 'auto_1',
        name: 'Welcome lead',
        trigger: { kind: 'contact-created' },
        action: { kind: 'add-tag', addTag: 'lead' },
        enabled: true,
      },
    });
  });

  it('rejects new legacy send-email-stub inputs before storage mutation', async () => {
    const response = await POST(request('POST', 'locale=en', {
      name: 'Legacy email action',
      trigger: { kind: 'contact-created' },
      action: { kind: 'send-email-stub', templateId: 'welcome' },
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({ ok: false, errorCode: 'invalid_automation_payload' });
    expect(mutateAutomationsMock).not.toHaveBeenCalled();
  });

  it('rejects email simulation creation in production regardless of allow flags', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ALLOW_CRM_EMAIL_STUB', '1');
    vi.stubEnv('ALLOW_STUB_EMAILS', '1');

    const response = await POST(request('POST', 'locale=en', {
      name: 'Production simulation',
      trigger: { kind: 'contact-created' },
      action: { kind: 'simulate-email', templateId: 'welcome' },
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({ ok: false, errorCode: 'invalid_automation_payload' });
    expect(JSON.stringify(data)).not.toContain('ALLOW_CRM_EMAIL_STUB');
    expect(mutateAutomationsMock).not.toHaveBeenCalled();
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mutateAutomationsMock.mockRejectedValueOnce(new Error('automation create secret leaked'));

    const response = await POST(request('POST', 'locale=ko', {
      name: 'Welcome lead',
      trigger: { kind: 'contact-created' },
      action: { kind: 'add-tag', addTag: 'lead' },
      enabled: true,
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '자동화를 만들지 못했습니다.',
      errorCode: 'automation_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('automation create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/automations] create failed', {
      errorCode: 'automation_create_failed',
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('automation create secret leaked');
    consoleError.mockRestore();
  });
});
