import type { Locale } from '@/lib/locales';

export type BuilderBillingDocumentsApiErrorCode =
  | 'validation_error'
  | 'billing_documents_failed'
  | 'billing_document_webhooks_failed'
  | 'event_not_found'
  | 'billing_document_webhook_replay_failed'
  | 'billing_document_settings_failed'
  | 'invalid_json'
  | 'billing_document_settings_save_failed'
  | 'invalid_template_payload'
  | 'template_not_found'
  | 'templates_list_failed'
  | 'template_create_failed'
  | 'template_load_failed'
  | 'template_update_failed'
  | 'template_delete_failed'
  | 'invalid_document_source'
  | 'invalid_manual_payment_payload'
  | 'invalid_manual_payment_json'
  | 'document_not_found'
  | 'order_not_found'
  | 'booking_not_found'
  | 'manual_payment_unavailable'
  | 'manual_payment_amount_invalid'
  | 'manual_payment_exceeds_balance'
  | 'order_not_manual_invoice'
  | 'order_refund_locked'
  | 'order_already_paid'
  | 'booking_cancelled'
  | 'booking_refund_locked'
  | 'booking_already_paid'
  | 'manual_payment_failed'
  | 'invalid_payment_link_payload'
  | 'payment_link_unavailable'
  | 'payment_link_failed'
  | 'payment_link_revoke_failed'
  | 'invalid_share_link_payload'
  | 'share_link_failed'
  | 'share_link_revoke_failed'
  | 'invalid_document_lifecycle_payload'
  | 'document_lifecycle_unavailable'
  | 'document_lifecycle_failed'
  | 'invalid_bulk_operation_payload'
  | 'no_valid_targets'
  | 'bulk_operation_failed';

export interface BuilderBillingDocumentsApiErrorPayload {
  error: string;
  errorCode: BuilderBillingDocumentsApiErrorCode;
}

