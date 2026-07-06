import { describe, expect, it } from 'vitest';
import {
  getBookingAnalyticsApiErrorPayload,
  getBookingCancellationPolicyApiErrorPayload,
  getBookingCalendarSyncApiErrorPayload,
  getBookingCalendarSyncConnectApiErrorPayload,
  getBookingEmailTemplateApiErrorPayload,
  getBookingNotificationTemplateApiErrorPayload,
  getBookingPackageCreditApiErrorPayload,
  getBookingPackageApiErrorPayload,
  getPublicBookingApiErrorPayload,
  getBookingResourceApiErrorPayload,
  getBookingServiceApiDetailMessage,
  getBookingServiceApiErrorPayload,
  getBookingStaffApiErrorPayload,
  getBookingStaffAvailabilityApiErrorPayload,
  getBookingMutationApiErrorPayload,
  getBookingManualPaymentApiErrorPayload,
  normalizeBookingManualPaymentApiErrorCode,
  getBookingDocumentApiErrorPayload,
  normalizeBookingDocumentApiErrorCode,
  getBookingWaitlistApiErrorPayload,
} from '@/lib/builder/bookings/bookings-copy';

describe('bookings copy helpers', () => {
  it('returns localized public booking API error payloads with stable codes', () => {
    expect(getPublicBookingApiErrorPayload('ko', 'booking_services_failed')).toEqual({
      error: '예약 서비스 목록을 불러오지 못했습니다.',
      errorCode: 'booking_services_failed',
    });
    expect(getPublicBookingApiErrorPayload('zh-hant', 'booking_availability_invalid')).toEqual({
      error: '請確認服務與日期。',
      errorCode: 'booking_availability_invalid',
    });
    const english = getPublicBookingApiErrorPayload('en', 'too_many_requests');

    expect(english).toEqual({
      error: 'Too many booking requests. Try again shortly.',
      errorCode: 'too_many_requests',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);

    expect(getPublicBookingApiErrorPayload('ko', 'booking_payment_provider_not_configured')).toEqual({
      error: '결제 제공자가 설정되지 않았습니다.',
      errorCode: 'booking_payment_provider_not_configured',
    });
    expect(getPublicBookingApiErrorPayload('zh-hant', 'booking_payment_secret_missing')).toEqual({
      error: '付款服務提供者未回傳付款確認資料。',
      errorCode: 'booking_payment_secret_missing',
    });
    expect(getPublicBookingApiErrorPayload('ko', 'booking_create_slot_unavailable')).toEqual({
      error: '선택한 시간은 더 이상 예약할 수 없습니다.',
      errorCode: 'booking_create_slot_unavailable',
    });
    expect(getPublicBookingApiErrorPayload('zh-hant', 'booking_create_payment_mismatch')).toEqual({
      error: '付款資料與所選服務不相符。',
      errorCode: 'booking_create_payment_mismatch',
    });
    expect(getPublicBookingApiErrorPayload('en', 'booking_create_failed')).toEqual({
      error: 'Unable to create the booking.',
      errorCode: 'booking_create_failed',
    });
  });

  it('returns localized booking analytics API error payloads with stable codes', () => {
    expect(getBookingAnalyticsApiErrorPayload('ko', 'unknown_locale')).toEqual({
      error: '지원하지 않는 언어입니다.',
      errorCode: 'unknown_locale',
    });
    expect(getBookingAnalyticsApiErrorPayload('zh-hant', 'invalid_from_timestamp')).toEqual({
      error: '請確認開始時間。',
      errorCode: 'invalid_from_timestamp',
    });
    const english = getBookingAnalyticsApiErrorPayload('en', 'invalid_to_timestamp');

    expect(english).toEqual({
      error: 'Check the to timestamp.',
      errorCode: 'invalid_to_timestamp',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized notification template API error payloads with stable codes', () => {
    expect(getBookingNotificationTemplateApiErrorPayload('ko', 'unknown_event_type')).toEqual({
      error: '지원하지 않는 알림 유형입니다.',
      errorCode: 'unknown_event_type',
    });
    expect(getBookingNotificationTemplateApiErrorPayload('zh-hant', 'template_not_found')).toEqual({
      error: '找不到通知範本。',
      errorCode: 'template_not_found',
    });
    const english = getBookingNotificationTemplateApiErrorPayload('en', 'duplicate_template');

    expect(english).toEqual({
      error: 'A matching notification template already exists.',
      errorCode: 'duplicate_template',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized booking email template API error payloads with stable codes', () => {
    expect(getBookingEmailTemplateApiErrorPayload('ko', 'invalid_template_payload')).toEqual({
      error: '이메일 템플릿 내용을 확인해 주세요.',
      errorCode: 'invalid_template_payload',
    });
    expect(getBookingEmailTemplateApiErrorPayload('zh-hant', 'unknown_template_type')).toEqual({
      error: '不支援的預約電子郵件範本。',
      errorCode: 'unknown_template_type',
    });
    const english = getBookingEmailTemplateApiErrorPayload('en', 'invalid_template_payload');

    expect(english).toEqual({
      error: 'Check the email template content.',
      errorCode: 'invalid_template_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized calendar sync connect API error payloads with stable codes', () => {
    expect(getBookingCalendarSyncConnectApiErrorPayload('ko', 'oauth_state_failed')).toEqual({
      error: '캘린더 연결 보안 상태를 만들 수 없습니다.',
      errorCode: 'oauth_state_failed',
    });
    expect(getBookingCalendarSyncConnectApiErrorPayload('zh-hant', 'missing_staff_id')).toEqual({
      error: '請選擇員工。',
      errorCode: 'missing_staff_id',
    });
    expect(getBookingCalendarSyncConnectApiErrorPayload('ko', 'invalid_oauth_state')).toEqual({
      error: '캘린더 연결 보안 상태가 만료되었거나 올바르지 않습니다.',
      errorCode: 'invalid_oauth_state',
    });
    expect(getBookingCalendarSyncConnectApiErrorPayload('zh-hant', 'token_exchange_failed')).toEqual({
      error: '無法取得行事曆連線權杖。',
      errorCode: 'token_exchange_failed',
    });
    const english = getBookingCalendarSyncConnectApiErrorPayload('en', 'auth_url_failed');

    expect(english).toEqual({
      error: 'Unable to create the calendar connection URL.',
      errorCode: 'auth_url_failed',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);

    const englishCallback = getBookingCalendarSyncConnectApiErrorPayload('en', 'oauth_provider_error');
    expect(englishCallback).toEqual({
      error: 'The calendar provider did not approve the connection.',
      errorCode: 'oauth_provider_error',
    });
    expect(englishCallback.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized calendar sync API error payloads with stable codes', () => {
    expect(getBookingCalendarSyncApiErrorPayload('ko', 'connection_not_found')).toEqual({
      error: '캘린더 연결을 찾을 수 없습니다.',
      errorCode: 'connection_not_found',
    });
    expect(getBookingCalendarSyncApiErrorPayload('zh-hant', 'invalid_recurrence_payload')).toEqual({
      error: '請確認重複行程設定。',
      errorCode: 'invalid_recurrence_payload',
    });
    const english = getBookingCalendarSyncApiErrorPayload('en', 'invalid_recurrence_config');

    expect(english).toEqual({
      error: 'Unable to create the recurrence rule.',
      errorCode: 'invalid_recurrence_config',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized service API error payloads with stable codes', () => {
    expect(getBookingServiceApiErrorPayload('ko', 'service_not_found')).toEqual({
      error: '예약 서비스를 찾을 수 없습니다.',
      errorCode: 'service_not_found',
    });
    expect(getBookingServiceApiErrorPayload('zh-hant', 'invalid_service_payload')).toEqual({
      error: '請確認服務內容。',
      errorCode: 'invalid_service_payload',
    });
    const english = getBookingServiceApiErrorPayload('en', 'invalid_service_payload');

    expect(english).toEqual({
      error: 'Check the service content.',
      errorCode: 'invalid_service_payload',
    });
    expect(getBookingServiceApiDetailMessage('zh-hant', 'expected_object_payload')).toBe('需要物件格式的請求內容。');
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized staff API error payloads with stable codes', () => {
    expect(getBookingStaffApiErrorPayload('ko', 'staff_not_found')).toEqual({
      error: '예약 담당자를 찾을 수 없습니다.',
      errorCode: 'staff_not_found',
    });
    expect(getBookingStaffApiErrorPayload('zh-hant', 'invalid_staff_payload')).toEqual({
      error: '請確認員工資料。',
      errorCode: 'invalid_staff_payload',
    });
    const english = getBookingStaffApiErrorPayload('en', 'invalid_staff_payload');

    expect(english).toEqual({
      error: 'Check the staff profile.',
      errorCode: 'invalid_staff_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized resource API error payloads with stable codes', () => {
    expect(getBookingResourceApiErrorPayload('ko', 'resource_not_found')).toEqual({
      error: '예약 자원을 찾을 수 없습니다.',
      errorCode: 'resource_not_found',
    });
    expect(getBookingResourceApiErrorPayload('zh-hant', 'invalid_resource_payload')).toEqual({
      error: '請確認資源資料。',
      errorCode: 'invalid_resource_payload',
    });
    const english = getBookingResourceApiErrorPayload('en', 'invalid_resource_payload');

    expect(english).toEqual({
      error: 'Check the resource details.',
      errorCode: 'invalid_resource_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized package API error payloads with stable codes', () => {
    expect(getBookingPackageApiErrorPayload('ko', 'package_not_found')).toEqual({
      error: '예약 패키지를 찾을 수 없습니다.',
      errorCode: 'package_not_found',
    });
    expect(getBookingPackageApiErrorPayload('zh-hant', 'invalid_package_payload')).toEqual({
      error: '請確認方案資料。',
      errorCode: 'invalid_package_payload',
    });
    const english = getBookingPackageApiErrorPayload('en', 'invalid_package_payload');

    expect(english).toEqual({
      error: 'Check the package details.',
      errorCode: 'invalid_package_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized package credit API error payloads with stable codes', () => {
    expect(getBookingPackageCreditApiErrorPayload('ko', 'credit_not_found')).toEqual({
      error: '고객 크레딧을 찾을 수 없습니다.',
      errorCode: 'credit_not_found',
    });
    expect(getBookingPackageCreditApiErrorPayload('zh-hant', 'invalid_credit_payload')).toEqual({
      error: '請確認客戶點數資料。',
      errorCode: 'invalid_credit_payload',
    });
    expect(getBookingPackageCreditApiErrorPayload('zh-hant', 'package_not_found')).toEqual({
      error: '找不到預約方案。',
      errorCode: 'package_not_found',
    });
    const english = getBookingPackageCreditApiErrorPayload('en', 'invalid_credit_payload');

    expect(english).toEqual({
      error: 'Check the customer credit details.',
      errorCode: 'invalid_credit_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized cancellation policy API error payloads with stable codes', () => {
    expect(getBookingCancellationPolicyApiErrorPayload('ko', 'policy_not_found')).toEqual({
      error: '취소 정책을 찾을 수 없습니다.',
      errorCode: 'policy_not_found',
    });
    expect(getBookingCancellationPolicyApiErrorPayload('zh-hant', 'invalid_policy_payload')).toEqual({
      error: '請確認取消政策資料。',
      errorCode: 'invalid_policy_payload',
    });
    const english = getBookingCancellationPolicyApiErrorPayload('en', 'invalid_policy_payload');

    expect(english).toEqual({
      error: 'Check the cancellation policy details.',
      errorCode: 'invalid_policy_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized staff availability API error payloads with stable codes', () => {
    expect(getBookingStaffAvailabilityApiErrorPayload('ko', 'invalid_availability_payload')).toEqual({
      error: '가능 시간 설정을 확인해 주세요.',
      errorCode: 'invalid_availability_payload',
    });
    expect(getBookingStaffAvailabilityApiErrorPayload('zh-hant', 'invalid_availability_payload')).toEqual({
      error: '請確認可用時段設定。',
      errorCode: 'invalid_availability_payload',
    });
    const english = getBookingStaffAvailabilityApiErrorPayload('en', 'invalid_availability_payload');

    expect(english).toEqual({
      error: 'Check the availability settings.',
      errorCode: 'invalid_availability_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized booking mutation API error payloads with stable codes', () => {
    expect(getBookingMutationApiErrorPayload('ko', 'booking_not_found')).toEqual({
      error: '예약을 찾을 수 없습니다.',
      errorCode: 'booking_not_found',
    });
    expect(getBookingMutationApiErrorPayload('zh-hant', 'slot_unavailable')).toEqual({
      error: '所選時段已無法預約。',
      errorCode: 'slot_unavailable',
    });
    expect(getBookingMutationApiErrorPayload('ko', 'slot_lock_conflict')).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
    const english = getBookingMutationApiErrorPayload('en', 'invalid_booking_payload');

    expect(english).toEqual({
      error: 'Check the booking details.',
      errorCode: 'invalid_booking_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized booking manual payment API error payloads with stable codes', () => {
    expect(getBookingManualPaymentApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '수동 결제 정보를 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBookingManualPaymentApiErrorPayload('zh-hant', 'manual_payment_exceeds_balance')).toEqual({
      error: '手動付款超過應付餘額。',
      errorCode: 'manual_payment_exceeds_balance',
    });
    expect(getBookingManualPaymentApiErrorPayload('ko', 'booking_refund_locked')).toEqual({
      error: '환불 처리된 예약에는 수동 결제를 기록할 수 없습니다.',
      errorCode: 'booking_refund_locked',
    });
    expect(getBookingManualPaymentApiErrorPayload('zh-hant', 'booking_already_paid')).toEqual({
      error: '此預約已付款完成。',
      errorCode: 'booking_already_paid',
    });
    expect(normalizeBookingManualPaymentApiErrorCode('manual_payment_amount_invalid')).toBe('manual_payment_amount_invalid');
    expect(normalizeBookingManualPaymentApiErrorCode('unexpected_error')).toBe('manual_payment_failed');

    const english = getBookingManualPaymentApiErrorPayload('en', 'invalid_json');
    expect(english).toEqual({
      error: 'Check the manual payment request format.',
      errorCode: 'invalid_json',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized booking document API error payloads with stable codes', () => {
    expect(getBookingDocumentApiErrorPayload('ko', 'invalid_document_payload')).toEqual({
      error: '결제 문서 정보를 확인해 주세요.',
      errorCode: 'invalid_document_payload',
    });
    expect(getBookingDocumentApiErrorPayload('zh-hant', 'receipt_requires_paid_booking')).toEqual({
      error: '收據只能為已付款的預約開立。',
      errorCode: 'receipt_requires_paid_booking',
    });
    expect(getBookingDocumentApiErrorPayload('ko', 'document_not_current')).toEqual({
      error: '현재 결제 문서만 처리할 수 있습니다.',
      errorCode: 'document_not_current',
    });
    expect(normalizeBookingDocumentApiErrorCode('document_not_found')).toBe('document_not_found');
    expect(normalizeBookingDocumentApiErrorCode('unexpected_document_state')).toBe('document_action_failed');

    const english = getBookingDocumentApiErrorPayload('en', 'document_action_failed');
    expect(english).toEqual({
      error: 'Document action failed.',
      errorCode: 'document_action_failed',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized booking waitlist API error payloads with stable codes', () => {
    expect(getBookingWaitlistApiErrorPayload('ko', 'waitlist_not_found')).toEqual({
      error: '대기 목록 항목을 찾을 수 없습니다.',
      errorCode: 'waitlist_not_found',
    });
    expect(getBookingWaitlistApiErrorPayload('zh-hant', 'invalid_waitlist_payload')).toEqual({
      error: '請確認候補名單資料。',
      errorCode: 'invalid_waitlist_payload',
    });
    expect(getBookingWaitlistApiErrorPayload('ko', 'waitlist_already_promoted')).toEqual({
      error: '이미 예약으로 승격된 대기 목록은 수정할 수 없습니다.',
      errorCode: 'waitlist_already_promoted',
    });
    expect(getBookingWaitlistApiErrorPayload('ko', 'waitlist_closed')).toEqual({
      error: '종료된 대기 목록은 예약으로 승격할 수 없습니다.',
      errorCode: 'waitlist_closed',
    });
    expect(getBookingWaitlistApiErrorPayload('zh-hant', 'no_available_slot')).toEqual({
      error: '沒有可用時段可將此候補名單轉為預約。',
      errorCode: 'no_available_slot',
    });
    expect(getBookingWaitlistApiErrorPayload('ko', 'slot_lock_conflict')).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
    const english = getBookingWaitlistApiErrorPayload('en', 'invalid_waitlist_payload');

    expect(english).toEqual({
      error: 'Check the waitlist details.',
      errorCode: 'invalid_waitlist_payload',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);

    const englishPromotion = getBookingWaitlistApiErrorPayload('en', 'invalid_waitlist_promotion_payload');
    expect(englishPromotion).toEqual({
      error: 'Check the waitlist promotion details.',
      errorCode: 'invalid_waitlist_promotion_payload',
    });
    expect(englishPromotion.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
