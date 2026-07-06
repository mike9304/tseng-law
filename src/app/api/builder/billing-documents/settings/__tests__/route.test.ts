import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadBillingDocumentAutomationSettings,
  saveBillingDocumentAutomationSettings,
} from '@/lib/builder/billing-document-automation';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  loadBillingDocumentAutomationSettings: vi.fn(async () => ({ enabled: true })),
  saveBillingDocumentAutomationSettings: vi.fn(async (settings: unknown) => settings),
}));

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const loadBillingDocumentAutomationSettingsMock = vi.mocked(loadBillingDocumentAutomationSettings);
const saveBillingDocumentAutomationSettingsMock = vi.mocked(saveBillingDocumentAutomationSettings);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/settings${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: BodyInit = JSON.stringify({ settings: { enabled: true } })): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/settings${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

describe('builder billing document settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'admin' } as never);
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    loadBillingDocumentAutomationSettingsMock.mockResolvedValue({ enabled: true } as never);
    saveBillingDocumentAutomationSettingsMock.mockImplementation(async (settings) => settings as never);
  });

  it('returns localized settings load failures', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadBillingDocumentAutomationSettingsMock.mockRejectedValueOnce(new Error('settings path leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入帳單文件設定。',
      errorCode: 'billing_document_settings_failed',
    });
    expect(payload.error).not.toContain('settings path leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/settings] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors for settings saves', async () => {
    const response = await PATCH(patchRequest('locale=ko', '{"settings":'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 문서 설정 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(saveBillingDocumentAutomationSettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized settings save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveBillingDocumentAutomationSettingsMock.mockRejectedValueOnce(new Error('automation settings leaked'));

    const response = await PATCH(patchRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save billing document settings.',
      errorCode: 'billing_document_settings_save_failed',
    });
    expect(payload.error).not.toContain('automation settings leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/settings] PATCH failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('loads and saves settings without changing successful response shapes', async () => {
    loadBillingDocumentAutomationSettingsMock.mockResolvedValueOnce({ enabled: false } as never);
    saveBillingDocumentAutomationSettingsMock.mockResolvedValueOnce({ enabled: true } as never);

    const getResponse = await GET(getRequest('locale=en'));
    const getPayload = await getResponse.json();
    const patchResponse = await PATCH(patchRequest('locale=en', JSON.stringify({ settings: { enabled: true } })));
    const patchPayload = await patchResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload).toEqual({ ok: true, settings: { enabled: false } });
    expect(patchResponse.status).toBe(200);
    expect(patchPayload).toEqual({ ok: true, settings: { enabled: true } });
    expect(saveBillingDocumentAutomationSettingsMock).toHaveBeenCalledWith({ enabled: true });
  });
});
