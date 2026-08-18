import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { loadShippingRules, saveShippingRules } from '@/lib/builder/commerce/shipping-engine';
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

vi.mock('@/lib/builder/commerce/shipping-engine', () => ({
  loadShippingRules: vi.fn(async () => []),
  saveShippingRules: vi.fn(async (rules: unknown) => rules),
}));

const shippingRule = {
  ruleId: 'ship-standard-twd',
  method: 'standard',
  label: 'Taiwan standard',
  currency: 'TWD',
  country: 'TW',
  amountCents: 12000,
  active: true,
  locale: 'all',
  priority: 0,
  estimatedDays: '3-5',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const loadShippingRulesMock = vi.mocked(loadShippingRules);
const saveShippingRulesMock = vi.mocked(saveShippingRules);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/shipping-rules${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { rules: [shippingRule] }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/shipping-rules${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce shipping rules API', () => {
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
    loadShippingRulesMock.mockResolvedValue([shippingRule] as never);
    saveShippingRulesMock.mockImplementation(async (rules) => rules as never);
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '배송 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(loadShippingRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadShippingRulesMock.mockRejectedValueOnce(new Error('shipping storage secret leaked'));

    const response = await GET(getRequest('scope=all&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入運送規則。',
      errorCode: 'shipping_rules_failed',
    });
    expect(payload.error).not.toContain('shipping storage secret leaked');
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/shipping-rules] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns shipping rules while preserving success response shape', async () => {
    loadShippingRulesMock.mockResolvedValueOnce([shippingRule] as never);

    const response = await GET(getRequest('scope=all&locale=en&currency=TWD'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, locale: 'en', currency: 'TWD', rules: [shippingRule] });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
  });

  it('returns localized invalid-json save errors', async () => {
    const response = await PATCH(patchRequest('locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認運送規則請求格式。',
      errorCode: 'invalid_json',
    });
    expect(saveShippingRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized save validation errors', async () => {
    const response = await PATCH(patchRequest('locale=ko', { rules: [] }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '배송 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(saveShippingRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveShippingRulesMock.mockRejectedValueOnce(new Error('shipping write secret leaked'));

    const response = await PATCH(patchRequest('locale=ko', { rules: [shippingRule] }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '배송 규칙을 저장하지 못했습니다.',
      errorCode: 'shipping_rules_update_failed',
    });
    expect(payload.error).not.toContain('shipping write secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/shipping-rules] PATCH failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('saves shipping rules while preserving success response shape', async () => {
    saveShippingRulesMock.mockResolvedValueOnce([shippingRule] as never);

    const response = await PATCH(patchRequest('locale=en', { rules: [shippingRule] }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, rules: [shippingRule] });
    expect(saveShippingRulesMock).toHaveBeenCalledWith([shippingRule]);
  });
});
