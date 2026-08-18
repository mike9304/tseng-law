import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';
import {
  appendConsultationLogLine,
  deleteConsultationLogRecordsBySession,
} from '@/lib/consultation/log-storage';

vi.mock('@/lib/consultation/admin/auth', () => ({
  requireConsultationAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
  deleteConsultationLogRecordsBySession: vi.fn(async () => ({
    totalScanned: 1,
    totalRemoved: 1,
    rewrittenDays: [{
      kind: 'events',
      dateKey: '2026-07-30',
      kept: 0,
      removed: 1,
    }],
  })),
}));

describe('/api/consultation/data/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireConsultationAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(deleteConsultationLogRecordsBySession).mockResolvedValue({
      totalScanned: 1,
      totalRemoved: 1,
      rewrittenDays: [{
        kind: 'events',
        dateKey: '2026-07-30',
        kept: 0,
        removed: 1,
      }],
    });
  });

  it.each([
    ['missing Origin and Referer', undefined],
    ['a cross-origin Origin', 'https://attacker.example'],
  ])('rejects %s before authentication, deletion, or audit logging', async (_label, origin) => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(origin));

    expect(response.status).toBe(403);
    expect(requireConsultationAdminAuth).not.toHaveBeenCalled();
    expect(deleteConsultationLogRecordsBySession).not.toHaveBeenCalled();
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('allows a same-origin request through the existing auth and deletion flow', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest('https://tseng-law.com'));

    expect(response.status).toBe(200);
    expect(requireConsultationAdminAuth).toHaveBeenCalledOnce();
    expect(deleteConsultationLogRecordsBySession).toHaveBeenCalledWith('session-123');
    expect(appendConsultationLogLine).toHaveBeenCalledOnce();
  });
});

function makeRequest(origin?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (origin) headers.set('origin', origin);
  return new NextRequest('https://tseng-law.com/api/consultation/data/delete', {
    method: 'POST',
    headers,
    body: JSON.stringify({ sessionId: 'session-123' }),
  });
}
