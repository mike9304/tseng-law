import type { Locale } from '@/lib/locales';

export type CommercePaymentWebhooksApiErrorCode =
  | 'invalid_payment_webhook_filters'
  | 'payment_webhooks_failed'
  | 'payment_webhook_event_not_found'
  | 'payment_webhook_replay_failed'
  | 'payment_provider_not_found'
  | 'payment_webhook_not_configured'
  | 'invalid_signature'
  | 'invalid_json'
  | 'unsupported_payment_event'
  | 'payment_webhook_failed';

export interface CommercePaymentWebhooksApiErrorPayload {
  error: string;
  errorCode: CommercePaymentWebhooksApiErrorCode;
}

const commercePaymentWebhooksApiErrorMessages: Record<Locale, Record<CommercePaymentWebhooksApiErrorCode, string>> = {
  ko: {
    invalid_payment_webhook_filters: '결제 웹훅 필터를 확인해 주세요.',
    payment_webhooks_failed: '결제 웹훅 이벤트를 불러오지 못했습니다.',
    payment_webhook_event_not_found: '결제 웹훅 이벤트를 찾을 수 없습니다.',
    payment_webhook_replay_failed: '결제 웹훅 이벤트를 재시도하지 못했습니다.',
    payment_provider_not_found: '지원하지 않는 결제 제공업체입니다.',
    payment_webhook_not_configured: '결제 웹훅이 설정되지 않았습니다.',
    invalid_signature: '결제 웹훅 서명을 확인할 수 없습니다.',
    invalid_json: '결제 웹훅 요청 형식을 확인해 주세요.',
    unsupported_payment_event: '지원하지 않는 결제 웹훅 이벤트입니다.',
    payment_webhook_failed: '결제 웹훅을 처리하지 못했습니다.',
  },
  'zh-hant': {
    invalid_payment_webhook_filters: '請確認付款 Webhook 篩選條件。',
    payment_webhooks_failed: '無法載入付款 Webhook 事件。',
    payment_webhook_event_not_found: '找不到付款 Webhook 事件。',
    payment_webhook_replay_failed: '無法重播付款 Webhook 事件。',
    payment_provider_not_found: '不支援的付款服務提供者。',
    payment_webhook_not_configured: '尚未設定付款 Webhook。',
    invalid_signature: '無法驗證付款 Webhook 簽章。',
    invalid_json: '請確認付款 Webhook 請求格式。',
    unsupported_payment_event: '不支援此付款 Webhook 事件。',
    payment_webhook_failed: '無法處理付款 Webhook。',
  },
  en: {
    invalid_payment_webhook_filters: 'Check the payment webhook filters.',
    payment_webhooks_failed: 'Unable to load payment webhook events.',
    payment_webhook_event_not_found: 'Payment webhook event not found.',
    payment_webhook_replay_failed: 'Unable to replay payment webhook event.',
    payment_provider_not_found: 'Unsupported payment provider.',
    payment_webhook_not_configured: 'Payment webhook is not configured.',
    invalid_signature: 'Unable to verify the payment webhook signature.',
    invalid_json: 'Check the payment webhook request format.',
    unsupported_payment_event: 'Unsupported payment webhook event.',
    payment_webhook_failed: 'Unable to process payment webhook.',
  },
};

export function getCommercePaymentWebhooksApiErrorPayload(
  locale: Locale,
  errorCode: CommercePaymentWebhooksApiErrorCode,
): CommercePaymentWebhooksApiErrorPayload {
  return {
    error: commercePaymentWebhooksApiErrorMessages[locale][errorCode],
    errorCode,
  };
}
