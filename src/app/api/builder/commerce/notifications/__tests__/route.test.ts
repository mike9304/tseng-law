import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordCommerceSettingsUpdated } from '@/lib/builder/audit/record';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listNotificationEvents,
  listRecoveryCarts,
  loadNotificationSettings,
  saveNotificationSettings,
} from '@/lib/builder/commerce/notifications-engine';
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

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  listNotificationEvents: vi.fn(async () => []),
  listRecoveryCarts: vi.fn(async () => []),
  loadNotificationSettings: vi.fn(async () => ({ enabled: true })),
  saveNotificationSettings: vi.fn(async (settings: unknown) => settings),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listNotificationEventsMock = vi.mocked(listNotificationEvents);
const listRecoveryCartsMock = vi.mocked(listRecoveryCarts);
const loadNotificationSettingsMock = vi.mocked(loadNotificationSettings);
const saveNotificationSettingsMock = vi.mocked(saveNotificationSettings);
const recordCommerceSettingsUpdatedMock = vi.mocked(recordCommerceSettingsUpdated);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/notifications${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { settings: { enabled: true } }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/notifications${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce notifications API', () => {
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
    listNotificationEventsMock.mockResolvedValue([]);
    listRecoveryCartsMock.mockResolvedValue([]);
    loadNotificationSettingsMock.mockResolvedValue({ enabled: true } as never);
    saveNotificationSettingsMock.mockImplementation(async (settings) => settings as never);
  });

  it('returns localized validation errors for invalid filters', async () => {
    const response = await GET(getRequest('locale=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '알림 필터를 확인해 주세요.',
      errorCode: 'invalid_notification_filters',
    });
    expect(payload.issues).toBeDefined();
    expect(loadNotificationSettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadNotificationSettingsMock.mockRejectedValueOnce(new Error('notification secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入通知。',
      errorCode: 'notifications_failed',
    });
    expect(payload.error).not.toContain('notification secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/notifications] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns notification settings, events, and recoveries while preserving success shape', async () => {
    const settings = { enabled: true, senderName: 'Tseng Law' };
    const event = { eventId: 'evt-1', type: 'order.created.customer', status: 'queued' };
    const recovery = { recoveryId: 'rec-1', status: 'captured' };
    loadNotificationSettingsMock.mockResolvedValueOnce(settings as never);
    listNotificationEventsMock.mockResolvedValueOnce([event] as never);
    listRecoveryCartsMock.mockResolvedValueOnce([recovery] as never);

    const response = await GET(getRequest('locale=en&type=order.created.customer&status=queued'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, settings, events: [event], recoveries: [recovery] });
    expect(listNotificationEventsMock).toHaveBeenCalledWith({
      locale: 'en',
      type: 'order.created.customer',
      status: 'queued',
    });
    expect(listRecoveryCartsMock).toHaveBeenCalledWith({ locale: 'en' });
  });

  it('returns localized invalid-json save errors', async () => {
    const response = await PATCH(patchRequest('locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認通知設定請求格式。',
      errorCode: 'invalid_json',
    });
    expect(saveNotificationSettingsMock).not.toHaveBeenCalled();
    expect(recordCommerceSettingsUpdatedMock).not.toHaveBeenCalled();
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveNotificationSettingsMock.mockRejectedValueOnce(new Error('notification write secret leaked'));

    const response = await PATCH(patchRequest('locale=ko', { settings: { enabled: true } }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '알림 설정을 저장하지 못했습니다.',
      errorCode: 'notifications_save_failed',
    });
    expect(payload.error).not.toContain('notification write secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/notifications] PATCH failed:',
      expect.any(Error),
    );
    expect(recordCommerceSettingsUpdatedMock).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('saves notification settings while preserving success shape', async () => {
    const settings = { enabled: false, senderName: 'Tseng Law' };
    saveNotificationSettingsMock.mockResolvedValueOnce(settings as never);

    const response = await PATCH(patchRequest('locale=en', { settings }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, settings });
    expect(saveNotificationSettingsMock).toHaveBeenCalledWith(settings);
    expect(recordCommerceSettingsUpdatedMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      area: 'notifications',
    });
  });
});
