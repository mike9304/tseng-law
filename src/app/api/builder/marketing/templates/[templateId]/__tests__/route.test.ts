import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getTemplate, saveTemplate } from '@/lib/builder/marketing/templates/storage';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'marketing-admin@example.test' })),
}));

vi.mock('@/lib/builder/marketing/templates/storage', () => ({
  getTemplate: vi.fn(),
  saveTemplate: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getTemplateMock = vi.mocked(getTemplate);
const saveTemplateMock = vi.mocked(saveTemplate);

function request(method: 'GET' | 'PATCH', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/templates/tpl_1${query ? `?${query}` : ''}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const template: EmailTemplate = {
  templateId: 'tpl_1',
  name: 'Newsletter',
  blocks: [{ blockId: 'blk_1', kind: 'heading', text: 'Hello' }],
  pageBackground: '#f1f5f9',
  contentBackground: '#ffffff',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

describe('builder marketing template detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'marketing-admin@example.test' } as never);
    getTemplateMock.mockResolvedValue(template as never);
    saveTemplateMock.mockResolvedValue(undefined as never);
  });

  it('loads templates while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, template });
  });

  it('renders templates while preserving render success response shape', async () => {
    const response = await GET(request('GET', 'locale=en&render=html'), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.template).toEqual(template);
    expect(data.html).toContain('Hello');
    expect(data.text).toContain('HELLO');
  });

  it('returns localized not-found errors', async () => {
    getTemplateMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('GET', 'locale=zh-hant'), {
      params: Promise.resolve({ templateId: 'missing' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '找不到範本。',
      errorCode: 'template_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getTemplateMock.mockRejectedValueOnce(new Error('template load secret leaked'));

    const response = await GET(request('GET', 'locale=en'), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to load the template.',
      errorCode: 'template_load_failed',
    });
    expect(JSON.stringify(data)).not.toContain('template load secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/templates/:id] load failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid update errors while preserving details', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko', { blocks: [{ blockId: 'x', kind: 'button', href: 'javascript:alert(1)', label: 'Bad' }] }), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '템플릿 업데이트 정보를 확인해 주세요.',
      errorCode: 'invalid_template_update',
    });
    expect(data.details).toBeTruthy();
    expect(saveTemplateMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', '{'), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the marketing request format.',
      errorCode: 'invalid_json',
    });
    expect(saveTemplateMock).not.toHaveBeenCalled();
  });

  it('updates templates while preserving PATCH success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', { name: 'Updated' }), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.template.name).toBe('Updated');
    expect(saveTemplateMock).toHaveBeenCalledTimes(1);
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveTemplateMock.mockRejectedValueOnce(new Error('template update secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=en', { name: 'Updated' }), {
      params: Promise.resolve({ templateId: 'tpl_1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to update the template.',
      errorCode: 'template_update_failed',
    });
    expect(JSON.stringify(data)).not.toContain('template update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/templates/:id] update failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
