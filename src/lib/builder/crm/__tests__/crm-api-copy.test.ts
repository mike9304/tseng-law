import { describe, expect, it } from 'vitest';
import { getBuilderCrmApiErrorPayload } from '@/lib/builder/crm/crm-api-copy';

describe('builder CRM API copy', () => {
  it('returns localized stable-code CRM API errors', () => {
    expect(getBuilderCrmApiErrorPayload('ko', 'contact_not_found')).toEqual({
      error: '연락처를 찾을 수 없습니다.',
      errorCode: 'contact_not_found',
    });
    expect(getBuilderCrmApiErrorPayload('zh-hant', 'invalid_automation_patch')).toEqual({
      error: '請確認自動化更新資料。',
      errorCode: 'invalid_automation_patch',
    });
    expect(getBuilderCrmApiErrorPayload('en', 'integration_create_failed')).toEqual({
      error: 'Unable to create the external integration.',
      errorCode: 'integration_create_failed',
    });
    expect(getBuilderCrmApiErrorPayload('zh-hant', 'send_queue_stats_failed')).toEqual({
      error: '無法載入傳送佇列統計。',
      errorCode: 'send_queue_stats_failed',
    });
    expect(getBuilderCrmApiErrorPayload('en', 'invalid_segment_payload')).toEqual({
      error: 'Check the segment details.',
      errorCode: 'invalid_segment_payload',
    });
    expect(getBuilderCrmApiErrorPayload('ko', 'tracking_invalid_token')).toEqual({
      error: '유효하지 않은 추적 토큰입니다.',
      errorCode: 'tracking_invalid_token',
    });
    expect(getBuilderCrmApiErrorPayload('zh-hant', 'tracking_not_configured')).toEqual({
      error: '追蹤設定尚未完成。',
      errorCode: 'tracking_not_configured',
    });
  });
});
