import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { listTemplates, makeTemplateId, saveTemplate } from '@/lib/builder/marketing/templates/storage';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'marketing-admin@example.test' })),
}));

vi.mock('@/lib/builder/marketing/templates/storage', () => ({
  listTemplates: vi.fn(),
  makeTemplateId: vi.fn(() => 'tpl_1'),
  saveTemplate: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const listTemplatesMock = vi.mocked(listTemplates);
const makeTemplateIdMock = vi.mocked(makeTemplateId);
const saveTemplateMock = vi.mocked(saveTemplate);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/templates${query ? `?${query}` : ''}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const template: EmailTemplate = {
  templateId: 'tpl_1',
  name: 'Newsletter',
  category: 'marketing',
  blocks: [],
  pageBackground: '#f1f5f9',
  contentBackground: '#ffffff',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

describe('builder marketing templates API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'marketing-admin@example.test' } as never);
    listTemplatesMock.mockResolvedValue([template] as never);
    makeTemplateIdMock.mockReturnValue('tpl_1');
    saveTemplateMock.mockResolvedValue(undefined as never);
  });

  it('lists templates while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, templates: [template], total: 1 });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listTemplatesMock.mockRejectedValueOnce(new Error('template list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入範本清單。',
      errorCode: 'templates_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('template list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/templates] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid template payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=en', { name: '' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the template details.',
      errorCode: 'invalid_template_payload',
    });
    expect(data.details).toBeTruthy();
    expect(saveTemplateMock).not.toHaveBeenCalled();
  });

  it('creates templates while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      name: 'Newsletter',
      category: 'marketing',
      blocks: [],
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      ok: true,
      template: {
        templateId: 'tpl_1',
        name: 'Newsletter',
        category: 'marketing',
      },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveTemplateMock.mockRejectedValueOnce(new Error('template create secret leaked'));

    const response = await POST(request('POST', 'locale=ko', {
      name: 'Newsletter',
      blocks: [],
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '템플릿을 만들지 못했습니다.',
      errorCode: 'template_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('template create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/templates] create failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
