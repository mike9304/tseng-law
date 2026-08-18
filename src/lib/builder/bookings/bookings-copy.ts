import type { Locale } from '@/lib/locales';

export type PublicBookingApiErrorCode =
  | 'too_many_requests'
  | 'rate_limit_unavailable'
  | 'invalid_json'
  | 'booking_services_failed'
  | 'booking_staff_failed'
  | 'booking_availability_invalid'
  | 'booking_availability_failed'
  | 'booking_payment_invalid'
  | 'booking_payment_service_unavailable'
  | 'booking_payment_free_service'
  | 'booking_payment_price_missing'
  | 'booking_payment_provider_not_configured'
  | 'booking_payment_client_not_configured'
  | 'booking_payment_provider_failed'
  | 'booking_payment_secret_missing'
  | 'booking_payment_provider_unreachable'
  | 'booking_payment_failed'
  | 'booking_create_invalid'
  | 'booking_create_rejected'
  | 'booking_create_service_or_staff_unavailable'
  | 'booking_create_payment_required'
  | 'booking_create_payment_not_allowed'
  | 'booking_create_payment_mismatch'
  | 'booking_create_payment_not_settled'
  | 'booking_create_payment_unverified'
  | 'booking_create_slot_locked'
  | 'booking_create_slot_unavailable'
  | 'booking_create_package_unavailable'
  | 'booking_storage_unavailable'
  | 'booking_create_failed';

export interface PublicBookingApiErrorPayload {
  error: string;
  errorCode: PublicBookingApiErrorCode;
}

const publicBookingApiErrorMessages: Record<Locale, Record<PublicBookingApiErrorCode, string>> = {
  ko: {
    too_many_requests: '예약 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    rate_limit_unavailable: '예약 보호 시스템을 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    invalid_json: '예약 요청 형식을 확인해 주세요.',
    booking_services_failed: '예약 서비스 목록을 불러오지 못했습니다.',
    booking_staff_failed: '예약 담당자 목록을 불러오지 못했습니다.',
    booking_availability_invalid: '서비스와 날짜를 확인해 주세요.',
    booking_availability_failed: '예약 가능 시간을 불러오지 못했습니다.',
    booking_payment_invalid: '결제 요청 정보를 확인해 주세요.',
    booking_payment_service_unavailable: '결제할 수 있는 서비스를 찾을 수 없습니다.',
    booking_payment_free_service: '무료 서비스에는 온라인 결제가 필요하지 않습니다.',
    booking_payment_price_missing: '서비스 결제 금액이 설정되지 않았습니다.',
    booking_payment_provider_not_configured: '결제 제공자가 설정되지 않았습니다.',
    booking_payment_client_not_configured: '결제 클라이언트가 설정되지 않았습니다.',
    booking_payment_provider_failed: '결제 제공자 요청이 실패했습니다.',
    booking_payment_secret_missing: '결제 제공자가 결제 확인 정보를 반환하지 않았습니다.',
    booking_payment_provider_unreachable: '결제 제공자에 연결하지 못했습니다.',
    booking_payment_failed: '결제를 준비하지 못했습니다.',
    booking_create_invalid: '예약 요청 정보를 확인해 주세요.',
    booking_create_rejected: '이 예약 요청을 접수할 수 없습니다.',
    booking_create_service_or_staff_unavailable: '선택한 서비스 또는 담당자를 예약할 수 없습니다.',
    booking_create_payment_required: '이 서비스는 예약 전 결제가 필요합니다.',
    booking_create_payment_not_allowed: '이 서비스에는 결제 정보가 필요하지 않습니다.',
    booking_create_payment_mismatch: '결제 정보가 선택한 서비스와 일치하지 않습니다.',
    booking_create_payment_not_settled: '결제가 아직 완료되지 않았습니다.',
    booking_create_payment_unverified: '결제 정보를 확인하지 못했습니다.',
    booking_create_slot_locked: '선택한 시간이 다른 요청에서 처리 중입니다.',
    booking_create_slot_unavailable: '선택한 시간은 더 이상 예약할 수 없습니다.',
    booking_create_package_unavailable: '사용 가능한 패키지 크레딧이 없습니다.',
    booking_storage_unavailable: '예약 저장 시스템을 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    booking_create_failed: '예약을 생성하지 못했습니다.',
  },
  'zh-hant': {
    too_many_requests: '預約請求過多，請稍後再試。',
    rate_limit_unavailable: '預約防護系統暫時無法使用，請稍後再試。',
    invalid_json: '請確認預約請求格式。',
    booking_services_failed: '無法載入預約服務清單。',
    booking_staff_failed: '無法載入預約員工清單。',
    booking_availability_invalid: '請確認服務與日期。',
    booking_availability_failed: '無法載入可預約時段。',
    booking_payment_invalid: '請確認付款請求資料。',
    booking_payment_service_unavailable: '找不到可付款的服務。',
    booking_payment_free_service: '免費服務不需要線上付款。',
    booking_payment_price_missing: '尚未設定服務付款金額。',
    booking_payment_provider_not_configured: '尚未設定付款服務提供者。',
    booking_payment_client_not_configured: '尚未設定付款用戶端。',
    booking_payment_provider_failed: '付款服務提供者請求失敗。',
    booking_payment_secret_missing: '付款服務提供者未回傳付款確認資料。',
    booking_payment_provider_unreachable: '無法連線至付款服務提供者。',
    booking_payment_failed: '無法準備付款。',
    booking_create_invalid: '請確認預約請求資料。',
    booking_create_rejected: '無法接受此預約請求。',
    booking_create_service_or_staff_unavailable: '無法預約所選服務或員工。',
    booking_create_payment_required: '此服務需要先付款才能預約。',
    booking_create_payment_not_allowed: '此服務不需要付款資料。',
    booking_create_payment_mismatch: '付款資料與所選服務不相符。',
    booking_create_payment_not_settled: '付款尚未完成。',
    booking_create_payment_unverified: '無法確認付款資料。',
    booking_create_slot_locked: '所選時段正在由其他請求處理。',
    booking_create_slot_unavailable: '所選時段已無法預約。',
    booking_create_package_unavailable: '沒有可用的方案點數。',
    booking_storage_unavailable: '預約儲存系統暫時無法使用，請稍後再試。',
    booking_create_failed: '無法建立預約。',
  },
  en: {
    too_many_requests: 'Too many booking requests. Try again shortly.',
    rate_limit_unavailable: 'Booking protection is temporarily unavailable. Try again shortly.',
    invalid_json: 'Check the booking request format.',
    booking_services_failed: 'Unable to load booking services.',
    booking_staff_failed: 'Unable to load booking staff.',
    booking_availability_invalid: 'Check the service and date.',
    booking_availability_failed: 'Unable to load available booking times.',
    booking_payment_invalid: 'Check the payment request details.',
    booking_payment_service_unavailable: 'The selected service is not available for payment.',
    booking_payment_free_service: 'Free services do not require online payment.',
    booking_payment_price_missing: 'The service payment amount is not configured.',
    booking_payment_provider_not_configured: 'The payment provider is not configured.',
    booking_payment_client_not_configured: 'The payment client is not configured.',
    booking_payment_provider_failed: 'The payment provider request failed.',
    booking_payment_secret_missing: 'The payment provider returned no confirmation secret.',
    booking_payment_provider_unreachable: 'Unable to reach the payment provider.',
    booking_payment_failed: 'Unable to prepare payment.',
    booking_create_invalid: 'Check the booking request details.',
    booking_create_rejected: 'Unable to accept this booking request.',
    booking_create_service_or_staff_unavailable: 'The selected service or staff member cannot be booked.',
    booking_create_payment_required: 'Payment is required before booking this service.',
    booking_create_payment_not_allowed: 'This service does not require payment details.',
    booking_create_payment_mismatch: 'The payment details do not match the selected service.',
    booking_create_payment_not_settled: 'Payment is not complete yet.',
    booking_create_payment_unverified: 'Unable to verify the payment details.',
    booking_create_slot_locked: 'The selected time is being processed by another request.',
    booking_create_slot_unavailable: 'The selected time is no longer available.',
    booking_create_package_unavailable: 'No package credit is available.',
    booking_storage_unavailable: 'Booking storage is temporarily unavailable. Try again shortly.',
    booking_create_failed: 'Unable to create the booking.',
  },
};

