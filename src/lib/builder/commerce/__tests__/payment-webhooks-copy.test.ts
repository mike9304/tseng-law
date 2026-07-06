import { describe, expect, it } from 'vitest';
import { getCommercePaymentWebhooksApiErrorPayload } from '@/lib/builder/commerce/payment-webhooks-copy';

describe('commerce payment webhooks copy', () => {
  it('returns localized API error payloads with stable codes', () => {
    expect(getCommercePaymentWebhooksApiErrorPayload('ko', 'invalid_payment_webhook_filters')).toEqual({
      error: '결제 웹훅 필터를 확인해 주세요.',
      errorCode: 'invalid_payment_webhook_filters',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('zh-hant', 'payment_webhooks_failed')).toEqual({
      error: '無法載入付款 Webhook 事件。',
      errorCode: 'payment_webhooks_failed',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('ko', 'payment_webhook_event_not_found')).toEqual({
      error: '결제 웹훅 이벤트를 찾을 수 없습니다.',
      errorCode: 'payment_webhook_event_not_found',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('en', 'payment_webhook_replay_failed')).toEqual({
      error: 'Unable to replay payment webhook event.',
      errorCode: 'payment_webhook_replay_failed',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('zh-hant', 'payment_provider_not_found')).toEqual({
      error: '不支援的付款服務提供者。',
      errorCode: 'payment_provider_not_found',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('ko', 'invalid_signature')).toEqual({
      error: '결제 웹훅 서명을 확인할 수 없습니다.',
      errorCode: 'invalid_signature',
    });
    expect(getCommercePaymentWebhooksApiErrorPayload('en', 'payment_webhook_failed')).toEqual({
      error: 'Unable to process payment webhook.',
      errorCode: 'payment_webhook_failed',
    });
  });
});
