import { describe, expect, it } from 'vitest';
import { getBookingManageApiErrorPayload } from '@/lib/builder/bookings/booking-manage-copy';

describe('booking manage-link copy helpers', () => {
  it('returns localized booking manage-link API error payloads with stable codes', () => {
    expect(getBookingManageApiErrorPayload('ko', 'invalid_or_expired_link')).toEqual({
      error: '예약 관리 링크가 유효하지 않거나 만료되었습니다.',
      errorCode: 'invalid_or_expired_link',
    });
    expect(getBookingManageApiErrorPayload('zh-hant', 'slot_lock_conflict')).toEqual({
      error: '所選時段正由其他請求預約中。',
      errorCode: 'slot_lock_conflict',
    });
    const english = getBookingManageApiErrorPayload('en', 'staff_unavailable');

    expect(english).toEqual({
      error: 'The selected staff member is not available.',
      errorCode: 'staff_unavailable',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
