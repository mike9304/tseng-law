import { describe, expect, it } from 'vitest';
import { getBuilderServicesApiErrorPayload } from '@/lib/builder/services/services-api-copy';

describe('builder services API copy', () => {
  it('returns localized stable-code service API errors', () => {
    expect(getBuilderServicesApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '서비스 영역 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderServicesApiErrorPayload('zh-hant', 'service_area_not_found')).toEqual({
      error: '找不到服務領域。',
      errorCode: 'service_area_not_found',
    });
    expect(getBuilderServicesApiErrorPayload('en', 'service_area_reset_failed')).toEqual({
      error: 'Unable to reset the service area.',
      errorCode: 'service_area_reset_failed',
    });
  });
});
