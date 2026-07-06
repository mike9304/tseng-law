import type { Locale } from '@/lib/locales';

export type CommerceOrdersApiErrorCode =
  | 'validation_error'
  | 'orders_failed'
  | 'order_not_found'
  | 'invalid_json'
  | 'order_update_failed'
  | 'manual_payment_amount_invalid'
  | 'manual_payment_exceeds_balance'
  | 'order_not_manual_invoice'
  | 'order_refund_locked'
  | 'order_already_paid'
  | 'manual_payment_failed'
  | 'refund_amount_invalid'
  | 'order_not_refundable'
  | 'refund_amount_exceeds_remaining'
  | 'payment_reference_missing'
  | 'refund_provider_failed'
  | 'refund_failed'
  | 'document_type_invalid'
  | 'receipt_requires_paid_order'
  | 'document_issue_failed';

export interface CommerceOrdersApiErrorPayload {
  error: string;
  errorCode: CommerceOrdersApiErrorCode;
}

const commerceOrdersApiErrorMessages: Record<Locale, Record<CommerceOrdersApiErrorCode, string>> = {
  ko: {
    validation_error: '주문 요청을 확인해 주세요.',
    orders_failed: '주문을 불러오지 못했습니다.',
    order_not_found: '주문을 찾을 수 없습니다.',
    invalid_json: '주문 요청 형식을 확인해 주세요.',
    order_update_failed: '주문을 업데이트하지 못했습니다.',
    manual_payment_amount_invalid: '수동 결제 금액을 확인해 주세요.',
    manual_payment_exceeds_balance: '수동 결제 금액이 남은 잔액을 초과합니다.',
    order_not_manual_invoice: '수동 청구서 주문에만 수동 결제를 기록할 수 있습니다.',
    order_refund_locked: '환불이 진행된 주문에는 수동 결제를 기록할 수 없습니다.',
    order_already_paid: '이미 결제 완료된 주문입니다.',
    manual_payment_failed: '수동 결제를 기록하지 못했습니다.',
    refund_amount_invalid: '환불 금액을 확인해 주세요.',
    order_not_refundable: '환불할 수 있는 결제 잔액이 없습니다.',
    refund_amount_exceeds_remaining: '환불 금액이 남은 환불 가능 금액을 초과합니다.',
    payment_reference_missing: '결제 참조가 없어 공급자 환불을 진행할 수 없습니다.',
    refund_provider_failed: '결제 공급자 환불을 처리하지 못했습니다.',
    refund_failed: '환불을 기록하지 못했습니다.',
    document_type_invalid: '문서 유형을 확인해 주세요.',
    receipt_requires_paid_order: '영수증은 결제 완료 또는 환불 처리된 주문에만 발급할 수 있습니다.',
    document_issue_failed: '주문 문서를 발급하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認訂單請求。',
    orders_failed: '無法載入訂單。',
    order_not_found: '找不到訂單。',
    invalid_json: '請確認訂單請求格式。',
    order_update_failed: '無法更新訂單。',
    manual_payment_amount_invalid: '請確認手動付款金額。',
    manual_payment_exceeds_balance: '手動付款金額超過剩餘應付餘額。',
    order_not_manual_invoice: '只有手動發票訂單可以記錄手動付款。',
    order_refund_locked: '已有退款紀錄的訂單無法記錄手動付款。',
    order_already_paid: '此訂單已付款完成。',
    manual_payment_failed: '無法記錄手動付款。',
    refund_amount_invalid: '請確認退款金額。',
    order_not_refundable: '沒有可退款的付款餘額。',
    refund_amount_exceeds_remaining: '退款金額超過剩餘可退款金額。',
    payment_reference_missing: '缺少付款參照，無法執行供應商退款。',
    refund_provider_failed: '無法處理付款供應商退款。',
    refund_failed: '無法記錄退款。',
    document_type_invalid: '請確認文件類型。',
    receipt_requires_paid_order: '收據只能為已付款或已退款處理的訂單開立。',
    document_issue_failed: '無法開立訂單文件。',
  },
  en: {
    validation_error: 'Check the order request.',
    orders_failed: 'Unable to load orders.',
    order_not_found: 'Order not found.',
    invalid_json: 'Check the order request format.',
    order_update_failed: 'Unable to update order.',
    manual_payment_amount_invalid: 'Check the manual payment amount.',
    manual_payment_exceeds_balance: 'Manual payment exceeds the remaining balance.',
    order_not_manual_invoice: 'Manual payments can only be recorded for manual invoice orders.',
    order_refund_locked: 'Manual payments cannot be recorded after a refund.',
    order_already_paid: 'This order is already paid.',
    manual_payment_failed: 'Unable to record manual payment.',
    refund_amount_invalid: 'Check the refund amount.',
    order_not_refundable: 'There is no refundable payment balance.',
    refund_amount_exceeds_remaining: 'Refund amount exceeds the remaining refundable amount.',
    payment_reference_missing: 'Payment reference is missing, so the provider refund cannot be processed.',
    refund_provider_failed: 'Unable to process the payment provider refund.',
    refund_failed: 'Unable to record refund.',
    document_type_invalid: 'Check the document type.',
    receipt_requires_paid_order: 'Receipts can only be issued for paid or refunded orders.',
    document_issue_failed: 'Unable to issue order document.',
  },
};

export function getCommerceOrdersApiErrorPayload(
  locale: Locale,
  errorCode: CommerceOrdersApiErrorCode,
): CommerceOrdersApiErrorPayload {
  return {
    error: commerceOrdersApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
