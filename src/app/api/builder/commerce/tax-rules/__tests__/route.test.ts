import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { loadTaxRules, saveTaxRules } from '@/lib/builder/commerce/tax-engine';
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

vi.mock('@/lib/builder/commerce/tax-engine', () => ({
  loadTaxRules: vi.fn(async () => []),
  saveTaxRules: vi.fn(async (rules: unknown) => rules),
}));

const taxRule = {
  ruleId: 'tax-tw',
  label: 'Taiwan VAT',
  country: 'TW',
  rateBps: 500,
  active: true,
  locale: 'all',
  priority: 0,
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const loadTaxRulesMock = vi.mocked(loadTaxRules);
const saveTaxRulesMock = vi.mocked(saveTaxRules);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/tax-rules${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { rules: [taxRule] }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/tax-rules${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce tax rules API', () => {
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
    loadTaxRulesMock.mockResolvedValue([taxRule] as never);
    saveTaxRulesMock.mockImplementation(async (rules) => rules as never);
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '세금 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(loadTaxRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadTaxRulesMock.mockRejectedValueOnce(new Error('tax storage secret leaked'));

    const response = await GET(getRequest('scope=all&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入稅務規則。',
      errorCode: 'tax_rules_failed',
    });
    expect(payload.error).not.toContain('tax storage secret leaked');
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/tax-rules] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns tax rules while preserving success response shape', async () => {
    loadTaxRulesMock.mockResolvedValueOnce([taxRule] as never);

    const response = await GET(getRequest('scope=all&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, locale: 'en', rules: [taxRule] });
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
      error: '請確認稅務規則請求格式。',
      errorCode: 'invalid_json',
    });
    expect(saveTaxRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized save validation errors', async () => {
    const response = await PATCH(patchRequest('locale=ko', { rules: [] }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '세금 규칙 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(saveTaxRulesMock).not.toHaveBeenCalled();
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveTaxRulesMock.mockRejectedValueOnce(new Error('tax write secret leaked'));

    const response = await PATCH(patchRequest('locale=ko', { rules: [taxRule] }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '세금 규칙을 저장하지 못했습니다.',
      errorCode: 'tax_rules_update_failed',
    });
    expect(payload.error).not.toContain('tax write secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/tax-rules] PATCH failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('saves tax rules while preserving success response shape', async () => {
    saveTaxRulesMock.mockResolvedValueOnce([taxRule] as never);

    const response = await PATCH(patchRequest('locale=en', { rules: [taxRule] }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, rules: [taxRule] });
    expect(saveTaxRulesMock).toHaveBeenCalledWith([{ ...taxRule, includedInPrice: false }]);
  });
});
