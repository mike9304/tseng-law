import { describe, expect, it } from 'vitest';
import { getBuilderWebhooksApiErrorPayload } from '../webhooks-api-copy';

describe('builder webhooks API copy', () => {
  it('returns localized stable-code payloads', () => {
    expect(getBuilderWebhooksApiErrorPayload('ko', 'validation_error')).toEqual({
      error: 'Webhook 요청 내용을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderWebhooksApiErrorPayload('zh-hant', 'delivery_not_found')).toEqual({
      error: '找不到 Webhook 傳送記錄。',
      errorCode: 'delivery_not_found',
    });
    expect(getBuilderWebhooksApiErrorPayload('en', 'webhook_retry_failed')).toEqual({
      error: 'Unable to retry the webhook delivery.',
      errorCode: 'webhook_retry_failed',
    });
  });
});
