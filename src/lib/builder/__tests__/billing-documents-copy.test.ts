import { describe, expect, it } from 'vitest';
import { getBuilderBillingDocumentsApiErrorPayload } from '@/lib/builder/billing-documents-copy';

describe('builder billing documents copy', () => {
  it('returns localized billing documents API error payloads with stable codes', () => {
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '청구서 문서 검색 조건을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'billing_documents_failed')).toEqual({
      error: '無法載入帳單文件。',
      errorCode: 'billing_documents_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'event_not_found')).toEqual({
      error: '웹훅 이벤트를 찾을 수 없습니다.',
      errorCode: 'event_not_found',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'billing_document_webhook_replay_failed')).toEqual({
      error: 'Webhook 重播失敗。',
      errorCode: 'billing_document_webhook_replay_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'invalid_json')).toEqual({
      error: '청구서 문서 설정 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'billing_document_settings_save_failed')).toEqual({
      error: '無法儲存帳單文件設定。',
      errorCode: 'billing_document_settings_save_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'template_not_found')).toEqual({
      error: '청구서 문서 템플릿을 찾을 수 없습니다.',
      errorCode: 'template_not_found',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'invalid_template_payload')).toEqual({
      error: '請確認帳單文件範本資料。',
      errorCode: 'invalid_template_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'invalid_manual_payment_payload')).toEqual({
      error: '수동 결제 정보를 확인해 주세요.',
      errorCode: 'invalid_manual_payment_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'manual_payment_exceeds_balance')).toEqual({
      error: '手動付款超過應付餘額。',
      errorCode: 'manual_payment_exceeds_balance',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'payment_link_unavailable')).toEqual({
      error: '이 문서에는 결제 링크를 만들 수 없습니다.',
      errorCode: 'payment_link_unavailable',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'invalid_payment_link_payload')).toEqual({
      error: '결제 링크 요청 정보를 확인해 주세요.',
      errorCode: 'invalid_payment_link_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'order_already_paid')).toEqual({
      error: '이미 결제가 완료된 주문입니다.',
      errorCode: 'order_already_paid',
    });

    const english = getBuilderBillingDocumentsApiErrorPayload('en', 'billing_documents_failed');

    expect(english).toEqual({
      error: 'Unable to load billing documents.',
      errorCode: 'billing_documents_failed',
    });
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'billing_document_webhooks_failed')).toEqual({
      error: 'Unable to load billing webhook events.',
      errorCode: 'billing_document_webhooks_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'billing_document_settings_failed')).toEqual({
      error: 'Unable to load billing document settings.',
      errorCode: 'billing_document_settings_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'template_delete_failed')).toEqual({
      error: 'Unable to delete billing document template.',
      errorCode: 'template_delete_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'booking_cancelled')).toEqual({
      error: 'Manual payments cannot be recorded for cancelled bookings.',
      errorCode: 'booking_cancelled',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'invalid_share_link_payload')).toEqual({
      error: '請確認分享連結請求資料。',
      errorCode: 'invalid_share_link_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'share_link_revoke_failed')).toEqual({
      error: 'Unable to revoke share link.',
      errorCode: 'share_link_revoke_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'invalid_document_lifecycle_payload')).toEqual({
      error: '문서 상태 변경 요청 정보를 확인해 주세요.',
      errorCode: 'invalid_document_lifecycle_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'document_lifecycle_unavailable')).toEqual({
      error: '此文件無法變更狀態。',
      errorCode: 'document_lifecycle_unavailable',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'document_lifecycle_failed')).toEqual({
      error: 'Unable to update document lifecycle.',
      errorCode: 'document_lifecycle_failed',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('ko', 'invalid_bulk_operation_payload')).toEqual({
      error: '일괄 작업 요청 정보를 확인해 주세요.',
      errorCode: 'invalid_bulk_operation_payload',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('zh-hant', 'no_valid_targets')).toEqual({
      error: '沒有可批次操作的有效文件。',
      errorCode: 'no_valid_targets',
    });
    expect(getBuilderBillingDocumentsApiErrorPayload('en', 'bulk_operation_failed')).toEqual({
      error: 'Bulk operation failed.',
      errorCode: 'bulk_operation_failed',
    });
  });
});
