import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordCommerceSettingsUpdated } from '@/lib/builder/audit/record';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { loadCurrencySettings, saveCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
  guardMutation: vi.fn(async () => ({
    username: 'admin',
    permission: 'manage-commerce',
  })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordCommerceSettingsUpdated: vi.fn(),
}));

vi.mock('@/lib/builder/commerce/currency-engine', () => ({
  loadCurrencySettings: vi.fn(async () => ({ baseCurrency: 'TWD' })),
  saveCurrencySettings: vi.fn(async (settings: unknown) => settings),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const loadCurrencySettingsMock = vi.mocked(loadCurrencySettings);
const saveCurrencySettingsMock = vi.mocked(saveCurrencySettings);
const recordCommerceSettingsUpdatedMock = vi.mocked(recordCommerceSettingsUpdated);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/currency-settings${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: unknown = { settings: { baseCurrency: 'TWD' } }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/currency-settings${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('builder commerce currency settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    guardMutationMock.mockResolvedValue({
      username: 'admin',
      permission: 'manage-commerce',
    } as never);
    loadCurrencySettingsMock.mockResolvedValue({ baseCurrency: 'TWD' } as never);
    saveCurrencySettingsMock.mockImplementation(async (settings) => settings as never);
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadCurrencySettingsMock.mockRejectedValueOnce(new Error('currency storage secret leaked'));

    const response = await GET(getRequest('scope=all&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入幣別設定。',
      errorCode: 'currency_settings_failed',
    });
    expect(payload.error).not.toContain('currency storage secret leaked');
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/currency-settings] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns settings while preserving success response shape', async () => {
    const settings = { baseCurrency: 'TWD', supportedCurrencies: ['TWD', 'USD'] };
    loadCurrencySettingsMock.mockResolvedValueOnce(settings as never);

    const response = await GET(getRequest('scope=all&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, settings });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveCurrencySettingsMock.mockRejectedValueOnce(new Error('currency write secret leaked'));

    const response = await PATCH(patchRequest('locale=ko', { settings: { baseCurrency: 'TWD' } }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '통화 설정을 저장하지 못했습니다.',
      errorCode: 'currency_settings_save_failed',
    });
    expect(payload.error).not.toContain('currency write secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/currency-settings] PATCH failed:',
      expect.any(Error),
    );
    expect(recordCommerceSettingsUpdatedMock).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('saves settings while preserving success response shape', async () => {
    const settings = { baseCurrency: 'USD', supportedCurrencies: ['USD'] };
    saveCurrencySettingsMock.mockResolvedValueOnce(settings as never);

    const response = await PATCH(patchRequest('locale=en', { settings }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, settings });
    expect(saveCurrencySettingsMock).toHaveBeenCalledWith(settings);
    expect(recordCommerceSettingsUpdatedMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      area: 'currency',
    });
  });
});
