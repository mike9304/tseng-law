import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  listAvailability,
  listBookings,
  listServices,
  listStaff,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listAvailability: vi.fn(async () => []),
  listBookings: vi.fn(async () => []),
  listServices: vi.fn(async () => []),
  listStaff: vi.fn(async () => []),
}));

describe('/api/builder/bookings/calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
  });

  it('requires view-bookings and does not read calendar data on denial', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: view-bookings' }, { status: 403 }),
    );
    const route = await import('../route');
    const request = new NextRequest('https://law.example.test/api/builder/bookings/calendar');
    const response = await route.GET(request);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(request, 'view-bookings');
    expect(listBookings).not.toHaveBeenCalled();
    expect(listServices).not.toHaveBeenCalled();
    expect(listStaff).not.toHaveBeenCalled();
    expect(listAvailability).not.toHaveBeenCalled();
  });
});
