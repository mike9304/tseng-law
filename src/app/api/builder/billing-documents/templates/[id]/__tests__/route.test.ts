import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteBillingDocumentTemplate,
  getBillingDocumentTemplate,
  updateBillingDocumentTemplate,
} from '@/lib/builder/billing-documents-templates';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { DELETE, GET, PATCH } from '../route';

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

vi.mock('@/lib/builder/billing-documents-templates', () => ({
  getBillingDocumentTemplate: vi.fn(async () => null),
  updateBillingDocumentTemplate: vi.fn(async () => null),
  deleteBillingDocumentTemplate: vi.fn(async () => false),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const getBillingDocumentTemplateMock = vi.mocked(getBillingDocumentTemplate);
const updateBillingDocumentTemplateMock = vi.mocked(updateBillingDocumentTemplate);
const deleteBillingDocumentTemplateMock = vi.mocked(deleteBillingDocumentTemplate);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/templates/bdtpl_1${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: unknown = { name: 'Updated invoice' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/templates/bdtpl_1${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/templates/bdtpl_1${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

describe('builder billing document template detail API', () => {
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
    getBillingDocumentTemplateMock.mockResolvedValue(null);
    updateBillingDocumentTemplateMock.mockResolvedValue(null);
    deleteBillingDocumentTemplateMock.mockResolvedValue(false);
  });

  it('returns localized not-found errors on GET', async () => {
    const response = await GET(getRequest('locale=zh-hant'), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到帳單文件範本。',
      errorCode: 'template_not_found',
    });
    expect(getBillingDocumentTemplateMock).toHaveBeenCalledWith('bdtpl_1');
  });

  it('returns localized invalid-patch errors', async () => {
    const response = await PATCH(patchRequest('locale=ko', { name: '' }), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '청구서 문서 템플릿 정보를 확인해 주세요.',
      errorCode: 'invalid_template_payload',
    });
    expect(updateBillingDocumentTemplateMock).not.toHaveBeenCalled();
  });

  it('returns localized not-found errors on PATCH when the template is missing', async () => {
    const response = await PATCH(patchRequest('locale=en'), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Billing document template not found.',
      errorCode: 'template_not_found',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteBillingDocumentTemplateMock.mockRejectedValueOnce(new Error('delete path leaked'));

    const response = await DELETE(deleteRequest('locale=zh-hant'), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法刪除帳單文件範本。',
      errorCode: 'template_delete_failed',
    });
    expect(payload.error).not.toContain('delete path leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/templates/:id] DELETE failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('updates and deletes templates while preserving success response shapes', async () => {
    const updated = {
      id: 'bdtpl_1',
      name: 'Updated invoice',
      language: 'en',
      headerHtml: '',
      footerHtml: '',
      accentColor: '#1d4ed8',
      includeQrCode: false,
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    };
    updateBillingDocumentTemplateMock.mockResolvedValueOnce(updated as never);
    deleteBillingDocumentTemplateMock.mockResolvedValueOnce(true);

    const patchResponse = await PATCH(patchRequest('locale=en'), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const patchPayload = await patchResponse.json();
    const deleteResponse = await DELETE(deleteRequest('locale=en'), { params: Promise.resolve({ id: 'bdtpl_1' }) });
    const deletePayload = await deleteResponse.json();

    expect(patchResponse.status).toBe(200);
    expect(patchPayload).toEqual({ ok: true, template: updated });
    expect(updateBillingDocumentTemplateMock).toHaveBeenCalledWith('bdtpl_1', {
      name: 'Updated invoice',
      logoAssetId: undefined,
    });
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload).toEqual({ ok: true });
    expect(deleteBillingDocumentTemplateMock).toHaveBeenCalledWith('bdtpl_1');
  });
});
