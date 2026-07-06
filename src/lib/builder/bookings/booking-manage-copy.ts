import type { Locale } from '@/lib/locales';

export type BookingManageApiErrorCode =
  | 'too_many_requests'
  | 'invalid_or_expired_link'
  | 'booking_not_found'
  | 'booking_not_manageable'
  | 'booking_already_cancelled'
  | 'invalid_update'
  | 'cancel_unavailable'
  | 'reschedule_unavailable'
  | 'slot_lock_conflict'
  | 'slot_unavailable'
  | 'staff_unavailable';

export interface BookingManageApiErrorPayload {
  error: string;
  errorCode: BookingManageApiErrorCode;
}

const bookingManageApiErrorMessages: Record<Locale, Record<BookingManageApiErrorCode, string>> = {
  ko: {
    too_many_requests: '예약 관리 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    invalid_or_expired_link: '예약 관리 링크가 유효하지 않거나 만료되었습니다.',
    booking_not_found: '예약을 찾을 수 없습니다.',
    booking_not_manageable: '이 예약은 관리할 수 없습니다.',
    booking_already_cancelled: '이미 취소된 예약입니다.',
    invalid_update: '예약 변경 내용을 확인해 주세요.',
    cancel_unavailable: '이 예약은 취소할 수 없습니다.',
    reschedule_unavailable: '이 예약은 일정을 변경할 수 없습니다.',
    slot_lock_conflict: '선택한 시간이 다른 요청에서 예약 중입니다.',
    slot_unavailable: '선택한 시간은 더 이상 예약할 수 없습니다.',
    staff_unavailable: '선택한 담당자를 예약할 수 없습니다.',
  },
  'zh-hant': {
    too_many_requests: '預約管理請求過多，請稍後再試。',
    invalid_or_expired_link: '預約管理連結無效或已過期。',
    booking_not_found: '找不到預約。',
    booking_not_manageable: '此預約目前無法管理。',
    booking_already_cancelled: '此預約已取消。',
    invalid_update: '請確認預約變更內容。',
    cancel_unavailable: '此預約目前無法取消。',
    reschedule_unavailable: '此預約目前無法改期。',
    slot_lock_conflict: '所選時段正由其他請求預約中。',
    slot_unavailable: '所選時段已無法預約。',
    staff_unavailable: '所選員工目前無法預約。',
  },
  en: {
    too_many_requests: 'Too many booking management requests. Try again shortly.',
    invalid_or_expired_link: 'The booking management link is invalid or expired.',
    booking_not_found: 'Booking not found.',
    booking_not_manageable: 'This booking cannot be managed.',
    booking_already_cancelled: 'This booking is already cancelled.',
    invalid_update: 'Check the booking update details.',
    cancel_unavailable: 'Cancellation is not available for this booking.',
    reschedule_unavailable: 'Reschedule is not available for this booking.',
    slot_lock_conflict: 'The selected slot is being booked by another request.',
    slot_unavailable: 'The selected slot is no longer available.',
    staff_unavailable: 'The selected staff member is not available.',
  },
};

export function getBookingManageApiErrorPayload(
  locale: Locale,
  errorCode: BookingManageApiErrorCode,
): BookingManageApiErrorPayload {
  return {
    error: bookingManageApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
