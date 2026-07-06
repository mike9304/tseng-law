import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteFaqItem,
  loadFaqItem,
  saveFaqItem,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  deleteFaqItem: vi.fn(),
  loadFaqItem: vi.fn(),
  saveFaqItem: vi.fn(),
  validateFaqItem: vi.fn(),
}));

const faqItem = {
  faqId: 'faq-1',
  slug: 'faq-question',
  locale: 'ko',
  question: 'FAQ question?',
  answer: 'FAQ answer.',
  categoryId: 'company-setup',
  tags: ['company'],
  status: 'published',
  sortOrder: 10,
  schemaEnabled: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const updatedFaqItem = {
  ...faqItem,
  status: 'draft',
  updatedAt: '2026-06-03T00:01:00.000Z',
};

const params = { params: { faqId: 'faq-1' } };
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const deleteFaqItemMock = vi.mocked(deleteFaqItem);
const loadFaqItemMock = vi.mocked(loadFaqItem);
const saveFaqItemMock = vi.mocked(saveFaqItem);
const validateFaqItemMock = vi.mocked(validateFaqItem);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/faq/faq-1${query ? `?${query}` : ''}`);
}

function patchRequest(
  query = '',
  body: string | unknown = { status: 'draft', locale: 'ko' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/faq/faq-1${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/faq/faq-1${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

describe('builder FAQ detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    deleteFaqItemMock.mockResolvedValue(undefined as never);
    loadFaqItemMock.mockResolvedValue(faqItem as never);
    saveFaqItemMock.mockResolvedValue(updatedFaqItem as never);
    validateFaqItemMock.mockReturnValue([]);
  });

  it('returns FAQ detail while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, item: faqItem });
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
  });

  it('returns localized missing FAQ errors', async () => {
    loadFaqItemMock.mockResolvedValueOnce(null);

    const response = await GET(getRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到 FAQ 項目。',
      errorCode: 'faq_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadFaqItemMock.mockRejectedValueOnce(new Error('FAQ load secret leaked'));

    const response = await GET(getRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'FAQ 항목을 불러오지 못했습니다.',
      errorCode: 'faq_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('FAQ load secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/faq/:faqId] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('updates FAQ items while preserving success response shape', async () => {
    const response = await PATCH(patchRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveFaqItemMock).toHaveBeenCalledWith({
      ...faqItem,
      status: 'draft',
    });
    expect(payload).toEqual({ ok: true, item: updatedFaqItem });
  });

  it('returns localized patch validation errors using the body locale', async () => {
    const response = await PATCH(patchRequest('', { status: 'bad', locale: 'zh-hant' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認 FAQ 請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(saveFaqItemMock).not.toHaveBeenCalled();
  });

  it('returns localized patch invalid JSON errors using the query locale', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the FAQ request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized engine validation errors without leaking raw validation strings', async () => {
    validateFaqItemMock.mockReturnValueOnce(['답변을 입력하세요.']);

    const response = await PATCH(patchRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the FAQ request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('답변을 입력하세요.');
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveFaqItemMock.mockRejectedValueOnce(new Error('FAQ update secret leaked'));

    const response = await PATCH(patchRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法儲存 FAQ 項目。',
      errorCode: 'faq_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('FAQ update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/faq/:faqId] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deletes FAQ items while preserving success response shape', async () => {
    const response = await DELETE(deleteRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(deleteFaqItemMock).toHaveBeenCalledWith('faq-1');
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteFaqItemMock.mockRejectedValueOnce(new Error('FAQ delete secret leaked'));

    const response = await DELETE(deleteRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'FAQ 항목을 삭제하지 못했습니다.',
      errorCode: 'faq_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('FAQ delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/faq/:faqId] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