const builderBillingDocumentsApiErrorMessages: Record<Locale, Record<BuilderBillingDocumentsApiErrorCode, string>> = {
  ko: {
    validation_error: '청구서 문서 검색 조건을 확인해 주세요.',
    billing_documents_failed: '청구서 문서를 불러오지 못했습니다.',
    billing_document_webhooks_failed: '청구서 웹훅 기록을 불러오지 못했습니다.',
    event_not_found: '웹훅 이벤트를 찾을 수 없습니다.',
    billing_document_webhook_replay_failed: '웹훅 다시 재생에 실패했습니다.',
    billing_document_settings_failed: '청구서 문서 설정을 불러오지 못했습니다.',
    invalid_json: '청구서 문서 설정 요청 형식을 확인해 주세요.',
    billing_document_settings_save_failed: '청구서 문서 설정을 저장하지 못했습니다.',
    invalid_template_payload: '청구서 문서 템플릿 정보를 확인해 주세요.',
    template_not_found: '청구서 문서 템플릿을 찾을 수 없습니다.',
    templates_list_failed: '청구서 문서 템플릿을 불러오지 못했습니다.',
    template_create_failed: '청구서 문서 템플릿을 만들지 못했습니다.',
    template_load_failed: '청구서 문서 템플릿을 불러오지 못했습니다.',
    template_update_failed: '청구서 문서 템플릿을 저장하지 못했습니다.',
    template_delete_failed: '청구서 문서 템플릿을 삭제하지 못했습니다.',
    invalid_document_source: '지원하지 않는 청구서 문서 출처입니다.',
    invalid_manual_payment_payload: '수동 결제 정보를 확인해 주세요.',
    invalid_manual_payment_json: '수동 결제 요청 형식을 확인해 주세요.',
    document_not_found: '청구서 문서를 찾을 수 없습니다.',
    order_not_found: '주문을 찾을 수 없습니다.',
    booking_not_found: '예약을 찾을 수 없습니다.',
    manual_payment_unavailable: '이 문서에는 수동 결제를 기록할 수 없습니다.',
    manual_payment_amount_invalid: '수동 결제 금액을 확인해 주세요.',
    manual_payment_exceeds_balance: '수동 결제가 미지급 잔액을 초과합니다.',
    order_not_manual_invoice: '수동 결제 가능한 인보이스 주문이 아닙니다.',
    order_refund_locked: '환불 처리된 주문에는 수동 결제를 기록할 수 없습니다.',
    order_already_paid: '이미 결제가 완료된 주문입니다.',
    booking_cancelled: '취소된 예약에는 수동 결제를 기록할 수 없습니다.',
    booking_refund_locked: '환불 처리된 예약에는 수동 결제를 기록할 수 없습니다.',
    booking_already_paid: '이미 결제가 완료된 예약입니다.',
    manual_payment_failed: '수동 결제 기록에 실패했습니다.',
    invalid_payment_link_payload: '결제 링크 요청 정보를 확인해 주세요.',
    payment_link_unavailable: '이 문서에는 결제 링크를 만들 수 없습니다.',
    payment_link_failed: '결제 링크를 만들지 못했습니다.',
    payment_link_revoke_failed: '결제 링크를 취소하지 못했습니다.',
    invalid_share_link_payload: '공유 링크 요청 정보를 확인해 주세요.',
    share_link_failed: '공유 링크를 만들지 못했습니다.',
    share_link_revoke_failed: '공유 링크를 취소하지 못했습니다.',
    invalid_document_lifecycle_payload: '문서 상태 변경 요청 정보를 확인해 주세요.',
    document_lifecycle_unavailable: '이 문서는 상태를 변경할 수 없습니다.',
    document_lifecycle_failed: '문서 상태 변경에 실패했습니다.',
    invalid_bulk_operation_payload: '일괄 작업 요청 정보를 확인해 주세요.',
    no_valid_targets: '일괄 작업할 유효한 문서가 없습니다.',
    bulk_operation_failed: '일괄 작업에 실패했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認帳單文件搜尋條件。',
    billing_documents_failed: '無法載入帳單文件。',
    billing_document_webhooks_failed: '無法載入帳單 Webhook 記錄。',
    event_not_found: '找不到 Webhook 事件。',
    billing_document_webhook_replay_failed: 'Webhook 重播失敗。',
    billing_document_settings_failed: '無法載入帳單文件設定。',
    invalid_json: '請確認帳單文件設定請求格式。',
    billing_document_settings_save_failed: '無法儲存帳單文件設定。',
    invalid_template_payload: '請確認帳單文件範本資料。',
    template_not_found: '找不到帳單文件範本。',
    templates_list_failed: '無法載入帳單文件範本。',
    template_create_failed: '無法建立帳單文件範本。',
    template_load_failed: '無法載入帳單文件範本。',
    template_update_failed: '無法儲存帳單文件範本。',
    template_delete_failed: '無法刪除帳單文件範本。',
    invalid_document_source: '不支援的帳單文件來源。',
    invalid_manual_payment_payload: '請確認手動付款資料。',
    invalid_manual_payment_json: '請確認手動付款請求格式。',
    document_not_found: '找不到帳單文件。',
    order_not_found: '找不到訂單。',
    booking_not_found: '找不到預約。',
    manual_payment_unavailable: '此文件無法記錄手動付款。',
    manual_payment_amount_invalid: '請確認手動付款金額。',
    manual_payment_exceeds_balance: '手動付款超過應付餘額。',
    order_not_manual_invoice: '此訂單不是可記錄手動付款的發票。',
    order_refund_locked: '已退款的訂單無法記錄手動付款。',
    order_already_paid: '此訂單已付款完成。',
    booking_cancelled: '已取消的預約無法記錄手動付款。',
    booking_refund_locked: '已退款的預約無法記錄手動付款。',
    booking_already_paid: '此預約已付款完成。',
    manual_payment_failed: '手動付款記錄失敗。',
    invalid_payment_link_payload: '請確認付款連結請求資料。',
    payment_link_unavailable: '此文件無法建立付款連結。',
    payment_link_failed: '無法建立付款連結。',
    payment_link_revoke_failed: '無法撤銷付款連結。',
    invalid_share_link_payload: '請確認分享連結請求資料。',
    share_link_failed: '無法建立分享連結。',
    share_link_revoke_failed: '無法撤銷分享連結。',
    invalid_document_lifecycle_payload: '請確認文件狀態變更請求資料。',
    document_lifecycle_unavailable: '此文件無法變更狀態。',
    document_lifecycle_failed: '文件狀態變更失敗。',
    invalid_bulk_operation_payload: '請確認批次操作請求資料。',
    no_valid_targets: '沒有可批次操作的有效文件。',
    bulk_operation_failed: '批次操作失敗。',
  },
  en: {
    validation_error: 'Check the billing document search filters.',
    billing_documents_failed: 'Unable to load billing documents.',
    billing_document_webhooks_failed: 'Unable to load billing webhook events.',
    event_not_found: 'Webhook event not found.',
    billing_document_webhook_replay_failed: 'Webhook replay failed.',
    billing_document_settings_failed: 'Unable to load billing document settings.',
    invalid_json: 'Check the billing document settings request format.',
    billing_document_settings_save_failed: 'Unable to save billing document settings.',
    invalid_template_payload: 'Check the billing document template details.',
    template_not_found: 'Billing document template not found.',
    templates_list_failed: 'Unable to load billing document templates.',
    template_create_failed: 'Unable to create billing document template.',
    template_load_failed: 'Unable to load billing document template.',
    template_update_failed: 'Unable to save billing document template.',
    template_delete_failed: 'Unable to delete billing document template.',
    invalid_document_source: 'Unsupported billing document source.',
    invalid_manual_payment_payload: 'Check the manual payment details.',
    invalid_manual_payment_json: 'Check the manual payment request format.',
    document_not_found: 'Billing document not found.',
    order_not_found: 'Order not found.',
    booking_not_found: 'Booking not found.',
    manual_payment_unavailable: 'Manual payments cannot be recorded for this document.',
    manual_payment_amount_invalid: 'Check the manual payment amount.',
    manual_payment_exceeds_balance: 'Manual payment exceeds the balance due.',
    order_not_manual_invoice: 'This order is not a manual-payment invoice.',
    order_refund_locked: 'Manual payments cannot be recorded for refunded orders.',
    order_already_paid: 'This order is already paid.',
    booking_cancelled: 'Manual payments cannot be recorded for cancelled bookings.',
    booking_refund_locked: 'Manual payments cannot be recorded for refunded bookings.',
    booking_already_paid: 'This booking is already paid.',
    manual_payment_failed: 'Manual payment failed.',
    invalid_payment_link_payload: 'Check the payment link request details.',
    payment_link_unavailable: 'A payment link cannot be created for this document.',
    payment_link_failed: 'Unable to create payment link.',
    payment_link_revoke_failed: 'Unable to revoke payment link.',
    invalid_share_link_payload: 'Check the share link request details.',
    share_link_failed: 'Unable to create share link.',
    share_link_revoke_failed: 'Unable to revoke share link.',
    invalid_document_lifecycle_payload: 'Check the document lifecycle request details.',
    document_lifecycle_unavailable: 'This document cannot change status.',
    document_lifecycle_failed: 'Unable to update document lifecycle.',
    invalid_bulk_operation_payload: 'Check the bulk operation request details.',
    no_valid_targets: 'No valid documents are available for this bulk operation.',
    bulk_operation_failed: 'Bulk operation failed.',
  },
};

export function getBuilderBillingDocumentsApiErrorPayload(
  locale: Locale,
  errorCode: BuilderBillingDocumentsApiErrorCode,
): BuilderBillingDocumentsApiErrorPayload {
  return {
    error: builderBillingDocumentsApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
