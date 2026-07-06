import { describe, expect, it } from 'vitest';
import { getBuilderCollabApiErrorPayload } from '@/lib/builder/collab/collab-api-copy';

describe('builder collab API copy', () => {
  it('returns localized stable-code collaboration API errors', () => {
    expect(getBuilderCollabApiErrorPayload('ko', 'invalid_request')).toEqual({
      error: '협업 요청을 확인해 주세요.',
      errorCode: 'invalid_request',
    });
    expect(getBuilderCollabApiErrorPayload('zh-hant', 'comment_not_found')).toEqual({
      error: '找不到留言。',
      errorCode: 'comment_not_found',
    });
    expect(getBuilderCollabApiErrorPayload('en', 'review_marker_delete_failed')).toEqual({
      error: 'Unable to delete the review marker.',
      errorCode: 'review_marker_delete_failed',
    });
  });
});
