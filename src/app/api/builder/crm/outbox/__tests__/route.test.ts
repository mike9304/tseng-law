import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readOutbox } from '@/lib/builder/crm/automation-model';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/automation-model', () => ({
  readOutbox: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const readOutboxMock = vi.mocked(readOutbox);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/outbox${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

const outboxEntry = {
  entryId: 'out_1',
  automationId: 'auto_1',
  contactId: 'ct_1',
  contactEmail: 'lead@example.test',
  templateId: 'welcome',
  triggeredAt: '2026-06-18T00:00:03.000Z',
  payload: { source: 'manual' },
};

describe('builder CRM outbox API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' });
    readOutboxMock.mockResolvedValue([outboxEntry]);
  });

  it('returns recent automation email outbox entries newest first', async () => {
    readOutboxMock.mockResolvedValue([
      {
        ...outboxEntry,
        entryId: 'out_old',
        triggeredAt: '2026-06-18T00:00:01.000Z',
      },
      outboxEntry,
    ]);

    const response = await GET(request('locale=en&recent=1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'view-contacts',
    });
    expect(data).toEqual({
      ok: true,
      total: 2,
      entries: [outboxEntry],
    });
  });

  it('returns localized outbox failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readOutboxMock.mockRejectedValueOnce(new Error('outbox secret leaked'));

    const response = await GET(request('locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入寄送紀錄。',
      errorCode: 'outbox_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('outbox secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/outbox] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
