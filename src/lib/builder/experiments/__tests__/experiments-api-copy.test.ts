import { describe, expect, it } from 'vitest';
import { getExperimentsApiErrorPayload } from '../experiments-api-copy';

describe('getExperimentsApiErrorPayload', () => {
  it('returns localized stable-code experiment API payloads', () => {
    expect(getExperimentsApiErrorPayload('ko', 'duplicate_variant_ids')).toEqual({
      error: '변형 ID는 중복될 수 없습니다.',
      errorCode: 'duplicate_variant_ids',
    });
    expect(getExperimentsApiErrorPayload('zh-hant', 'experiment_not_found')).toEqual({
      error: '找不到實驗。',
      errorCode: 'experiment_not_found',
    });
    expect(getExperimentsApiErrorPayload('en', 'experiment_event_failed')).toEqual({
      error: 'Unable to save the experiment conversion event.',
      errorCode: 'experiment_event_failed',
    });
  });
});
