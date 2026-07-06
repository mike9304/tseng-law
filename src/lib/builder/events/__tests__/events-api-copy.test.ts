import { describe, expect, it } from 'vitest';
import { getBuilderEventsApiErrorPayload } from '../events-api-copy';

describe('builder events API copy', () => {
  it('returns localized stable-code payloads', () => {
    expect(getBuilderEventsApiErrorPayload('ko', 'validation_error')).toEqual({
      error: '이벤트 요청 내용을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(getBuilderEventsApiErrorPayload('zh-hant', 'event_rsvp_full')).toEqual({
      error: '活動報名名額已滿。',
      errorCode: 'event_rsvp_full',
    });
    expect(getBuilderEventsApiErrorPayload('en', 'events_list_failed')).toEqual({
      error: 'Unable to load events.',
      errorCode: 'events_list_failed',
    });
    expect(getBuilderEventsApiErrorPayload('ko', 'too_many_requests')).toEqual({
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      errorCode: 'too_many_requests',
    });
  });
});
