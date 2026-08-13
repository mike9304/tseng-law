import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBillingDocumentTemplate,
  listBillingDocumentTemplates,
} from '@/lib/builder/billing-documents-templates';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { GET, POST } from '../route';

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
  listBillingDocumentTemplates: vi.fn(async () => []),
  createBillingDocumentTemplate: vi.fn(async (input: unknown) => ({
    id: 'bdtpl_1',
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    ...(input as Record<string, unknown>),
  })),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listBillingDocumentTemplatesMock = vi.mocked(listBillingDocumentTemplates);
const createBillingDocumentTemplateMock = vi.mocked(createBillingDocumentTemplate);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/templates${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: unknown = {
  name: 'Default invoice',
  language: 'en',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/templates${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('builder billing document templates API', () => {
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
    listBillingDocumentTemplatesMock.mockResolvedValue([]);
    createBillingDocumentTemplateMock.mockImplementation(async (input) => ({
      id: 'bdtpl_1',
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
      ...(input as Record<string, unknown>),
    }) as never);
  });

  it('returns a localized stable-code error when template listing fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listBillingDocumentTemplatesMock.mockRejectedValueOnce(new Error('template storage leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 문서 템플릿을 불러오지 못했습니다.',
      errorCode: 'templates_list_failed',
    });
    expect(payload.error).not.toContain('template storage leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/templates] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns localized validation errors for invalid template create payloads', async () => {
    const response = await POST(postRequest('locale=zh-hant', { name: '', language: 'fr' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認帳單文件範本資料。',
      errorCode: 'invalid_template_payload',
    });
    expect(payload.issues).toBeDefined();
    expect(createBillingDocumentTemplateMock).not.toHaveBeenCalled();
  });

  it('creates templates with parsed defaults and preserves success shape', async () => {
    const response = await POST(postRequest('locale=en', {
      name: 'Invoice',
      language: 'en',
      includeQrCode: true,
    }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(createBillingDocumentTemplateMock).toHaveBeenCalledWith({
      name: 'Invoice',
      language: 'en',
      headerHtml: '',
      footerHtml: '',
      accentColor: undefined,
      logoAssetId: undefined,
      includeQrCode: true,
      isDefault: false,
    });
    expect(payload).toEqual({
      ok: true,
      template: {
        id: 'bdtpl_1',
        name: 'Invoice',
        language: 'en',
        headerHtml: '',
        footerHtml: '',
        includeQrCode: true,
        isDefault: false,
        createdAt: '2026-06-03T00:00:00.000Z',
        updatedAt: '2026-06-03T00:00:00.000Z',
      },
    });
  });
});
