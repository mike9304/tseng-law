import type { Locale } from '@/lib/locales';

export type BuilderWebhooksApiErrorCode =
  | 'validation_error'
  | 'invalid_json'
  | 'webhook_list_failed'
  | 'webhook_create_failed'
  | 'webhook_not_found'
  | 'webhook_update_failed'
  | 'webhook_delete_failed'
  | 'webhook_deliveries_failed'
  | 'delivery_not_found'
  | 'webhook_retry_failed';

export interface BuilderWebhooksApiErrorPayload {
  error: string;
  errorCode: BuilderWebhooksApiErrorCode;
}

const builderWebhooksApiErrorMessages: Record<Locale, Record<BuilderWebhooksApiErrorCode, string>> = {
  ko: {
    validation_error: 'Webhook 요청 내용을 확인해 주세요.',
    invalid_json: 'Webhook 요청 형식을 확인해 주세요.',
    webhook_list_failed: 'Webhook 목록을 불러오지 못했습니다.',
    webhook_create_failed: 'Webhook을 만들지 못했습니다.',
    webhook_not_found: 'Webhook을 찾을 수 없습니다.',
    webhook_update_failed: 'Webhook을 저장하지 못했습니다.',
    webhook_delete_failed: 'Webhook을 비활성화하지 못했습니다.',
    webhook_deliveries_failed: 'Webhook 전송 이력을 불러오지 못했습니다.',
    delivery_not_found: 'Webhook 전송 기록을 찾을 수 없습니다.',
    webhook_retry_failed: 'Webhook 재시도를 완료하지 못했습니다.',
  },
  'zh-hant': {
    validation_error: '請確認 Webhook 請求內容。',
    invalid_json: '請確認 Webhook 請求格式。',
    webhook_list_failed: '無法載入 Webhook 清單。',
    webhook_create_failed: '無法建立 Webhook。',
    webhook_not_found: '找不到 Webhook。',
    webhook_update_failed: '無法儲存 Webhook。',
    webhook_delete_failed: '無法停用 Webhook。',
    webhook_deliveries_failed: '無法載入 Webhook 傳送記錄。',
    delivery_not_found: '找不到 Webhook 傳送記錄。',
    webhook_retry_failed: '無法完成 Webhook 重試。',
  },
  en: {
    validation_error: 'Check the webhook request.',
    invalid_json: 'Check the webhook request format.',
    webhook_list_failed: 'Unable to load webhooks.',
    webhook_create_failed: 'Unable to create the webhook.',
    webhook_not_found: 'Webhook not found.',
    webhook_update_failed: 'Unable to save the webhook.',
    webhook_delete_failed: 'Unable to deactivate the webhook.',
    webhook_deliveries_failed: 'Unable to load webhook deliveries.',
    delivery_not_found: 'Webhook delivery not found.',
    webhook_retry_failed: 'Unable to retry the webhook delivery.',
  },
};

export function getBuilderWebhooksApiErrorPayload(
  locale: Locale,
  errorCode: BuilderWebhooksApiErrorCode,
): BuilderWebhooksApiErrorPayload {
  return { error: builderWebhooksApiErrorMessages[locale][errorCode], errorCode };
}
