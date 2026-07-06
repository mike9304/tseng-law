import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { deleteContact, getContact, updateContact } from '@/lib/builder/crm/contact-store';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/contact-store', () => ({
  deleteContact: vi.fn(),
  getContact: vi.fn(),
  updateContact: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const deleteContactMock = vi.mocked(deleteContact);
const getContactMock = vi.mocked(getContact);
const updateContactMock = vi.mocked(updateContact);

function request(method: 'GET' | 'PATCH' | 'DELETE', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/contacts/ct_1${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const routeContext = { params: { id: 'ct_1' } };
const contact = {
  id: 'ct_1',
  email: 'lead@example.test',
  source: 'manual',
  tags: [],
  createdAt: '2026-06-03T00:00:00.000Z',
  lastActivityAt: '2026-06-03T00:00:00.000Z',
};

describe('builder CRM contact detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    deleteContactMock.mockResolvedValue(true as never);
    getContactMock.mockResolvedValue(contact as never);
    updateContactMock.mockResolvedValue(contact as never);
  });

  it('loads contacts while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, contact });
  });

  it('returns localized not-found errors', async () => {
    getContactMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('GET', 'locale=zh-hant'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '找不到聯絡人。',
      errorCode: 'contact_not_found',
    });
  });

  it('returns localized invalid patch errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=ko', { email: 'nope' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '연락처 정보를 확인해 주세요.',
      errorCode: 'invalid_contact_payload',
    });
    expect(updateContactMock).not.toHaveBeenCalled();
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateContactMock.mockRejectedValueOnce(new Error('contact update secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=en', { name: 'Lead' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to update the contact.',
      errorCode: 'contact_update_failed',
    });
    expect(JSON.stringify(data)).not.toContain('contact update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/contacts/:id] update failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteContactMock.mockRejectedValueOnce(new Error('contact delete secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=ko'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '연락처를 삭제하지 못했습니다.',
      errorCode: 'contact_delete_failed',
    });
    expect(JSON.stringify(data)).not.toContain('contact delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/contacts/:id] delete failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
