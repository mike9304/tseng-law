import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createFaqItem,
  listFaqCategories,
  listFaqItems,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  createFaqItem: vi.fn(),
  listFaqCategories: vi.fn(),
  listFaqItems: vi.fn(),
  validateFaqItem: vi.fn(),
}));

const category = {
  categoryId: 'company-setup',
  slug: 'company-setup',
  label: { ko: '법인설립', 'zh-hant': '公司設立', en: 'Company Setup' },
  sortOrder: 10,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

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

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const createFaqItemMock = vi.mocked(createFaqItem);
const listFaqCategoriesMock = vi.mocked(listFaqCategories);
const listFaqItemsMock = vi.mocked(listFaqItems);
const validateFaqItemMock = vi.mocked(validateFaqItem);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/faq${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = {
    locale: 'ko',
    question: 'FAQ question?',
    answer: 'FAQ answer.',
    categoryId: 'company-setup',
    tags: ['company'],
    status: 'published',
    sortOrder: 10,
    schemaEnabled: true,
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/faq${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder FAQ API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    createFaqItemMock.mockResolvedValue(faqItem as never);
    listFaqCategoriesMock.mockReturnValue([category] as never);
    listFaqItemsMock.mockResolvedValue([faqItem] as never);
    validateFaqItemMock.mockReturnValue([]);
  });

  it('returns FAQ items while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&status=all&category=company-setup&q=FAQ&limit=20'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      locale: 'en',
      categories: [category],
      total: 1,
      items: [faqItem],
    });
    expect(listFaqItemsMock).toHaveBeenCalledWith({
      locale: 'en',
      status: 'all',
      categoryId: 'company-setup',
      q: 'FAQ',
      limit: 20,
    });
  });

  it('returns localized query validation errors', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認 FAQ 請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listFaqItemsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listFaqItemsMock.mockRejectedValueOnce(new Error('FAQ storage secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入 FAQ 清單。',
      errorCode: 'faq_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('FAQ storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/faq] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized create validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      locale: 'zh-hant',
      question: '',
      answer: 'FAQ answer.',
      categoryId: 'company-setup',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認 FAQ 請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(createFaqItemMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the FAQ request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized engine validation errors without leaking raw validation strings', async () => {
    validateFaqItemMock.mockReturnValueOnce(['질문을 입력하세요.']);

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the FAQ request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('질문을 입력하세요.');
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createFaqItemMock.mockRejectedValueOnce(new Error('FAQ create secret leaked'));

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'FAQ 항목을 만들지 못했습니다.',
      errorCode: 'faq_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('FAQ create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/faq] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates FAQ items while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(createFaqItemMock).toHaveBeenCalledWith({
      locale: 'ko',
      question: 'FAQ question?',
      answer: 'FAQ answer.',
      categoryId: 'company-setup',
      tags: ['company'],
      status: 'published',
      sortOrder: 10,
      schemaEnabled: true,
    });
    expect(payload).toEqual({ ok: true, item: faqItem });
  });
});
