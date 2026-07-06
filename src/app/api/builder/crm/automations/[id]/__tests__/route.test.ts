import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { mutateAutomations, type CrmAutomation } from '@/lib/builder/crm/automation-model';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/automation-model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/crm/automation-model')>();
  return {
    ...actual,
    mutateAutomations: vi.fn(),
  };
});

const guardMutationMock = vi.mocked(guardMutation);
const mutateAutomationsMock = vi.mocked(mutateAutomations);

function request(method: 'PATCH' | 'DELETE', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/automations/auto_1${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const routeContext = { params: { id: 'auto_1' } };
const automation: CrmAutomation = {
  id: 'auto_1',
  name: 'Welcome lead',
  trigger: { kind: 'contact-created' },
  action: { kind: 'add-tag', addTag: 'lead' },
  enabled: true,
  createdAt: '2026-06-03T00:00:00.000Z',
};

describe('builder CRM automation detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    mutateAutomationsMock.mockImplementation(async (updater) => updater([automation]).result as never);
  });

  it('updates automations while preserving PATCH success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', { enabled: false }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      automation: {
        id: 'auto_1',
        enabled: false,
      },
    });
  });

  it('returns localized invalid patch errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=zh-hant', { trigger: { kind: 'bad' } }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認自動化更新資料。',
      errorCode: 'invalid_automation_patch',
    });
    expect(mutateAutomationsMock).not.toHaveBeenCalled();
  });

  it('returns localized not-found errors', async () => {
    mutateAutomationsMock.mockImplementationOnce(async (updater) => updater([]).result as never);

    const response = await DELETE(request('DELETE', 'locale=en'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: 'Automation not found.',
      errorCode: 'automation_not_found',
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mutateAutomationsMock.mockRejectedValueOnce(new Error('automation update secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=ko', { enabled: false }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '자동화를 업데이트하지 못했습니다.',
      errorCode: 'automation_update_failed',
    });
    expect(JSON.stringify(data)).not.toContain('automation update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/automations/:id] update failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mutateAutomationsMock.mockRejectedValueOnce(new Error('automation delete secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=zh-hant'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法刪除自動化。',
      errorCode: 'automation_delete_failed',
    });
    expect(JSON.stringify(data)).not.toContain('automation delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/automations/:id] delete failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
