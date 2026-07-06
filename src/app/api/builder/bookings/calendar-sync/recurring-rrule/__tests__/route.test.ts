import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/calendar-sync/recurring-rrule?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/calendar-sync/recurring-rrule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized errors for invalid recurrence payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ frequency: 'yearly' }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '請確認重複行程設定。',
      errorCode: 'invalid_recurrence_payload',
    });
  });

  it('returns safe localized errors for recurrence build failures', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({
      frequency: 'weekly',
      weekdays: ['monday'],
      until: '2026-09-01T00:00:00.000Z',
      count: 6,
    }, 'en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: 'Unable to create the recurrence rule.',
      errorCode: 'invalid_recurrence_config',
    });
    expect(payload.error).not.toContain('until and count are mutually exclusive');
  });

  it('returns RRULE output for valid recurrence payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({
      frequency: 'biweekly',
      weekdays: ['tuesday', 'thursday'],
      count: 6,
    }, 'ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      rrule: 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;COUNT=6',
      config: {
        frequency: 'biweekly',
        weekdays: ['tuesday', 'thursday'],
        count: 6,
      },
    });
  });
});
