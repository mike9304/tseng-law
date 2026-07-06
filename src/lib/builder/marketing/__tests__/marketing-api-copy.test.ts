import { describe, expect, it } from 'vitest';
import {
  getBuilderMarketingApiErrorPayload,
  getPublicMarketingApiErrorPayload,
  getPublicMarketingUnsubscribePageCopy,
} from '@/lib/builder/marketing/marketing-api-copy';

describe('builder marketing API copy', () => {
  it('returns localized stable-code marketing API errors', () => {
    expect(getBuilderMarketingApiErrorPayload('ko', 'campaign_not_found')).toEqual({
      error: '캠페인을 찾을 수 없습니다.',
      errorCode: 'campaign_not_found',
    });
    expect(getBuilderMarketingApiErrorPayload('zh-hant', 'campaign_batch_send_failed')).toEqual({
      error: '無法完成活動發送。',
      errorCode: 'campaign_batch_send_failed',
    });
    expect(getBuilderMarketingApiErrorPayload('en', 'invalid_campaign_payload')).toEqual({
      error: 'Check the campaign details.',
      errorCode: 'invalid_campaign_payload',
    });
    expect(getBuilderMarketingApiErrorPayload('zh-hant', 'template_not_found')).toEqual({
      error: '找不到範本。',
      errorCode: 'template_not_found',
    });
    expect(getBuilderMarketingApiErrorPayload('en', 'subscriber_import_row_failed')).toEqual({
      error: 'Unable to import the subscriber row.',
      errorCode: 'subscriber_import_row_failed',
    });
  });

  it('returns localized stable-code public marketing API errors', () => {
    expect(getPublicMarketingApiErrorPayload('ko', 'invalid_subscribe_payload')).toEqual({
      error: '구독 정보를 확인해 주세요.',
      errorCode: 'invalid_subscribe_payload',
    });
    expect(getPublicMarketingApiErrorPayload('zh-hant', 'invalid_redirect')).toEqual({
      error: '請確認要前往的連結。',
      errorCode: 'invalid_redirect',
    });
    expect(getPublicMarketingApiErrorPayload('en', 'missing_token')).toEqual({
      error: 'A confirmation token is required.',
      errorCode: 'missing_token',
    });
    expect(getPublicMarketingApiErrorPayload('ko', 'unauthorized')).toEqual({
      error: '인증되지 않은 마케팅 요청입니다.',
      errorCode: 'unauthorized',
    });
  });

  it('returns localized unsubscribe confirmation copy', () => {
    expect(getPublicMarketingUnsubscribePageCopy('zh-hant').confirmationTitle).toBe('請確認取消訂閱');
    expect(getPublicMarketingUnsubscribePageCopy('en').confirmButton).toBe('Confirm unsubscribe');
  });
});
