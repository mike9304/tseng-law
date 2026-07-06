import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getSendQueueStats } from '@/lib/builder/crm/campaign-queue';
import type { CrmSendQueueStats } from '@/lib/builder/crm/campaign-queue';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/campaign-queue', () => ({
  getSendQueueStats: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getSendQueueStatsMock = vi.mocked(getSendQueueStats);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/send-queue${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

const stats: CrmSendQueueStats = {
  total: 1,
  pending: 1,
  sent: 0,
  failed: 0,
  bounced: 0,
  byCampaign: {
    cmp_1: { total: 1, pending: 1, sent: 0, failed: 0, bounced: 0 },
  },
  recent: [
    {
      id: 'snd_1',
      campaignId: 'cmp_1',
      contactId: 'ct_1',
      contactEmail: 'lead@example.test',
      status: 'pending',
      attempts: 0,
      enqueuedAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    },
  ],
};

describe('builder CRM send queue API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    getSendQueueStatsMock.mockResolvedValue(stats as never);
  });

  it('returns send queue stats while preserving GET success response shape', async () => {
    const response = await GET(request('locale=en&recent=5'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(getSendQueueStatsMock).toHaveBeenCalledWith(5);
    expect(data).toEqual({ ok: true, stats });
  });

  it('clamps non-finite recent limits to the default', async () => {
    const response = await GET(request('locale=en&recent=bad'));

    expect(response.status).toBe(200);
    expect(getSendQueueStatsMock).toHaveBeenCalledWith(20);
  });

  it('returns localized stats failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getSendQueueStatsMock.mockRejectedValueOnce(new Error('send queue secret leaked'));

    const response = await GET(request('locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入傳送佇列統計。',
      errorCode: 'send_queue_stats_failed',
    });
    expect(JSON.stringify(data)).not.toContain('send queue secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/send-queue] stats failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
