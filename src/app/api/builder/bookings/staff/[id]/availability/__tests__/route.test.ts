import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getStaffAvailability,
  saveStaffAvailability,
} from '@/lib/builder/bookings/storage';
import type { DayOfWeek, StaffAvailability } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getStaffAvailability: vi.fn(async () => availability()),
  saveStaffAvailability: vi.fn(async () => undefined),
}));

const emptyWeekly = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
} satisfies Record<DayOfWeek, []>;

function availability(overrides: Partial<StaffAvailability> = {}): StaffAvailability {
  return {
    staffId: 'staff-route-test',
    weekly: {
      ...emptyWeekly,
      monday: [{ start: '09:00', end: '17:00' }],
    },
    blockedDates: [],
    dateOverrides: [],
    timezone: 'Asia/Taipei',
    recurringTemplateId: 'weekdays-09-18',
    holidayCalendar: 'none',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/bookings/staff/staff-route-test/availability?locale=${locale}`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

describe('/api/builder/bookings/staff/[id]/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns staff availability for authenticated builder admins', async () => {
    vi.mocked(getStaffAvailability).mockResolvedValueOnce(availability({ timezone: 'Asia/Seoul' }));
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/staff/staff-route-test/availability'),
      { params: { id: 'staff-route-test' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.availability).toEqual(expect.objectContaining({
      staffId: 'staff-route-test',
      timezone: 'Asia/Seoul',
    }));
    expect(getStaffAvailability).toHaveBeenCalledWith('staff-route-test');
  });

  it('returns localized errors for invalid availability payloads', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({
      weekly: {
        ...emptyWeekly,
        monday: [{ start: '18:00', end: '09:00' }],
      },
      blockedDates: [{
        start: '2099-01-05T01:00:00.000Z',
        end: '2099-01-05T00:00:00.000Z',
      }],
      timezone: 'Mars/Base',
    }, 'zh-hant'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認可用時段設定。');
    expect(payload.errorCode).toBe('invalid_availability_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveStaffAvailability).not.toHaveBeenCalled();
  });

  it('updates staff availability with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest(availability({
      staffId: 'client-supplied-id',
      timezone: 'Asia/Seoul',
      weekly: {
        ...emptyWeekly,
        tuesday: [{ start: '10:00', end: '15:00' }],
      },
    }), 'en'), {
      params: { id: 'staff-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.availability).toEqual(expect.objectContaining({
      staffId: 'staff-route-test',
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    }));
    expect(payload.availability.weekly.tuesday).toEqual([{ start: '10:00', end: '15:00' }]);
    expect(saveStaffAvailability).toHaveBeenCalledWith(payload.availability);
  });
});
