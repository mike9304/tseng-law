import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { createContact, listContacts } from '@/lib/builder/crm/contact-store';
import { runAutomationsForEvent } from '@/lib/builder/crm/automation-engine';
import { dispatchToIntegrations } from '@/lib/builder/crm/integrations-dispatcher';
import type { CrmContact } from '@/lib/builder/crm/contact-model';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/contact-store', () => ({
  createContact: vi.fn(),
  listContacts: vi.fn(),
}));

vi.mock('@/lib/builder/crm/automation-engine', () => ({
  runAutomationsForEvent: vi.fn(),
}));

vi.mock('@/lib/builder/crm/integrations-dispatcher', () => ({
  dispatchToIntegrations: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const createContactMock = vi.mocked(createContact);
const listContactsMock = vi.mocked(listContacts);
const runAutomationsForEventMock = vi.mocked(runAutomationsForEvent);
const dispatchToIntegrationsMock = vi.mocked(dispatchToIntegrations);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/contacts${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const contact = {
  id: 'ct_1',
  email: 'lead@example.test',
  source: 'manual',
  tags: [],
  createdAt: '2026-06-03T00:00:00.000Z',
  lastActivityAt: '2026-06-03T00:00:00.000Z',
} satisfies CrmContact;

describe('builder CRM contacts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' });
    listContactsMock.mockResolvedValue([contact]);
    createContactMock.mockResolvedValue(contact);
    runAutomationsForEventMock.mockResolvedValue(undefined);
    dispatchToIntegrationsMock.mockResolvedValue(undefined);
  });

  it('lists contacts while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en&q=lead&source=manual&tag=vip'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listContactsMock).toHaveBeenCalledWith({ q: 'lead', source: 'manual', tag: 'vip' });
    expect(data).toEqual({ ok: true, contacts: [contact], total: 1 });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listContactsMock.mockRejectedValueOnce(new Error('contact list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入聯絡人清單。',
      errorCode: 'contacts_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('contact list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/contacts] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid contact payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', { email: 'not-email' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認聯絡人資料。',
      errorCode: 'invalid_contact_payload',
    });
    expect(data.details).toBeTruthy();
    expect(createContactMock).not.toHaveBeenCalled();
  });

  it('creates a contact and fans out contact-created integrations', async () => {
    const response = await POST(request('POST', 'locale=en', {
      email: 'lead@example.test',
      tags: ['subscriber'],
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ok: true, contact });
    expect(runAutomationsForEventMock).toHaveBeenCalledWith({
      kind: 'contact-created',
      contact,
      payload: { source: 'manual' },
    });
    expect(dispatchToIntegrationsMock).toHaveBeenCalledWith({
      kind: 'contact-created',
      contact,
      payload: { source: 'manual' },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createContactMock.mockRejectedValueOnce(new Error('contact create secret leaked'));

    const response = await POST(request('POST', 'locale=en', { email: 'lead@example.test' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to create the contact.',
      errorCode: 'contact_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('contact create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/contacts] create failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
