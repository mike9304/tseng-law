import { describe, expect, it } from 'vitest';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';

describe('booking slot locks', () => {
  it('serializes bookings that need the same resource on the same day', () => {
    const first = {
      serviceId: 'svc-a',
      staffId: 'staff-a',
      startAt: '2099-01-05T00:00:00.000Z',
      resourceIds: ['room-a'],
    };
    const second = {
      serviceId: 'svc-b',
      staffId: 'staff-b',
      startAt: '2099-01-05T00:30:00.000Z',
      resourceIds: ['room-a'],
    };

    expect(acquireSlotLock(first)).toBe(true);
    expect(acquireSlotLock(second)).toBe(false);

    releaseSlotLock(first);
    expect(acquireSlotLock(second)).toBe(true);
    releaseSlotLock(second);
  });
});
