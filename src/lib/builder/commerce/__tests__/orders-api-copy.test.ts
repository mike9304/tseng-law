import { describe, expect, it } from 'vitest';
import { getCommerceOrdersApiErrorPayload } from '@/lib/builder/commerce/orders-api-copy';

describe('commerce orders API copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommerceOrdersApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '주문 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getCommerceOrdersApiErrorPayload('zh-hant', 'orders_failed')).toEqual({
      error: '無法載入訂單。',
      errorCode: 'orders_failed',
    });
    expect(getCommerceOrdersApiErrorPayload('zh-hant', 'order_not_found')).toEqual({
      error: '找不到訂單。',
      errorCode: 'order_not_found',
    });
    expect(getCommerceOrdersApiErrorPayload('ko', 'invalid_json')).toEqual({
      error: '주문 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(getCommerceOrdersApiErrorPayload('en', 'order_update_failed')).toEqual({
      error: 'Unable to update order.',
      errorCode: 'order_update_failed',
    });
    expect(getCommerceOrdersApiErrorPayload('ko', 'manual_payment_exceeds_balance')).toEqual({
      error: '수동 결제 금액이 남은 잔액을 초과합니다.',
      errorCode: 'manual_payment_exceeds_balance',
    });
    expect(getCommerceOrdersApiErrorPayload('zh-hant', 'manual_payment_failed')).toEqual({
      error: '無法記錄手動付款。',
      errorCode: 'manual_payment_failed',
    });
    expect(getCommerceOrdersApiErrorPayload('ko', 'refund_amount_exceeds_remaining')).toEqual({
      error: '환불 금액이 남은 환불 가능 금액을 초과합니다.',
      errorCode: 'refund_amount_exceeds_remaining',
    });
    expect(getCommerceOrdersApiErrorPayload('en', 'refund_provider_failed')).toEqual({
      error: 'Unable to process the payment provider refund.',
      errorCode: 'refund_provider_failed',
    });
    expect(getCommerceOrdersApiErrorPayload('ko', 'receipt_requires_paid_order')).toEqual({
      error: '영수증은 결제 완료 또는 환불 처리된 주문에만 발급할 수 있습니다.',
      errorCode: 'receipt_requires_paid_order',
    });
    expect(getCommerceOrdersApiErrorPayload('zh-hant', 'document_issue_failed')).toEqual({
      error: '無法開立訂單文件。',
      errorCode: 'document_issue_failed',
    });
  });
});