export function getPublicBookingApiErrorPayload(
  locale: Locale,
  errorCode: PublicBookingApiErrorCode,
): PublicBookingApiErrorPayload {
  return {
    error: publicBookingApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingAnalyticsApiErrorCode =
  | 'unknown_locale'
  | 'invalid_from_timestamp'
  | 'invalid_to_timestamp';

export interface BookingAnalyticsApiErrorPayload {
  error: string;
  errorCode: BookingAnalyticsApiErrorCode;
}

const bookingAnalyticsApiErrorMessages: Record<Locale, Record<BookingAnalyticsApiErrorCode, string>> = {
  ko: {
    unknown_locale: '지원하지 않는 언어입니다.',
    invalid_from_timestamp: '시작 일시를 확인해 주세요.',
    invalid_to_timestamp: '종료 일시를 확인해 주세요.',
  },
  'zh-hant': {
    unknown_locale: '不支援的語言。',
    invalid_from_timestamp: '請確認開始時間。',
    invalid_to_timestamp: '請確認結束時間。',
  },
  en: {
    unknown_locale: 'Unsupported locale.',
    invalid_from_timestamp: 'Check the from timestamp.',
    invalid_to_timestamp: 'Check the to timestamp.',
  },
};

export function getBookingAnalyticsApiErrorPayload(
  locale: Locale,
  errorCode: BookingAnalyticsApiErrorCode,
): BookingAnalyticsApiErrorPayload {
  return {
    error: bookingAnalyticsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingNotificationTemplateApiErrorCode =
  | 'unknown_event_type'
  | 'unknown_locale'
  | 'invalid_template_payload'
  | 'invalid_template_patch'
  | 'duplicate_template'
  | 'template_not_found';

export interface BookingNotificationTemplateApiErrorPayload {
  error: string;
  errorCode: BookingNotificationTemplateApiErrorCode;
}

const bookingNotificationTemplateApiErrorMessages: Record<
  Locale,
  Record<BookingNotificationTemplateApiErrorCode, string>
> = {
  ko: {
    unknown_event_type: '지원하지 않는 알림 유형입니다.',
    unknown_locale: '지원하지 않는 언어입니다.',
    invalid_template_payload: '템플릿 내용을 확인해 주세요.',
    invalid_template_patch: '템플릿 수정 내용을 확인해 주세요.',
    duplicate_template: '이미 같은 알림 템플릿이 있습니다.',
    template_not_found: '알림 템플릿을 찾을 수 없습니다.',
  },
  'zh-hant': {
    unknown_event_type: '不支援的通知類型。',
    unknown_locale: '不支援的語言。',
    invalid_template_payload: '請確認範本內容。',
    invalid_template_patch: '請確認範本更新內容。',
    duplicate_template: '相同的通知範本已存在。',
    template_not_found: '找不到通知範本。',
  },
  en: {
    unknown_event_type: 'Unsupported notification type.',
    unknown_locale: 'Unsupported locale.',
    invalid_template_payload: 'Check the template content.',
    invalid_template_patch: 'Check the template update.',
    duplicate_template: 'A matching notification template already exists.',
    template_not_found: 'Notification template not found.',
  },
};

export function getBookingNotificationTemplateApiErrorPayload(
  locale: Locale,
  errorCode: BookingNotificationTemplateApiErrorCode,
): BookingNotificationTemplateApiErrorPayload {
  return {
    error: bookingNotificationTemplateApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingEmailTemplateApiErrorCode =
  | 'unknown_template_type'
  | 'invalid_template_payload';

export interface BookingEmailTemplateApiErrorPayload {
  error: string;
  errorCode: BookingEmailTemplateApiErrorCode;
}

const bookingEmailTemplateApiErrorMessages: Record<Locale, Record<BookingEmailTemplateApiErrorCode, string>> = {
  ko: {
    unknown_template_type: '지원하지 않는 예약 이메일 템플릿입니다.',
    invalid_template_payload: '이메일 템플릿 내용을 확인해 주세요.',
  },
  'zh-hant': {
    unknown_template_type: '不支援的預約電子郵件範本。',
    invalid_template_payload: '請確認電子郵件範本內容。',
  },
  en: {
    unknown_template_type: 'Unsupported booking email template.',
    invalid_template_payload: 'Check the email template content.',
  },
};

export function getBookingEmailTemplateApiErrorPayload(
  locale: Locale,
  errorCode: BookingEmailTemplateApiErrorCode,
): BookingEmailTemplateApiErrorPayload {
  return {
    error: bookingEmailTemplateApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingCalendarSyncConnectApiErrorCode =
  | 'missing_staff_id'
  | 'oauth_state_failed'
  | 'auth_url_failed'
  | 'oauth_provider_error'
  | 'missing_oauth_params'
  | 'invalid_oauth_state'
  | 'token_exchange_failed'
  | 'token_encrypt_failed';

export interface BookingCalendarSyncConnectApiErrorPayload {
  error: string;
  errorCode: BookingCalendarSyncConnectApiErrorCode;
}

const bookingCalendarSyncConnectApiErrorMessages: Record<
  Locale,
  Record<BookingCalendarSyncConnectApiErrorCode, string>
> = {
  ko: {
    missing_staff_id: '스태프를 선택해 주세요.',
    oauth_state_failed: '캘린더 연결 보안 상태를 만들 수 없습니다.',
    auth_url_failed: '캘린더 연결 URL을 만들 수 없습니다.',
    oauth_provider_error: '캘린더 제공자가 연결을 승인하지 않았습니다.',
    missing_oauth_params: '캘린더 연결 응답이 올바르지 않습니다.',
    invalid_oauth_state: '캘린더 연결 보안 상태가 만료되었거나 올바르지 않습니다.',
    token_exchange_failed: '캘린더 연결 토큰을 받을 수 없습니다.',
    token_encrypt_failed: '캘린더 연결 토큰을 안전하게 저장할 수 없습니다.',
  },
  'zh-hant': {
    missing_staff_id: '請選擇員工。',
    oauth_state_failed: '無法建立行事曆連線安全狀態。',
    auth_url_failed: '無法建立行事曆連線網址。',
    oauth_provider_error: '行事曆服務提供者未核准連線。',
    missing_oauth_params: '行事曆連線回應不正確。',
    invalid_oauth_state: '行事曆連線安全狀態已過期或不正確。',
    token_exchange_failed: '無法取得行事曆連線權杖。',
    token_encrypt_failed: '無法安全儲存行事曆連線權杖。',
  },
  en: {
    missing_staff_id: 'Select a staff member.',
    oauth_state_failed: 'Unable to create the calendar connection security state.',
    auth_url_failed: 'Unable to create the calendar connection URL.',
    oauth_provider_error: 'The calendar provider did not approve the connection.',
    missing_oauth_params: 'The calendar connection response is invalid.',
    invalid_oauth_state: 'The calendar connection security state is expired or invalid.',
    token_exchange_failed: 'Unable to receive the calendar connection token.',
    token_encrypt_failed: 'Unable to store the calendar connection token securely.',
  },
};

export function getBookingCalendarSyncConnectApiErrorPayload(
  locale: Locale,
  errorCode: BookingCalendarSyncConnectApiErrorCode,
): BookingCalendarSyncConnectApiErrorPayload {
  return {
    error: bookingCalendarSyncConnectApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingCalendarSyncApiErrorCode =
  | 'connection_not_found'
  | 'invalid_recurrence_payload'
  | 'invalid_recurrence_config';

export interface BookingCalendarSyncApiErrorPayload {
  error: string;
  errorCode: BookingCalendarSyncApiErrorCode;
}

const bookingCalendarSyncApiErrorMessages: Record<Locale, Record<BookingCalendarSyncApiErrorCode, string>> = {
  ko: {
    connection_not_found: '캘린더 연결을 찾을 수 없습니다.',
    invalid_recurrence_payload: '반복 일정 설정을 확인해 주세요.',
    invalid_recurrence_config: '반복 일정 규칙을 만들 수 없습니다.',
  },
  'zh-hant': {
    connection_not_found: '找不到行事曆連線。',
    invalid_recurrence_payload: '請確認重複行程設定。',
    invalid_recurrence_config: '無法建立重複行程規則。',
  },
  en: {
    connection_not_found: 'Calendar connection not found.',
    invalid_recurrence_payload: 'Check the recurrence settings.',
    invalid_recurrence_config: 'Unable to create the recurrence rule.',
  },
};

export function getBookingCalendarSyncApiErrorPayload(
  locale: Locale,
  errorCode: BookingCalendarSyncApiErrorCode,
): BookingCalendarSyncApiErrorPayload {
  return {
    error: bookingCalendarSyncApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingServiceApiErrorCode =
  | 'invalid_service_payload'
  | 'service_not_found';

export interface BookingServiceApiErrorPayload {
  error: string;
  errorCode: BookingServiceApiErrorCode;
}

const bookingServiceApiErrorMessages: Record<Locale, Record<BookingServiceApiErrorCode, string>> = {
  ko: {
    invalid_service_payload: '서비스 내용을 확인해 주세요.',
    service_not_found: '예약 서비스를 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_service_payload: '請確認服務內容。',
    service_not_found: '找不到預約服務。',
  },
  en: {
    invalid_service_payload: 'Check the service content.',
    service_not_found: 'Booking service not found.',
  },
};

const bookingServiceApiDetailMessages = {
  ko: {
    expected_object_payload: '객체 형식의 요청 본문이 필요합니다.',
  },
  'zh-hant': {
    expected_object_payload: '需要物件格式的請求內容。',
  },
  en: {
    expected_object_payload: 'Expected an object payload.',
  },
} satisfies Record<Locale, Record<'expected_object_payload', string>>;

export function getBookingServiceApiErrorPayload(
  locale: Locale,
  errorCode: BookingServiceApiErrorCode,
): BookingServiceApiErrorPayload {
  return {
    error: bookingServiceApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export function getBookingServiceApiDetailMessage(
  locale: Locale,
  detailCode: 'expected_object_payload',
): string {
  return bookingServiceApiDetailMessages[locale][detailCode];
}

export type BookingStaffApiErrorCode =
  | 'invalid_staff_payload'
  | 'staff_not_found';

export interface BookingStaffApiErrorPayload {
  error: string;
  errorCode: BookingStaffApiErrorCode;
}

const bookingStaffApiErrorMessages: Record<Locale, Record<BookingStaffApiErrorCode, string>> = {
  ko: {
    invalid_staff_payload: '담당자 정보를 확인해 주세요.',
    staff_not_found: '예약 담당자를 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_staff_payload: '請確認員工資料。',
    staff_not_found: '找不到預約員工。',
  },
  en: {
    invalid_staff_payload: 'Check the staff profile.',
    staff_not_found: 'Booking staff member not found.',
  },
};

export function getBookingStaffApiErrorPayload(
  locale: Locale,
  errorCode: BookingStaffApiErrorCode,
): BookingStaffApiErrorPayload {
  return {
    error: bookingStaffApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingResourceApiErrorCode =
  | 'invalid_resource_payload'
  | 'resource_not_found';

export interface BookingResourceApiErrorPayload {
  error: string;
  errorCode: BookingResourceApiErrorCode;
}

const bookingResourceApiErrorMessages: Record<Locale, Record<BookingResourceApiErrorCode, string>> = {
  ko: {
    invalid_resource_payload: '자원 정보를 확인해 주세요.',
    resource_not_found: '예약 자원을 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_resource_payload: '請確認資源資料。',
    resource_not_found: '找不到預約資源。',
  },
  en: {
    invalid_resource_payload: 'Check the resource details.',
    resource_not_found: 'Booking resource not found.',
  },
};

export function getBookingResourceApiErrorPayload(
  locale: Locale,
  errorCode: BookingResourceApiErrorCode,
): BookingResourceApiErrorPayload {
  return {
    error: bookingResourceApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingPackageApiErrorCode =
  | 'invalid_package_payload'
  | 'package_not_found';

export interface BookingPackageApiErrorPayload {
  error: string;
  errorCode: BookingPackageApiErrorCode;
}

const bookingPackageApiErrorMessages: Record<Locale, Record<BookingPackageApiErrorCode, string>> = {
  ko: {
    invalid_package_payload: '패키지 정보를 확인해 주세요.',
    package_not_found: '예약 패키지를 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_package_payload: '請確認方案資料。',
    package_not_found: '找不到預約方案。',
  },
  en: {
    invalid_package_payload: 'Check the package details.',
    package_not_found: 'Booking package not found.',
  },
};

export function getBookingPackageApiErrorPayload(
  locale: Locale,
  errorCode: BookingPackageApiErrorCode,
): BookingPackageApiErrorPayload {
  return {
    error: bookingPackageApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingPackageCreditApiErrorCode =
  | 'invalid_credit_payload'
  | 'credit_not_found'
  | 'package_not_found';

export interface BookingPackageCreditApiErrorPayload {
  error: string;
  errorCode: BookingPackageCreditApiErrorCode;
}

const bookingPackageCreditApiErrorMessages: Record<
  Locale,
  Record<BookingPackageCreditApiErrorCode, string>
> = {
  ko: {
    invalid_credit_payload: '고객 크레딧 정보를 확인해 주세요.',
    credit_not_found: '고객 크레딧을 찾을 수 없습니다.',
    package_not_found: '예약 패키지를 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_credit_payload: '請確認客戶點數資料。',
    credit_not_found: '找不到客戶點數。',
    package_not_found: '找不到預約方案。',
  },
  en: {
    invalid_credit_payload: 'Check the customer credit details.',
    credit_not_found: 'Customer credit not found.',
    package_not_found: 'Booking package not found.',
  },
};

export function getBookingPackageCreditApiErrorPayload(
  locale: Locale,
  errorCode: BookingPackageCreditApiErrorCode,
): BookingPackageCreditApiErrorPayload {
  return {
    error: bookingPackageCreditApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingCancellationPolicyApiErrorCode =
  | 'invalid_policy_payload'
  | 'policy_not_found';

export interface BookingCancellationPolicyApiErrorPayload {
  error: string;
  errorCode: BookingCancellationPolicyApiErrorCode;
}

const bookingCancellationPolicyApiErrorMessages: Record<
  Locale,
  Record<BookingCancellationPolicyApiErrorCode, string>
> = {
  ko: {
    invalid_policy_payload: '취소 정책 정보를 확인해 주세요.',
    policy_not_found: '취소 정책을 찾을 수 없습니다.',
  },
  'zh-hant': {
    invalid_policy_payload: '請確認取消政策資料。',
    policy_not_found: '找不到取消政策。',
  },
  en: {
    invalid_policy_payload: 'Check the cancellation policy details.',
    policy_not_found: 'Cancellation policy not found.',
  },
};

export function getBookingCancellationPolicyApiErrorPayload(
  locale: Locale,
  errorCode: BookingCancellationPolicyApiErrorCode,
): BookingCancellationPolicyApiErrorPayload {
  return {
    error: bookingCancellationPolicyApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingStaffAvailabilityApiErrorCode =
  | 'invalid_availability_payload';

export interface BookingStaffAvailabilityApiErrorPayload {
  error: string;
  errorCode: BookingStaffAvailabilityApiErrorCode;
}

const bookingStaffAvailabilityApiErrorMessages: Record<
  Locale,
  Record<BookingStaffAvailabilityApiErrorCode, string>
> = {
  ko: {
    invalid_availability_payload: '가능 시간 설정을 확인해 주세요.',
  },
  'zh-hant': {
    invalid_availability_payload: '請確認可用時段設定。',
  },
  en: {
    invalid_availability_payload: 'Check the availability settings.',
  },
};

export function getBookingStaffAvailabilityApiErrorPayload(
  locale: Locale,
  errorCode: BookingStaffAvailabilityApiErrorCode,
): BookingStaffAvailabilityApiErrorPayload {
  return {
    error: bookingStaffAvailabilityApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingMutationApiErrorCode =
  | 'invalid_booking_payload'
  | 'booking_not_found'
  | 'service_or_staff_not_found'
  | 'slot_lock_conflict'
  | 'slot_unavailable'
  | 'booking_create_failed';

export interface BookingMutationApiErrorPayload {
  error: string;
  errorCode: BookingMutationApiErrorCode;
}

const bookingMutationApiErrorMessages: Record<Locale, Record<BookingMutationApiErrorCode, string>> = {
  ko: {
    invalid_booking_payload: '예약 정보를 확인해 주세요.',
    booking_not_found: '예약을 찾을 수 없습니다.',
    service_or_staff_not_found: '서비스 또는 담당자를 찾을 수 없습니다.',
    slot_lock_conflict: '선택한 시간이 다른 요청에서 예약 중입니다.',
    slot_unavailable: '선택한 시간을 더 이상 예약할 수 없습니다.',
    booking_create_failed: '예약을 만들 수 없습니다.',
  },
  'zh-hant': {
    invalid_booking_payload: '請確認預約資料。',
    booking_not_found: '找不到預約。',
    service_or_staff_not_found: '找不到服務或員工。',
    slot_lock_conflict: '所選時段正由其他請求預約中。',
    slot_unavailable: '所選時段已無法預約。',
    booking_create_failed: '無法建立預約。',
  },
  en: {
    invalid_booking_payload: 'Check the booking details.',
    booking_not_found: 'Booking not found.',
    service_or_staff_not_found: 'Service or staff not found.',
    slot_lock_conflict: 'The selected slot is being booked by another request.',
    slot_unavailable: 'The selected slot is no longer available.',
    booking_create_failed: 'Booking could not be created.',
  },
};

export function getBookingMutationApiErrorPayload(
  locale: Locale,
  errorCode: BookingMutationApiErrorCode,
): BookingMutationApiErrorPayload {
  return {
    error: bookingMutationApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingManualPaymentApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'booking_not_found'
  | 'manual_payment_amount_invalid'
  | 'manual_payment_exceeds_balance'
  | 'booking_cancelled'
  | 'booking_refund_locked'
  | 'booking_already_paid'
  | 'manual_payment_failed';

export interface BookingManualPaymentApiErrorPayload {
  error: string;
  errorCode: BookingManualPaymentApiErrorCode;
}

const bookingManualPaymentApiErrorMessages: Record<Locale, Record<BookingManualPaymentApiErrorCode, string>> = {
  ko: {
    validation_error: '수동 결제 정보를 확인해 주세요.',
    invalid_json: '수동 결제 요청 형식을 확인해 주세요.',
    booking_not_found: '예약을 찾을 수 없습니다.',
    manual_payment_amount_invalid: '수동 결제 금액을 확인해 주세요.',
    manual_payment_exceeds_balance: '수동 결제가 잔액을 초과합니다.',
    booking_cancelled: '취소된 예약에는 수동 결제를 기록할 수 없습니다.',
    booking_refund_locked: '환불 처리된 예약에는 수동 결제를 기록할 수 없습니다.',
    booking_already_paid: '이미 결제가 완료된 예약입니다.',
    manual_payment_failed: '수동 결제에 실패했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認手動付款資料。',
    invalid_json: '請確認手動付款請求格式。',
    booking_not_found: '找不到預約。',
    manual_payment_amount_invalid: '請確認手動付款金額。',
    manual_payment_exceeds_balance: '手動付款超過應付餘額。',
    booking_cancelled: '已取消的預約無法記錄手動付款。',
    booking_refund_locked: '已退款的預約無法記錄手動付款。',
    booking_already_paid: '此預約已付款完成。',
    manual_payment_failed: '手動付款失敗。',
  },
  en: {
    validation_error: 'Check the manual payment details.',
    invalid_json: 'Check the manual payment request format.',
    booking_not_found: 'Booking not found.',
    manual_payment_amount_invalid: 'Check the manual payment amount.',
    manual_payment_exceeds_balance: 'Manual payment exceeds the balance due.',
    booking_cancelled: 'Manual payments cannot be recorded for cancelled bookings.',
    booking_refund_locked: 'Manual payments cannot be recorded for refunded bookings.',
    booking_already_paid: 'This booking is already paid.',
    manual_payment_failed: 'Manual payment failed.',
  },
};

export function normalizeBookingManualPaymentApiErrorCode(
  errorCode?: string,
): BookingManualPaymentApiErrorCode {
  switch (errorCode) {
    case 'validation_error':
    case 'invalid_json':
    case 'booking_not_found':
    case 'manual_payment_amount_invalid':
    case 'manual_payment_exceeds_balance':
    case 'booking_cancelled':
    case 'booking_refund_locked':
    case 'booking_already_paid':
    case 'manual_payment_failed':
      return errorCode;
    default:
      return 'manual_payment_failed';
  }
}

export function getBookingManualPaymentApiErrorPayload(
  locale: Locale,
  errorCode: BookingManualPaymentApiErrorCode,
): BookingManualPaymentApiErrorPayload {
  return {
    error: bookingManualPaymentApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingDocumentApiErrorCode =
  | 'invalid_document_payload'
  | 'booking_not_found'
  | 'invalid_document_type'
  | 'receipt_requires_paid_booking'
  | 'document_not_found'
  | 'document_not_current'
  | 'document_action_failed';

export interface BookingDocumentApiErrorPayload {
  error: string;
  errorCode: BookingDocumentApiErrorCode;
}

const bookingDocumentApiErrorMessages: Record<Locale, Record<BookingDocumentApiErrorCode, string>> = {
  ko: {
    invalid_document_payload: '결제 문서 정보를 확인해 주세요.',
    booking_not_found: '예약을 찾을 수 없습니다.',
    invalid_document_type: '지원하지 않는 결제 문서 유형입니다.',
    receipt_requires_paid_booking: '영수증은 결제가 완료된 예약에서만 발급할 수 있습니다.',
    document_not_found: '결제 문서를 찾을 수 없습니다.',
    document_not_current: '현재 결제 문서만 처리할 수 있습니다.',
    document_action_failed: '문서 작업을 수행하지 못했습니다.',
  },
  'zh-hant': {
    invalid_document_payload: '請確認帳單文件資料。',
    booking_not_found: '找不到預約。',
    invalid_document_type: '不支援的帳單文件類型。',
    receipt_requires_paid_booking: '收據只能為已付款的預約開立。',
    document_not_found: '找不到帳單文件。',
    document_not_current: '只能處理目前有效的帳單文件。',
    document_action_failed: '無法執行文件操作。',
  },
  en: {
    invalid_document_payload: 'Check the billing document details.',
    booking_not_found: 'Booking not found.',
    invalid_document_type: 'Unsupported billing document type.',
    receipt_requires_paid_booking: 'Receipts can only be issued for paid bookings.',
    document_not_found: 'Billing document not found.',
    document_not_current: 'Only the current billing document can be processed.',
    document_action_failed: 'Document action failed.',
  },
};

export function normalizeBookingDocumentApiErrorCode(
  errorCode?: string,
): BookingDocumentApiErrorCode {
  switch (errorCode) {
    case 'invalid_document_payload':
    case 'booking_not_found':
    case 'invalid_document_type':
    case 'receipt_requires_paid_booking':
    case 'document_not_found':
    case 'document_not_current':
    case 'document_action_failed':
      return errorCode;
    default:
      return 'document_action_failed';
  }
}

export function getBookingDocumentApiErrorPayload(
  locale: Locale,
  errorCode: BookingDocumentApiErrorCode,
): BookingDocumentApiErrorPayload {
  return {
    error: bookingDocumentApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export type BookingWaitlistApiErrorCode =
  | 'waitlist_not_found'
  | 'invalid_waitlist_payload'
  | 'waitlist_already_promoted'
  | 'waitlist_closed'
  | 'invalid_waitlist_promotion_payload'
  | 'service_or_staff_not_available'
  | 'staff_not_assigned_to_service'
  | 'no_available_slot'
  | 'slot_lock_conflict'
  | 'slot_unavailable';

export interface BookingWaitlistApiErrorPayload {
  error: string;
  errorCode: BookingWaitlistApiErrorCode;
}

const bookingWaitlistApiErrorMessages: Record<Locale, Record<BookingWaitlistApiErrorCode, string>> = {
  ko: {
    waitlist_not_found: '대기 목록 항목을 찾을 수 없습니다.',
    invalid_waitlist_payload: '대기 목록 정보를 확인해 주세요.',
    waitlist_already_promoted: '이미 예약으로 승격된 대기 목록은 수정할 수 없습니다.',
    waitlist_closed: '종료된 대기 목록은 예약으로 승격할 수 없습니다.',
    invalid_waitlist_promotion_payload: '대기 목록 승격 정보를 확인해 주세요.',
    service_or_staff_not_available: '서비스 또는 담당자를 사용할 수 없습니다.',
    staff_not_assigned_to_service: '선택한 담당자는 이 서비스에 배정되어 있지 않습니다.',
    no_available_slot: '이 대기 목록을 승격할 수 있는 시간이 없습니다.',
    slot_lock_conflict: '선택한 시간이 다른 요청에서 예약 중입니다.',
    slot_unavailable: '선택한 시간을 더 이상 예약할 수 없습니다.',
  },
  'zh-hant': {
    waitlist_not_found: '找不到候補名單項目。',
    invalid_waitlist_payload: '請確認候補名單資料。',
    waitlist_already_promoted: '已轉為預約的候補名單無法編輯。',
    waitlist_closed: '已關閉的候補名單無法轉為預約。',
    invalid_waitlist_promotion_payload: '請確認候補名單轉預約資料。',
    service_or_staff_not_available: '服務或員工目前不可用。',
    staff_not_assigned_to_service: '所選員工未指派給此服務。',
    no_available_slot: '沒有可用時段可將此候補名單轉為預約。',
    slot_lock_conflict: '所選時段正由其他請求預約中。',
    slot_unavailable: '所選時段已無法預約。',
  },
  en: {
    waitlist_not_found: 'Waitlist entry not found.',
    invalid_waitlist_payload: 'Check the waitlist details.',
    waitlist_already_promoted: 'Promoted waitlist entries cannot be edited.',
    waitlist_closed: 'Closed waitlist entries cannot be promoted.',
    invalid_waitlist_promotion_payload: 'Check the waitlist promotion details.',
    service_or_staff_not_available: 'Service or staff is not available.',
    staff_not_assigned_to_service: 'The selected staff member is not assigned to this service.',
    no_available_slot: 'No available slot can promote this waitlist entry.',
    slot_lock_conflict: 'The selected slot is being booked by another request.',
    slot_unavailable: 'The selected slot is no longer available.',
  },
};

export function getBookingWaitlistApiErrorPayload(
  locale: Locale,
  errorCode: BookingWaitlistApiErrorCode,
): BookingWaitlistApiErrorPayload {
  return {
    error: bookingWaitlistApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export function getBookingsAdminCopy(locale: Locale) {
  const ko = locale === 'ko';
  const zh = locale === 'zh-hant';
  return {
    eyebrow: ko ? 'Wix 예약 MVP' : zh ? 'Wix 預約 MVP' : 'Wix Bookings MVP',
    ariaLabel: ko ? '예약 관리자' : zh ? '預約管理' : 'Bookings admin',
    nav: {
      dashboard: ko ? '대시보드' : zh ? '總覽' : 'Dashboard',
      services: ko ? '서비스' : zh ? '服務' : 'Services',
      policies: ko ? '정책' : zh ? '政策' : 'Policies',
      packages: ko ? '패키지' : zh ? '套餐' : 'Packages',
      resources: ko ? '자원' : zh ? '資源' : 'Resources',
      staff: ko ? '담당자' : zh ? '員工' : 'Staff',
      calendar: ko ? '캘린더' : zh ? '行事曆' : 'Calendar',
      emailTemplates: ko ? '이메일' : zh ? '電子郵件' : 'Email',
    },
    pages: {
      dashboard: {
        title: ko ? '예약 대시보드' : zh ? '預約儀表板' : 'Bookings dashboard',
        subtitle: ko
          ? '예약을 검색, 필터, 재조정하고 Wix 스타일 예약 상태로 관리합니다.'
          : zh
            ? '搜尋、篩選、重新排程並管理 Wix 風格的預約狀態。'
            : 'Search, filter, reschedule, and move consultations through Wix-style booking states.',
      },
      services: {
        title: ko ? '예약 서비스' : zh ? '預約服務' : 'Booking services',
        subtitle: ko
          ? '상담 서비스에 시간, 가격, 버퍼, 담당자를 연결합니다.'
          : zh
            ? '將諮詢服務與時長、價格、緩衝時間與可用律師連結。'
            : 'Package consultations with duration, price, buffers, and eligible lawyers.',
      },
      policies: {
        title: ko ? '취소 정책' : zh ? '取消政策' : 'Cancellation policies',
        subtitle: ko
          ? '서비스와 고객 셀프서비스 관리에 재사용 가능한 취소/환불 규칙을 만듭니다.'
          : zh
            ? '為服務與客戶自助管理建立可重用的取消／退款規則。'
            : 'Author reusable cancel and refund rules for services and self-service booking management.',
      },
      packages: {
        title: ko ? '예약 패키지' : zh ? '預約套餐' : 'Booking packages',
        subtitle: ko
          ? '세션 패키지를 만들고 유료 예약에 사용할 고객 크레딧을 지급합니다.'
          : zh
            ? '建立方案包，並發放可兌換付費預約的客戶點數。'
            : 'Create session packages and grant customer credits that can redeem paid booking services.',
      },
      resources: {
        title: ko ? '예약 자원' : zh ? '預約資源' : 'Booking resources',
        subtitle: ko
          ? '회의실, 장비, 공용 가능 시간 제약을 관리합니다.'
          : zh
            ? '管理會議室、設備與共用可用性限制。'
            : 'Manage rooms, equipment, and shared availability constraints for services.',
      },
      staff: {
        title: ko ? '담당자' : zh ? '員工' : 'Booking staff',
        subtitle: ko
          ? '변호사 예약 프로필, 전문 분야, 사진, 알림 이메일을 관리합니다.'
          : zh
            ? '管理律師預約檔案、專長、照片與通知電子郵件。'
            : 'Manage lawyer booking profiles, specialties, photos, and notification emails.',
      },
      staffAvailability: {
        title: ko ? '담당자 일정' : zh ? '員工可用時段' : 'Staff availability',
        subtitle: ko
          ? '슬롯 생성을 위한 주간 시간과 차단 날짜를 설정합니다.'
          : zh
            ? '設定每週時段與封鎖日期以產生可預約時段。'
            : 'Set weekly hours and blocked dates for slot generation.',
      },
      calendar: {
        title: ko ? '예약 캘린더' : zh ? '預約行事曆' : 'Bookings calendar',
        subtitle: ko
          ? '상담 예약과 차단된 캘린더 시간을 한 화면에서 검토합니다.'
          : zh
            ? '在同一個面板檢視預約與被封鎖的行事曆時段。'
            : 'Review consultation bookings and blocked calendar time in one dashboard.',
      },
      emailTemplates: {
        title: ko ? '예약 이메일 템플릿' : zh ? '預約電子郵件範本' : 'Booking email templates',
        subtitle: ko
          ? '확인, 리마인더, 취소, 관리자 알림 이메일을 실시간 placeholder로 커스터마이즈합니다.'
          : zh
            ? '以即時 placeholder 自訂確認、提醒、取消與管理員通知信。'
            : 'Customize confirmation, reminder, cancellation, and admin notification emails with live placeholders.',
      },
      calendarSync: {
        title: ko ? '캘린더 동기화' : zh ? '行事曆同步' : 'Calendar sync',
        subtitle: ko
          ? '스태프 OAuth 연결 후 예약은 외부 캘린더로 보내고, 외부 일정은 busy block으로 가져와 공개 예약 슬롯에서 제외합니다.'
          : zh
            ? '完成員工 OAuth 連線後，將預約送往外部行事曆，並把外部行程匯入為 busy block，以排除公開預約時段。'
            : 'After staff OAuth connection, send bookings to external calendars and import outside events as busy blocks so public slots stay excluded.',
      },
      staffNotFound: {
        title: ko ? '담당자를 찾을 수 없음' : zh ? '找不到員工' : 'Staff not found',
        subtitle: ko ? '담당자 목록으로 돌아가 활성 프로필을 선택하세요.' : zh ? '返回員工列表並選擇可用檔案。' : 'Return to staff and choose an active profile.',
      },
    },
  } as const;
}

export function getBookingFlowCopy(locale: Locale) {
  const ko = locale === 'ko';
  const zh = locale === 'zh-hant';
  return {
    steps: [ko ? '서비스' : zh ? '服務' : 'Service', ko ? '담당자' : zh ? '員工' : 'Staff', ko ? '날짜 및 시간' : zh ? '日期與時間' : 'Date & time', ko ? '정보' : zh ? '資訊' : 'Info'],
    preview: {
      allActiveServices: ko ? '모든 활성 서비스' : zh ? '所有啟用服務' : 'All active services',
      anyAssignedStaff: ko ? '배정 가능한 담당자' : zh ? '任一可指派員工' : 'Any assigned staff',
      serviceCards: ko
        ? '서비스 카드는 공개 페이지의 예약 API에서 불러옵니다.'
        : zh
          ? '服務卡片會從公開頁面的預約 API 載入。'
          : 'Service cards load from the booking API on the published page.',
      staffCards: ko
        ? '가능한 담당자와 시간대는 예약 중에 확인됩니다.'
        : zh
          ? '可用員工與時段會在預約流程中解析。'
          : 'Available staff and time slots are resolved during booking.',
    },
    labels: {
      date: ko ? '날짜' : zh ? '日期' : 'Date',
      availableTimes: ko ? '예약 가능 시간' : zh ? '可預約時段' : 'Available times',
      loadingSlots: ko ? '슬롯을 불러오는 중...' : zh ? '正在載入時段…' : 'Loading slots...',
      noSlots: ko ? '이 날짜에 예약 가능한 시간이 없습니다.' : zh ? '此日期沒有可預約時段。' : 'No available slots for this date.',
      waitlist: ko ? '대기자 명단' : zh ? '候補名單' : 'Waitlist',
      waitlistDescription: ko
        ? '취소나 새 시간이 생기면 이 날짜의 대기자 명단에서 먼저 연락할 수 있게 등록합니다.'
        : zh
          ? '若有取消或新時段出現，我們會優先從此日期的候補名單聯絡您。'
          : 'Register so we can contact you first if a cancellation or new slot opens up on this date.',
      name: ko ? '이름' : zh ? '姓名' : 'Name',
      email: ko ? '이메일' : zh ? '電子郵件' : 'Email',
      phone: ko ? '전화' : zh ? '電話' : 'Phone',
      notes: ko ? '메모' : zh ? '備註' : 'Notes',
      consentWaitlist: ko ? '개인정보 수집 및 대기자 연락 안내에 동의합니다.' : zh ? '我同意個資蒐集與候補聯絡通知。' : 'I agree to the privacy collection and waitlist contact notice.',
      waitlistJoined: ko ? '대기자 명단에 등록되었습니다.' : zh ? '已加入候補名單。' : 'You have been added to the waitlist.',
      waitlistDuplicate: ko ? '이미 같은 날짜 대기자 명단에 등록되어 있습니다.' : zh ? '您已加入這個日期的候補名單。' : 'You are already on the waitlist for this date.',
      joinWaitlist: ko ? '대기 등록' : zh ? '加入候補名單' : 'Join waitlist',
      joining: ko ? '등록 중...' : zh ? '正在加入…' : 'Joining...',
      paymentElement: ko ? '결제 요소' : zh ? '付款元件' : 'Payment Element',
      sessionPackage: ko ? '세션권' : zh ? '方案包' : 'Session package',
      discountCode: ko ? '할인 코드' : zh ? '折扣碼' : 'Discount code',
      discountApply: ko ? '적용' : zh ? '套用' : 'Apply',
      discountApplied: (code: string, amount: string) => ko
        ? `${code} 적용됨 · ${amount} 할인`
        : zh
          ? `${code} 已套用 · 折抵 ${amount}`
          : `${code} applied · ${amount} off`,
      discountUnavailable: ko ? '적용 가능한 할인 코드를 찾지 못했습니다.' : zh ? '找不到可套用的折扣碼。' : 'No applicable discount code was found.',
      paymentPrepare: ko ? '결제 준비' : zh ? '準備付款' : 'Prepare payment',
      paymentLoading: ko ? '결제창을 준비 중입니다...' : zh ? '正在準備付款視窗…' : 'Preparing payment...',
      paymentStubTitle: ko ? 'Stripe 결제 요소' : zh ? 'Stripe 付款元件' : 'Stripe Payment Element',
      paymentStubSubtitle: ko ? '개발 환경 테스트 결제' : zh ? '開發環境測試付款' : 'Development test payment',
      paymentStubComplete: ko ? '테스트 결제 완료' : zh ? '完成測試付款' : 'Complete test payment',
      paymentConfirm: ko ? '결제 확인' : zh ? '確認付款' : 'Confirm payment',
      paymentConfirming: ko ? 'Stripe 결제를 확인 중입니다...' : zh ? '正在確認 Stripe 付款…' : 'Confirming Stripe payment...',
      paymentConfirmedPackage: ko ? '세션권이 확인되었습니다. 예약 확정 시 1회 차감됩니다.' : zh ? '已確認方案包。預約成立時會扣除 1 次。' : 'Session package confirmed. One credit will be used when the booking is finalized.',
      paymentConfirmedBooking: ko ? '결제가 확인되었습니다. 이제 예약을 확정할 수 있습니다.' : zh ? '付款已確認，現在可以完成預約。' : 'Payment is confirmed. You can now finalize the booking.',
      paymentConfirmNeeded: ko ? '결제 전 이름과 이메일을 입력해 주세요.' : zh ? '付款前請先輸入姓名與電子郵件。' : 'Please enter your name and email before payment.',
      paymentReady: ko ? '결제 확인이 필요합니다.' : zh ? '需要確認付款。' : 'Payment confirmation is required.',
      bookingInProgress: ko ? '예약 중...' : zh ? '預約中…' : 'Booking...',
      confirmBooking: ko ? '예약 확정' : zh ? '確認預約' : 'Confirm booking',
      back: ko ? '뒤로' : zh ? '返回' : 'Back',
      continue: ko ? '계속' : zh ? '繼續' : 'Continue',
      serviceDueNow: ko ? '즉시 결제' : zh ? '立即付款' : 'due now',
      total: ko ? '총액' : zh ? '總額' : 'Total',
      depositDue: ko ? '예약금 결제 후 예약이 확정됩니다.' : zh ? '支付訂金後預約即確認。' : 'Booking is confirmed after the deposit is paid.',
      laterBalance: ko ? '잔액은 나중에 결제합니다.' : zh ? '餘額會在稍後支付。' : 'The remaining balance will be paid later.',
      paymentModeConfirmed: ko ? '결제 후 예약 확정' : zh ? '付款後確認預約' : 'Booking confirmed after payment',
      paymentModePayLater: ko ? '예약 후 나중 결제' : zh ? '預約後稍後付款' : 'Book now, pay later',
      paymentModeFree: ko ? '결제 없이 예약 확정' : zh ? '無需付款即可確認預約' : 'Booking confirmed without payment',
      paymentStatus: {
        idle: ko ? '대기' : zh ? '待處理' : 'Idle',
        creating: ko ? '생성 중' : zh ? '建立中' : 'Creating',
        ready: ko ? '준비됨' : zh ? '已準備' : 'Ready',
        confirming: ko ? '확인 중' : zh ? '確認中' : 'Confirming',
        confirmed: ko ? '확인됨' : zh ? '已確認' : 'Confirmed',
        error: ko ? '오류' : zh ? '錯誤' : 'Error',
      },
      groupCapacity: ko ? '그룹 예약 정원' : zh ? '團體預約名額' : 'Group capacity',
      slotCapacity: ko ? '자리' : zh ? '席位' : 'seats',
      customerTimezoneLabel: ko ? '내 시간대' : zh ? '我的時區' : 'My timezone',
      summaryLabel: ko ? '예약 요약' : zh ? '預約摘要' : 'Booking summary',
      serviceCards: ko ? '서비스 카드' : zh ? '服務卡片' : 'Service cards',
      staffCards: ko ? '담당자 카드' : zh ? '員工卡片' : 'Staff cards',
    },
  } as const;
}
